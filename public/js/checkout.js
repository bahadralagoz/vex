(() => {
  const { fmt, byId, visual, esc, load, totals } = window.FrenaShop;
  const $ = s => document.querySelector(s);
  const CITIES = "Adana,Adıyaman,Afyonkarahisar,Ağrı,Aksaray,Amasya,Ankara,Antalya,Ardahan,Artvin,Aydın,Balıkesir,Bartın,Batman,Bayburt,Bilecik,Bingöl,Bitlis,Bolu,Burdur,Bursa,Çanakkale,Çankırı,Çorum,Denizli,Diyarbakır,Düzce,Edirne,Elazığ,Erzincan,Erzurum,Eskişehir,Gaziantep,Giresun,Gümüşhane,Hakkari,Hatay,Iğdır,Isparta,İstanbul,İzmir,Kahramanmaraş,Karabük,Karaman,Kars,Kastamonu,Kayseri,Kırıkkale,Kırklareli,Kırşehir,Kilis,Kocaeli,Konya,Kütahya,Malatya,Manisa,Mardin,Mersin,Muğla,Muş,Nevşehir,Niğde,Ordu,Osmaniye,Rize,Sakarya,Samsun,Siirt,Sinop,Sivas,Şanlıurfa,Şırnak,Tekirdağ,Tokat,Trabzon,Tunceli,Uşak,Van,Yalova,Yozgat,Zonguldak".split(",");
  $("#city").insertAdjacentHTML("beforeend", CITIES.map(c => `<option>${c}</option>`).join(""));

  const cart = load();
  const t = totals(cart);
  $("#summaryItems").innerHTML = cart.length ? cart.map(l => {
    const p = byId(l.id);
    const color = p.colors.find(c => c.name === l.color) || p.colors[0];
    return `<div class="line-item"><div class="line-item__img">${visual(p, color, { alt: false })}</div>
      <div><h4>${esc(p.name)}</h4><small>${esc(l.color)} · ${esc(l.size)} · ${l.qty} adet</small></div>
      <div class="line-item__right"><span>${fmt(p.price * l.qty)}</span></div></div>`;
  }).join("") : `<p class="summary__empty">Sepetin boş. <a href="index.html#koleksiyon">Koleksiyona göz at</a>.</p>`;
  $("#sumSubtotal").textContent = fmt(t.subtotal);
  $("#sumShipping").textContent = t.shipping ? fmt(t.shipping) : "Ücretsiz";
  $("#sumTotal").textContent = fmt(t.total);
  $("#payBtn").disabled = !cart.length;

  // önceki denemeden kalan bilgileri geri doldur (kart bilgisi asla saklanmaz)
  const FIELDS = ["name", "surname", "email", "phone", "city", "district", "address", "zip", "note"];
  try {
    const saved = JSON.parse(localStorage.getItem("frena-customer")) || {};
    FIELDS.forEach(f => { if (saved[f]) $("#" + f).value = saved[f]; });
  } catch {}

  function showErrors(fields = {}) {
    document.querySelectorAll(".field").forEach(el => el.classList.remove("invalid"));
    Object.entries(fields).forEach(([k, msg]) => {
      const el = (k === "consent" ? $("#consentField") : $("#" + k)?.closest(".field"));
      if (!el) return;
      el.classList.add("invalid");
      el.querySelector(".hint").textContent = msg;
    });
    const first = document.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
    first?.focus();
  }

  $("#checkoutForm").addEventListener("input", e => { e.target.closest(".field")?.classList.remove("invalid"); if (!document.querySelector(".field.invalid")) $("#formError").hidden = true; });
  $("#checkoutForm").addEventListener("change", e => e.target.closest(".field")?.classList.remove("invalid"));

  $("#checkoutForm").addEventListener("submit", async e => {
    e.preventDefault();
    const customer = Object.fromEntries(FIELDS.concat("identityNumber").map(f => [f, $("#" + f).value.trim()]));
    customer.consent = $("#consent").checked;
    try { localStorage.setItem("frena-customer", JSON.stringify(Object.fromEntries(FIELDS.map(f => [f, customer[f]])))); } catch {}

    const btn = $("#payBtn"), err = $("#formError");
    btn.disabled = true; btn.textContent = "Ödeme sayfası hazırlanıyor…"; err.hidden = true;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, cart: cart.map(({ id, color, size, qty }) => ({ id, color, size, qty })) })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        err.textContent = data.error || "Bir sorun oluştu, tekrar dene.";
        err.hidden = false;
        showErrors(data.fields);
        if (!data.fields) scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      location.href = data.redirect;
    } catch {
      err.textContent = "Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.";
      err.hidden = false;
    } finally {
      btn.disabled = !cart.length;
      btn.innerHTML = 'Ödemeye geç <span class="btn__arrow">→</span>';
    }
  });
})();
