// FRENA ürün kataloğu (Trendyol mağazasından alındı)
// Her model tek ürün; renkler ayrı fotoğraf setleriyle "colors" altında.
// Fotoğraflar: public/assets/products/ — ilk görsel kartta, ikincisi üzerine gelince gösterilir.
// Sunucu fiyatları da bu dosyadan okur; fiyat değişikliği yalnızca burada yapılır.
const img = (slug, n) => Array.from({ length: n }, (_, i) => `assets/products/${slug}-${i + 1}.jpg`);

const SIZE_CHARTS = {
  palazzo: {
    cols: ["Beden", "Bel çevresi", "Basen çevresi", "Uzunluk"],
    rows: [["S", "68–72", "96", "110"], ["M", "72–76", "100", "110"], ["L", "76–80", "104", "111"],
           ["XL", "80–84", "108", "111"], ["XXL", "84–88", "112", "112"], ["3XL", "88–92", "116", "112"]]
  },
  tayt: {
    cols: ["Beden", "Bel", "Kalça", "Boy"],
    rows: [["XS", "58–60", "79–83", "86–90"], ["S", "61–65", "84–85", "86–90"], ["M", "68–73", "86–88", "89–93"],
           ["L", "74–78", "89–90", "89–93"], ["XL", "79–83", "91–93", "89–93"], ["XXL", "84–85", "94–98", "91–96"]]
  },
  tshirt: {
    cols: ["Beden", "En", "Boy"],
    rows: [["S", "49", "58"], ["M", "51", "60"], ["L", "53", "62"], ["XL", "55", "64"], ["XXL", "57", "65"]]
  }
};

