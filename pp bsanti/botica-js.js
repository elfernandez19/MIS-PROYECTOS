// =====================================================================
// CONFIGURACIÓN DE LA API PARA CONSULTAR DNI Y RUC
// El token es como una contraseña que nos da permiso para usar el servicio
// =====================================================================
const API_TOKEN = 'sk_13668.HaO80R1Q4FvuyPNI8Wz1j5BrPFIPC6eo';

// =====================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// Aquí guardamos todos los datos mientras la app está abierta
// =====================================================================
let state = {
  name: 'Botica Santillán',          // Nombre del negocio (editable)
  config: { dir: '', tel: '' },       // Dirección y teléfono del negocio
  productos: [],  // Lista de productos en inventario
  ventas: [],     // Historial de ventas registradas
  clientes: []    // Lista de clientes registrados
};

// Guarda el estado en localStorage para que no se pierda al cerrar la app
function save() {
  localStorage.setItem('botica_santillan', JSON.stringify(state));
  // JSON.stringify convierte el objeto a texto para poder guardarlo
}

// Carga los datos guardados al abrir la app
function load() {
  const d = localStorage.getItem('botica_santillan'); // Busca datos guardados
  if (d) state = JSON.parse(d); // JSON.parse convierte el texto de vuelta a objeto
}
load(); // Se ejecuta automáticamente al iniciar

// =====================================================================
// NAVEGACIÓN ENTRE PESTAÑAS
// Muestra la sección seleccionada y oculta las demás
// =====================================================================
function showTab(t) {
  // Quita la clase "active" de todas las secciones (las oculta)
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Quita el resaltado de todos los botones del menú
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));

  // Muestra solo la sección que el usuario seleccionó
  document.getElementById('tab-' + t).classList.add('active');

  // Resalta el botón del menú que fue clickeado
  event.target.classList.add('active');

  // Llama a la función correspondiente para renderizar el contenido
  if (t === 'dashboard') renderDashboard();
  if (t === 'inventario') renderInventario();
  if (t === 'ventas') { renderHistorialVentas(); renderVentaItems(); }
  if (t === 'clientes') renderClientes();
  if (t === 'reportes') renderReportes();
}

// =====================================================================
// EDICIÓN DEL NOMBRE DEL NEGOCIO
// =====================================================================

// Abre el modal con el nombre actual para editarlo
function openEditName() {
  document.getElementById('modal-name-input').value = state.name;
  document.getElementById('modal-name').classList.add('open'); // Muestra el modal
}

// Guarda el nuevo nombre ingresado
function saveEditName() {
  state.name = document.getElementById('modal-name-input').value || state.name;
  document.getElementById('bizName').textContent = state.name; // Actualiza el encabezado
  document.title = state.name; // Cambia el título de la pestaña del navegador
  save();
  closeModal('modal-name');
}

// Cierra cualquier modal por su ID
function closeModal(id) {
  document.getElementById(id).classList.remove('open'); // Quita la clase que lo hace visible
}

// =====================================================================
// CONSULTA DE DNI / RUC EN TIEMPO REAL
// =====================================================================

// Detecta automáticamente si lo que se escribe es DNI (8 dígitos) o RUC (11 dígitos)
function onDocInput(prefix) {
  // replace(/\D/g, '') elimina todo lo que no sea número
  const val = document.getElementById(prefix + '-doc').value.replace(/\D/g, '');
  document.getElementById(prefix + '-doc').value = val;

  const badge = document.getElementById(prefix + '-doc-badge');

  if (val.length === 8) {
    badge.textContent = 'DNI';
    badge.className = 'dni-badge dni-ok'; // Etiqueta verde para DNI
    badge.style.display = 'inline';
  } else if (val.length === 11) {
    badge.textContent = 'RUC';
    badge.className = 'dni-badge badge-blue'; // Etiqueta azul para RUC
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none'; // Oculta si no tiene la longitud correcta
  }
}

