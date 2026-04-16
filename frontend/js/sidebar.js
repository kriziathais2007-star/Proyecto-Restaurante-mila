document.addEventListener("DOMContentLoaded", () => {
    // Hamburger / Sidebar toggle (móvil) 
    const hamburger = document.querySelector(".hamburger");
    const sidebar   = document.querySelector(".sidebar");
    const overlay   = document.querySelector(".overlay");

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("show");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    }

    hamburger.addEventListener("click", openSidebar);
    overlay.addEventListener("click", closeSidebar);

    // Nav links: marcar activo y cerrar sidebar 
    const navLinks = document.querySelectorAll(".sidebar ul li a[data-page]");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove("activo"));
            link.classList.add("activo");
            closeSidebar();
        });
    });

    //  Cerrar sesión 
    document.getElementById("btn-logout").addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("¿Seguro que deseas cerrar sesión?")) {
            // Aquí va la lógica de logout (redirect, limpiar token, etc.)
            alert("Sesión cerrada");
        }
    });

});