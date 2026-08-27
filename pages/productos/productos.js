const productos = [
    {
        id: 1,
        nombre: "Pulsera GPS Femenino",
        descripcion: "Ubicación en tiempo real, botón SOS y resistencia al agua para el día a día de los más pequeños.",
        precio: 189900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["emergencia", "ubicacion", "agua"],
        icono: "bi-smartwatch",
        color: "#DDEFFB",
        img: "/Assets/images/products/1.png"
    },
    {
        id: 2,
        nombre: "Audifonos GPS integrado",
        descripcion: "Diseñada para jovenes y niños. con sistema inalámbrico y geolocalización.",
        precio: 199900,
        categoria: "audifonos",
        grupo: "adultos",
        caracteristicas: ["emergencia", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 3,
        nombre: "Reloj GPS Masculino",
        descripcion: "Localización precisa y monitoreo constante en un diseño elegante para uso diario.",
        precio: 249900,
        categoria: "relojes",
        grupo: "adultos",
        caracteristicas: ["ubicacion", "bateria"],
        icono: "bi-smartwatch",
        color: "#DFE8EC"
    },
    {
        id: 4,
        nombre: "Reloj GPS Explorer Boy",
        descripcion: "Resistente al agua y a los golpes, pensado para las aventuras diarias de los niños.",
        precio: 209900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 5,
        nombre: "Reloj GPS Explorer Girl",
        descripcion: "Resistente al agua y a los golpes, pensado para las aventuras diarias de los niños.",
        precio: 209900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },

    {
        id: 6,
        nombre: "Gafas de sol GPS",
        descripcion: "Fácil de usar, con botón de emergencia.",
        precio: 159900,
        categoria: "gafas",
        grupo: "adultos",
        caracteristicas: ["emergencia", "ubicacion"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 7,
        nombre: "Arete GPS",
        descripcion: "Resistente al agua con batería de larga duración.",
        precio: 229900,
        categoria: "aretes",
        grupo: "ninos",
        caracteristicas: ["emergencia", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 8,
        nombre: "Arete GPS  Niña",
        descripcion: "Ligera y resistente al agua, ideal para acompañar a las niñas en sus actividades.",
        precio: 169900,
        categoria: "aretes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 9,
        nombre: "Llavero GPS Femenino",
        descripcion: "Un accesorio discreto con seguimiento en tiempo real, ideal para el uso diario.",
        precio: 179900,
        categoria: "llavero",
        grupo: "adultos",
        caracteristicas: ["ubicacion"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 10,
        nombre: "Cadena GPS Delicada",
        descripcion: "Un accesorio discreto con seguimiento en tiempo real, ideal para el uso diario.",
        precio: 179900,
        categoria: "cadenas",
        grupo: "adultos",
        caracteristicas: ["ubicacion"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 11,
        nombre: "Pulsera GPS Básica Kids",
        descripcion: "Fácil de usar, con botón de emergencia al alcance de los más pequeños.",
        precio: 159900,
        categoria: "pulseras",
        grupo: "ninos",
        caracteristicas: ["emergencia", "ubicacion"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 12,
        nombre: "Pulsera GPS SOS Plus",
        descripcion: "Resistente al agua con batería de larga duración, pensada para adultos mayores.",
        precio: 229900,
        categoria: "pulseras",
        grupo: "adultos",
        caracteristicas: ["emergencia", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 13,
        nombre: "Pulsera GPS Deportiva",
        descripcion: "Ligera y resistente al agua, ideal para acompañar a los niños en sus actividades deportivas.",
        precio: 169900,
        categoria: "cadenas",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 14,
        nombre: "Pulsera GPS SOS Confort",
        descripcion: "Diseñada para adultos mayores, con botón de emergencia y batería de larga duración.",
        precio: 199900,
        categoria: "pulseras",
        grupo: "adultos",
        caracteristicas: ["emergencia", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
];

const favoritos = new Set();

const gridProductos = document.getElementById("gridProductos");
const contadorProductos = document.getElementById("contadorProductos");
const sinResultados = document.getElementById("sinResultados");
const paginacionProductos = document.getElementById("paginacionProductos");
const ordenarPor = document.getElementById("ordenarPor");
const precioMin = document.getElementById("precioMin");
const precioMax = document.getElementById("precioMax");
const catBtns = document.querySelectorAll(".cat-btn");
const filtroChecks = document.querySelectorAll(".filtro-check");

const PRODUCTOS_POR_PAGINA = 9;
let categoriaActiva = "todos";
let paginaActual = 1;

function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-CO") + " COP";
}

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

function obtenerProductosFiltrados() {
    let resultado = productos.filter(p =>
        productoCoincideCategoria(p) &&
        productoCoincidePrecio(p) &&
        productoCoincideCaracteristicas(p)
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

    const esFavorito = favoritos.has(producto.id);

    col.innerHTML = `
        <div class="producto-card" data-id="${producto.id}">
            <button type="button" class="producto-fav-btn ${esFavorito ? "active" : ""}" aria-label="Marcar como favorito">
                <i class="bi ${esFavorito ? "bi-star-fill" : "bi-star"}"></i>
            </button>
            <div class="producto-img-wrap" style="background:${producto.color};">
                <img src="/Assets/images/products/${producto.id}.png" alt="${producto.nombre}">
            </div>
            <h3 class="producto-nombre">${producto.nombre}</h3>
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
        renderizarProductos();
    });

    col.querySelector(".producto-cart-btn").addEventListener("click", () => {
        Swal.fire("Agregado al carrito", `${producto.nombre} se añadió correctamente`, "success");
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

renderizarProductos();
