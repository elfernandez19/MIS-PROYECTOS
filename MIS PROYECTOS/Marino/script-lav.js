// MARINO LAVANDERÍA - Service Request System
// WhatsApp: 990 854 675

const PHONE = '51990854675';
const selected = {}; // { id: { name, unit, qty } }

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateOrderUI();
});

// ── QTY CONTROL ───────────────────────────────────
function changeQty(id, name, unit, delta) {
  if (!selected[id]) selected[id] = { name, unit, qty: 0 };
  selected[id].qty = Math.max(0, selected[id].qty + delta);

  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = selected[id].qty;

  const row = document.getElementById('row-' + id);
  if (row) row.classList.toggle('selected', selected[id].qty > 0);

  if (selected[id].qty === 0) delete selected[id];
  updateOrderUI();
}

// ── ORDER UI ──────────────────────────────────────
function updateOrderUI() {
  const items = Object.values(selected);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const badge = document.getElementById('order-badge');
  if (badge) badge.textContent = count;

  const toggle = document.getElementById('order-toggle');
  if (toggle) toggle.style.display = count > 0 ? 'flex' : 'none';

  const list = document.getElementById('order-list');
  if (list) {
    if (items.length === 0) {
      list.innerHTML = '<div class="order-empty">Aún no has seleccionado nada.</div>';
    } else {
      list.innerHTML = items.map(i => `
        <div class="order-row">
          <span class="order-row-name">${i.name}</span>
          <span class="order-row-qty">${i.qty} ${i.unit}${i.qty > 1 && i.unit === 'kg' ? '' : ''}</span>
        </div>
      `).join('');
    }
  }

  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.disabled = items.length === 0;
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
  const items = Object.values(selected);
  if (items.length === 0) return;

  const name    = document.getElementById('inp-name')?.value.trim()    || 'Cliente';
  const address = document.getElementById('inp-address')?.value.trim() || 'No indicada';
  const horario = document.getElementById('inp-horario')?.value.trim() || 'A confirmar';
  const notes   = document.getElementById('inp-notes')?.value.trim()   || '';

  let msg = `👕 *SOLICITUD — MARINO LAVANDERÍA*\n\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  msg += `📍 *Dirección de recojo:* ${address}\n`;
  msg += `🕐 *Horario de recojo:* ${horario}\n\n`;
  msg += `🧺 *Ropa a lavar:*\n`;
  items.forEach(i => {
    msg += `  • ${i.name}: ${i.qty} ${i.unit}${i.qty > 1 && i.unit !== 'par' ? 's' : ''}\n`;
  });
  msg += `\n✨ *Recojo y entrega GRATIS*\n`;
  if (notes) msg += `\n📝 *Notas:* ${notes}\n`;
  msg += `\n_Solicitud desde la web de Marino_`;

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── SCROLL REVEAL ─────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
