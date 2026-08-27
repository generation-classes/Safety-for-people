document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // PRODUCTOS BASE
    // =========================================================

    const productosBase = [

        {
            id: 1,
            nombre: "Pulsera GPS Femenino",
            categoria: "Pulseras GPS",
            descripcion: "Pulsera con GPS para mayor seguridad.",
            precio: 199900,
            stock: 25,
            imagen: "../../Assets/images/pulsera.png",
            caracteristicas: [
                "Botón de emergencia",
                "Resistencia al agua",
                "Ubicación en tiempo real",
                "Batería de larga duración"
            ]
        },

        {
            id: 2,
            nombre: "Audífonos GPS integrado",
            categoria: "Audífonos GPS",
            descripcion: "Audífonos inalámbricos con geolocalización.",
            precio: 399900,
            stock: 20,
            imagen: "../../Assets/images/audifono.png",
            caracteristicas: [
                "GPS integrado",
                "Conexión inalámbrica",
                "Ubicación en tiempo real",
                "Batería de larga duración"
            ]
        },

        {
            id: 3,
            nombre: "Reloj GPS Masculino",
            categoria: "Relojes GPS",
            descripcion: "Reloj inteligente con GPS integrado.",
            precio: 359900,
            stock: 15,
            imagen: "../../Assets/images/reloj.png",
            caracteristicas: [
                "GPS integrado",
                "Botón de emergencia",
                "Resistencia al agua",
                "Monitoreo de ubicación"
            ]
        },

        {
            id: 4,
            nombre: "Reloj GPS Niño",
            categoria: "Para niños",
            descripcion: "Reloj infantil con localización GPS.",
            precio: 199900,
            stock: 20,
            imagen: "../../Assets/images/relojnino.png",
            caracteristicas: [
                "GPS en tiempo real",
                "Botón de emergencia",
                "Diseño infantil",
                "Resistencia al agua"
            ]
        },

        {
            id: 5,
            nombre: "Pulsera GPS Niña",
            categoria: "Para niños",
            descripcion: "Pulsera infantil con GPS.",
            precio: 159900,
            stock: 25,
            imagen: "../../Assets/images/manillanina.png",
            caracteristicas: [
                "Ubicación en tiempo real",
                "Botón de emergencia",
                "Diseño infantil",
                "Batería de larga duración"
            ]
        },

        {
            id: 6,
            nombre: "Gafas de sol GPS",
            categoria: "GPS",
            descripcion: "Gafas de sol con sistema de localización.",
            precio: 199900,
            stock: 18,
            imagen: "../../Assets/images/gafas.png",
            caracteristicas: [
                "Sistema GPS",
                "Diseño discreto",
                "Ubicación en tiempo real",
                "Batería recargable"
            ]
        },

        {
            id: 7,
            nombre: "Arete GPS",
            categoria: "GPS",
            descripcion: "Aretes discretos con localización.",
            precio: 159900,
            stock: 20,
            imagen: "../../Assets/images/aretes.png",
            caracteristicas: [
                "Diseño discreto",
                "Ubicación en tiempo real",
                "Sistema GPS",
                "Batería de larga duración"
            ]
        },

        {
            id: 8,
            nombre: "Arete GPS Niña",
            categoria: "Para niños",
            descripcion: "Aretes infantiles con sistema de localización.",
            precio: 99900,
            stock: 15,
            imagen: "../../Assets/images/aretesniña.png",
            caracteristicas: [
                "GPS integrado",
                "Diseño infantil",
                "Ubicación en tiempo real",
                "Batería de larga duración"
            ]
        },

        {
            id: 9,
            nombre: "Llavero GPS Femenino",
            categoria: "GPS",
            descripcion: "Llavero discreto con rastreador GPS.",
            precio: 159900,
            stock: 30,
            imagen: "../../Assets/images/llavero.png",
            caracteristicas: [
                "Rastreador GPS",
                "Diseño discreto",
                "Ubicación en tiempo real",
                "Batería de larga duración"
            ]
        }

    ];


    // =========================================================
    // PRODUCTOS DEL ADMINISTRADOR
    // =========================================================

    function obtenerProductosAdministrador() {

        try {

            return JSON.parse(
                localStorage.getItem("productos")
            ) || [];

        } catch (error) {

            console.error(
                "Error al obtener productos:",
                error
            );

            return [];
        }
    }


    // =========================================================
    // GUARDAR PRODUCTOS
    // =========================================================

    function guardarProductosAdministrador(productos) {

        try {

            localStorage.setItem(
                "productos",
                JSON.stringify(productos)
            );

            return true;

        } catch (error) {

            console.error(
                "No se pudo guardar el producto:",
                error
            );

            return false;
        }
    }


    // =========================================================
    // COMPRIMIR IMAGEN
    // =========================================================

    function comprimirImagen(archivo) {

        return new Promise((resolve, reject) => {

            const lector = new FileReader();


            lector.onload = (evento) => {

                const imagen = new Image();


                imagen.onload = () => {

                    const canvas =
                        document.createElement("canvas");


                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 500;


                    let ancho =
                        imagen.width;

                    let alto =
                        imagen.height;


                    if (
                        ancho > MAX_WIDTH ||
                        alto > MAX_HEIGHT
                    ) {

                        const proporcion =
                            Math.min(
                                MAX_WIDTH / ancho,
                                MAX_HEIGHT / alto
                            );


                        ancho =
                            Math.round(
                                ancho * proporcion
                            );


                        alto =
                            Math.round(
                                alto * proporcion
                            );

                    }


                    canvas.width =
                        ancho;

                    canvas.height =
                        alto;


                    const contexto =
                        canvas.getContext("2d");


                    contexto.drawImage(
                        imagen,
                        0,
                        0,
                        ancho,
                        alto
                    );


                    const imagenComprimida =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.55
                        );


                    resolve(
                        imagenComprimida
                    );

                };


                imagen.onerror = () => {

                    reject(
                        new Error(
                            "No se pudo procesar la imagen."
                        )
                    );

                };


                imagen.src =
                    evento.target.result;

            };


            lector.onerror = () => {

                reject(
                    new Error(
                        "No se pudo leer la imagen."
                    )
                );

            };


            lector.readAsDataURL(archivo);

        });
    }


    // =========================================================
    // FORMULARIO DEL ADMINISTRADOR
    // =========================================================

    const formulario =
        document.getElementById(
            "formularioAgregarProducto"
        );


    if (formulario) {

        formulario.addEventListener(
            "submit",
            async (evento) => {

                evento.preventDefault();


                const nombre =
                    document
                        .getElementById("nombreProducto")
                        ?.value
                        .trim();


                const categoria =
                    document
                        .getElementById("categoriaProducto")
                        ?.value
                        .trim();


                const descripcion =
                    document
                        .getElementById("descripcionProducto")
                        ?.value
                        .trim();


                const precio =
                    document
                        .getElementById("precioRegular")
                        ?.value
                        .trim();


                const stock =
                    document
                        .getElementById("stockDisponible")
                        ?.value
                        .trim();


                const archivo =
                    document.getElementById(
                        "archivoProducto"
                    );


                // =================================================
                // VALIDACIONES
                // =================================================

                if (!nombre) {

                    mostrarMensaje(
                        "Campo obligatorio",
                        "Ingresa el nombre del producto",
                        "error"
                    );

                    return;
                }


                if (!categoria) {

                    mostrarMensaje(
                        "Campo obligatorio",
                        "Ingresa la categoría",
                        "error"
                    );

                    return;
                }


                if (!descripcion) {

                    mostrarMensaje(
                        "Campo obligatorio",
                        "Ingresa una descripción",
                        "error"
                    );

                    return;
                }


                if (!precio || Number(precio) <= 0) {

                    mostrarMensaje(
                        "Precio inválido",
                        "Ingresa un precio válido",
                        "error"
                    );

                    return;
                }


                if (!stock || Number(stock) < 0) {

                    mostrarMensaje(
                        "Stock inválido",
                        "Ingresa un stock válido",
                        "error"
                    );

                    return;
                }


                if (
                    !archivo ||
                    archivo.files.length === 0
                ) {

                    mostrarMensaje(
                        "Campo obligatorio",
                        "Selecciona una imagen",
                        "error"
                    );

                    return;
                }


                const imagenArchivo =
                    archivo.files[0];


                if (
                    !imagenArchivo.type.startsWith(
                        "image/"
                    )
                ) {

                    mostrarMensaje(
                        "Archivo no válido",
                        "Selecciona una imagen válida",
                        "error"
                    );

                    return;
                }


                // =================================================
                // MOSTRAR CARGANDO
                // =================================================

                const botonGuardar =
                    document.getElementById(
                        "btnGuardarProducto"
                    );


                if (botonGuardar) {

                    botonGuardar.disabled =
                        true;

                    botonGuardar.textContent =
                        "Guardando...";

                }


                try {

                    // =================================================
                    // COMPRIMIR IMAGEN
                    // =================================================

                    const imagen =
                        await comprimirImagen(
                            imagenArchivo
                        );


                    // =================================================
                    // CREAR PRODUCTO
                    // =================================================

                    const productoNuevo = {

                        id: Date.now(),

                        nombre:
                            nombre,

                        categoria:
                            categoria,

                        descripcion:
                            descripcion,

                        precio:
                            Number(precio),

                        stock:
                            Number(stock),

                        imagen:
                            imagen,

                        caracteristicas: [
                            "Botón de emergencia",
                            "Ubicación en tiempo real",
                            "Batería de larga duración",
                            "Diseño seguro"
                        ]

                    };


                    // =================================================
                    // OBTENER PRODUCTOS
                    // =================================================

                    const productos =
                        obtenerProductosAdministrador();


                    productos.push(
                        productoNuevo
                    );


                    // =================================================
                    // GUARDAR
                    // =================================================

                    const guardado =
                        guardarProductosAdministrador(
                            productos
                        );


                    if (!guardado) {

                        mostrarMensaje(
                            "No se pudo guardar",
                            "El almacenamiento del navegador está lleno. Elimina productos de prueba y vuelve a intentarlo.",
                            "error"
                        );

                        return;
                    }


                    // =================================================
                    // ANALÍTICA
                    // =================================================

                    registrarEventoAnalitica(
                        "createProduct",
                        productoNuevo
                    );


                    // =================================================
                    // ÉXITO
                    // =================================================

                    mostrarMensaje(
                        "Producto agregado",
                        "El producto fue creado correctamente.",
                        "success"
                    );


                    formulario.reset();


                    // =================================================
                    // CERRAR MODAL
                    // =================================================

                    const modal =
                        document.getElementById(
                            "modalAgregarProducto"
                        );


                    if (
                        modal &&
                        typeof bootstrap !== "undefined"
                    ) {

                        const instancia =
                            bootstrap.Modal.getInstance(
                                modal
                            );


                        if (instancia) {

                            instancia.hide();

                        }

                    }


                } catch (error) {

                    console.error(
                        "Error creando producto:",
                        error
                    );


                    mostrarMensaje(
                        "Error",
                        "No fue posible guardar el producto.",
                        "error"
                    );

                } finally {

                    if (botonGuardar) {

                        botonGuardar.disabled =
                            false;

                        botonGuardar.textContent =
                            "Guardar";

                    }

                }

            }
        );

    }


    // =========================================================
    // PÁGINA DE PRODUCTOS
    // =========================================================

    const contenedorProductos =
        document.querySelector(
            ".productos-grid"
        );


    if (contenedorProductos) {

        configurarProductosExistentes();

        agregarProductosAdministrador();

        actualizarCantidadProductos();

    }


    // =========================================================
    // PRODUCTOS EXISTENTES
    // =========================================================

    function configurarProductosExistentes() {

        const tarjetas =
            document.querySelectorAll(
                ".producto-card"
            );


        tarjetas.forEach(
            (tarjeta) => {

                const id =
                    tarjeta.dataset.productoId;


                if (!id) {

                    return;

                }


                tarjeta.style.cursor =
                    "pointer";


                tarjeta.addEventListener(
                    "click",
                    (evento) => {

                        if (
                            evento.target.closest(
                                "button"
                            )
                        ) {

                            return;

                        }


                        window.location.href =
                            `detalle.html?id=${id}`;

                    }
                );

            }
        );

    }


    // =========================================================
    // PRODUCTOS CREADOS POR ADMINISTRADOR
    // =========================================================

    function agregarProductosAdministrador() {

        const productos =
            obtenerProductosAdministrador();


        productos.forEach(
            (producto) => {

                crearTarjetaProducto(
                    producto
                );

            }
        );

    }


    // =========================================================
    // CREAR TARJETA
    // =========================================================

    function crearTarjetaProducto(producto) {

        const tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.classList.add(
            "producto-card"
        );


        tarjeta.dataset.productoId =
            producto.id;


        const contenedorImagen =
            document.createElement(
                "div"
            );


        contenedorImagen.classList.add(
            "producto-imagen"
        );


        const imagen =
            document.createElement(
                "img"
            );


        imagen.src =
            producto.imagen;


        imagen.alt =
            producto.nombre;


        contenedorImagen.appendChild(
            imagen
        );


        const informacion =
            document.createElement(
                "div"
            );


        informacion.classList.add(
            "producto-info"
        );


        const titulo =
            document.createElement(
                "h3"
            );


        titulo.textContent =
            producto.nombre;


        const descripcion =
            document.createElement(
                "p"
            );


        descripcion.textContent =
            producto.descripcion;


        const footer =
            document.createElement(
                "div"
            );


        footer.classList.add(
            "producto-footer"
        );


        const precio =
            document.createElement(
                "span"
            );


        precio.classList.add(
            "producto-precio"
        );


        precio.textContent =
            `$${Number(
                producto.precio
            ).toLocaleString(
                "es-CO"
            )} COP`;


        const boton =
            document.createElement(
                "button"
            );


        boton.type =
            "button";


        boton.setAttribute(
            "aria-label",
            "Agregar al carrito"
        );


        boton.innerHTML =
            `<i class="bi bi-cart3"></i>`;


        footer.appendChild(
            precio
        );


        footer.appendChild(
            boton
        );


        informacion.appendChild(
            titulo
        );


        informacion.appendChild(
            descripcion
        );


        informacion.appendChild(
            footer
        );


        tarjeta.appendChild(
            contenedorImagen
        );


        tarjeta.appendChild(
            informacion
        );


        contenedorProductos.appendChild(
            tarjeta
        );


        tarjeta.addEventListener(
            "click",
            (evento) => {

                if (
                    evento.target.closest(
                        "button"
                    )
                ) {

                    return;

                }


                window.location.href =
                    `detalle.html?id=${producto.id}`;

            }
        );

    }


    // =========================================================
    // CANTIDAD DE PRODUCTOS
    // =========================================================

    function actualizarCantidadProductos() {

        const elemento =
            document.getElementById(
                "cantidadProductos"
            );


        if (!elemento) {

            return;

        }


        const productosAdmin =
            obtenerProductosAdministrador();


        const total =
            productosBase.length +
            productosAdmin.length;


        elemento.textContent =
            `Mostrando ${total} productos`;

    }


    // =========================================================
    // DETALLE DEL PRODUCTO
    // =========================================================

    const elementoNombre =
        document.getElementById(
            "nombreProducto"
        );


    if (
        elementoNombre &&
        window.location.pathname.includes(
            "detalle.html"
        )
    ) {

        cargarDetalleProducto();

    }


    // =========================================================
    // CARGAR DETALLE SEGÚN ID
    // =========================================================

    function cargarDetalleProducto() {

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const id =
            parametros.get("id");


        if (!id) {

            mostrarProductoNoEncontrado();

            return;

        }


        let producto =
            productosBase.find(
                (item) =>
                    String(item.id) ===
                    String(id)
            );


        if (!producto) {

            const productosAdmin =
                obtenerProductosAdministrador();


            producto =
                productosAdmin.find(
                    (item) =>
                        String(item.id) ===
                        String(id)
                );

        }


        if (!producto) {

            mostrarProductoNoEncontrado();

            return;

        }


        // =====================================================
        // REGISTRAR VISUALIZACIÓN
        // =====================================================

        registrarEventoAnalitica(
            "viewProduct",
            producto
        );


        const imagen =
            document.getElementById(
                "imagenProducto"
            );


        const categoria =
            document.getElementById(
                "categoriaProducto"
            );


        const nombre =
            document.getElementById(
                "nombreProducto"
            );


        const precio =
            document.getElementById(
                "precioProducto"
            );


        const descripcion =
            document.getElementById(
                "descripcionProducto"
            );


        const stock =
            document.getElementById(
                "stockProducto"
            );


        const breadcrumb =
            document.getElementById(
                "breadcrumbProducto"
            );


        const caracteristicas =
            document.getElementById(
                "caracteristicasProducto"
            );


        if (imagen) {

            imagen.src =
                producto.imagen;

            imagen.alt =
                producto.nombre;

        }


        if (categoria) {

            categoria.innerHTML =
                `
                <i class="bi bi-tag-fill"></i>
                ${producto.categoria}
                `;

        }


        if (nombre) {

            nombre.textContent =
                producto.nombre;

        }


        if (precio) {

            precio.textContent =
                `$${Number(
                    producto.precio
                ).toLocaleString(
                    "es-CO"
                )} COP`;

        }


        if (descripcion) {

            descripcion.textContent =
                producto.descripcion;

        }


        if (stock) {

            if (
                Number(producto.stock) > 0
            ) {

                stock.classList.remove(
                    "agotado"
                );


                stock.classList.add(
                    "disponible"
                );


                stock.innerHTML =
                    `
                    <i class="bi bi-check-circle-fill"></i>
                    Stock disponible: ${producto.stock} unidades
                    `;

            } else {

                stock.classList.remove(
                    "disponible"
                );


                stock.classList.add(
                    "agotado"
                );


                stock.innerHTML =
                    `
                    <i class="bi bi-x-circle-fill"></i>
                    Producto agotado
                    `;

            }

        }


        if (caracteristicas) {

            caracteristicas.innerHTML =
                "";


            if (
                Array.isArray(
                    producto.caracteristicas
                )
            ) {

                producto.caracteristicas.forEach(
                    (caracteristica) => {

                        const li =
                            document.createElement(
                                "li"
                            );


                        li.innerHTML =
                            `
                            <i class="bi bi-check2"></i>
                            ${caracteristica}
                            `;


                        caracteristicas.appendChild(
                            li
                        );

                    }
                );

            }

        }


        if (breadcrumb) {

            breadcrumb.textContent =
                producto.nombre;

        }


        document.title =
            `${producto.nombre} | SAPE`;

    }


    // =========================================================
    // CARRITO
    // =========================================================

    const botonCarrito =
        document.getElementById(
            "btnAgregarCarrito"
        );


    if (botonCarrito) {

        botonCarrito.addEventListener(
            "click",
            () => {

                const parametros =
                    new URLSearchParams(
                        window.location.search
                    );


                const id =
                    parametros.get("id");


                if (!id) {

                    return;

                }


                let producto =
                    productosBase.find(
                        (item) =>
                            String(item.id) ===
                            String(id)
                    );


                if (!producto) {

                    const productosAdmin =
                        obtenerProductosAdministrador();


                    producto =
                        productosAdmin.find(
                            (item) =>
                                String(item.id) ===
                                String(id)
                        );

                }


                if (!producto) {

                    return;

                }


                const cantidad =
                    Number(
                        document.getElementById(
                            "cantidadProducto"
                        )?.value || 1
                    );


                registrarEventoAnalitica(
                    "addToCart",
                    producto,
                    cantidad
                );


                mostrarMensaje(
                    "Producto agregado",
                    `${producto.nombre} fue agregado al carrito`,
                    "success"
                );

            }
        );

    }


    // =========================================================
    // CANTIDAD
    // =========================================================

    const btnAumentar =
        document.getElementById(
            "btnAumentar"
        );


    const btnDisminuir =
        document.getElementById(
            "btnDisminuir"
        );


    const cantidadInput =
        document.getElementById(
            "cantidadProducto"
        );


    if (
        btnAumentar &&
        cantidadInput
    ) {

        btnAumentar.addEventListener(
            "click",
            () => {

                let cantidad =
                    Number(
                        cantidadInput.value
                    );


                cantidad++;


                cantidadInput.value =
                    cantidad;

            }
        );

    }


    if (
        btnDisminuir &&
        cantidadInput
    ) {

        btnDisminuir.addEventListener(
            "click",
            () => {

                let cantidad =
                    Number(
                        cantidadInput.value
                    );


                if (cantidad > 1) {

                    cantidad--;

                }


                cantidadInput.value =
                    cantidad;

            }
        );

    }


    // =========================================================
    // PRODUCTO NO ENCONTRADO
    // =========================================================

    function mostrarProductoNoEncontrado() {

        const contenido =
            document.querySelector(
                ".detalle-contenido"
            );


        if (!contenido) {

            return;

        }


        contenido.innerHTML =
            `
            <div class="alert alert-danger text-center">

                <h4>
                    Producto no encontrado
                </h4>

                <p>
                    El producto que estás buscando
                    no existe o ya no está disponible.
                </p>

                <a
                    href="index.html"
                    class="btn btn-primary"
                >
                    Volver a productos
                </a>

            </div>
            `;

    }


    // =========================================================
    // MENSAJES
    // =========================================================

    function mostrarMensaje(
        titulo,
        mensaje,
        tipo
    ) {

        if (
            typeof Swal !== "undefined"
        ) {

            Swal.fire(
                titulo,
                mensaje,
                tipo
            );

        } else {

            alert(
                `${titulo}\n${mensaje}`
            );

        }

    }


    // =========================================================
    // ANALÍTICA
    // =========================================================

    function registrarEventoAnalitica(
        tipoEvento,
        producto,
        cantidad = 1
    ) {

        if (!producto) {

            return;

        }


        try {

            let eventos =
                JSON.parse(
                    localStorage.getItem(
                        "analiticaProductos"
                    )
                ) || [];


            const nuevoEvento = {

                id:
                    Date.now() +
                    Math.random(),

                evento:
                    tipoEvento,

                productoId:
                    producto.id,

                producto:
                    producto.nombre,

                categoria:
                    producto.categoria,

                precio:
                    producto.precio,

                cantidad:
                    cantidad,

                fecha:
                    new Date().toISOString()

            };


            eventos.push(
                nuevoEvento
            );


            // Evita que la analítica crezca
            // indefinidamente

            if (eventos.length > 500) {

                eventos =
                    eventos.slice(-500);

            }


            localStorage.setItem(
                "analiticaProductos",
                JSON.stringify(eventos)
            );


        } catch (error) {

            console.error(
                "Error guardando analítica:",
                error
            );

        }

    }


    // =========================================================
    // OBTENER ANALÍTICA
    // =========================================================

    function obtenerAnalitica() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "analiticaProductos"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // =========================================================
    // RESUMEN
    // =========================================================

    function obtenerResumenAnalitica() {

        const eventos =
            obtenerAnalitica();


        const resumen = {

            totalEventos:
                eventos.length,

            visualizaciones:
                0,

            agregadosCarrito:
                0,

            productosCreados:
                0

        };


        eventos.forEach(
            (evento) => {

                if (
                    evento.evento ===
                    "viewProduct"
                ) {

                    resumen.visualizaciones++;

                }


                if (
                    evento.evento ===
                    "addToCart"
                ) {

                    resumen.agregadosCarrito++;

                }


                if (
                    evento.evento ===
                    "createProduct"
                ) {

                    resumen.productosCreados++;

                }

            }
        );


        return resumen;

    }


    // =========================================================
    // PRODUCTOS MÁS VISTOS
    // =========================================================

    function obtenerProductosMasVistos() {

        const eventos =
            obtenerAnalitica();


        const productos = {};


        eventos.forEach(
            (evento) => {

                if (
                    evento.evento !==
                    "viewProduct"
                ) {

                    return;

                }


                const id =
                    evento.productoId;


                if (
                    !productos[id]
                ) {

                    productos[id] = {

                        id:
                            id,

                        nombre:
                            evento.producto,

                        visitas:
                            0

                    };

                }


                productos[id].visitas++;

            }
        );


        return Object.values(
            productos
        ).sort(
            (a, b) =>
                b.visitas -
                a.visitas
        );

    }


    // =========================================================
    // PRODUCTOS MÁS AGREGADOS
    // =========================================================

    function obtenerProductosMasAgregados() {

        const eventos =
            obtenerAnalitica();


        const productos = {};


        eventos.forEach(
            (evento) => {

                if (
                    evento.evento !==
                    "addToCart"
                ) {

                    return;

                }


                const id =
                    evento.productoId;


                if (
                    !productos[id]
                ) {

                    productos[id] = {

                        id:
                            id,

                        nombre:
                            evento.producto,

                        cantidad:
                            0

                    };

                }


                productos[id].cantidad +=
                    Number(
                        evento.cantidad || 1
                    );

            }
        );


        return Object.values(
            productos
        ).sort(
            (a, b) =>
                b.cantidad -
                a.cantidad
        );

    }


    // =========================================================
    // DASHBOARD - GRÁFICA
    // =========================================================

    const ventasChartCanvas =
        document.getElementById(
            "ventasChart"
        );


    if (
        ventasChartCanvas &&
        typeof Chart !== "undefined"
    ) {

        const eventos =
            obtenerAnalitica();


        // =====================================================
        // CREAR LOS 7 DÍAS
        // =====================================================

        const dias = [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ];


        const ventasPorDia = [
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ];


        // =====================================================
        // CONTAR AGREGADOS AL CARRITO
        // =====================================================

        eventos.forEach(
            (evento) => {

                if (
                    evento.evento !==
                    "addToCart"
                ) {

                    return;

                }


                const fecha =
                    new Date(
                        evento.fecha
                    );


                const dia =
                    fecha.getDay();


                const posicion =
                    dia === 0
                        ? 6
                        : dia - 1;


                ventasPorDia[posicion] +=
                    Number(
                        evento.cantidad || 1
                    );

            }
        );


        // =====================================================
        // CREAR GRÁFICA
        // =====================================================

        new Chart(
            ventasChartCanvas,
            {

                type: "bar",

                data: {

                    labels:
                        dias,

                    datasets: [

                        {

                            label:
                                "Número de ventas",

                            data:
                                ventasPorDia,

                            backgroundColor:
                                "#006D77",

                            borderRadius:
                                8,

                            borderSkipped:
                                false

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            display:
                                true

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            }

                        }

                    }

                }

            }
        );

    }


    // =========================================================
    // EXPONER ANALÍTICA
    // =========================================================

    window.analiticaProductos = {

        obtenerEventos:
            obtenerAnalitica,

        obtenerResumen:
            obtenerResumenAnalitica,

        productosMasVistos:
            obtenerProductosMasVistos,

        productosMasAgregados:
            obtenerProductosMasAgregados

    };

});