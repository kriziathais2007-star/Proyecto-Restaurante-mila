document.addEventListener("DOMContentLoaded", () => {

    // ── Mostrar fecha de hoy ──────────────────────────────────────────────────
    const fechaEl = document.getElementById("fecha-hoy");
    if (fechaEl) {
        fechaEl.textContent = new Date().toLocaleDateString("es-PE", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    }

    // ── Cargar tablas ─────────────────────────────────────────────────────────
    cargarUsuarios();
    cargarAsistencia();

    // ── Botón GUARDAR usuario ─────────────────────────────────────────────────
    document.getElementById("btn-crearUsuario").addEventListener("click", guardarUsuario);

    // ── Botón ACTUALIZAR usuario ──────────────────────────────────────────────
    document.getElementById("btn-Editarusuario").addEventListener("click", actualizarUsuario);

});

// ═══════════════════════════════════════════════════════════════════════════════
// USUARIOS
// ═══════════════════════════════════════════════════════════════════════════════

function cargarUsuarios() {
    fetch("http://localhost:8080/api/usuarios")
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById("table-usuario");
            tbody.innerHTML = "";
            data.forEach(usuario => {
                tbody.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.telefono}</td>
                    <td>
                        <button class="btn btn-outline-primary me-2 btnEditar"
                            data-bs-toggle="modal" data-bs-target="#modalEditarUsuario"
                            data-idusu="${usuario.id}"
                            data-nomusu="${usuario.nombre}"
                            data-rolusu="${usuario.rol}"
                            data-telusu="${usuario.telefono}"
                            data-contrausu="${usuario.contrasena}">
                            <i class="fas fa-pencil-alt"></i> Editar
                        </button>
                        <button class="btn btn-outline-danger btnEliminar" data-idusuario="${usuario.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>`;
            });
        })
        .catch(err => alert("Error al cargar usuarios: " + err));
}

function guardarUsuario() {
    const nombre     = document.getElementById("u_nombre").value.trim();
    const rol        = document.getElementById("u_rol").value;
    const telefono   = document.getElementById("u_telefono").value.trim();
    const contrasena = document.getElementById("u_contrasena").value.trim();

    if (!nombre || !rol || !telefono || !contrasena) {
        alert("Por favor completa todos los campos.");
        return;
    }

    fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rol, telefono, contrasena }),
    }).then(r => {
        if (r.ok) {
            bootstrap.Modal.getInstance(document.getElementById("modalRegistroUsuario")).hide();
            cargarUsuarios();
        } else {
            alert("Error al crear el usuario");
        }
    }).catch(err => alert("Error de red: " + err));
}

function actualizarUsuario() {
    const id         = document.getElementById("btn-Editarusuario").dataset.idusu;
    const nombre     = document.getElementById("c_u_nombre").value.trim();
    const rol        = document.getElementById("c_u_rol").value;
    const telefono   = document.getElementById("c_u_telefono").value.trim();
    const contrasena = document.getElementById("c_u_contrasena").value.trim();

    if (!nombre || !rol || !telefono || !contrasena) {
        alert("Por favor completa todos los campos.");
        return;
    }

    fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rol, telefono, contrasena }),
    }).then(r => {
        if (r.ok) {
            bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
            cargarUsuarios();
        } else {
            alert("Error al actualizar el usuario");
        }
    }).catch(err => alert("Error de red: " + err));
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASISTENCIA
// ═══════════════════════════════════════════════════════════════════════════════

