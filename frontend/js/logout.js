// ═══════════════════════════════════════════════════════════════════════════════
// CERRAR SESIÓN
// ══════════════════════════════════════════════════════════════════
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();

        if (confirm("¿Deseas cerrar sesión?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            localStorage.removeItem("nombre");
            window.location.href = "login.html";
        }
    });
}