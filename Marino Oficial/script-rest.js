// MARINO RESTAURANTE — Order System
// WhatsApp: 990 854 675

const PHONE = '51990854675';
const order = {};

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateOrderUI();
});

function switchTab(tab) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
}

function changeQty(id, name, price, delta) {
  if (!order[id]) order[id] = { name, price, qty: 0 };
  order[id].qty = Math.max(0, order[id].qty + delta);
  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = order[id].qty;
  const row = document.getElementById('row-' + id);
  if (row) row.classList.toggle('selected', order[id].qty > 0);
  if (order[id].qty === 0) delete order[id];
  updateOrderUI();
}

function updateOrderUI() {
  const items = Object.values(order);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('order-badge');
  if (badge) badge.textContent = count;
  const toggle = document.getElementById('order-toggle');
  if (toggle) toggle.style.display = count > 0 ? 'flex' : 'none';
  const list = document.getElementById('order-list');
  if (list) {
    list.innerHTML = items.length === 0
      ? '<div class="order-empty">Aún no has seleccionado nada.</div>'
      : items.map(i => `<div class="order-row"><span class="order-row-name">${i.qty}x ${i.name}</span><span class="order-row-price">S/${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
  }
  const totalEl = document.getElementById('order-total');
  if (totalEl) totalEl.textContent = `S/${total.toFixed(2)}`;
  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.disabled = items.length === 0;
}

function toggleOrderPanel() { document.getElementById('order-panel').classList.toggle('open'); }
function closeOrderPanel()  { document.getElementById('order-panel').classList.remove('open'); }

function sendWhatsApp() {
  const items = Object.values(order);
  if (!items.length) return;
  const name    = document.getElementById('inp-name')?.value.trim()    || 'Cliente';
  const address = document.getElementById('inp-address')?.value.trim() || 'No indicada';
  const notes   = document.getElementById('inp-notes')?.value.trim()   || '';
  const total   = items.reduce((s,i) => s + i.price*i.qty, 0);

  // Save order for admin panel
  saveOrderToStorage('restaurante', items, total, { name, address });

  let msg = `🍽️ *PEDIDO — MARINO RESTAURANTE*\n\n`;
  msg += `👤 *Nombre:* ${name}\n📍 *Dirección:* ${address}\n\n📋 *Pedido:*\n`;
  items.forEach(i => { msg += `  • ${i.qty}x ${i.name} — S/${(i.price*i.qty).toFixed(2)}\n`; });
  msg += `\n💰 *Total:* S/${total.toFixed(2)}\n`;
  if (notes) msg += `📝 *Notas:* ${notes}\n`;
  msg += `\n_Pedido desde marinochiclayo.com_`;
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
}

function saveOrderToStorage(service, items, total, customer) {
  try {
    const orders = JSON.parse(localStorage.getItem('marino_orders') || '[]');
    const now = new Date();
    orders.push({
      id: Date.now(), service, items, total, customer,
      date: now.toISOString(),
      day: now.toLocaleDateString('es-PE'),
      month: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`,
      year: String(now.getFullYear())
    });
    localStorage.setItem('marino_orders', JSON.stringify(orders));
  } catch(e) { console.warn('Storage error', e); }
}

function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
