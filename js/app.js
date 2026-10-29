(() => {
  const PRODUCTS = window.FRENA_PRODUCTS;
  const CATEGORIES = window.FRENA_CATEGORIES;
  const CONFIG = window.FRENA_CONFIG;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = n => new Intl.NumberFormat("tr-TR").format(n) + " TL";
  const catLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || "";

  // ---------- görsel yer tutucular (fotoğraf eklenene kadar) ----------
  const SHAPES = {
    elbise: "M78 20 Q100 34 122 20 L128 62 Q120 84 126 110 L168 236 Q100 252 32 236 L74 110 Q80 84 72 62 Z",
    ust: "M70 40 Q100 56 130 40 L176 66 L162 112 L142 104 L144 214 Q100 224 56 214 L58 104 L38 112 L24 66 Z",
    alt: "M58 30 L142 30 L150 236 L114 240 L100 92 L86 240 L50 236 Z",
    ceket: "M66 26 L100 70 L134 26 L176 56 L170 236 L112 240 L100 92 L88 240 L30 236 L24 56 Z"
  };
  function visual(p, color) {
    if (p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
    const fill = color ? color.hex : p.colors[0].hex;
    return `<div class="ph" style="background:radial-gradient(circle at 35% 25%, ${p.tone[0]}, ${p.tone[1]})">
      <svg viewBox="0 0 200 260"><path d="${SHAPES[p.category] || SHAPES.ust}" fill="${fill}" stroke="rgba(0,0,0,.12)"/></svg>
      <span class="ph__label">${p.name}</span></div>`;
  }

  // ---------- harici linkler ----------
  $("#trendyolLink").href = CONFIG.trendyolStore;
  $$(".js-trendyol").forEach(a => (a.href = CONFIG.trendyolStore));
  $$(".js-instagram").forEach(a => (a.href = CONFIG.instagram));
  $("#year").textContent = new Date().getFullYear();

  // ---------- filtreler & grid ----------
  let activeCat = "hepsi";
  $("#filters").innerHTML = CATEGORIES.map(c =>
    `<button class="filter${c.id === activeCat ? " active" : ""}" data-cat="${c.id}">${c.label}</button>`).join("");
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest(".filter");
    if (!b) return;
    activeCat = b.dataset.cat;
    $$(".filter").forEach(f => f.classList.toggle("active", f === b));
    renderGrid();
  });

  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: .15 });

  function renderGrid() {
    const list = PRODUCTS.filter(p => activeCat === "hepsi" || p.category === activeCat);
    $("#productGrid").innerHTML = list.map(p => {
      const tag = p.oldPrice
        ? `<span class="card__tag card__tag--sale">%${Math.round((1 - p.price / p.oldPrice) * 100)} indirim</span>`
        : p.tag ? `<span class="card__tag">${p.tag}</span>` : "";
      return `<article class="card" data-id="${p.id}">
        <div class="card__media">${tag}${visual(p)}
          <div class="card__quick">${p.sizes.map(s => `<button data-size="${s}" aria-label="${s} beden sepete ekle">${s}</button>`).join("")}</div>
        </div>
        <div class="card__info">
          <div><h3 class="card__name">${p.name}</h3>
            <div class="card__dots">${p.colors.map(c => `<span style="background:${c.hex}" title="${c.name}"></span>`).join("")}</div></div>
          <p class="card__price">${p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : ""}${fmt(p.price)}</p>
        </div></article>`;
    }).join("");
    $$(".card").forEach((c, i) => { c.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(c); });
  }
  renderGrid();

  $("#productGrid").addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const p = PRODUCTS.find(x => x.id === card.dataset.id);
    const sizeBtn = e.target.closest("[data-size]");
    if (sizeBtn) { addToCart(p, p.colors[0], sizeBtn.dataset.size); return; }
    openQuick(p);
  });

  // ---------- özel imleç ----------
  const cursor = $("#cursor");
  if (matchMedia("(hover: hover)").matches) {
    addEventListener("mousemove", e => { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; });
    $("#productGrid").addEventListener("mouseover", e => {
      const overQuick = e.target.closest(".card__quick");
      cursor.classList.toggle("show", !!e.target.closest(".card") && !overQuick);
    });
    $("#productGrid").addEventListener("mouseleave", () => cursor.classList.remove("show"));
  }

  // ---------- panel yönetimi ----------
  const overlay = $("#overlay");
  function openPanel(el) {
    $$(".quick.show, .drawer.show").forEach(x => x.classList.remove("show"));
    el.classList.add("show"); el.setAttribute("aria-hidden", "false");
    overlay.classList.add("show"); document.body.classList.add("lock");
    cursor.classList.remove("show");
  }
  function closePanels() {
    $$(".quick, .drawer").forEach(x => { x.classList.remove("show"); x.setAttribute("aria-hidden", "true"); });
    overlay.classList.remove("show"); document.body.classList.remove("lock");
  }
  overlay.addEventListener("click", closePanels);
  $$("[data-close]").forEach(b => b.addEventListener("click", closePanels));
  addEventListener("keydown", e => e.key === "Escape" && closePanels());

  // ---------- hızlı bakış ----------
  let current = null, selColor = null, selSize = null;
  function openQuick(p) {
    current = p; selColor = p.colors[0]; selSize = null;
    $("#quickCat").textContent = catLabel(p.category);
    $("#quickName").textContent = p.name;
    $("#quickPrice").innerHTML = fmt(p.price) + (p.oldPrice ? `<s>${fmt(p.oldPrice)}</s>` : "");
    $("#quickDesc").textContent = p.description;
    $("#quickShip").textContent = p.price >= CONFIG.freeShippingLimit ? "Bu ürünle kargo ücretsiz." : `${fmt(CONFIG.freeShippingLimit)} üzeri kargo ücretsiz.`;
    renderQuickOptions();
    openPanel($("#quickView"));
  }
  function renderQuickOptions() {
    const p = current;
    $("#quickMedia").innerHTML = visual(p, selColor);
    $("#quickColorName").textContent = selColor.name;
    $("#quickColors").innerHTML = p.colors.map((c, i) =>
      `<button class="swatch${c === selColor ? " active" : ""}" data-i="${i}" style="background:${c.hex}" aria-label="${c.name}"></button>`).join("");
    $("#quickSizes").innerHTML = p.sizes.map(s =>
      `<button class="size${s === selSize ? " active" : ""}" data-s="${s}">${s}</button>`).join("");
    $("#addToCart").textContent = selSize ? `Sepete ekle — ${fmt(p.price)}` : "Beden seç";
    $("#addToCart").disabled = !selSize;
  }
  $("#quickColors").addEventListener("click", e => {
    const b = e.target.closest(".swatch"); if (!b) return;
    selColor = current.colors[+b.dataset.i]; renderQuickOptions();
  });
  $("#quickSizes").addEventListener("click", e => {
    const b = e.target.closest(".size"); if (!b) return;
    selSize = b.dataset.s; renderQuickOptions();
  });
  $("#addToCart").addEventListener("click", () => {
    addToCart(current, selColor, selSize);
    openPanel($("#cartDrawer"));
  });

  // ---------- sepet ----------
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("frena-cart")) || []; } catch { cart = []; }
  cart = cart.filter(l => PRODUCTS.some(p => p.id === l.id));
  const save = () => { try { localStorage.setItem("frena-cart", JSON.stringify(cart)); } catch {} };

  function addToCart(p, color, size) {
    const key = `${p.id}|${color.name}|${size}`;
    const line = cart.find(l => l.key === key);
    line ? line.qty++ : cart.push({ key, id: p.id, color: color.name, size, qty: 1 });
    save(); renderCart();
    const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    toast(`${p.name} (${size}) sepete eklendi`);
  }

  function renderCart() {
    const count = cart.reduce((a, l) => a + l.qty, 0);
    const total = cart.reduce((a, l) => a + l.qty * PRODUCTS.find(p => p.id === l.id).price, 0);
    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = fmt(total);
    $("#checkoutBtn").disabled = !count;
    const left = CONFIG.freeShippingLimit - total;
    $("#shipProgress").innerHTML = (left > 0
      ? `Ücretsiz kargoya <strong>${fmt(left)}</strong> kaldı`
      : `<strong>Kargo ücretsiz!</strong>`) +
      `<div class="bar"><i style="width:${Math.min(100, total / CONFIG.freeShippingLimit * 100)}%"></i></div>`;
    $("#cartItems").innerHTML = count ? cart.map(l => {
      const p = PRODUCTS.find(x => x.id === l.id);
      const color = p.colors.find(c => c.name === l.color) || p.colors[0];
      return `<div class="line-item" data-key="${l.key}">
        <div class="line-item__img">${visual(p, color)}</div>
        <div><h4>${p.name}</h4><small>${l.color} · ${l.size}</small>
          <div class="qty"><button data-q="-1" aria-label="Azalt">−</button><span>${l.qty}</span><button data-q="1" aria-label="Arttır">+</button></div></div>
        <div class="line-item__right"><span>${fmt(p.price * l.qty)}</span><button class="remove">Kaldır</button></div>
      </div>`;
    }).join("") : `<div class="empty"><strong>Sepetin boş</strong>Yavaşça göz at, acele yok.</div>`;
  }
  $("#cartItems").addEventListener("click", e => {
    const row = e.target.closest(".line-item"); if (!row) return;
    const line = cart.find(l => l.key === row.dataset.key);
    if (e.target.closest(".remove")) cart = cart.filter(l => l !== line);
    const q = e.target.closest("[data-q]");
    if (q) { line.qty += +q.dataset.q; if (line.qty < 1) cart = cart.filter(l => l !== line); }
    save(); renderCart();
  });
  $("#cartBtn").addEventListener("click", () => openPanel($("#cartDrawer")));
  $("#checkoutBtn").addEventListener("click", () => {
    const lines = cart.map(l => {
      const p = PRODUCTS.find(x => x.id === l.id);
      return `• ${p.name} — ${l.color} / ${l.size} x${l.qty} = ${fmt(p.price * l.qty)}`;
    });
    const total = cart.reduce((a, l) => a + l.qty * PRODUCTS.find(p => p.id === l.id).price, 0);
    const msg = `Merhaba FRENA, sipariş vermek istiyorum:\n${lines.join("\n")}\nToplam: ${fmt(total)}`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  });
  renderCart();

  // ---------- toast ----------
  let tt;
  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400);
  }

  // ---------- nav & mobil menü ----------
  const nav = $("#nav");
  const menuBtn = $("#menuBtn"), menu = $("#mobileMenu");
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open"); menu.classList.toggle("open");
    document.body.classList.toggle("lock", menu.classList.contains("open"));
  });
  $$("a", menu).forEach(a => a.addEventListener("click", () => {
    menuBtn.classList.remove("open"); menu.classList.remove("open"); document.body.classList.remove("lock");
  }));

  // ---------- manifesto: kelime kelime aydınlanma ----------
  const mt = $("#manifestoText");
  const highlight = ["durmayı", "kalıcı."];
  mt.innerHTML = mt.textContent.trim().split(/\s+/)
    .map(w => `<span class="w${highlight.includes(w) ? " hl" : ""}">${w}</span>`).join(" ");
  const words = $$(".w", mt);

  // ---------- sayaçlar ----------
  const counters = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, start = performance.now();
    const step = t => {
      const k = Math.min(1, (t - start) / 1600);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); counters.unobserve(el);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => counters.observe(el));

  // ---------- scroll efektleri ----------
  const look = $("#lookbook"), track = $("#lookTrack");
  function onScroll() {
    nav.classList.toggle("scrolled", scrollY > 40);

    const r = mt.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .4)));
    const lit = Math.floor(k * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));

    const lr = look.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -lr.top / (lr.height - innerHeight)));
    const max = track.scrollWidth - track.parentElement.clientWidth + parseFloat(getComputedStyle(track.parentElement).paddingLeft) * 2;
    track.style.transform = `translateX(${-p * Math.max(0, max)}px)`;
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // ---------- bülten ----------
  $("#newsletterForm").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    $("#newsletterNote").textContent = "Teşekkürler! Yeni drop'tan ilk sen haberdar olacaksın.";
  });
})();
