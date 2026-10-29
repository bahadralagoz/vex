// FRENA ürün kataloğu
// Yeni ürün eklemek için bu listeye bir nesne ekleyin.
// images: ["assets/products/dosya-1.jpg", "assets/products/dosya-2.jpg"]
//   ilk görsel kartta, ikincisi üzerine gelince gösterilir (boşsa yer tutucu çizilir)
// trendyol: ürünün Trendyol linki (isteğe bağlı)
window.FRENA_PRODUCTS = [
  {
    id: "f001",
    name: "Lune Saten Elbise",
    category: "elbise",
    price: 1899,
    oldPrice: 2299,
    tag: "Yeni",
    colors: [{ name: "Şampanya", hex: "#e8d5b5" }, { name: "Gece", hex: "#1d1f2b" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Akışkan saten kumaş, verev kesim ve ince askılarıyla gün batımından gece yarısına uzanan bir siluet.",
    images: [],
    tone: ["#e7d8c6", "#a8876a"]
  },
  {
    id: "f002",
    name: "Atlas Oversize Blazer",
    category: "ceket",
    price: 2499,
    tag: "Çok Satan",
    colors: [{ name: "Kum", hex: "#cdbb9c" }, { name: "Siyah", hex: "#141414" }],
    sizes: ["S", "M", "L", "XL"],
    description: "Geniş omuz, düşük düğme hattı ve astarlı iç yapı. Hem takım hem tek parça olarak kombinlenir.",
    images: [],
    tone: ["#d3c3b0", "#6d5643"]
  },
  {
    id: "f003",
    name: "Mira Triko Bluz",
    category: "ust",
    price: 899,
    colors: [{ name: "Ekru", hex: "#efe9dc" }, { name: "Kiremit", hex: "#b4532a" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Yumuşak dokulu ince triko, kayık yaka ve hafif balon kol detayı.",
    images: [],
    tone: ["#f1e9de", "#c4b4a4"]
  },
  {
    id: "f004",
    name: "Sora Yüksek Bel Pantolon",
    category: "alt",
    price: 1299,
    tag: "Yeni",
    colors: [{ name: "Taş", hex: "#a39d92" }, { name: "Lacivert", hex: "#22304a" }],
    sizes: ["34", "36", "38", "40", "42"],
    description: "Pileli ön, geniş paça ve yüksek bel. Bacak boyunu uzatan ütü izi detayı.",
    images: [],
    tone: ["#b8ab9c", "#5a4a3e"]
  },
  {
    id: "f005",
    name: "Nova Keten Gömlek",
    category: "ust",
    price: 1099,
    colors: [{ name: "Beyaz", hex: "#f7f5f0" }, { name: "Adaçayı", hex: "#9aa58c" }],
    sizes: ["S", "M", "L"],
    description: "Nefes alan keten karışımı, rahat kesim ve sedef düğmeler.",
    images: [],
    tone: ["#e3e0d2", "#9c9a80"]
  },
  {
    id: "f006",
    name: "Vela Midi Etek",
    category: "alt",
    price: 1199,
    oldPrice: 1499,
    colors: [{ name: "Bordo", hex: "#5e1f2b" }, { name: "Kahve", hex: "#5a3d2b" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Dökümlü midi boy, arkada gizli fermuar ve yürürken hareket eden pliseler.",
    images: [],
    tone: ["#8f6a55", "#3a261c"]
  },
  {
    id: "f007",
    name: "Iris Kruvaze Elbise",
    category: "elbise",
    price: 1699,
    colors: [{ name: "Zeytin", hex: "#5d5f3a" }],
    sizes: ["S", "M", "L", "XL"],
    description: "Belden bağlamalı kruvaze yaka, her vücut tipine uyum sağlayan ayarlanabilir siluet.",
    images: [],
    tone: ["#a39a78", "#4f4a34"]
  },
  {
    id: "f008",
    name: "Terra Trençkot",
    category: "ceket",
    price: 3299,
    tag: "Sınırlı",
    colors: [{ name: "Bej", hex: "#c8ad85" }],
    sizes: ["S", "M", "L"],
    description: "Su itici gabardin, apoletli omuz ve kemer. Mevsimler arası vazgeçilmez.",
    images: [],
    tone: ["#d6c0a2", "#7e6047"]
  }
];

window.FRENA_CATEGORIES = [
  { id: "hepsi", label: "Hepsi" },
  { id: "elbise", label: "Elbise" },
  { id: "ust", label: "Üst Giyim" },
  { id: "alt", label: "Alt Giyim" },
  { id: "ceket", label: "Ceket & Dış Giyim" }
];

// Mağaza ayarları (sunucu da kargo ücretini buradan okur)
window.FRENA_CONFIG = {
  trendyolStore: "https://www.trendyol.com/sr?mid=261651&os=1",
  instagram: "https://www.instagram.com/frenaofficialtr/",
  freeShippingLimit: 1500,
  shippingFee: 89
};
