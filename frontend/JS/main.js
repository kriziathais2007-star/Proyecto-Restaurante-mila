// ===== DATOS =====
const USUARIOS = [
  { user: 'admin',    pass: '1234', nombre: 'Juan' },
  { user: 'milagros', pass: '0000', nombre: 'Milagros' },
];

let pedidos = [
  { id: 1, mesa: 1, plato: 'Arroz con Pollo',    cant: 2, hora: '12:30', estado: 'pendiente'   },
  { id: 2, mesa: 2, plato: 'Tallarín con Pollo', cant: 1, hora: '12:45', estado: 'preparacion' },
  { id: 3, mesa: 3, plato: 'Arroz Chaufa',       cant: 2, hora: '13:00', estado: 'servido'     },
  { id: 4, mesa: 1, plato: 'Ají de Gallina',     cant: 1, hora: '13:15', estado: 'pendiente'   },
  { id: 5, mesa: 4, plato: 'Pollo al Horno',     cant: 3, hora: '13:20', estado: 'preparacion' },
];

let menuItems = [
  { id: 1, nombre: 'Arroz con pollo',   precio: 8.00 },
  { id: 2, nombre: 'Tallarín con pollo',precio: 8.00 },
  { id: 3, nombre: 'Ají de gallina',    precio: 8.00 },
  { id: 4, nombre: 'Arroz chaufa',      precio: 8.00 },
  { id: 5, nombre: 'Pollo al horno',    precio: 8.00 },
  { id: 6, nombre: 'Estofado de pollo', precio: 8.00 },
];

let asistencia   = [];
let nextPedidoId = 6;
let nextMenuId   = 7;
let editingMenuId= null;
let asistMode    = null;

// ===== HELPERS =====
function horaActual() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
function estadoLabel(e) {
  return { pendiente:'Pendiente', preparacion:'En preparación', servido:'Servido' }[e] || e;
}
function openModal(id)    { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id)   { document.getElementById(id).classList.add('hidden'); }

// ===== LOGIN =====
const loginStar = document.getElementById('loginStar');
const dashboard   = document.getElementById('dashboard');

document.getElementById('btnLogin').addEventListener('click', doLogin);
document.getElementById('inputPass').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
document.getElementById('inputUser').addEventListener('keydown', e => { if (e.key==='Enter') document.getElementById('inputPass').focus(); });

function doLogin() {
  const u = document.getElementById('inputUser').value.trim();
  const p = document.getElementById('inputPass').value.trim();
  const found = USUARIOS.find(x => x.user===u && x.pass===p);
  const errEl = document.getElementById('loginError');
  if (!found) {
    errEl.textContent = 'Usuario o contraseña incorrectos.';
    document.getElementById('inputPass').value = '';
    return;
  }
  errEl.textContent = '';
  document.getElementById('userName').textContent = found.nombre;
  loginStar.classList.add('hidden');
  dashboard.classList.remove('hidden');
  setWelcomeDate();
  renderAll();
}

// ===== OLVIDÉ CONTRASEÑA =====
const modalOlvide = document.getElementById('modalOlvide');
document.getElementById('btnOlvide').addEventListener('click', () => openModal('modalOlvide'));
document.getElementById('closeModalOlvide').addEventListener('click', () => closeModal('modalOlvide'));
document.getElementById('closeModalOlvide2').addEventListener('click', () => closeModal('modalOlvide'));
modalOlvide.addEventListener('click', e => { if (e.target === modalOlvide) closeModal('modalOlvide'); });

// ===== LOGOUT =====
document.getElementById('btnLogout').addEventListener('click', e => {
  e.preventDefault();
  dashboard.classList.add('hidden');
  loginStar.classList.remove('hidden');
  document.getElementById('inputUser').value = '';
  document.getElementById('inputPass').value = '';
});

// ===== SIDEBAR =====
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

document.getElementById('btnHamburger').addEventListener('click', () => {
  sidebar.classList.toggle('sidebar-open');
  overlay.classList.toggle('show');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('sidebar-open');
  overlay.classList.remove('show');
});

