// ===== DATOS =====
const USUARIOS = [
  { user: 'admin',    pass: '1234', nombre: 'Juan' },
  { user: 'milagros', pass: '0000', nombre: 'Milagros' },
];
// ===== LOGIN =====
const loginScreen = document.getElementById('loginScreen');
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
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  setWelcomeDate();
  renderAll();
}


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
