// MARINO BARBER - Appointment System
// WhatsApp: 970 736 968

const PHONE = '51970736968';
let selectedPromo = null;
const selectedServices = {}; // { id: { name, price, qty } }

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateOrderUI();
});

// ── PROMO SELECTION ───────────────────────────────
function selectPromo(id, name, price) {
  if (selectedPromo && selectedPromo.id === id) {
    // Deselect
    selectedPromo = null;
    document.getElementById('promo-' + id)?.classList.remove('selected');
  } else {
    // Deselect previous
    if (selectedPromo) {
      document.getElementById('promo-' + selectedPromo.id)?.classList.remove('selected');
    }
    selectedPromo = { id, name, price };
    document.getElementById('promo-' + id)?.classList.add('selected');
  }
  updateOrderUI();
}

// ── INDIVIDUAL SERVICE QTY ────────────────────────
function changeQty(id, name, price, delta) {
  if (!selectedServices[id]) selectedServices[id] = { name, price, qty: 0 };
  selectedServices[id].qty = Math.max(0, selectedServices[id].qty + delta);

  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = selectedServices[id].qty;

  const row = document.getElementById('row-' + id);
  if (row) row.classList.toggle('selected', selectedServices[id].qty > 0);

  if (selectedServices[id].qty === 0) delete selectedServices[id];
  updateOrderUI();
}

// ── ORDER UI ──────────────────────────────────────
function updateOrderUI() {
  const svcItems = Object.values(selectedServices);
  let total = svcItems.reduce((s, i) => s + i.price * i.qty, 0);
  let count = svcItems.reduce((s, i) => s + i.qty, 0);
  if (selectedPromo) { total += selectedPromo.price; count++; }

  const badge = document.getElementById('order-badge');
  if (badge) badge.textContent = count;

  const toggle = document.getElementById('order-toggle');
  if (toggle) toggle.style.display = count > 0 ? 'flex' : 'none';

  const list = document.getElementById('order-list');
  if (list) {
    let html = '';
    if (selectedPromo) {
      html += `<div class="order-row">
        <span class="order-row-name">📦 ${selectedPromo.name}</span>
        <span class="order-row-price">S/${selectedPromo.price.toFixed(2)}</span>
      </div>`;
    }
    svcItems.forEach(i => {
      html += `<div class="order-row">
        <span class="order-row-name">${i.qty}x ${i.name}</span>
        <span class="order-row-price">S/${(i.price * i.qty).toFixed(2)}</span>
      </div>`;
    });
    list.innerHTML = html || '<div class="order-empty">Aún no has seleccionado nada.</div>';
  }

  const totalEl = document.getElementById('order-total');
  if (totalEl) totalEl.textContent = `S/${total.toFixed(2)}`;

  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.disabled = count === 0;
}

// ── PANEL ─────────────────────────────────────────
function toggleOrderPanel() {
  document.getElementById('order-panel').classList.toggle('open');
}
function closeOrderPanel() {
  document.getElementById('order-panel').classList.remove('open');
}

// ── SEND WHATSAPP ─────────────────────────────────
function sendWhatsApp() {
  const svcItems = Object.values(selectedServices);
  if (!selectedPromo && svcItems.length === 0) return;

  const name  = document.getElementById('inp-name')?.value.trim()  || 'Cliente';
  const fecha = document.getElementById('inp-fecha')?.value.trim() || 'A confirmar';
  const notes = document.getElementById('inp-notes')?.value.trim() || '';
  let total = svcItems.reduce((s, i) => s + i.price * i.qty, 0);
  if (selectedPromo) total += selectedPromo.price;

  let msg = `✂️ *RESERVA DE CITA — MARINO BARBER*\n\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  msg += `📅 *Fecha/hora preferida:* ${fecha}\n\n`;
  msg += `💈 *Servicios solicitados:*\n`;
  if (selectedPromo) msg += `  • Paquete ${selectedPromo.name} — S/${selectedPromo.price.toFixed(2)}\n`;
  svcItems.forEach(i => {
    msg += `  • ${i.qty}x ${i.name} — S/${(i.price * i.qty).toFixed(2)}\n`;
  });
  msg += `\n💰 *Total referencial:* S/${total.toFixed(2)}\n`;
  if (notes) msg += `\n📝 *Notas:* ${notes}\n`;
  msg += `\n_Reserva desde la web de Marino_`;

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── SCROLL REVEAL ─────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
