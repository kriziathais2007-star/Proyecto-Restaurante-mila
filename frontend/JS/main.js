const USUARIOS = [
    {user: "admin", pass: "1234", nombre: 'Thais'},
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