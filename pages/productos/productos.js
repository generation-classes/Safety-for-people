let favoritosGuardados = [];
try {
    favoritosGuardados = JSON.parse(localStorage.getItem("sape_favoritos") || "[]");
} catch {
    favoritosGuardados = [];
}
const favoritos = new Set(Array.isArray(favoritosGuardados) ? favoritosGuardados : []);

const gridProductos = document.getElementById("gridProductos");
const contadorProductos = document.getElementById("contadorProductos");
const sinResultados = document.getElementById("sinResultados");
const paginacionProductos = document.getElementById("paginacionProductos");
const ordenarPor = document.getElementById("ordenarPor");
const precioMin = document.getElementById("precioMin");
const precioMax = document.getElementById("precioMax");
const catBtns = document.querySelectorAll(".cat-btn");
const filtroChecks = document.querySelectorAll(".filtro-check");
const chkFavoritos = document.getElementById("chkFavoritos");
const buscador = document.querySelector('.buscador input[type="search"]');

function normalizarCategoria(nombre) {
    const texto = String(nombre || "").trim().toLowerCase();
    if (texto.includes("reloj")) return "relojes";
    if (texto.includes("cadena")) return "cadenas";
    if (texto.includes("puls")) return "pulseras";
    if (texto.includes("audif")) return "audifonos";
    if (texto.includes("gafa")) return "gafas";
    if (texto.includes("arete")) return "aretes";
    if (texto.includes("llav")) return "llavero";
    return texto || "otros";
}

function normalizarCaracteristicas(lista) {
    if (!Array.isArray(lista)) return [];
    return lista.map(item => {
        const texto = String(item || "").toLowerCase();
        if (texto.includes("emerg")) return "emergencia";
        if (texto.includes("agua")) return "agua";
        if (texto.includes("ubicac") || texto.includes("gps") || texto.includes("tiempo real")) return "ubicacion";
        if (texto.includes("bater")) return "bateria";
        return texto;
    });
}

function mapearProducto(producto, categoriasPorId) {
    const categoriaNombre = categoriasPorId.get(producto.categoryId)?.name || "";
    const textoCompleto = `${producto.name || ""} ${producto.description || ""}`.toLowerCase();

    return {
        id: producto.id,
        nombre: producto.name || "Producto",
        descripcion: producto.description || "",
        precio: Number(producto.price) || 0,
        stock: Number(producto.stock) || 0,
        categoria: normalizarCategoria(categoriaNombre),
        grupo: textoCompleto.includes("niñ") || textoCompleto.includes("infantil") ? "ninos" : "adultos",
        caracteristicas: normalizarCaracteristicas(producto.characteristics),
        color: producto.backgroundColor || "#DDEFFB",
        imagen: producto.image
    };
}

async function cargarCatalogoProductos() {
    const [productosApi, categoriasApi] = await Promise.all([
        ProductsService.getAll(),
        CategoriesService.getAll().catch(() => [])
    ]);

    const categoriasPorId = new Map(categoriasApi.map(categoria => [categoria.id, categoria]));
    return productosApi.map(producto => mapearProducto(producto, categoriasPorId));
}

const PRODUCTOS_POR_PAGINA = 9;
let categoriaActiva = "todos";
let paginaActual = 1;
let terminoBusqueda = new URLSearchParams(window.location.search).get("buscar")?.trim().toLowerCase() || "";

if (buscador) buscador.value = terminoBusqueda;

document.addEventListener("input", (evento) => {
    if (!evento.target.matches('.buscador input[type="search"]')) return;
    terminoBusqueda = evento.target.value.trim().toLowerCase();
    if (typeof renderizarProductos === "function") {
        paginaActual = 1;
        renderizarProductos();
    }
});

function productoCoincideCategoria(producto) {
    if (categoriaActiva === "todos") return true;
    if (categoriaActiva === "ninos" || categoriaActiva === "adultos") {
        return producto.grupo === categoriaActiva;
    }
    return producto.categoria === categoriaActiva;
}

function productoCoincidePrecio(producto) {
    const min = precioMin.value ? Number(precioMin.value) : 0;
    const max = precioMax.value ? Number(precioMax.value) : Infinity;
    return producto.precio >= min && producto.precio <= max;
}

function productoCoincideCaracteristicas(producto) {
    const seleccionadas = Array.from(filtroChecks).filter(chk => chk.checked).map(chk => chk.value);
    return seleccionadas.every(c => producto.caracteristicas.includes(c));
}

function productoCoincideBusqueda(producto) {
    if (!terminoBusqueda) return true;
    return [producto.nombre, producto.descripcion, producto.categoria, producto.grupo]
        .filter(Boolean)
        .some(valor => valor.toLowerCase().includes(terminoBusqueda));
}

let catalogoProductos = [];

