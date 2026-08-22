let carrito = [
  {
    id: 1,
    nombre: "Reloj GPS niños SG",
    descripcion: "descripcion del producto, características breves",
    precio: 200900,
    cantidad: 1,
    imagen: "reloj.png",
  },
  {
    id: 2,
    nombre: "Reloj GPS niños SG",
    descripcion: "descripcion del producto, características breves",
    precio: 200900,
    cantidad: 1,
    imagen: "reloj.png",
  },
];

function actualizarCarrito() {
  carrito.forEach((producto) => {
    const contador = document.getElementById(`cantidad-${producto.id}`);

    if (contador) {
      contador.textContent = producto.cantidad;
    }
  });
}

function aumentarCantidad(id) {
  const producto = carrito.find((producto) => producto.id === id);

  if (producto) {
    producto.cantidad++;
    actualizarCarrito();
  }
}

function disminuirCantidad(id) {
  const producto = carrito.find((producto) => producto.id === id);

  if (producto) {
    producto.cantidad--;

    if (producto.cantidad === 0) {
      carrito = carrito.filter((item) => item.id !== id);
      console.josn?.("Objeto eliminado del carrito");
    }

    actualizarCarrito();
    console.log("Carrito actual:", carrito);
  }
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
  carrito = carrito.filter((producto) => producto.id !== id);

  actualizarCarrito();

  console.log("Producto eliminado del carrito");
  console.log("Carrito actual:", carrito);
}
