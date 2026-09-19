document.addEventListener("DOMContentLoaded", () => {
    if (!window.App || !App.isLoggedIn() || App.getRole() !== "admin") {
        window.location.href = "../Inicio/index.html";
        return;
    }

    const tablaProductos = document.getElementById("tablaProductos");
    const formProducto = document.getElementById("formProducto");
    const modalProductoEl = document.getElementById("modalProducto");
    const modalProducto = new bootstrap.Modal(modalProductoEl);
    const modalProductoTitulo = document.getElementById("modalProductoTitulo");
    const btnNuevoProducto = document.getElementById("btnNuevoProducto");
    const productoImagenTipo = document.getElementById("productoImagenTipo");
    const bloqueImagenUrl = document.getElementById("bloqueImagenUrl");
    const bloqueImagenArchivo = document.getElementById("bloqueImagenArchivo");
    const productoImagenUrl = document.getElementById("productoImagenUrl");
    const productoImagenArchivo = document.getElementById("productoImagenArchivo");
    const productoImagenArchivoTexto = document.getElementById("productoImagenArchivoTexto");
    const productoImagenPreview = document.getElementById("productoImagenPreview");

    const selectPorPagina = document.getElementById("productosPorPagina");
    const paginacionProductosAdmin = document.getElementById("paginacionProductosAdmin");

    let categorias = [];
    let favoritoActual = false;
    let imagenOriginal = "";
    let archivoSeleccionado = null;
    let productosCache = [];
    let paginaActual = 1;
    let productosPorPagina = Number(selectPorPagina.value) || 5;

    function parsearCaracteristicas(valor) {
        if (Array.isArray(valor)) return valor;
        if (typeof valor !== "string" || !valor.trim()) return [];
        try {
            const parseado = JSON.parse(valor);
            return Array.isArray(parseado) ? parseado : [];
        } catch {
            // El backend a veces guarda "emergencia, ubicacion" como texto plano, no JSON.
            return valor.split(",").map(item => item.trim()).filter(Boolean);
        }
    }

    async function cargarCategorias() {
        const select = document.getElementById("productoCategoria");
        try {
            categorias = await CategoriesService.getAll();
        } catch {
            categorias = [];
        }
        select.innerHTML = categorias
            .map(categoria => `<option value="${categoria.id}">${categoria.name}</option>`)
            .join("") || '<option value="">Sin categorías</option>';
    }

    function formatearPrecio(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CO") + " COP";
    }

    function nombreCategoria(categoryId) {
        return categorias.find(c => String(c.id) === String(categoryId))?.name || "Sin categoría";
    }

    async function cargarProductos() {
        tablaProductos.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Cargando productos...</td></tr>';
        try {
            // "Eliminar" es un soft delete en el backend (active=false) para no romper
            // el historial de ventas que ya referencian el producto; se ocultan aquí.
            const productos = await ProductsService.getAll();
            productosCache = productos.filter(producto => producto.active !== false);
            paginaActual = 1;
            renderizarTabla();
        } catch (error) {
            tablaProductos.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">No se pudieron cargar los productos: ${error.message}</td></tr>`;
        }
    }

    function renderizarTabla() {
        if (!productosCache.length) {
            tablaProductos.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay productos registrados.</td></tr>';
            paginacionProductosAdmin.innerHTML = "";
            return;
        }

        const totalPaginas = Math.max(1, Math.ceil(productosCache.length / productosPorPagina));
        paginaActual = Math.min(paginaActual, totalPaginas);

        const inicio = (paginaActual - 1) * productosPorPagina;
        const productosPagina = productosCache.slice(inicio, inicio + productosPorPagina);

        tablaProductos.innerHTML = "";
        productosPagina.forEach(producto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img src="${producto.image || ''}" alt="${producto.name}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;background:#eee;"></td>
                <td>${producto.name}</td>
                <td>${nombreCategoria(producto.categoryId)}</td>
                <td>${formatearPrecio(producto.price)}</td>
                <td>${producto.stock}</td>
                <td>${producto.active ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-secondary">No</span>'}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-secondary me-1 btn-editar-producto" data-id="${producto.id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success me-1 btn-stock-producto" data-id="${producto.id}" title="Actualizar stock">
                        <i class="bi bi-box-seam"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-producto" data-id="${producto.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            fila.querySelector(".btn-editar-producto").addEventListener("click", () => abrirModalEdicion(producto));
            fila.querySelector(".btn-stock-producto").addEventListener("click", () => actualizarStock(producto));
            fila.querySelector(".btn-eliminar-producto").addEventListener("click", () => eliminarProducto(producto));

            tablaProductos.appendChild(fila);
        });

        renderizarPaginacionAdmin(totalPaginas);
    }

    function renderizarPaginacionAdmin(totalPaginas) {
        paginacionProductosAdmin.innerHTML = "";
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
                    renderizarTabla();
                });
            }

            li.appendChild(btn);
            return li;
        };

        const ul = document.createElement("ul");
        ul.className = "pagination pagination-sm mb-0";

        ul.appendChild(crearItem("Anterior", paginaActual - 1, { disabled: paginaActual === 1 }));
        for (let i = 1; i <= totalPaginas; i++) {
            ul.appendChild(crearItem(String(i), i, { activo: i === paginaActual }));
        }
        ul.appendChild(crearItem("Siguiente", paginaActual + 1, { disabled: paginaActual === totalPaginas }));

        paginacionProductosAdmin.appendChild(ul);
    }

    selectPorPagina.addEventListener("change", () => {
        productosPorPagina = Number(selectPorPagina.value) || 5;
        paginaActual = 1;
        renderizarTabla();
    });

    async function actualizarStock(producto) {
        const resultado = await Swal.fire({
            title: "Actualizar stock",
            input: "number",
            inputLabel: `${producto.name} — stock actual: ${producto.stock}`,
            inputValue: producto.stock,
            inputAttributes: { min: 0 },
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            inputValidator: (valor) => {
                if (valor === "" || Number(valor) < 0) {
                    return "Ingresa una cantidad válida (0 o más).";
                }
            },
        });

        if (!resultado.isConfirmed) return;

        const payload = {
            name: producto.name,
            description: producto.description,
            price: Number(producto.price),
            stock: Number(resultado.value),
            active: producto.active,
            categoryId: producto.categoryId || null,
            characteristics: JSON.stringify(parsearCaracteristicas(producto.characteristics)),
            image: producto.image,
            favorite: Boolean(producto.favorite),
        };

        try {
            await ProductsService.update(producto.id, payload);
            App.notify("Stock actualizado.");
            cargarProductos();
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo actualizar el stock.", "error");
        }
    }

    function mostrarBloqueImagen(tipo) {
        bloqueImagenUrl.classList.toggle("d-none", tipo !== "url");
        bloqueImagenArchivo.classList.toggle("d-none", tipo !== "archivo");
    }

    function limpiarFormulario() {
        formProducto.reset();
        document.getElementById("productoId").value = "";
        productoImagenPreview.classList.add("d-none");
        productoImagenPreview.src = "";
        productoImagenArchivoTexto.textContent = "Seleccionar imagen";
        productoImagenArchivo.value = "";
        productoImagenTipo.value = "url";
        mostrarBloqueImagen("url");
        favoritoActual = false;
        imagenOriginal = "";
        archivoSeleccionado = null;
        modalProductoTitulo.innerHTML = '<i class="bi bi-tag-fill me-2"></i> Agregar producto';
    }

    function abrirModalEdicion(producto) {
        limpiarFormulario();
        document.getElementById("productoId").value = producto.id;
        document.getElementById("productoNombre").value = producto.name || "";
        document.getElementById("productoCategoria").value = producto.categoryId || "";
        document.getElementById("productoDescripcion").value = producto.description || "";
        document.getElementById("productoPrecio").value = producto.price || 0;
        document.getElementById("productoStock").value = producto.stock || 0;
        document.getElementById("productoActivo").checked = Boolean(producto.active);
        document.getElementById("productoCaracteristicas").value = parsearCaracteristicas(producto.characteristics).join(", ");

        favoritoActual = Boolean(producto.favorite);
        imagenOriginal = producto.image || "";
        productoImagenUrl.value = imagenOriginal;
        if (imagenOriginal) {
            productoImagenPreview.src = imagenOriginal;
            productoImagenPreview.classList.remove("d-none");
        }

        modalProductoTitulo.innerHTML = '<i class="bi bi-pencil-fill me-2"></i> Editar producto';
        modalProducto.show();
    }

    async function eliminarProducto(producto) {
        const confirmacion = await Swal.fire({
            icon: "warning",
            title: "¿Eliminar producto?",
            text: `Vas a eliminar "${producto.name}". Esta acción no se puede deshacer.`,
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            await ProductsService.remove(producto.id);
            App.notify("Producto eliminado.", "info");
            cargarProductos();
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo eliminar el producto.", "error");
        }
    }

    btnNuevoProducto.addEventListener("click", limpiarFormulario);

    productoImagenTipo.addEventListener("change", () => {
        mostrarBloqueImagen(productoImagenTipo.value);
    });

    productoImagenUrl.addEventListener("input", () => {
        const url = productoImagenUrl.value.trim();
        if (url) {
            productoImagenPreview.src = url;
            productoImagenPreview.classList.remove("d-none");
        } else {
            productoImagenPreview.classList.add("d-none");
        }
    });

    productoImagenArchivo.addEventListener("change", () => {
        const archivo = productoImagenArchivo.files[0];
        if (!archivo) {
            archivoSeleccionado = null;
            return;
        }
        archivoSeleccionado = archivo;
        productoImagenArchivoTexto.textContent = archivo.name;
        productoImagenPreview.src = URL.createObjectURL(archivo);
        productoImagenPreview.classList.remove("d-none");
    });

    productoImagenPreview.addEventListener("error", () => {
        productoImagenPreview.classList.add("d-none");
    });

    formProducto.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const id = document.getElementById("productoId").value;
        const tipoImagen = productoImagenTipo.value;

        if (tipoImagen === "archivo" && !archivoSeleccionado && !imagenOriginal) {
            Swal.fire("Falta la imagen", "Selecciona un archivo para subir.", "warning");
            return;
        }

        const caracteristicasTexto = document.getElementById("productoCaracteristicas").value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

        const payload = {
            name: document.getElementById("productoNombre").value.trim(),
            description: document.getElementById("productoDescripcion").value.trim(),
            price: Number(document.getElementById("productoPrecio").value),
            stock: Number(document.getElementById("productoStock").value),
            active: document.getElementById("productoActivo").checked,
            categoryId: Number(document.getElementById("productoCategoria").value) || null,
            characteristics: JSON.stringify(caracteristicasTexto),
            image: tipoImagen === "url" ? productoImagenUrl.value.trim() : imagenOriginal,
            favorite: favoritoActual,
        };

        const boton = document.getElementById("btnGuardarProducto");
        boton.disabled = true;
        boton.textContent = archivoSeleccionado ? "Subiendo imagen..." : "Guardando...";

        try {
            let productoId = id;

            if (id) {
                await ProductsService.update(id, payload);
            } else {
                const creado = await ProductsService.create(payload);
                productoId = creado.id;
            }

            if (tipoImagen === "archivo" && archivoSeleccionado) {
                await ProductsService.uploadImagen(productoId, archivoSeleccionado);
            }

            App.notify(id ? "Producto actualizado." : "Producto creado.");
            modalProducto.hide();
            cargarProductos();
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo guardar el producto.", "error");
        } finally {
            boton.disabled = false;
            boton.textContent = "Guardar";
        }
    });

    cargarCategorias().then(cargarProductos);
});
