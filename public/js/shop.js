// Ana sayfa ve ödeme sayfasının ortak kullandığı yardımcılar: biçimlendirme, görseller, sepet.
window.FrenaShop = (() => {
  const PRODUCTS = window.FRENA_PRODUCTS;
  const CONFIG = window.FRENA_CONFIG;
  const KEY = "frena-cart";

  const fmt = n => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(n) + " TL";
  const byId = id => PRODUCTS.find(p => p.id === id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // fotoğraf eklenene kadar kategoriye göre çizilen yer tutucu
  const SHAPES = {
    elbise: "M78 20 Q100 34 122 20 L128 62 Q120 84 126 110 L168 236 Q100 252 32 236 L74 110 Q80 84 72 62 Z",
    tshirt: "M70 40 Q100 56 130 40 L176 66 L162 112 L142 104 L144 214 Q100 224 56 214 L58 104 L38 112 L24 66 Z",
    atlet: "M78 30 L92 30 Q100 60 108 30 L122 30 Q128 70 140 92 L144 214 Q100 224 56 214 L60 92 Q72 70 78 30 Z",
    alt: "M58 30 L142 30 L150 236 L114 240 L100 92 L86 240 L50 236 Z",
    ceket: "M66 26 L100 70 L134 26 L176 56 L170 236 L112 240 L100 92 L88 240 L30 236 L24 56 Z"
  };
  const imagesOf = (p, color) => (color || p.colors[0]).images || p.images || [];
  function visual(p, color, { alt = true, index = 0 } = {}) {
    const imgs = imagesOf(p, color);
    if (imgs.length) {
      const main = `<img src="${imgs[index] || imgs[0]}" alt="${esc(p.name)}" loading="lazy">`;
      return alt && imgs[1] && index === 0 ? main + `<img class="alt" src="${imgs[1]}" alt="" loading="lazy">` : main;
    }
    const fill = color ? color.hex : p.colors[0].hex;
    const tone = p.tone || ["#e7d8c6", "#a8876a"];
    return `<div class="ph" style="background:radial-gradient(circle at 50% 30%, ${tone[0]}, ${tone[1]})">
      <svg viewBox="0 0 200 260"><path d="${SHAPES[p.category] || SHAPES.tshirt}" fill="${fill}" stroke="rgba(0,0,0,.12)"/></svg>
      <span class="ph__label">${esc(p.name)}</span></div>`;
  }

  function load() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch { cart = []; }
    return cart.filter(l => byId(l.id) && l.qty > 0);
  }
  function save(cart) { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} }
  function totals(cart) {
    const subtotal = cart.reduce((a, l) => a + l.qty * byId(l.id).price, 0);
    const shipping = subtotal === 0 || subtotal >= CONFIG.freeShippingLimit ? 0 : CONFIG.shippingFee;
    return { count: cart.reduce((a, l) => a + l.qty, 0), subtotal, shipping, total: subtotal + shipping };
  }

  return { PRODUCTS, CONFIG, fmt, byId, esc, visual, imagesOf, load, save, totals };
})();
