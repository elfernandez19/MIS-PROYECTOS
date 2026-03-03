// MARINO RESTAURANTE - Order System
// WhatsApp: 990 854 675

const PHONE = '51990854675';
const order = {}; // { itemId: { name, qty, price } }

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateOrderUI();
});

// ── TABS ──────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
}

// ── QTY CONTROL ───────────────────────────────────
function changeQty(id, name, price, delta) {
  if (!order[id]) order[id] = { name, price, qty: 0 };
  order[id].qty = Math.max(0, order[id].qty + delta);

  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = order[id].qty;

  // Highlight row
  const row = document.getElementById('row-' + id);
  if (row) {
    row.classList.toggle('selected', order[id].qty > 0);
  }

  if (order[id].qty === 0) delete order[id];
  updateOrderUI();
}

// ── ORDER UI ──────────────────────────────────────
function updateOrderUI() {
  const items = Object.values(order);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Badge
  const badge = document.getElementById('order-badge');
  if (badge) badge.textContent = count;

  // Toggle visibility
  const toggle = document.getElementById('order-toggle');
  if (toggle) toggle.style.display = count > 0 ? 'flex' : 'none';

  // List
  const list = document.getElementById('order-list');
  if (list) {
    if (items.length === 0) {
      list.innerHTML = '<div class="order-empty">Aún no has seleccionado nada.</div>';
    } else {
      list.innerHTML = items.map(i => `
        <div class="order-row">
          <span class="order-row-name">${i.qty}x ${i.name}</span>
          <span class="order-row-price">S/${(i.price * i.qty).toFixed(2)}</span>
        </div>
      `).join('');
    }
  }

  // Total
  const totalEl = document.getElementById('order-total');
  if (totalEl) totalEl.textContent = `S/${total.toFixed(2)}`;

  // WA Button
  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.disabled = items.length === 0;
}

// ── ORDER PANEL ───────────────────────────────────
function toggleOrderPanel() {
  document.getElementById('order-panel').classList.toggle('open');
}

function closeOrderPanel() {
  document.getElementById('order-panel').classList.remove('open');
}

// ── SEND WHATSAPP ─────────────────────────────────
function sendWhatsApp() {
  const items = Object.values(order);
  if (items.length === 0) return;

  const name    = document.getElementById('inp-name')?.value.trim() || 'Cliente';
  const address = document.getElementById('inp-address')?.value.trim() || 'No indicada';
  const notes   = document.getElementById('inp-notes')?.value.trim() || '';
  const total   = items.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = `🍽️ *PEDIDO — MARINO RESTAURANTE*\n\n`;
  msg += `👤 *Nombre:* ${name}\n`;
  msg += `📍 *Dirección:* ${address}\n\n`;
  msg += `📋 *Pedido:*\n`;
  items.forEach(i => {
    msg += `  • ${i.qty}x ${i.name} — S/${(i.price * i.qty).toFixed(2)}\n`;
  });
  msg += `\n💰 *Total:* S/${total.toFixed(2)}\n`;
  if (notes) msg += `\n📝 *Notas:* ${notes}\n`;
  msg += `\n_Pedido desde la web de Marino_`;

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── SCROLL REVEAL ─────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
