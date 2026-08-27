const MapaCategorias = {
    relojes: "Relojes GPS",
    cadenas: "Cadenas GPS",
    pulseras: "Pulseras GPS",
    audifonos: "Audífonos GPS",
    gafas: "Gafas GPS",
    aretes: "Aretes GPS",
    llavero: "Llavero GPS"
};

function leerIdDesdeUrl() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
}

function buscarProductoPorId(id) {
    return productos.find(producto => String(producto.id) === String(id));
}

function pintarProducto(producto) {

    const imagen = document.getElementById("imagenProducto");
    if (imagen) {
        imagen.src = obtenerImagenProducto(producto);
        imagen.alt = producto.nombre;
    }

    const categoria = document.getElementById("categoriaProducto");
    if (categoria) {
        const etiqueta = MapaCategorias[producto.categoria] || producto.categoria;
        categoria.innerHTML = `<i class="bi bi-tag-fill"></i> ${etiqueta}`;
    }

    const nombre = document.getElementById("nombreProducto");
    if (nombre) nombre.textContent = producto.nombre;

    const precio = document.getElementById("precioProducto");
    if (precio) precio.textContent = formatearPrecio(producto.precio);

    const descripcion = document.getElementById("descripcionProducto");
    if (descripcion) descripcion.textContent = producto.descripcion;

    const stock = document.getElementById("stockProducto");
    if (stock) {
        stock.classList.add("disponible");
        stock.innerHTML = '<i class="bi bi-check-circle-fill"></i> Stock disponible';
    }

    const caracteristicas = document.getElementById("caracteristicasProducto");
    if (caracteristicas) {
        caracteristicas.innerHTML = "";
        producto.caracteristicas.forEach(codigo => {
            const etiqueta = MapaCaracteristicas[codigo] || codigo;
            const li = document.createElement("li");
            li.innerHTML = `<i class="bi bi-check2"></i> ${etiqueta}`;
            caracteristicas.appendChild(li);
        });
    }

    const breadcrumb = document.getElementById("breadcrumbProducto");
    if (breadcrumb) breadcrumb.textContent = producto.nombre;

    document.title = `${producto.nombre} | SAPE`;
}

function mostrarProductoNoEncontrado() {

    const contenido = document.getElementById("contenidoDetalle");
    if (!contenido) return;

    contenido.innerHTML = `
        <div class="alert alert-danger text-center">
            <h4>Producto no encontrado</h4>
            <p>El producto que estás buscando no existe o ya no está disponible.</p>
            <a href="index.html" class="btn btn-primary">Volver a productos</a>
        </div>
    `;
}

const id = leerIdDesdeUrl();
const producto = buscarProductoPorId(id);

if (producto) {
    pintarProducto(producto);
} else {
    mostrarProductoNoEncontrado();
}