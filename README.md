# FRENA — Web Sitesi

FRENA kadın giyim markasının web sitesi: ürün vitrini, sepet ve **iyzico ile kartla ödeme**.

## Çalıştırma

Node.js 18 veya üzeri gerekir.

```bash
npm install
cp .env.example .env
npm start
```

Site `http://localhost:3000` adresinde açılır.

`.env` içinde iyzico anahtarları boşsa site **demo ödeme modunda** çalışır: tüm akış (sepet → teslimat formu → ödeme → sonuç)
denenebilir, ama gerçek kart çekimi yapılmaz.

## Kartla ödeme (iyzico)

1. iyzico'ya üye işyeri olarak başvur: https://www.iyzico.com (şahıs veya şirket).
2. Test için sandbox hesabı aç: https://sandbox-merchant.iyzipay.com. API ve gizli anahtarını `.env` dosyasına yaz.
3. Test kartı: `5528 7900 0000 0008`, son kullanma tarihi ileri bir tarih, CVC `123`.
4. Canlıya geçerken canlı anahtarları gir, `IYZICO_BASE_URL=https://api.iyzipay.com` yap ve `BASE_URL` alanına sitenin gerçek adresini (https) yaz.

Kart bilgileri sunucumuza hiç gelmez; müşteri iyzico'nun güvenli ödeme sayfasında öder (3D Secure, taksit).
Fiyatlar her zaman sunucuda, `public/js/products.js` dosyasından hesaplanır; tarayıcıdan gelen fiyata güvenilmez.
Siparişler `data/orders.json` dosyasına kaydedilir.

## Ürün eklemek / düzenlemek

Tüm ürünler `public/js/products.js` dosyasında. Ürün fotoğraflarını `public/assets/products/` klasörüne koyup
`images` listesine yazın: ilk görsel kartta, ikincisi fare üzerine gelince gösterilir. Kargo ücreti ve ücretsiz kargo
sınırı aynı dosyanın sonundaki `FRENA_CONFIG` içinde.

## Yapı

- `server/index.js` — Express sunucusu, iyzico entegrasyonu, sipariş kaydı
- `public/index.html` — ana sayfa
- `public/odeme.html` — teslimat bilgileri ve ödemeye geçiş
- `public/siparis.html` — ödeme sonucu
- `public/demo-odeme.html` — iyzico anahtarı yokken kullanılan test ödeme ekranı
- `public/css/style.css` — tasarım (renkler en üstte, logodan alındı)
- `public/js/shop.js` — ortak sepet ve görsel yardımcıları
- `public/assets/` — logo dosyaları (koyu ve açık zemin için)

## Yayına almak

Node.js çalıştırabilen bir sunucu gerekir (ör. Render, Railway, DigitalOcean veya bir VPS).
Satış yapmadan önce mesafeli satış sözleşmesi, ön bilgilendirme formu, KVKK ve iade metinlerini eklemeyi unutmayın.