// Consulta la API de RENIEC/SUNAT para obtener el nombre del DNI o RUC
async function consultarDoc(prefix) {
  const val = document.getElementById(prefix + '-doc').value.trim();
  const info = document.getElementById(prefix + '-doc-info'); // Área de resultado

  if (val.length !== 8 && val.length !== 11) {
    info.innerHTML = '<span style="color:#e53935">Ingresa un DNI (8 dígitos) o RUC (11 dígitos)</span>';
    return; // Detiene la ejecución si el número no es válido
  }

  const tipo = val.length === 8 ? 'dni' : 'ruc';
  info.innerHTML = '<span class="spinner"></span> Consultando...'; // Muestra animación

  try {
    // fetch hace una petición HTTP a la API con el número ingresado
    const res = await fetch(`https://api.apis.net.pe/v2/${tipo}?numero=${val}`, {
      headers: {
        Authorization: 'Bearer ' + API_TOKEN, // Token de acceso al servicio
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('No encontrado'); // Si la API falla, lanza un error

    const data = await res.json(); // Convierte la respuesta JSON a objeto

    // La API puede devolver el nombre en distintos campos según si es DNI o RUC
    const nombre = data.nombre || data.razonSocial || data.nombreCompleto || '';
    if (!nombre) throw new Error('Sin datos');

    // Rellena automáticamente el campo de nombre
    document.getElementById(prefix + '-nombre').value = nombre;
    info.innerHTML = `✅ <strong>${tipo.toUpperCase()}</strong> válido — <span style="color:#333">${nombre}</span>`;

  } catch (e) {
    info.innerHTML = '<span style="color:#e53935">❌ No se encontró información. Verifica el número.</span>';
  }
}

// =====================================================================
// GESTIÓN DE CLIENTES
// =====================================================================

// Agrega un nuevo cliente al registro
function addCliente() {
  const n = document.getElementById('cl-nombre').value.trim();
  if (!n) { alert('Ingresa el nombre del cliente'); return; }

  const doc = document.getElementById('cl-doc').value.trim();
  const tipo = doc.length === 8 ? 'DNI' : doc.length === 11 ? 'RUC' : '—';

  state.clientes.push({
    id: Date.now(),  // ID único basado en la fecha y hora actual
    nombre: n,
    doc,
    tipoDoc: tipo,
    telefono: document.getElementById('cl-telefono').value,
    email: document.getElementById('cl-email').value,
    compras: 0  // Contador de compras registradas, empieza en cero
  });

  save(); renderClientes();

  // Limpia los campos después de agregar
  ['cl-doc', 'cl-nombre', 'cl-telefono', 'cl-email'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('cl-doc-info').textContent = '';
  document.getElementById('cl-doc-badge').style.display = 'none';
}

// Dibuja la tabla de clientes en pantalla
function renderClientes() {
  const q = document.getElementById('cl-buscar')?.value?.toLowerCase() || '';
  const tb = document.getElementById('tbl-clientes');

  // Filtra clientes cuyo nombre o número de documento coincida con la búsqueda
  const list = state.clientes.filter(c =>
    c.nombre.toLowerCase().includes(q) || (c.doc || '').includes(q)
  );

  if (!list.length) {
    tb.innerHTML = '<tr><td colspan="6" class="empty">Sin clientes aún</td></tr>';
    return;
  }

  // Genera una fila HTML por cada cliente encontrado
  tb.innerHTML = list.map(c => `<tr>
    <td><strong>${c.nombre}</strong></td>
    <td>${c.doc || '—'}</td>
    <td><span class="badge ${c.tipoDoc === 'RUC' ? 'badge-blue' : 'badge-teal'}">${c.tipoDoc || '—'}</span></td>
    <td>${c.telefono || '—'}</td>
    <td><span class="badge badge-green">${c.compras || 0}</span></td>
    <td>
      <button class="btn btn-sm" style="background:#e0f2f1;color:#00796b" onclick="openEditCl(${c.id})">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="deleteCl(${c.id})">🗑️</button>
    </td>
  </tr>`).join('');
}

// Abre el modal para editar los datos de un cliente
function openEditCl(id) {
  const c = state.clientes.find(x => x.id === id); // Busca el cliente por su ID
  if (!c) return;
  // Rellena el modal con los datos actuales del cliente
  document.getElementById('ecl-id').value = id;
  document.getElementById('ecl-doc').value = c.doc || '';
  document.getElementById('ecl-nombre').value = c.nombre;
  document.getElementById('ecl-tel').value = c.telefono || '';
  document.getElementById('ecl-email').value = c.email || '';
  document.getElementById('modal-edit-cl').classList.add('open');
}

// Guarda los cambios al editar un cliente
function saveEditCl() {
  const id = parseInt(document.getElementById('ecl-id').value); // parseInt convierte texto a número entero
  const c = state.clientes.find(x => x.id === id);
  if (!c) return;
  const doc = document.getElementById('ecl-doc').value.trim();
  c.doc = doc;
  c.tipoDoc = doc.length === 8 ? 'DNI' : doc.length === 11 ? 'RUC' : '—';
  c.nombre = document.getElementById('ecl-nombre').value || c.nombre;
  c.telefono = document.getElementById('ecl-tel').value;
  c.email = document.getElementById('ecl-email').value;
  save(); renderClientes(); closeModal('modal-edit-cl');
}

// Elimina un cliente por su ID
function deleteCl(id) {
  if (confirm('¿Eliminar cliente?')) {
    // filter devuelve todos los clientes EXCEPTO el que tiene ese ID
    state.clientes = state.clientes.filter(c => c.id !== id);
    save(); renderClientes();
  }
}

// Elimina todos los clientes
function clearClientes() {
  if (confirm('¿Eliminar todos los clientes?')) {
    state.clientes = [];
    save(); renderClientes();
  }
}

// =====================================================================
// GESTIÓN DE INVENTARIO
// =====================================================================

// Agrega un nuevo producto al inventario
function addProducto() {
  const n = document.getElementById('inv-nombre').value.trim();
  const p = parseFloat(document.getElementById('inv-precio').value); // Precio de venta
  const s = parseInt(document.getElementById('inv-stock').value);    // Cantidad en stock

  // Valida que los campos obligatorios estén completos
  if (!n || isNaN(p) || isNaN(s)) { alert('Completa nombre, precio y stock'); return; }

  state.productos.push({
    id: Date.now(),
    nombre: n,
    cat: document.getElementById('inv-cat').value,
    precio: p,
    costo: parseFloat(document.getElementById('inv-costo').value) || 0, // Costo de compra (para calcular ganancia)
    stock: s,
    stockMin: parseInt(document.getElementById('inv-stock-min').value) || 5, // Alerta cuando baje de este número
    vencimiento: document.getElementById('inv-vencimiento').value
  });

  save(); renderInventario();
  // Limpia el formulario
  ['inv-nombre', 'inv-precio', 'inv-costo', 'inv-stock', 'inv-vencimiento'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('inv-stock-min').value = '5';
}

// Dibuja la tabla del inventario
function renderInventario() {
  const q = document.getElementById('inv-buscar')?.value?.toLowerCase() || '';
  const tb = document.getElementById('tbl-inv');
  const list = state.productos.filter(p => p.nombre.toLowerCase().includes(q));

  if (!list.length) {
    tb.innerHTML = '<tr><td colspan="6" class="empty">Sin productos aún</td></tr>';
    return;
  }

  tb.innerHTML = list.map(p => `<tr>
    <td><strong>${p.nombre}</strong></td>
    <td><span class="badge badge-teal">${p.cat}</span></td>
    <td>S/ ${p.precio.toFixed(2)}</td>
    <td class="${p.stock <= p.stockMin ? 'stock-low' : ''}">
      ${p.stock} ${p.stock <= p.stockMin ? '⚠️' : ''}
    </td>
    <td style="font-size:.78rem">${p.vencimiento || '—'}</td>
    <td>
      <button class="btn btn-sm" style="background:#e0f2f1;color:#00796b" onclick="openEditProd(${p.id})">✏️</button>
      <button class="btn btn-danger btn-sm" onclick="deleteProd(${p.id})">🗑️</button>
    </td>
  </tr>`).join('');
}

// Abre el modal para editar un producto
function openEditProd(id) {
  const p = state.productos.find(x => x.id === id);
  if (!p) return;
  document.getElementById('ep-id').value = id;
  document.getElementById('ep-nombre').value = p.nombre;
  document.getElementById('ep-cat').value = p.cat;
  document.getElementById('ep-precio').value = p.precio;
  document.getElementById('ep-costo').value = p.costo || 0;
  document.getElementById('ep-stock').value = p.stock;
  document.getElementById('ep-stockmin').value = p.stockMin || 5;
  document.getElementById('ep-venc').value = p.vencimiento || '';
  document.getElementById('modal-edit-prod').classList.add('open');
}

// Guarda los cambios al editar un producto
function saveEditProd() {
  const id = parseInt(document.getElementById('ep-id').value);
  const p = state.productos.find(x => x.id === id);
  if (!p) return;
  p.nombre = document.getElementById('ep-nombre').value || p.nombre;
  p.cat = document.getElementById('ep-cat').value;
  p.precio = parseFloat(document.getElementById('ep-precio').value) || p.precio;
  p.costo = parseFloat(document.getElementById('ep-costo').value) || 0;
  p.stock = parseInt(document.getElementById('ep-stock').value) || p.stock;
  p.stockMin = parseInt(document.getElementById('ep-stockmin').value) || 5;
  p.vencimiento = document.getElementById('ep-venc').value;
  save(); renderInventario(); closeModal('modal-edit-prod');
}

// Elimina un producto del inventario
function deleteProd(id) {
  if (confirm('¿Eliminar producto?')) {
    state.productos = state.productos.filter(p => p.id !== id);
    save(); renderInventario();
  }
}

// Vacía todo el inventario
function clearInventario() {
  if (confirm('¿Eliminar inventario?')) {
    state.productos = [];
    save(); renderInventario();
  }
}

// =====================================================================
// GESTIÓN DE VENTAS
// =====================================================================

let ventaItems = []; // Arreglo temporal con los productos del ticket actual

// Agrega un producto al ticket de venta actual
function addVentaItem() {
  if (!state.productos.length) { alert('Agrega productos primero'); return; }
  ventaItems.push({ prodId: state.productos[0].id, cant: 1 }); // Agrega el primer producto por defecto
  renderVentaItems();
}

// Dibuja los ítems del ticket actual y calcula el total
function renderVentaItems() {
  const w = document.getElementById('v-items-wrap');
  if (!ventaItems.length) {
    w.innerHTML = '';
    document.getElementById('v-total-preview').textContent = '';
    return;
  }

  w.innerHTML = ventaItems.map((it, i) => `<div class="form-row" style="align-items:center">
    <select onchange="ventaItems[${i}].prodId=parseInt(this.value);renderVentaItems()" style="flex:2">
      ${state.productos.map(p => `<option value="${p.id}" ${p.id === it.prodId ? 'selected' : ''}>${p.nombre} — S/ ${p.precio.toFixed(2)} (${p.stock})</option>`).join('')}
    </select>
    <input type="number" min="1" value="${it.cant}" style="flex:.5;min-width:55px"
      onchange="ventaItems[${i}].cant=parseInt(this.value)||1;renderVentaItems()"/>
    <button class="btn btn-danger btn-sm" onclick="ventaItems.splice(${i},1);renderVentaItems()">✕</button>
  </div>`).join('');

  // Calcula el total de todos los ítems del ticket
  const total = ventaItems.reduce((s, it) => {
    const p = state.productos.find(x => x.id === it.prodId);
    return s + (p ? p.precio * it.cant : 0);
  }, 0);

  document.getElementById('v-total-preview').textContent = ventaItems.length ? 'Total: S/ ' + total.toFixed(2) : '';
}

// Registra la venta y descuenta el stock automáticamente
function registrarVenta() {
  if (!ventaItems.length) { alert('Agrega al menos un producto'); return; }

  const items = [];
  for (const it of ventaItems) {
    const p = state.productos.find(x => x.id === it.prodId);
    if (!p) { alert('Producto no encontrado'); return; }

    // Verifica que haya suficiente stock antes de vender
    if (p.stock < it.cant) { alert('Stock insuficiente: ' + p.nombre); return; }

    items.push({ nombre: p.nombre, cant: it.cant, precio: p.precio, costo: p.costo || 0 });
    p.stock -= it.cant; // Resta la cantidad vendida del stock
  }

  const total = items.reduce((s, i) => s + i.precio * i.cant, 0);

  const venta = {
    id: Date.now(),
    cliente: document.getElementById('v-cliente').value.trim() || 'General',
    pago: document.getElementById('v-pago').value, // Método de pago seleccionado
    items,
    total,
    fecha: new Date().toLocaleString() // Fecha y hora actuales
  };

  // Si el cliente está registrado, aumenta su contador de compras
  const cl = state.clientes.find(c => c.nombre.toLowerCase() === venta.cliente.toLowerCase());
  if (cl) cl.compras = (cl.compras || 0) + 1;

  state.ventas.push(venta);
  save();
  ventaItems = []; // Limpia el ticket actual
  document.getElementById('v-cliente').value = '';
  renderVentaItems(); renderHistorialVentas(); renderDashboard();
}

// Dibuja la tabla del historial de ventas
function renderHistorialVentas() {
  const q = document.getElementById('v-buscar')?.value?.toLowerCase() || '';
  const tb = document.getElementById('tbl-historial');
  const list = state.ventas.filter(v => v.cliente.toLowerCase().includes(q));

  if (!list.length) {
    tb.innerHTML = '<tr><td colspan="6" class="empty">Sin ventas aún</td></tr>';
    return;
  }

  // [...list].reverse() crea una copia invertida para mostrar las más recientes primero
  tb.innerHTML = [...list].reverse().map((v, i) => `<tr>
    <td>${list.length - i}</td>
    <td>${v.cliente}</td>
    <td><span class="badge badge-teal">${v.pago}</span></td>
    <td><strong>S/ ${v.total.toFixed(2)}</strong></td>
    <td style="font-size:.78rem">${v.fecha}</td>
    <td><button class="btn btn-danger btn-sm" onclick="deleteVenta(${v.id})">🗑️</button></td>
  </tr>`).join('');
}

// Elimina una venta del historial
function deleteVenta(id) {
  if (confirm('¿Eliminar venta?')) {
    state.ventas = state.ventas.filter(v => v.id !== id);
    save(); renderHistorialVentas();
  }
}

// Borra todo el historial de ventas
function clearVentas() {
  if (confirm('¿Eliminar historial?')) {
    state.ventas = [];
    save(); renderHistorialVentas();
  }
}

// =====================================================================
// REPORTES Y ESTADÍSTICAS
// =====================================================================
function renderReportes() {
  // Suma todos los totales de ventas
  const total = state.ventas.reduce((s, v) => s + v.total, 0);

  // Calcula la ganancia estimada: precio de venta menos costo por unidad
  const ganancia = state.ventas.reduce((s, v) =>
    s + v.items.reduce((a, i) => a + (i.precio - i.costo) * i.cant, 0), 0
  );

  document.getElementById('r-total').textContent = 'S/ ' + total.toFixed(2);
  document.getElementById('r-count').textContent = state.ventas.length;
  document.getElementById('r-ganancia').textContent = 'S/ ' + ganancia.toFixed(2);
  document.getElementById('r-promedio').textContent = state.ventas.length
    ? 'S/ ' + (total / state.ventas.length).toFixed(2) : 'S/ 0';

  // Prepara los últimos 7 días para el gráfico
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i); // Resta i días para obtener fechas anteriores
    days.push(d);
  }

  // Calcula el total de ventas por cada día
  const dayTotals = days.map(d => {
    const ds = d.toLocaleDateString();
    return {
      lbl: d.toLocaleDateString('es', { weekday: 'short' }),
      val: state.ventas
        .filter(v => new Date(v.fecha).toLocaleDateString() === ds)
        .reduce((s, v) => s + v.total, 0)
    };
  });

  // Encuentra el valor máximo para escalar las barras del gráfico
  const max = Math.max(...dayTotals.map(d => d.val), 1);

  // Dibuja las barras del gráfico con altura proporcional al valor
  document.getElementById('chart-dias').innerHTML = dayTotals.map(d => `<div class="chart-bar-col">
    <div class="chart-val">${d.val > 0 ? 'S/' + d.val.toFixed(0) : ''}</div>
    <div class="chart-bar" style="height:${(d.val / max) * 90}px"></div>
    <div class="chart-lbl">${d.lbl}</div>
  </div>`).join('');

  // Cuenta cuántas unidades se vendió de cada producto
  const cnt = {};
  state.ventas.forEach(v => v.items.forEach(i => {
    cnt[i.nombre] = (cnt[i.nombre] || 0) + i.cant;
  }));

  // Ordena de mayor a menor y muestra solo los 5 primeros
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);

  document.getElementById('top-productos').innerHTML = top.length
    ? top.map(([n, c], i) => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-weight:700;color:var(--primary);min-width:20px">${i + 1}.</span>
        <div style="flex:1">
          <div style="font-size:.85rem;font-weight:600">${n}</div>
          <div style="background:#e0f2f1;border-radius:4px;height:8px;margin-top:4px">
            <div style="background:var(--primary);height:8px;border-radius:4px;width:${(c / top[0][1]) * 100}%"></div>
          </div>
        </div>
        <span style="font-weight:700;font-size:.9rem">${c} uds</span>
      </div>`).join('')
    : '<div class="empty">Sin datos aún</div>';
}

// =====================================================================
// DASHBOARD PRINCIPAL
// Resumen rápido del negocio: ventas de hoy, alertas de stock, etc.
// =====================================================================
function renderDashboard() {
  const hoy = new Date().toLocaleDateString(); // Fecha actual en formato local

  // Filtra las ventas registradas hoy
  const vh = state.ventas.filter(v => new Date(v.fecha).toLocaleDateString() === hoy);

  document.getElementById('st-ventashoy').textContent = vh.length;
  document.getElementById('st-ingresos').textContent = 'S/ ' + vh.reduce((s, v) => s + v.total, 0).toFixed(2);
  document.getElementById('st-productos').textContent = state.productos.length;

  // Encuentra productos cuyo stock llegó al mínimo o menos
  const sb = state.productos.filter(p => p.stock <= p.stockMin);
  document.getElementById('st-stockbajo').textContent = sb.length;

  // Muestra una alerta roja por cada producto con stock bajo
  document.getElementById('alertas-wrap').innerHTML = sb.map(p =>
    `<div class="alerta-stock">⚠️ Stock bajo: <strong>${p.nombre}</strong> — quedan ${p.stock} unidades</div>`
  ).join('');

  // Muestra las últimas 4 ventas registradas
  const rec = [...state.ventas].reverse().slice(0, 4);
  document.getElementById('dash-ventas').innerHTML = rec.length
    ? rec.map(v => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:.85rem">
        <span><strong>${v.cliente}</strong></span>
        <span class="badge badge-teal">${v.pago}</span>
        <strong>S/ ${v.total.toFixed(2)}</strong>
        <span style="color:#999;font-size:.75rem">${v.fecha}</span>
      </div>`).join('')
    : '<div class="empty">Sin ventas aún</div>';
}

// =====================================================================
// CONFIGURACIÓN DEL NEGOCIO
// =====================================================================

// Guarda solo el nombre del negocio
function saveConfig() {
  const n = document.getElementById('cfg-nombre').value.trim();
  if (n) {
    state.name = n;
    document.getElementById('bizName').textContent = n;
    document.title = n;
  }
  save();
  alert('Nombre guardado ✓');
}

// Guarda todos los datos de configuración
function saveConfigFull() {
  saveConfig();
  state.config.dir = document.getElementById('cfg-dir').value;
  state.config.tel = document.getElementById('cfg-tel').value;
  save();
  alert('Configuración guardada ✓');
}

// =====================================================================
// INICIO DE LA APLICACIÓN
// Estas líneas se ejecutan automáticamente cuando la página carga
// =====================================================================
renderDashboard(); // Muestra el dashboard como pantalla inicial
document.getElementById('cfg-nombre').value = state.name; // Rellena el campo en Config
document.getElementById('bizName').textContent = state.name; // Muestra el nombre en el header
