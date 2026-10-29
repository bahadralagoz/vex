# FRENA — Web Sitesi

FRENA kadın giyim markasının web sitesi. Saf HTML/CSS/JS ile yazıldı, kurulum veya derleme gerektirmez.

## Çalıştırma

`index.html` dosyasını tarayıcıda açmanız yeterli. Yerel sunucuyla açmak için:

```bash
python3 -m http.server 8000
```

## Ürün eklemek / düzenlemek

Tüm ürünler `js/products.js` dosyasında. Her ürün için ad, kategori, fiyat, renkler, bedenler ve açıklama girilir.
Ürün fotoğraflarını `assets/products/` klasörüne koyup `image` alanına yolunu yazın
(ör. `"assets/products/lune-elbise.jpg"`). Fotoğraf yoksa renkli bir yer tutucu gösterilir.

Aynı dosyanın sonundaki `FRENA_CONFIG` içinde WhatsApp numarası, Trendyol ve Instagram linkleri ayarlanır.

## Yapı

- `index.html` — sayfa iskeleti
- `css/style.css` — tasarım (renkler en üstte `:root` içinde)
- `js/products.js` — ürün kataloğu ve ayarlar
- `js/app.js` — filtreleme, hızlı bakış, sepet, animasyonlar

## Sipariş akışı

Sepet tarayıcıda saklanır; "Siparişi tamamla" butonu siparişi hazır bir WhatsApp mesajı olarak açar.
Online kartla ödeme için bir sonraki adımda iyzico/PayTR entegrasyonu veya Shopify gibi bir altyapı eklenebilir.
