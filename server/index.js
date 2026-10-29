// FRENA sunucusu: siteyi yayınlar ve iyzico Checkout Form ile kartla ödemeyi yönetir.
// Kart bilgileri bu sunucuya hiç gelmez; müşteri iyzico'nun güvenli ödeme sayfasında öder.
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const crypto = require("crypto");
const express = require("express");
const Iyzipay = require("iyzipay");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const ORDERS_FILE = path.join(ROOT, "data", "orders.json");
const PORT = process.env.PORT || 3000;
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, "");

// ---------- katalog: fiyatlar her zaman sunucuda, ürün dosyasından hesaplanır ----------
function loadCatalog() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(PUBLIC, "js", "products.js"), "utf8"), sandbox);
  return { products: sandbox.window.FRENA_PRODUCTS, config: sandbox.window.FRENA_CONFIG };
}

// ---------- iyzico ----------
const iyzicoEnabled = Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
const iyzipay = iyzicoEnabled
  ? new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com"
    })
  : null;
const call = (fn, req) => new Promise((resolve, reject) => fn(req, (err, res) => (err ? reject(err) : resolve(res))));

// ---------- sipariş kayıtları (basit JSON dosyası) ----------
function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); } catch { return {}; }
}
function writeOrder(order) {
  const all = readOrders();
  all[order.id] = order;
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(all, null, 2));
}

