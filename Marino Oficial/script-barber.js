// MARINO BARBER — Appointment System
// WhatsApp: 970 736 968
// 2 Sucursales: Los Sauces | La Pradera

const PHONE = '51970736968';
let selectedPromo = null;
let selectedSucursal = null;
const selectedServices = {};

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateOrderUI();
});

function chooseSucursal(id, name) {
  selectedSucursal = { id, name };
  document.querySelectorAll('.sucursal-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('suc-' + id)?.classList.add('selected');
  updateOrderUI();
}

function selectPromo(id, name, price) {
  if (selectedPromo?.id === id) {
    selectedPromo = null;
    document.getElementById('promo-' + id)?.classList.remove('selected');
  } else {
    if (selectedPromo) document.getElementById('promo-' + selectedPromo.id)?.classList.remove('selected');
    selectedPromo = { id, name, price };
    document.getElementById('promo-' + id)?.classList.add('selected');
  }
  updateOrderUI();
}

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

function updateOrderUI() {
  const svcItems = Object.values(selectedServices);
  let total = svcItems.reduce((s, i) => s + i.price * i.qty, 0);
  let count = svcItems.reduce((s, i) => s + i.qty, 0);
  if (selectedPromo) { total += selectedPromo.price; count++; }

  const badge = document.getElementById('order-badge');
  if (badge) badge.textContent = count;
  const toggle = document.getElementById('order-toggle');
  if (toggle) toggle.style.display = count > 0 ? 'flex' : 'none';

  // Sucursal warning
  const sucWarn = document.getElementById('suc-warning');
  if (sucWarn) sucWarn.style.display = (!selectedSucursal && count > 0) ? 'block' : 'none';

  const list = document.getElementById('order-list');
  if (list) {
    let html = '';
    if (selectedSucursal) {
      html += `<div class="order-row order-row-suc"><span class="order-row-name">📍 Sucursal: ${selectedSucursal.name}</span></div>`;
    }
    if (selectedPromo) {
      html += `<div class="order-row"><span class="order-row-name">📦 ${selectedPromo.name}</span><span class="order-row-price">S/${selectedPromo.price.toFixed(2)}</span></div>`;
    }
    svcItems.forEach(i => {
      html += `<div class="order-row"><span class="order-row-name">${i.qty}x ${i.name}</span><span class="order-row-price">S/${(i.price*i.qty).toFixed(2)}</span></div>`;
    });
    list.innerHTML = html || '<div class="order-empty">Aún no has seleccionado nada.</div>';
  }

  const totalEl = document.getElementById('order-total');
  if (totalEl) totalEl.textContent = `S/${total.toFixed(2)}`;
  const waBtn = document.getElementById('wa-btn');
  if (waBtn) waBtn.disabled = count === 0 || !selectedSucursal;
}

function toggleOrderPanel() { document.getElementById('order-panel').classList.toggle('open'); }
function closeOrderPanel()  { document.getElementById('order-panel').classList.remove('open'); }

function sendWhatsApp() {
  const svcItems = Object.values(selectedServices);
  if (!selectedPromo && !svcItems.length) return;
  if (!selectedSucursal) { alert('Por favor selecciona una sucursal.'); return; }

  const name  = document.getElementById('inp-name')?.value.trim()  || 'Cliente';
  const fecha = document.getElementById('inp-fecha')?.value.trim() || 'A confirmar';
  const notes = document.getElementById('inp-notes')?.value.trim() || '';
  let total = svcItems.reduce((s, i) => s + i.price * i.qty, 0);
  if (selectedPromo) total += selectedPromo.price;

  // Determine service key for admin
  const serviceKey = selectedSucursal.id === 'sauces' ? 'barber_sauces' : 'barber_pradera';
  const allItems = [];
  if (selectedPromo) allItems.push({ name: `Paquete ${selectedPromo.name}`, qty: 1, price: selectedPromo.price });
  svcItems.forEach(i => allItems.push(i));
  saveOrderToStorage(serviceKey, allItems, total, { name, fecha });

  let msg = `✂️ *RESERVA DE CITA — MARINO BARBER*\n\n`;
  msg += `📍 *Sucursal:* ${selectedSucursal.name}\n`;
  msg += `👤 *Nombre:* ${name}\n📅 *Fecha/hora:* ${fecha}\n\n💈 *Servicios:*\n`;
  if (selectedPromo) msg += `  • Paquete ${selectedPromo.name} — S/${selectedPromo.price.toFixed(2)}\n`;
  svcItems.forEach(i => { msg += `  • ${i.qty}x ${i.name} — S/${(i.price*i.qty).toFixed(2)}\n`; });
  msg += `\n💰 *Total referencial:* S/${total.toFixed(2)}\n`;
  if (notes) msg += `📝 *Notas:* ${notes}\n`;
  msg += `\n_Reserva desde marinochiclayo.com_`;
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