function cargarAsistencia() {
    fetch("http://localhost:8080/api/asistencia/hoy")
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById("table-asistencia");
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Sin registros hoy</td></tr>`;
                return;
            }

            data.forEach(a => {
                const entrada  = a.horaEntrada ? a.horaEntrada.substring(0, 5) : "—";
                const salida   = a.horaSalida  ? a.horaSalida.substring(11, 16) : "—";
                const badgeClass = {
                    asistio : "bg-success",
                    tarde   : "bg-warning text-dark",
                    falta   : "bg-danger"
                }[a.estado] || "bg-secondary";

                const yaEntro  = a.horaEntrada !== null;
                const yaSalio  = a.horaSalida  !== null;

                tbody.innerHTML += `
                <tr>
                    <td>${a.usuario.nombre}</td>
                    <td>${a.usuario.rol}</td>
                    <td>${entrada}</td>
                    <td>${salida}</td>
                    <td><span class="badge ${badgeClass}">${a.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success me-1 btnEntrada"
                            data-idusu="${a.usuario.id}"
                            ${yaEntro ? "disabled" : ""}>
                            <i class="fa-solid fa-right-to-bracket"></i> Entrada
                        </button>
                        <button class="btn btn-sm btn-danger btnSalida"
                            data-idusu="${a.usuario.id}"
                            ${!yaEntro || yaSalio ? "disabled" : ""}>
                            <i class="fa-solid fa-right-from-bracket"></i> Salida
                        </button>
                    </td>
                </tr>`;
            });
        })
        .catch(err => console.error("Error al cargar asistencia: " + err));
}

// ── Función para cargar la tabla de asistencia con TODOS los usuarios ─────────
// (muestra a los que aún no han marcado también)
function cargarAsistenciaCompleta() {
    Promise.all([
        fetch("http://localhost:8080/api/usuarios").then(r => r.json()),
        fetch("http://localhost:8080/api/asistencia/hoy").then(r => r.json())
    ]).then(([usuarios, asistencias]) => {
        const tbody = document.getElementById("table-asistencia");
        tbody.innerHTML = "";

        usuarios.forEach(usuario => {
            // Busca si ya tiene registro hoy
            const a = asistencias.find(x => x.usuario.id === usuario.id);

            const entrada = a?.horaEntrada ? a.horaEntrada.substring(0, 5) : "—";
            const salida  = a?.horaSalida  ? a.horaSalida.substring(11, 16) : "—";
            const estado  = a?.estado ?? "falta";

            const badgeClass = {
                asistio : "bg-success",
                tarde   : "bg-warning text-dark",
                falta   : "bg-danger"
            }[estado] || "bg-secondary";

            const yaEntro = a != null && a.horaEntrada != null;
            const yaSalio = a != null && a.horaSalida  != null && a.horaSalida !== "" ;

            tbody.innerHTML += `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.rol}</td>
                <td>${entrada}</td>
                <td>${salida}</td>
                <td><span class="badge ${badgeClass}">${estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-success me-1 btnEntrada"
                        data-idusu="${usuario.id}"
                        ${yaEntro ? "disabled" : ""}>
                        <i class="fa-solid fa-right-to-bracket"></i> Entrada
                    </button>
                    <button class="btn btn-sm btn-danger btnSalida"
                        data-idusu="${usuario.id}"
                        ${!yaEntro || yaSalio ? "disabled" : ""}>
                        <i class="fa-solid fa-right-from-bracket"></i> Salida
                    </button>
                </td>
            </tr>`;
        });
    }).catch(err => console.error("Error: " + err));
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTOS DELEGADOS (eliminar, editar, toggle pass, entrada, salida)
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener("click", function (e) {

    // ── ELIMINAR USUARIO ──────────────────────────────────────────────────────
    const btnEliminar = e.target.closest(".btnEliminar");
    if (btnEliminar) {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
        const id = btnEliminar.dataset.idusuario;
        fetch(`http://localhost:8080/api/usuarios/${id}`, { method: "DELETE" })
            .then(r => {
                if (r.ok) { cargarUsuarios(); cargarAsistenciaCompleta(); }
                else alert("Error al eliminar el usuario");
            })
            .catch(err => alert("Error de red: " + err));
    }

    // ── EDITAR USUARIO: cargar datos en modal ─────────────────────────────────
    const btnEditar = e.target.closest(".btnEditar");
    if (btnEditar) {
        document.getElementById("c_u_nombre").value     = btnEditar.dataset.nomusu;
        document.getElementById("c_u_rol").value        = btnEditar.dataset.rolusu;
        document.getElementById("c_u_telefono").value   = btnEditar.dataset.telusu;
        document.getElementById("c_u_contrasena").value = btnEditar.dataset.contrausu;
        document.getElementById("btn-Editarusuario").dataset.idusu = btnEditar.dataset.idusu;
    }

    // ── TOGGLE CONTRASEÑA (ojito) ─────────────────────────────────────────────
    const btnToggle = e.target.closest(".toggle-pass");
    if (btnToggle) {
        const input = document.getElementById(btnToggle.dataset.target);
        const icon  = btnToggle.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    }

    // ── MARCAR ENTRADA ────────────────────────────────────────────────────────
    const btnEntrada = e.target.closest(".btnEntrada");
    if (btnEntrada) {
        const id = btnEntrada.dataset.idusu;
        fetch(`http://localhost:8080/api/asistencia/entrada/${id}`, { method: "POST" })
            .then(r => {
                if (r.ok) cargarAsistenciaCompleta();
                else alert("Error al marcar entrada");
            })
            .catch(err => alert("Error de red: " + err));
    }

    // ── MARCAR SALIDA ─────────────────────────────────────────────────────────
    const btnSalida = e.target.closest(".btnSalida");
    if (btnSalida) {
        const id = btnSalida.dataset.idusu;
        fetch(`http://localhost:8080/api/asistencia/salida/${id}`, { method: "PUT" })
            .then(r => {
                if (r.ok) cargarAsistenciaCompleta();
                else alert("Error al marcar salida");
            })
            .catch(err => alert("Error de red: " + err));
    }

});

// Reemplazar cargarAsistencia inicial por la versión completa
document.addEventListener("DOMContentLoaded", () => {
    cargarAsistenciaCompleta();
});