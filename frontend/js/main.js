
// EVENTOS EN JAVASCRIPT (CLICK, CARGAR, KEY,)

document.addEventListener("DOMContentLoaded", () => {

  fetch("http://localhost:8080/api/clientes")
    .then((response) => response.json())
    .then((data) => {
      // DOM -> <tbody id="table-cliente">
      const elemento = document.getElementById("table-cliente");
      for (let i = 0; i < data.length; i++) {
        //data[i], muestra en forma de array
        let cliente = data[i];
        // alt + 96
        let fila = `
                            <tr>
                            <td>${cliente.id}</td>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.apellido}</td>
                            <td>${cliente.dni}</td>
                            <td>${cliente.telefono}</td>
                            <td>${cliente.direccion}</td>
                            <td> 
                                <button class="btn btn-outline-primary me-2">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button id="btnEliminar" data-idcliente = ${cliente.id} class="btn btn-outline-danger">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </td>
                            </tr>                
                           `;
        elemento.innerHTML += fila;
      }
    });

});

// EVENTO DE CLICK EN JAVASCRIPT
//Creamos una variable que almacene el DOM de ese elemento del boton
document.addEventListener("click", function (e) {
  const btnDelete = e.target.closest("#btnEliminar");
    if (btnDelete) { //TRUE o 1
        alert("Eliminando...");
        const id = btnDelete.dataset.idcliente;
        //console.log(id) para en consola que ID es nada mas
        //fetch("http://localhost:8080/api/clientes/"+id, {
        fetch(`http://localhost:8080/api/clientes/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
              alert('Cliente eliminado correctamente');
              location.reload(); // Recargar la página para reflejar los cambios
            } else {
              alert('Error al eliminar el cliente');
        }})
    }
});
