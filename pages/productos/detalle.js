function formatearPrecio(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CO") + " COP";
}

function obtenerImagenProducto(producto) {
    return App.ajustarRutaImagen(producto.imagen, producto.id);
}

function leerIdDesdeUrl() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("id");
}

function parsearCaracteristicas(valor) {
    if (Array.isArray(valor)) return valor;
    if (typeof valor !== "string" || !valor.trim()) return [];
    try {
        const parseado = JSON.parse(valor);
        return Array.isArray(parseado) ? parseado : [];
    } catch {
        // Algunos productos guardan "emergencia, ubicacion" como texto plano, no JSON.
        return valor.split(",").map(item => item.trim()).filter(Boolean);
    }
}

function etiquetaCaracteristica(item) {
    const texto = String(item || "").toLowerCase();
    if (texto.includes("emerg")) return "Botón de emergencia";
    if (texto.includes("agua")) return "Resistencia al agua";
    if (texto.includes("ubicac") || texto.includes("gps") || texto.includes("tiempo real")) return "Ubicación en tiempo real";
    if (texto.includes("bater")) return "Batería de larga duración";
    return item;
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

function pintarProducto(producto) {
    const imagen = document.getElementById("imagenProducto");
    if (imagen) {
        imagen.classList.remove("d-none");
        imagen.src = obtenerImagenProducto(producto);
        imagen.alt = producto.nombre;
    }

    const categoria = document.getElementById("categoriaProducto");
    if (categoria) {
        categoria.innerHTML = `<i class="bi bi-tag-fill"></i> ${producto.categoria}`;
    }

    const nombre = document.getElementById("nombreProducto");
    if (nombre) nombre.textContent = producto.nombre;

    const precio = document.getElementById("precioProducto");
    if (precio) precio.textContent = formatearPrecio(producto.precio);

    const descripcion = document.getElementById("descripcionProducto");
    if (descripcion) descripcion.textContent = producto.descripcion;

    const stockDisponible = Number(producto.stock) || 0;
    const stock = document.getElementById("stockProducto");
    if (stock) {
        if (stockDisponible > 0) {
            stock.classList.remove("agotado");
            stock.classList.add("disponible");
            stock.innerHTML = `<i class="bi bi-check-circle-fill"></i> Stock disponible: ${stockDisponible} unidades`;
        } else {
            stock.classList.remove("disponible");
            stock.classList.add("agotado");
            stock.innerHTML = '<i class="bi bi-x-circle-fill"></i> Producto agotado';
        }
    }

    const caracteristicas = document.getElementById("caracteristicasProducto");
    if (caracteristicas) {
        caracteristicas.innerHTML = "";
        producto.caracteristicas.forEach(codigo => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="bi bi-check2"></i> ${etiquetaCaracteristica(codigo)}`;
            caracteristicas.appendChild(li);
        });
    }

    const breadcrumb = document.getElementById("breadcrumbProducto");
    if (breadcrumb) breadcrumb.textContent = producto.nombre;

    document.title = `${producto.nombre} | SAPE`;

    const cantidad = document.querySelector(".cantidad-input");
    const disminuir = document.querySelector(".cantidad-btn:first-child");
    const aumentar = document.querySelector(".cantidad-btn:last-child");
    const agregar = document.querySelector(".detalle-btn-carrito");
    const maximoCantidad = Math.max(1, stockDisponible);

    if (cantidad) {
        cantidad.max = String(maximoCantidad);
        cantidad.value = String(Math.min(Number(cantidad.value || 1), maximoCantidad));
    }

    if (agregar) {
        agregar.disabled = stockDisponible <= 0;
    }

    const actualizarCantidad = cambio => {
        if (!cantidad) return;
        const valor = Math.min(maximoCantidad, Math.max(1, Number(cantidad.value || 1) + cambio));
        cantidad.value = valor;
    };

    disminuir?.addEventListener("click", () => actualizarCantidad(-1));
    aumentar?.addEventListener("click", () => actualizarCantidad(1));
    cantidad?.addEventListener("change", () => {
        if (!cantidad) return;
        cantidad.value = Math.min(maximoCantidad, Math.max(1, Number(cantidad.value || 1)));
    });
    agregar?.addEventListener("click", () => {
        App.addToCart(producto, Number(cantidad?.value || 1));
    });
}

function mostrarCargando() {
    const nombre = document.getElementById("nombreProducto");
    if (nombre) nombre.textContent = "Cargando...";

    const precio = document.getElementById("precioProducto");
    if (precio) precio.textContent = "";

    const descripcion = document.getElementById("descripcionProducto");
    if (descripcion) descripcion.textContent = "";

    const categoria = document.getElementById("categoriaProducto");
    if (categoria) categoria.innerHTML = "";

    const stock = document.getElementById("stockProducto");
    if (stock) stock.innerHTML = "";

    const imagen = document.getElementById("imagenProducto");
    if (imagen) imagen.classList.add("d-none");
}

async function cargarProducto() {
    const id = leerIdDesdeUrl();
    if (!id) {
        mostrarProductoNoEncontrado();
        return;
    }

    mostrarCargando();

    try {
        const productoApi = await ProductsService.getById(id);

        if (productoApi.active === false) {
            mostrarProductoNoEncontrado();
            return;
        }

        const producto = {
            id: productoApi.id,
            nombre: productoApi.name || "Producto",
            descripcion: productoApi.description || "Producto disponible",
            precio: Number(productoApi.price) || 0,
            stock: Number(productoApi.stock) || 0,
            categoria: "Cargando...",
            caracteristicas: parsearCaracteristicas(productoApi.characteristics),
            color: productoApi.backgroundColor || "#DDEFFB",
            imagen: productoApi.image,
        };

        // Se pinta el producto de inmediato; la categoría llega aparte para no
        // bloquear toda la vista si esa petición tarda o falla.
        pintarProducto(producto);

        if (productoApi.categoryId) {
            CategoriesService.getById(productoApi.categoryId)
                .then(categoria => {
                    const categoriaEl = document.getElementById("categoriaProducto");
                    if (categoriaEl && categoria?.name) {
                        categoriaEl.innerHTML = `<i class="bi bi-tag-fill"></i> ${categoria.name}`;
                    }
                })
                .catch(() => {
                    const categoriaEl = document.getElementById("categoriaProducto");
                    if (categoriaEl) categoriaEl.innerHTML = `<i class="bi bi-tag-fill"></i> Sin categoría`;
                });
        } else {
            const categoriaEl = document.getElementById("categoriaProducto");
            if (categoriaEl) categoriaEl.innerHTML = `<i class="bi bi-tag-fill"></i> Sin categoría`;
        }
    } catch (error) {
        mostrarProductoNoEncontrado();
    }
}

cargarProducto();