// ---------- doğrulama ----------
const clean = (v, max = 200) => String(v ?? "").trim().slice(0, max);
function validateCustomer(c = {}) {
  const customer = {
    name: clean(c.name, 60), surname: clean(c.surname, 60), email: clean(c.email, 120),
    phone: clean(c.phone, 20).replace(/[^\d+]/g, ""), identityNumber: clean(c.identityNumber, 11),
    city: clean(c.city, 60), district: clean(c.district, 60), address: clean(c.address, 400),
    zip: clean(c.zip, 10), note: clean(c.note, 500), consent: c.consent === true
  };
  const errors = {};
  if (!customer.name) errors.name = "Adını yaz.";
  if (!customer.surname) errors.surname = "Soyadını yaz.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = "Geçerli bir e-posta adresi yaz.";
  if (customer.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefon numarası en az 10 haneli olmalı.";
  if (customer.identityNumber && !/^\d{11}$/.test(customer.identityNumber)) errors.identityNumber = "TC kimlik numarası 11 haneli olmalı.";
  if (!customer.city) errors.city = "İl seç.";
  if (!customer.district) errors.district = "İlçe yaz.";
  if (customer.address.length < 10) errors.address = "Açık adresi mahalle, sokak ve numara ile yaz.";
  if (!customer.consent) errors.consent = "Devam etmek için sözleşmeleri onaylaman gerekiyor.";
  return { customer, errors };
}

function priceCart(rawCart) {
  const { products, config } = loadCatalog();
  if (!Array.isArray(rawCart) || !rawCart.length) throw new Error("Sepetin boş.");
  const lines = rawCart.slice(0, 50).map(l => {
    const p = products.find(x => x.id === l.id);
    const qty = Math.floor(Number(l.qty));
    if (!p || !(qty >= 1 && qty <= 20)) throw new Error("Sepetteki bir ürün artık satışta değil. Sepeti yenileyip tekrar dene.");
    const color = p.colors.find(c => c.name === l.color);
    if (!color || !p.sizes.includes(l.size)) throw new Error(`${p.name} için seçilen renk veya beden bulunamadı.`);
    return { id: p.id, name: p.name, category: p.category, color: color.name, size: l.size, qty, unitPrice: p.price, lineTotal: p.price * qty };
  });
  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const shipping = subtotal >= config.freeShippingLimit ? 0 : config.shippingFee;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

const money = n => Number(n).toFixed(2);

// ---------- uygulama ----------
const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
// demo ödeme sayfası yalnızca iyzico anahtarı yokken açılır
app.get("/demo-odeme.html", (req, res, next) => (iyzicoEnabled ? res.redirect("/") : next()));
app.use(express.static(PUBLIC, { extensions: ["html"] }));

app.get("/api/config", (req, res) => res.json({ paymentMode: iyzicoEnabled ? "iyzico" : "demo" }));

app.post("/api/checkout", async (req, res) => {
  const { customer, errors } = validateCustomer(req.body.customer);
  if (Object.keys(errors).length) return res.status(400).json({ error: "Formdaki işaretli alanları kontrol et.", fields: errors });

  let priced;
  try { priced = priceCart(req.body.cart); } catch (e) { return res.status(400).json({ error: e.message }); }

  const id = "FR" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString("hex").toUpperCase();
  const order = { id, status: "pending", createdAt: new Date().toISOString(), customer, ...priced };
  writeOrder(order);

  if (!iyzicoEnabled) return res.json({ redirect: `/demo-odeme.html?siparis=${id}` });

  const ip = (req.ip || "85.34.78.112").replace("::ffff:", "");
  const address = `${customer.address} ${customer.district}`;
  const contactName = `${customer.name} ${customer.surname}`;
  const basketItems = priced.lines.map((l, i) => ({
    id: `${l.id}-${i}`, name: `${l.name} (${l.color}/${l.size}) x${l.qty}`,
    category1: "Giyim", category2: l.category, itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, price: money(l.lineTotal)
  }));
  if (priced.shipping) basketItems.push({ id: "kargo", name: "Kargo", category1: "Kargo", itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL, price: money(priced.shipping) });

  try {
    const result = await call(iyzipay.checkoutFormInitialize.create.bind(iyzipay.checkoutFormInitialize), {
      locale: Iyzipay.LOCALE.TR,
      conversationId: id,
      price: money(priced.total),
      paidPrice: money(priced.total),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: id,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${BASE_URL}/api/odeme/sonuc`,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: crypto.createHash("sha1").update(customer.email).digest("hex").slice(0, 16),
        name: customer.name, surname: customer.surname, gsmNumber: customer.phone, email: customer.email,
        identityNumber: customer.identityNumber || "11111111111",
        registrationAddress: address, ip, city: customer.city, country: "Turkey", zipCode: customer.zip || undefined
      },
      shippingAddress: { contactName, city: customer.city, country: "Turkey", address, zipCode: customer.zip || undefined },
      billingAddress: { contactName, city: customer.city, country: "Turkey", address, zipCode: customer.zip || undefined },
      basketItems
    });
    if (result.status !== "success") {
      console.error("iyzico başlatma hatası", result.errorCode, result.errorMessage);
      return res.status(502).json({ error: `Ödeme başlatılamadı: ${result.errorMessage || "bilinmeyen hata"}` });
    }
    writeOrder({ ...order, iyzicoToken: result.token });
    res.json({ redirect: result.paymentPageUrl });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "Ödeme sağlayıcısına ulaşılamadı. Birkaç dakika sonra tekrar dene." });
  }
});

// iyzico ödeme bittikten sonra müşteriyi buraya POST eder
app.post("/api/odeme/sonuc", async (req, res) => {
  if (!iyzicoEnabled || !req.body.token) return res.redirect("/siparis.html?durum=hata");
  try {
    const result = await call(iyzipay.checkoutForm.retrieve.bind(iyzipay.checkoutForm), { locale: Iyzipay.LOCALE.TR, token: req.body.token });
    const order = readOrders()[result.basketId];
    if (!order) return res.redirect("/siparis.html?durum=hata");
    const paid = result.status === "success" && result.paymentStatus === "SUCCESS" && Number(result.paidPrice) >= order.total;
    writeOrder({ ...order, status: paid ? "paid" : "failed", paymentId: result.paymentId, paidAt: paid ? new Date().toISOString() : undefined, failure: paid ? undefined : result.errorMessage });
    res.redirect(`/siparis.html?durum=${paid ? "basarili" : "basarisiz"}&no=${order.id}`);
  } catch (e) {
    console.error(e);
    res.redirect("/siparis.html?durum=hata");
  }
});

// demo modu: iyzico anahtarı girilene kadar akışı uçtan uca denemek için
app.post("/api/demo/odeme", (req, res) => {
  if (iyzicoEnabled) return res.status(404).end();
  const order = readOrders()[req.body.siparis];
  if (!order || order.status !== "pending") return res.status(400).json({ error: "Sipariş bulunamadı." });
  const paid = req.body.sonuc === "basarili";
  writeOrder({ ...order, status: paid ? "paid" : "failed", paidAt: paid ? new Date().toISOString() : undefined, demo: true });
  res.json({ redirect: `/siparis.html?durum=${paid ? "basarili" : "basarisiz"}&no=${order.id}` });
});

// sonuç ve demo sayfalarının gösterdiği özet (kişisel bilgi döndürmez)
app.get("/api/siparis/:id", (req, res) => {
  const o = readOrders()[req.params.id];
  if (!o) return res.status(404).json({ error: "Sipariş bulunamadı." });
  res.json({ id: o.id, status: o.status, total: o.total, shipping: o.shipping, firstName: o.customer.name, lines: o.lines.map(({ name, color, size, qty, lineTotal }) => ({ name, color, size, qty, lineTotal })) });
});

app.listen(PORT, () => {
  console.log(`FRENA ${BASE_URL} adresinde çalışıyor — ödeme modu: ${iyzicoEnabled ? "iyzico" : "DEMO (iyzico anahtarı yok)"}`);
});