// ===== NAVEGACIÓN =====
const navLinks  = document.querySelectorAll('.nav-link[data-section]');
const sections  = document.querySelectorAll('.section');
const breadcrumb= document.getElementById('breadcrumb');
const secNames  = { inicio:'Inicio', pedidos:'Pedidos', cocina:'Cocina', asistencia:'Asistencia', menu:'Menú' };

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sec = link.dataset.section;
    navLinks.forEach(l => l.classList.remove('activo'));
    link.classList.add('activo');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('sec-'+sec).classList.add('active');
    breadcrumb.innerHTML = `<span>Inicio</span>` +
      (sec!=='inicio' ? ` <i class="fa-solid fa-chevron-right" style="font-size:.65rem;color:#aaa"></i><span>${secNames[sec]}</span>` : '');
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('show');
    renderSection(sec);
  });
});

function renderSection(sec) {
  ({ inicio:renderInicio, pedidos:renderPedidos, cocina:renderCocina, asistencia:renderAsistencia, menu:renderMenu }[sec] || (()=>{}))();
}

// ===== FECHA =====
function setWelcomeDate() {
  document.getElementById('welcomeDate').textContent =
    new Date().toLocaleDateString('es-PE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function renderAll() {
  renderInicio(); renderPedidos(); renderCocina(); renderAsistencia(); renderMenu();
}

// ===== INICIO =====
function renderInicio() {
  document.getElementById('statPendiente').textContent = pedidos.filter(p=>p.estado==='pendiente').length;
  document.getElementById('statPrep').textContent      = pedidos.filter(p=>p.estado==='preparacion').length;
  document.getElementById('statServido').textContent   = pedidos.filter(p=>p.estado==='servido').length;
  document.getElementById('tbodyInicio').innerHTML = [...pedidos].reverse().slice(0,6).map(p=>`
    <tr>
      <td>Mesa ${p.mesa}</td><td>${p.hora}</td>
      <td>${p.plato} ×${p.cant}</td>
      <td><span class="badge ${p.estado}">${estadoLabel(p.estado)}</span></td>
    </tr>`).join('');
}

// ===== PEDIDOS =====
function renderPedidos() {
  const cont = document.getElementById('listaPedidos');
  if (!pedidos.length) { cont.innerHTML='<p style="color:#aaa;font-size:.85rem">No hay pedidos.</p>'; return; }
  cont.innerHTML = pedidos.map(p=>`
    <div class="pedido-card ${p.estado}">
      <div class="pedido-info">
        <div class="pedido-mesa">Mesa ${p.mesa}</div>
        <div class="pedido-detalle">${p.plato} × ${p.cant}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span class="pedido-hora">${p.hora}</span>
        <span class="badge ${p.estado}">${estadoLabel(p.estado)}</span>
        ${p.estado!=='servido'?`<button class="menu-item-edit" onclick="avanzarPedido(${p.id})" title="Avanzar"><i class="fa-solid fa-arrow-right"></i></button>`:''}
        <button class="menu-item-edit" onclick="eliminarPedido(${p.id})" title="Eliminar"><i class="fa-solid fa-trash" style="color:#e74c3c"></i></button>
      </div>
    </div>`).join('');
}

window.avanzarPedido = function(id) {
  const p = pedidos.find(x=>x.id===id); if(!p) return;
  const fl=['pendiente','preparacion','servido'], idx=fl.indexOf(p.estado);
  if(idx<fl.length-1){ p.estado=fl[idx+1]; renderAll(); }
};
window.eliminarPedido = function(id) {
  if(!confirm('¿Eliminar este pedido?')) return;
  pedidos=pedidos.filter(x=>x.id!==id); renderAll();
};

// ===== MODAL NUEVO PEDIDO =====
const modalPedido = document.getElementById('modalPedido');
const pedidoPlato = document.getElementById('pedidoPlato');

function refreshPedidoSelect() {
  pedidoPlato.innerHTML = '<option value="">Selecciona un plato...</option>';
  menuItems.forEach(m => {
    const o = document.createElement('option');
    o.value=m.nombre; o.textContent=`${m.nombre}  —  S/ ${m.precio.toFixed(2)}`;
    pedidoPlato.appendChild(o);
  });
}
refreshPedidoSelect();

document.getElementById('btnNuevoPedido').addEventListener('click', ()=>{ refreshPedidoSelect(); openModal('modalPedido'); });
document.getElementById('closeModal').addEventListener('click', ()=>closeModal('modalPedido'));
modalPedido.addEventListener('click', e=>{ if(e.target===modalPedido) closeModal('modalPedido'); });

document.getElementById('btnConfirmarPedido').addEventListener('click', ()=>{
  const mesa=parseInt(document.getElementById('pedidoMesa').value);
  const plato=pedidoPlato.value;
  const cant=parseInt(document.getElementById('pedidoCant').value);
  if(!mesa||!plato||!cant||cant<1){ alert('Completa todos los campos correctamente.'); return; }
  pedidos.push({ id:nextPedidoId++, mesa, plato, cant, hora:horaActual(), estado:'pendiente' });
  document.getElementById('pedidoMesa').value='';
  pedidoPlato.value='';
  document.getElementById('pedidoCant').value='1';
  closeModal('modalPedido');
  renderAll();
});

// ===== COCINA =====
function renderCocina() {
  const estados = ['pendiente','preparacion','servido'];
  const etiquetas = { pendiente:'Pendiente', preparacion:'En preparación', servido:'Servido' };

  const col=(id,est)=>{
    const items=pedidos.filter(p=>p.estado===est);
    document.getElementById(id).innerHTML = items.length
      ? items.map(p=>{
          const btns = estados
            .filter(e=>e!==est)
            .map(e=>`<button class="ci-estado-btn ci-btn-${e}" onclick="cambiarEstadoCocina(${p.id},'${e}')">${etiquetas[e]}</button>`)
            .join('');
          return `<div class="cocina-item">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span class="ci-mesa">Mesa ${p.mesa}</span>
              <span class="ci-hora">${p.hora}</span>
            </div>
            <div class="ci-plato">${p.plato} ×${p.cant}</div>
            <div class="ci-btns">${btns}</div>
          </div>`;
        }).join('')
      : '<p style="padding:10px;font-size:.78rem;color:#aaa">Sin pedidos</p>';
  };
  col('cocinaPendiente','pendiente');
  col('cocinaPrep','preparacion');
  col('cocinaServido','servido');
}

window.cambiarEstadoCocina = function(id, nuevoEstado) {
  const p = pedidos.find(x=>x.id===id); if(!p) return;
  p.estado = nuevoEstado;
  renderAll();
};

// ===== ASISTENCIA =====
// Horario oficial: entrada 07:00, salida 16:30
const HORA_ENTRADA = { h: 7,  m: 0  };   // 07:00 am
const HORA_SALIDA  = { h: 16, m: 30 };   // 04:30 pm

function minutosDesde0(h, m) { return h * 60 + m; }

function calcularEstadoEntrada(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  const registrado = minutosDesde0(h, m);
  const limite     = minutosDesde0(HORA_ENTRADA.h, HORA_ENTRADA.m);
  return registrado <= limite ? 'asistio' : 'tardanza';
}

function renderAsistencia() {
  // Mostrar horario oficial como info
  const infoEl = document.getElementById('asistHorarioInfo');
  if (infoEl) {
    const eH = `${String(HORA_ENTRADA.h).padStart(2,'0')}:${String(HORA_ENTRADA.m).padStart(2,'0')}`;
    const sH = `${String(HORA_SALIDA.h).padStart(2,'0')}:${String(HORA_SALIDA.m).padStart(2,'0')}`;
    infoEl.textContent = `Horario oficial — Entrada: ${eH} am  |  Salida: ${sH} pm`;
  }

  const tbody = document.getElementById('tbodyAsistencia');
  if (!asistencia.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#aaa;padding:20px;font-size:.82rem">
      Sin registros hoy. Usa los botones para registrar asistencia.</td></tr>`;
    return;
  }
  tbody.innerHTML = asistencia.map((a, i) => {
    const dc = { asistio:'green', tardanza:'yellow', falto:'red' }[a.estado] || 'red';
    const lb = { asistio:'Asistió', tardanza:'Tardanza', falto:'Faltó' }[a.estado] || '—';
    return `<tr>
      <td>${a.nombre}</td>
      <td>${a.entrada || '—'}</td>
      <td>${a.salida  || '—'}</td>
      <td>
        <span class="dot ${dc}"></span>${lb}
        <button class="menu-item-edit" onclick="eliminarAsist(${i})" style="margin-left:8px" title="Eliminar">
          <i class="fa-solid fa-trash" style="color:#e74c3c;font-size:.8rem"></i>
        </button>
      </td>
    </tr>`;
  }).join('');
}

window.eliminarAsist = function(i) {
  if (!confirm('¿Eliminar este registro?')) return;
  asistencia.splice(i, 1); renderAsistencia();
};

// Marcar como "Faltó" a empleados sin entrada registrada
window.marcarFaltas = function() {
  const nombre = document.getElementById('asistNombreFalta').value.trim();
  const errEl  = document.getElementById('asistFaltaError');
  if (!nombre) { errEl.textContent = 'Ingresa el nombre del empleado.'; return; }
  const existe = asistencia.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    errEl.textContent = `"${existe.nombre}" ya tiene registro (${existe.estado === 'falto' ? 'Faltó' : 'asistencia registrada'}).`;
    return;
  }
  asistencia.push({ nombre, entrada: '', salida: '', estado: 'falto' });
  closeModal('modalFalta');
  renderAsistencia();
};

// Modal "Registrar Falta"
const modalFalta = document.getElementById('modalFalta');
document.getElementById('btnFalta').addEventListener('click', () => {
  document.getElementById('asistNombreFalta').value = '';
  document.getElementById('asistFaltaError').textContent = '';
  openModal('modalFalta');
  setTimeout(() => document.getElementById('asistNombreFalta').focus(), 100);
});
document.getElementById('closeModalFalta').addEventListener('click', () => closeModal('modalFalta'));
modalFalta.addEventListener('click', e => { if (e.target === modalFalta) closeModal('modalFalta'); });
document.getElementById('btnConfirmarFalta').addEventListener('click', marcarFaltas);
document.getElementById('asistNombreFalta').addEventListener('keydown', e => { if (e.key === 'Enter') marcarFaltas(); });

// Modal entrada / salida
const modalAsist = document.getElementById('modalAsistencia');

document.getElementById('btnEntrada').addEventListener('click', () => {
  asistMode = 'entrada';
  document.getElementById('modalAsistTitulo').textContent = 'Registrar entrada';
  document.getElementById('asistNombre').value = '';
  document.getElementById('asistError').textContent = '';
  // Mostrar hora oficial en el modal
  const eH = `${String(HORA_ENTRADA.h).padStart(2,'0')}:${String(HORA_ENTRADA.m).padStart(2,'0')}`;
  document.getElementById('asistHoraInfo').textContent = `Hora límite de entrada: ${eH} am`;
  openModal('modalAsistencia');
  setTimeout(() => document.getElementById('asistNombre').focus(), 100);
});

document.getElementById('btnSalida').addEventListener('click', () => {
  asistMode = 'salida';
  document.getElementById('modalAsistTitulo').textContent = 'Registrar salida';
  document.getElementById('asistNombre').value = '';
  document.getElementById('asistError').textContent = '';
  const sH = `${String(HORA_SALIDA.h).padStart(2,'0')}:${String(HORA_SALIDA.m).padStart(2,'0')}`;
  document.getElementById('asistHoraInfo').textContent = `Hora oficial de salida: ${sH} pm`;
  openModal('modalAsistencia');
  setTimeout(() => document.getElementById('asistNombre').focus(), 100);
});

document.getElementById('closeModalAsist').addEventListener('click', () => closeModal('modalAsistencia'));
modalAsist.addEventListener('click', e => { if (e.target === modalAsist) closeModal('modalAsistencia'); });
document.getElementById('btnConfirmarAsist').addEventListener('click', confirmarAsist);
document.getElementById('asistNombre').addEventListener('keydown', e => { if (e.key === 'Enter') confirmarAsist(); });

function confirmarAsist() {
  const nombre = document.getElementById('asistNombre').value.trim();
  const errEl  = document.getElementById('asistError');
  if (!nombre) { errEl.textContent = 'Ingresa el nombre del empleado.'; return; }

  const existe = asistencia.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  const hora   = horaActual();

  if (asistMode === 'entrada') {
    if (existe) {
      errEl.textContent = existe.estado === 'falto'
        ? `"${existe.nombre}" fue marcado como faltó. Elimina ese registro primero.`
        : `"${existe.nombre}" ya tiene entrada registrada (${existe.entrada}).`;
      return;
    }
    const estado = calcularEstadoEntrada(hora);
    asistencia.push({ nombre, entrada: hora, salida: '', estado });

  } else { // salida
    if (!existe || existe.estado === 'falto') {
      errEl.textContent = `No se encontró entrada para "${nombre}". Registra la entrada primero.`;
      return;
    }
    if (existe.salida) {
      errEl.textContent = `"${existe.nombre}" ya tiene salida registrada (${existe.salida}).`;
      return;
    }
    existe.salida = hora;
  }

  closeModal('modalAsistencia');
  renderAsistencia();
}

// ===== MENÚ =====
function renderMenu() {
  document.getElementById('menuList').innerHTML = menuItems.map(m=>`
    <div class="menu-item">
      <div class="menu-item-name">${m.nombre}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="menu-item-price">S/ ${m.precio.toFixed(2)}</span>
        <button class="menu-item-edit" onclick="abrirEditarPlato(${m.id})" title="Editar">
          <i class="fa-solid fa-pen-to-square"></i></button>
        <button class="menu-item-edit" onclick="eliminarPlato(${m.id})" title="Eliminar">
          <i class="fa-solid fa-trash" style="color:#e74c3c"></i></button>
      </div>
    </div>`).join('');
}

// --- Modal editar plato ---
const modalMenu=document.getElementById('modalMenu');

window.abrirEditarPlato = function(id) {
  const item=menuItems.find(m=>m.id===id); if(!item) return;
  editingMenuId=id;
  document.getElementById('modalMenuTitulo').textContent=`Editar plato`;
  document.getElementById('menuEditNombre').value=item.nombre;
  document.getElementById('menuEditPrecio').value=item.precio.toFixed(2);
  openModal('modalMenu');
  setTimeout(()=>document.getElementById('menuEditNombre').focus(),100);
};
document.getElementById('closeModalMenu').addEventListener('click',()=>closeModal('modalMenu'));
modalMenu.addEventListener('click',e=>{ if(e.target===modalMenu) closeModal('modalMenu'); });

document.getElementById('btnConfirmarMenu').addEventListener('click',()=>{
  const nombre=document.getElementById('menuEditNombre').value.trim();
  const precio=parseFloat(document.getElementById('menuEditPrecio').value);
  if(!nombre){ alert('El nombre no puede estar vacío.'); return; }
  if(isNaN(precio)||precio<0){ alert('Precio inválido.'); return; }
  const item=menuItems.find(m=>m.id===editingMenuId);
  if(item){ item.nombre=nombre; item.precio=precio; }
  closeModal('modalMenu');
  renderMenu(); refreshPedidoSelect();
});

// --- Eliminar plato ---
window.eliminarPlato = function(id) {
  const item=menuItems.find(m=>m.id===id); if(!item) return;
  if(!confirm(`¿Eliminar "${item.nombre}" del menú?`)) return;
  menuItems=menuItems.filter(m=>m.id!==id);
  renderMenu(); refreshPedidoSelect();
};

// --- Modal nuevo plato ---
const modalMenuNuevo=document.getElementById('modalMenuNuevo');

document.getElementById('btnNuevoPlato').addEventListener('click',()=>{
  document.getElementById('menuNuevoNombre').value='';
  document.getElementById('menuNuevoPrecio').value='';
  openModal('modalMenuNuevo');
  setTimeout(()=>document.getElementById('menuNuevoNombre').focus(),100);
});
document.getElementById('closeModalMenuNuevo').addEventListener('click',()=>closeModal('modalMenuNuevo'));
modalMenuNuevo.addEventListener('click',e=>{ if(e.target===modalMenuNuevo) closeModal('modalMenuNuevo'); });

document.getElementById('btnConfirmarMenuNuevo').addEventListener('click',()=>{
  const nombre=document.getElementById('menuNuevoNombre').value.trim();
  const precio=parseFloat(document.getElementById('menuNuevoPrecio').value);
  if(!nombre){ alert('Ingresa el nombre del plato.'); return; }
  if(isNaN(precio)||precio<0){ alert('Precio inválido.'); return; }
  menuItems.push({ id:nextMenuId++, nombre, precio });
  closeModal('modalMenuNuevo');
  renderMenu(); refreshPedidoSelect();
});