function obtenerProductosFiltrados() {
    let resultado = catalogoProductos.filter(p =>
        productoCoincideCategoria(p) &&
        productoCoincidePrecio(p) &&
        productoCoincideCaracteristicas(p) &&
        productoCoincideBusqueda(p) &&
        (!chkFavoritos.checked || p.isFavorite === true)
    );

    switch (ordenarPor.value) {
        case "precio-asc":
            resultado.sort((a, b) => a.precio - b.precio);
            break;
        case "precio-desc":
            resultado.sort((a, b) => b.precio - a.precio);
            break;
        case "nombre":
            resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
    }

    return resultado;
}

function crearTarjeta(producto) {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    producto.isFavorite = favoritos.has(producto.id);
    const esFavorito = producto.isFavorite;

    col.innerHTML = `
        <div class="producto-card" data-id="${producto.id}">
            <button type="button" class="producto-fav-btn ${esFavorito ? "active" : ""}" aria-label="Marcar como favorito">
                <i class="bi ${esFavorito ? "bi-star-fill" : "bi-star"}"></i>
            </button>
            <div class="producto-img-wrap" style="background:${producto.color};">
                <img src="${obtenerImagenProducto(producto)}" alt="${producto.nombre}">
            </div>
            <a class="producto-nombre text-decoration-none" href="detalle.html?id=${producto.id}">${producto.nombre}</a>
            <p class="producto-desc">${producto.descripcion}</p>
            <div class="producto-footer">
                <span class="producto-precio">${formatearPrecio(producto.precio)}</span>
                <button type="button" class="producto-cart-btn" aria-label="Agregar al carrito">
                    <i class="bi bi-cart3"></i>
                </button>
            </div>
        </div>
    `;

    col.querySelector(".producto-fav-btn").addEventListener("click", () => {
        if (favoritos.has(producto.id)) {
            favoritos.delete(producto.id);
        } else {
            favoritos.add(producto.id);
        }
        producto.isFavorite = favoritos.has(producto.id);
        localStorage.setItem("sape_favoritos", JSON.stringify([...favoritos]));
        renderizarProductos();
    });

    col.querySelector(".producto-cart-btn").addEventListener("click", () => {
        App.addToCart(producto);
    });

    return col;
}

function renderizarProductos() {
    const filtrados = obtenerProductosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA));
    paginaActual = Math.min(paginaActual, totalPaginas);

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const productosPagina = filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

    gridProductos.innerHTML = "";
    productosPagina.forEach(producto => gridProductos.appendChild(crearTarjeta(producto)));

    contadorProductos.textContent = `Mostrando ${filtrados.length} producto${filtrados.length === 1 ? "" : "s"}`;
    sinResultados.classList.toggle("d-none", filtrados.length > 0);

    renderizarPaginacion(totalPaginas);
}

function renderizarPaginacion(totalPaginas) {
    paginacionProductos.innerHTML = "";
    if (totalPaginas <= 1) return;

    const crearItem = (texto, pagina, { disabled = false, activo = false } = {}) => {
        const li = document.createElement("li");
        li.className = `page-item${disabled ? " disabled" : ""}${activo ? " active" : ""}`;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-link";
        btn.textContent = texto;
        if (!disabled && !activo) {
            btn.addEventListener("click", () => {
                paginaActual = pagina;
                renderizarProductos();
            });
        }

        li.appendChild(btn);
        return li;
    };

    const ul = document.createElement("ul");
    ul.className = "pagination justify-content-center mb-0";

    ul.appendChild(crearItem("Anterior", paginaActual - 1, { disabled: paginaActual === 1 }));
    for (let i = 1; i <= totalPaginas; i++) {
        ul.appendChild(crearItem(String(i), i, { activo: i === paginaActual }));
    }
    ul.appendChild(crearItem("Siguiente", paginaActual + 1, { disabled: paginaActual === totalPaginas }));

    paginacionProductos.appendChild(ul);
}

gridProductos.addEventListener("click", (evento) => {
    const tarjeta = evento.target.closest(".producto-card");
    if (!tarjeta) return;
    if (evento.target.closest("button")) return;

    window.location.href = "detalle.html?id=" + tarjeta.dataset.id;
});

function aplicarFiltros() {
    paginaActual = 1;
    renderizarProductos();
}

catBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        catBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        categoriaActiva = btn.dataset.categoria;
        aplicarFiltros();
    });
});

filtroChecks.forEach(chk => chk.addEventListener("change", aplicarFiltros));
precioMin.addEventListener("change", aplicarFiltros);
precioMax.addEventListener("change", aplicarFiltros);
ordenarPor.addEventListener("change", aplicarFiltros);
chkFavoritos.addEventListener("change", aplicarFiltros);

async function inicializar() {
    try {
        catalogoProductos = await cargarCatalogoProductos();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        App.notify("No se pudieron cargar los productos. Intenta de nuevo más tarde.", "danger");
        catalogoProductos = [];
    }
    renderizarProductos();
}

inicializar();
