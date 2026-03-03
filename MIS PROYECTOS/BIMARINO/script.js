// ============================================================
//  MARINO - JAVASCRIPT
// ============================================================

// ---- CURSOR PERSONALIZADO ----
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    }, 80);
  });

  document.querySelectorAll('a, button, .menu-item, .promo-card, .preview-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      follower.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.opacity = '0.5';
    });
  });
}

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ---- PARTÍCULAS DE FONDO ----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '0, 245, 255' : '139, 0, 255',
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
    ctx.fill();

    // Líneas entre partículas cercanas
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.05 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- TABS RESTAURANTE ----
function switchTab(tab) {
  document.querySelectorAll('#restaurante-section .menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#restaurante-section .tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('tab-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// ---- TABS BARBER ----
function switchBarberTab(tab) {
  document.querySelectorAll('#barber-section .menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#barber-section .tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('btab-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// ---- SELECTOR DE SERVICIO EN FORMULARIO ----
let currentService = 'restaurante';

const whatsappNumbers = {
  restaurante: '51990854675',
  barber: '51970736968',
  lavanderia: '51990854675', // usar el principal hasta confirmar el número de lavandería
};

const serviceLabels = {
  restaurante: 'Tu pedido (detalla platos, guarniciones, bebidas)',
  barber: 'Servicio que deseas (ej: Corte + Barba, Paquete Premium...)',
  lavanderia: 'Descripción de tu ropa (tipo, cantidad, observaciones)',
};

const servicePlaceholders = {
  restaurante: 'Ej: 1 Trío Marino + 1 Jugo de Mango + delivery a Los Sauces...',
  barber: 'Ej: Quiero agendar para el sábado - Paquete Premium...',
  lavanderia: 'Ej: 5 polos, 2 pantalones, 3 camisas. Recojo en Los Sauces...',
};

function selectService(service) {
  currentService = service;

  document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sbtn-' + service).classList.add('active');

  document.getElementById('order-label').textContent = serviceLabels[service];
  document.getElementById('order-detail').placeholder = servicePlaceholders[service];
}

// ---- BOTONES DE PEDIR (desde sección de servicios) ----
function openOrder(service) {
  selectService(service);
  document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
}

// ---- ENVIAR PEDIDO POR WHATSAPP ----
function sendOrder() {
  const name = document.getElementById('order-name').value.trim();
  const address = document.getElementById('order-address').value.trim();
  const detail = document.getElementById('order-detail').value.trim();
  const extra = document.getElementById('order-extra').value.trim();

  if (!name) { showAlert('Por favor ingresa tu nombre 😊'); return; }
  if (!address) { showAlert('Por favor ingresa tu dirección o referencia 📍'); return; }
  if (!detail) { showAlert('Por favor detalla tu pedido ✏️'); return; }

  const serviceEmojis = { restaurante: '🍽️', barber: '💈', lavanderia: '👕' };
  const serviceNames = { restaurante: 'MARINO RESTAURANTE', barber: 'MARINO BARBER', lavanderia: 'MARINO LAVANDERÍA' };

  let message = `${serviceEmojis[currentService]} *NUEVO PEDIDO — ${serviceNames[currentService]}*\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `📍 *Dirección:* ${address}\n\n`;
  message += `📋 *Detalle:*\n${detail}\n`;
  if (extra) message += `\n💬 *Indicación especial:* ${extra}`;
  message += `\n\n_Pedido enviado desde marinocorporacion.com_`;

  const number = whatsappNumbers[currentService];
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

// ---- ALERTA PERSONALIZADA ----
function showAlert(msg) {
  const existing = document.querySelector('.custom-alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = 'custom-alert';
  alert.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #0e0e18;
    border: 1px solid #00f5ff;
    color: #f0f4ff;
    padding: 1rem 2rem;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    z-index: 9999;
    box-shadow: 0 0 20px rgba(0,245,255,0.3);
    animation: fadeInUp 0.3s ease;
    max-width: 90vw;
    text-align: center;
  `;
  alert.textContent = msg;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3500);
}

// ---- INTERSECTION OBSERVER (animaciones al hacer scroll) ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-block, .lav-feature, .promo-card, .nstat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
