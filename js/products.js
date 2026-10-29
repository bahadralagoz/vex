// FRENA ürün kataloğu
// Yeni ürün eklemek için bu listeye bir nesne ekleyin.
// image: "assets/products/dosya-adi.jpg" (boş bırakılırsa renkli bir yer tutucu gösterilir)
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
    image: "",
    tone: ["#e8d5b5", "#b98e5a"]
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
    image: "",
    tone: ["#cdbb9c", "#6f5f45"]
  },
  {
    id: "f003",
    name: "Mira Triko Bluz",
    category: "ust",
    price: 899,
    colors: [{ name: "Ekru", hex: "#efe9dc" }, { name: "Kiremit", hex: "#b4532a" }],
    sizes: ["XS", "S", "M", "L"],
    description: "Yumuşak dokulu ince triko, kayık yaka ve hafif balon kol detayı.",
    image: "",
    tone: ["#efe9dc", "#c9b8a0"]
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
    image: "",
    tone: ["#a39d92", "#4d4a44"]
  },
  {
    id: "f005",
    name: "Nova Keten Gömlek",
    category: "ust",
    price: 1099,
    colors: [{ name: "Beyaz", hex: "#f7f5f0" }, { name: "Adaçayı", hex: "#9aa58c" }],
    sizes: ["S", "M", "L"],
    description: "Nefes alan keten karışımı, rahat kesim ve sedef düğmeler.",
    image: "",
    tone: ["#dfe3d6", "#9aa58c"]
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
    image: "",
    tone: ["#8c3a48", "#3c121b"]
  },
  {
    id: "f007",
    name: "Iris Kruvaze Elbise",
    category: "elbise",
    price: 1699,
    colors: [{ name: "Zeytin", hex: "#5d5f3a" }],
    sizes: ["S", "M", "L", "XL"],
    description: "Belden bağlamalı kruvaze yaka, her vücut tipine uyum sağlayan ayarlanabilir siluet.",
    image: "",
    tone: ["#8a8c5c", "#3f4126"]
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
    image: "",
    tone: ["#d8bf98", "#8e6c43"]
  }
];

window.FRENA_CATEGORIES = [
  { id: "hepsi", label: "Hepsi" },
  { id: "elbise", label: "Elbise" },
  { id: "ust", label: "Üst Giyim" },
  { id: "alt", label: "Alt Giyim" },
  { id: "ceket", label: "Ceket & Dış Giyim" }
];

// Sipariş bilgileri — kendi bilgilerinizle değiştirin
window.FRENA_CONFIG = {
  whatsapp: "905000000000", // başında + olmadan, ülke kodu ile
  trendyolStore: "https://www.trendyol.com/sr?mid=261651&os=1",
  instagram: "https://instagram.com/",
  freeShippingLimit: 1500
};