window.FRENA_PRODUCTS = [
  {
    id: "palazzo",
    name: "Cırt Kapama Palazzo Pantolon",
    category: "alt",
    price: 749,
    tag: "3 renk",
    colors: [
      { name: "Siyah", hex: "#1c1a19", images: img("palazzo-siyah", 3), trendyol: "https://www.trendyol.com/frena/kadin-likrali-cirt-kapama-siyah-palazzo-pantolon-p-1184882806" },
      { name: "Kahverengi", hex: "#4e3022", images: img("palazzo-kahverengi", 3), trendyol: "https://www.trendyol.com/frena/kadin-likrali-cirt-kapama-kahverengi-palazzo-pantolon-p-1184882621" },
      { name: "Lacivert", hex: "#1f2740", images: img("palazzo-lacivert", 3), trendyol: "https://www.trendyol.com/frena/kadin-likrali-cirt-kapama-lacivert-palazzo-pantolon-p-1184883239" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    sizeChart: SIZE_CHARTS.palazzo,
    description: "Likralı kumaşı esneyerek hareketine eşlik eder. Cırt kapamalı bel kemeri, önden pileler ve yan cepler. Geniş paçası boyu uzun gösterir."
  },
  {
    id: "tayt",
    name: "Çapraz Bel Detaylı Tayt",
    category: "alt",
    price: 599,
    tag: "3 renk",
    colors: [
      { name: "Siyah", hex: "#1c1a19", images: img("tayt-siyah", 3), trendyol: "https://www.trendyol.com/frena/capraz-bel-detayli-siyah-tayt-p-1184874183" },
      { name: "Antrasit", hex: "#45474b", images: img("tayt-antrasit", 3), trendyol: "https://www.trendyol.com/frena/capraz-bel-detayli-antrasit-tayt-p-1184874234" },
      { name: "Lacivert", hex: "#1f2740", images: img("tayt-lacivert", 3), trendyol: "https://www.trendyol.com/frena/capraz-bel-detayli-lacivert-tayt-p-1184874248" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    sizeChart: SIZE_CHARTS.tayt,
    description: "Önde V şeklinde kesişen yüksek bel, beli inceltir ve vücudu toparlar. Sporda da gündelik kombinlerde de rahat."
  },
  {
    id: "tshirt-nakis",
    name: "Nakış Detaylı %100 Pamuk T-shirt",
    category: "tshirt",
    price: 679,
    tag: "Frena nakışlı",
    colors: [
      { name: "Ekru", hex: "#ece5d6", images: img("tshirt-nakis-ekru", 3), trendyol: "https://www.trendyol.com/frena/kadin-dekoratif-yaka-tok-doku-nakis-detayli-100-pamuk-ekru-t-shirt-p-1184872747" },
      { name: "Siyah", hex: "#1c1a19", images: img("tshirt-nakis-siyah", 3), trendyol: "https://www.trendyol.com/frena/kadin-dekoratif-yaka-tok-doku-nakis-detayli-100-pamuk-siyah-t-shirt-p-1184872479" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: SIZE_CHARTS.tshirt,
    description: "%100 pamuk, tok dokulu kumaş. Göğüste el yazısı Frena nakışı ve dekoratif yaka. Yıkandıkça formunu korur."
  },
  {
    id: "tshirt",
    name: "Dekoratif Yaka %100 Pamuk T-shirt",
    category: "tshirt",
    price: 629,
    colors: [
      { name: "Siyah", hex: "#1c1a19", images: img("tshirt-siyah", 3), trendyol: "https://www.trendyol.com/frena/kadin-dekoratif-yaka-tok-doku-100-pamuk-siyah-t-shirt-p-1184870965" },
      { name: "Ekru", hex: "#ece5d6", images: img("tshirt-ekru", 3), trendyol: "https://www.trendyol.com/frena/kadin-dekoratif-yaka-tok-doku-100-pamuk-ekru-t-shirt-p-1184870828" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: SIZE_CHARTS.tshirt,
    description: "%100 pamuk, tok dokulu kumaş ve dekoratif yaka. Sade kesimiyle palazzo, jean ve taytla aynı kolaylıkla kombinlenir."
  },
  {
    id: "atlet-3lu",
    name: "3'lü Fitilli Basic Atlet",
    category: "atlet",
    price: 699,
    tag: "Avantajlı paket",
    colors: [
      { name: "Siyah", hex: "#1c1a19", images: img("atlet-3lu-siyah", 1), trendyol: "https://www.trendyol.com/frena/kadin-3-lu-siyah-fitilli-gorunum-basic-bluz-atlet-p-1185749677" },
      { name: "Beyaz", hex: "#f6f4ef", images: img("atlet-3lu-beyaz", 1), trendyol: "https://www.trendyol.com/frena/kadin-3-lu-beyaz-fitilli-gorunum-basic-bluz-atlet-p-1185750346" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Aynı renkte 3 adet fitilli görünümlü askılı atlet. Gardırobun temel parçası, tek tek almaktan daha avantajlı."
  },
  {
    id: "atlet-2li",
    name: "2'li Fitilli Basic Atlet",
    category: "atlet",
    price: 499,
    tag: "Paket",
    colors: [
      { name: "Siyah + Beyaz", hex: "linear-gradient(90deg, #1c1a19 50%, #f6f4ef 50%)", images: img("atlet-2li", 3), trendyol: "https://www.trendyol.com/frena/kadin-2-li-siyah-beyaz-fitilli-gorunum-basic-bluz-atlet-p-1185748796" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Bir siyah, bir beyaz fitilli görünümlü askılı atlet. Tek başına ya da gömlek ve ceket altında katmanlı giyilir."
  },
  {
    id: "atlet",
    name: "Fitilli Askılı Basic Atlet",
    category: "atlet",
    price: 299,
    colors: [
      { name: "Beyaz", hex: "#f6f4ef", images: img("atlet-beyaz", 2), trendyol: "https://www.trendyol.com/frena/kadin-fitilli-gorunum-askili-basic-beyaz-bluz-atlet-p-1185736980" },
      { name: "Siyah", hex: "#1c1a19", images: img("atlet-siyah", 2), trendyol: "https://www.trendyol.com/frena/kadin-fitilli-gorunum-askili-basic-siyah-bluz-atlet-p-1185738009" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Fitilli görünümlü, vücudu saran askılı atlet. Yüksek bel palazzo ve taytla dengeli bir siluet oluşturur."
  }
];

window.FRENA_CATEGORIES = [
  { id: "hepsi", label: "Hepsi" },
  { id: "alt", label: "Pantolon & Tayt" },
  { id: "tshirt", label: "T-shirt" },
  { id: "atlet", label: "Atlet" }
];

// Mağaza ayarları (sunucu da kargo ücretini buradan okur)
window.FRENA_CONFIG = {
  trendyolStore: "https://www.trendyol.com/sr?mid=261651&os=1",
  instagram: "https://www.instagram.com/frenaofficialtr/",
  freeShippingLimit: 1500,
  shippingFee: 89
};
