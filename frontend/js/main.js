document.addEventListener("DOMContentLoaded", () => {

    // ── Cargar tabla de usuarios ──────────────────────────────────────────────
    cargarUsuarios();

    // ── Botón GUARDAR (nuevo usuario) ─────────────────────────────────────────
    // FIX #1: el id en el HTML es "btn-crearUsuario" (U mayúscula)
    const btnSaveUsuario = document.getElementById("btn-crearUsuario");
    btnSaveUsuario.addEventListener("click", guardarUsuario);

    // ── Botón ACTUALIZAR (editar usuario) ─────────────────────────────────────
    // FIX #5: faltaba completamente este listener
    const btnActualizar = document.getElementById("btn-Editarusuario");
    btnActualizar.addEventListener("click", actualizarUsuario);

});

// ── Cargar y renderizar tabla ─────────────────────────────────────────────────
function cargarUsuarios() {
    fetch("http://localhost:8080/api/usuarios")
        .then(response => response.json())
        .then(data => {
            const elemento = document.getElementById("table-usuario");
            elemento.innerHTML = ""; // limpiar antes de renderizar
            data.forEach(usuario => {
                // FIX #4: data-* usan nombres claros y consistentes con lo que se lee después
                // FIX #6: se usan clases (btnEditar, btnEliminar) en vez de IDs duplicados
                const fila = `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.contra}</td>
                    <td>
                        <button
                            class="btn btn-outline-primary me-2 btnEditar"
                            data-bs-toggle="modal"
                            data-bs-target="#modalEditarUsuario"
                            data-idusu="${usuario.id}"
                            data-nomusu="${usuario.nombre}"
                            data-rolusu="${usuario.rol}"
                            data-telusu="${usuario.telefono}"
                            data-contrausu="${usuario.contra}">
                            <i class="fas fa-pencil-alt"></i> Editar
                        </button>
                        <button class="btn btn-outline-danger btnEliminar" data-idusuario="${usuario.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>`;
                elemento.innerHTML += fila;
            });
        })
        .catch(err => alert("Error al cargar usuarios: " + err));
}

// ── Eliminar usuario ──────────────────────────────────────────────────────────
// FIX #6: ahora escucha la clase .btnEliminar en vez del id duplicado
document.addEventListener("click", function (e) {

    // ── ELIMINAR ──────────────────────────────────────────────────────────────
    const btnEliminar = e.target.closest(".btnEliminar");
    if (btnEliminar) {
        if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
        const id = btnEliminar.dataset.idusuario;
        fetch(`http://localhost:8080/api/usuarios/${id}`, { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    alert("Usuario eliminado");
                    cargarUsuarios(); // recargar sin hacer location.reload()
                } else {
                    alert("Error al eliminar el usuario");
                }
            })
            .catch(err => alert("Error de red: " + err));
    }

    // ── EDITAR: cargar datos en el modal ──────────────────────────────────────
    // FIX #3 y #4: ahora llamardatos recibe el elemento correcto y lee los data-* bien
    const btnEditar = e.target.closest(".btnEditar");
    if (btnEditar) {
        document.getElementById("c_u_nombre").value    = btnEditar.dataset.nomusu;
        document.getElementById("c_u_rol").value       = btnEditar.dataset.rolusu;
        document.getElementById("c_u_telefono").value  = btnEditar.dataset.telusu;
        document.getElementById("c_u_contrasena").value = btnEditar.dataset.contrausu;
        // Guardar el id en el botón Actualizar para usarlo al hacer PUT
        document.getElementById("btn-Editarusuario").dataset.idusu = btnEditar.dataset.idusu;
    }

});

// ── Guardar nuevo usuario ─────────────────────────────────────────────────────
function guardarUsuario() {
    const nombre   = document.getElementById("u_nombre").value.trim();
    const rol      = document.getElementById("u_rol").value;
    const telefono = document.getElementById("u_telefono").value.trim();
    const contra   = document.getElementById("u_contra").value.trim();

    if (!nombre || !rol || !telefono || !contra) {
        alert("Por favor completa todos los campos.");
        return;
    }

    fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rol, telefono, contra }),
    }).then(response => {
        if (response.ok) {
            // Cerrar modal y recargar tabla
            bootstrap.Modal.getInstance(document.getElementById("modalRegistroUsuario")).hide();
            cargarUsuarios();
        } else {
            alert("Error al crear el usuario");
        }
    }).catch(err => alert("Error de red: " + err));
}

// ── Actualizar usuario existente ──────────────────────────────────────────────
// FIX #5: función que antes no existía
function actualizarUsuario() {
    const id       = document.getElementById("btn-Editarusuario").dataset.idusu;
    const nombre   = document.getElementById("c_u_nombre").value.trim();
    const rol      = document.getElementById("c_u_rol").value;
    const telefono = document.getElementById("c_u_telefono").value.trim();
    const contra   = document.getElementById("c_u_contrasena").value.trim();

    if (!nombre || !rol || !telefono || !contra) {
        alert("Por favor completa todos los campos.");
        return;
    }

    fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rol, telefono, contra }),
    }).then(response => {
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario")).hide();
            cargarUsuarios();
        } else {
            alert("Error al actualizar el usuario");
        }
    }).catch(err => alert("Error de red: " + err));
}
