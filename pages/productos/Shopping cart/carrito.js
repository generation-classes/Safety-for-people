const listaCarrito = document.getElementById("listaCarrito");
const subtotalCarrito = document.getElementById("subtotalCarrito");
const subtotalEtiqueta = document.getElementById("subtotalEtiqueta");
const totalCarrito = document.getElementById("totalCarrito");
const descuentoCarrito = document.getElementById("descuentoCarrito");
const vaciarCarrito = document.getElementById("vaciarCarrito");
const finalizarCompraBtn = document.getElementById("finalizarCompraBtn");

function precioCarrito(valor) {
    return "$" + Number(valor).toLocaleString("es-CO") + " COP";
}

function crearItemCarrito(item) {
    const elemento = document.createElement("div");
    elemento.className = "item d-flex flex-row flex-wrap justify-content-between align-items-center border-bottom border-3";
    elemento.innerHTML = `
        <div class="col-12 col-md d-flex flex-row align-items-center justify-content-start">
            <div class="img-carrito p-3 d-flex justify-content-center align-items-center">
                <img src="${item.imagen}" class="w-100 h-100" alt="${item.nombre}">
            </div>
            <div class="d-flex flex-column gap-1">
                <h3 class="fs-6 fw-semibold">${item.nombre}</h3>
                <p>${item.descripcion || "Producto de seguridad SAPE"}</p>
            </div>
            <button type="button" class="btn-eliminar mx-auto d-md-none" aria-label="Eliminar producto">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <div class="col-4 col-md-2 d-flex justify-content-center align-items-center text-center">
            <h3 class="fs-6 fw-bold">${precioCarrito(item.precio)}</h3>
        </div>
        <div class="col-4 col-md-2 d-flex justify-content-center align-items-center">
            <div class="counter d-flex flex-row justify-content-center align-items-center rounded-5 px-2">
                <button type="button" class="px-3 decrease border-0 bg-transparent" aria-label="Disminuir cantidad">-</button>
                <h3 class="m-0 fs-6">${item.quantity}</h3>
                <button type="button" class="px-3 increment border-0 bg-transparent" aria-label="Aumentar cantidad">+</button>
            </div>
        </div>
        <div class="col-4 col-md-2 d-flex justify-content-center align-items-center text-center">
            <h3 class="fs-6 fw-bold">${precioCarrito(item.precio * item.quantity)}</h3>
        </div>
        <div class="col-auto col-md-1 d-none d-md-flex justify-content-center align-items-center">
            <button type="button" class="btn-eliminar" aria-label="Eliminar producto">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    elemento.querySelectorAll(".btn-eliminar").forEach(button => {
        button.addEventListener("click", () => App.removeFromCart(item.id));
    });
    elemento.querySelector(".decrease").addEventListener("click", () => {
        if (item.quantity === 1) {
            App.removeFromCart(item.id);
            return;
        }
        App.changeCartQuantity(item.id, item.quantity - 1);
    });
    elemento.querySelector(".increment").addEventListener("click", () => {
        const stockDisponible = App.getProductStock(item.id);
        if (stockDisponible > 0 && item.quantity >= stockDisponible) {
            App.notify(`Solo quedan ${stockDisponible} unidades disponibles.`, 'info');
            return;
        }
        App.changeCartQuantity(item.id, item.quantity + 1);
    });

    return elemento;
}

function renderizarCarrito() {
    const cart = App.getCart();
    const cantidadProductos = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const subtotal = cart.reduce((total, item) => total + Number(item.precio) * Number(item.quantity), 0);

    listaCarrito.innerHTML = "";
    if (!cart.length) {
        listaCarrito.innerHTML = '<p class="text-center text-muted m-auto">Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => listaCarrito.appendChild(crearItemCarrito(item)));
    }

    subtotalEtiqueta.textContent = `Subtotal (${cantidadProductos} producto${cantidadProductos === 1 ? "" : "s"})`;
    subtotalCarrito.textContent = precioCarrito(subtotal);
    totalCarrito.textContent = precioCarrito(subtotal);
    descuentoCarrito.textContent = precioCarrito(0);
}

vaciarCarrito.addEventListener("click", () => App.clearCart());
finalizarCompraBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    App.finalizePurchase();
});
document.addEventListener("sape:cart-updated", renderizarCarrito);
renderizarCarrito();
