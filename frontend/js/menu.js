const API_PLATOS = "http://localhost:8080/api/platos";

function getToken() {
    return localStorage.getItem("token");
}

// ── Toast ──
function toast(msg, tipo = "ok") {
    const el = document.createElement("div");
    el.className = "toast-msg" + (tipo === "error" ? " error" : "");
    el.textContent = msg;
    document.getElementById("toast-wrap").appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// ── Cargar platos ──
function cargarPlatos() {
    fetch(API_PLATOS, {
        headers: { "Authorization": "Bearer " + getToken() }
    })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById("platos-grid");
        document.getElementById("badge-total").textContent = data.length;
        grid.innerHTML = "";

        if (data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-plate-wheat"></i>
                    <p>No hay platos en el menú todavía.<br>¡Agrega el primero!</p>
                </div>`;
            return;
        }

        data.forEach((plato, i) => {
            const card = document.createElement("div");
            card.className = "plato-card";
            card.style.animationDelay = (i * 0.06) + "s";
            card.innerHTML = `
                <div class="card-img-wrap">
                    <i class="fa-solid fa-bowl-food"></i>
                </div>
                <div class="card-body-plato">
                    <div class="card-nombre-plato">${plato.nombre}</div>
                    <div class="card-desc-plato">${plato.descripcion || "Sin descripción."}</div>
                    <div class="card-footer-plato">
                        <div class="card-precio"><span>S/.</span>${plato.precio.toFixed(2)}</div>
                        <button class="btn-eliminar-plato" data-id="${plato.id}">
                            <i class="fa-solid fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    })
    .catch(() => toast("Error al cargar el menú", "error"));
}

// ── Guardar plato ──
document.getElementById("btn-guardarPlato").addEventListener("click", () => {
    const nombre      = document.getElementById("p_nombre").value.trim();
    const precio      = parseFloat(document.getElementById("p_precio").value);
    const descripcion = document.getElementById("p_descripcion").value.trim();

    if (!nombre || isNaN(precio) || precio <= 0) {
        toast("Completa nombre y precio correctamente.", "error");
        return;
    }

    fetch(API_PLATOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({ nombre, precio, descripcion })
    })
    .then(r => {
        if (r.ok) {
            bootstrap.Modal.getInstance(
                document.getElementById("modalAgregarPlato")
            ).hide();
            document.getElementById("p_nombre").value      = "";
            document.getElementById("p_precio").value      = "";
            document.getElementById("p_descripcion").value = "";
            cargarPlatos();
            toast("¡Plato agregado correctamente! ✓");
        } else {
            toast("Error al guardar el plato.", "error");
        }
    })
    .catch(() => toast("No se pudo conectar.", "error"));
});

// ── Eliminar plato ──
document.getElementById("platos-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-eliminar-plato");
    if (!btn) return;
    if (!confirm("¿Eliminar este plato del menú?")) return;

    fetch(`${API_PLATOS}/${btn.dataset.id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + getToken() }
    })
    .then(r => {
        if (r.ok) { cargarPlatos(); toast("Plato eliminado."); }
        else toast("Error al eliminar.", "error");
    })
    .catch(() => toast("No se pudo conectar.", "error"));
});

// ── Init ──
cargarPlatos();