document.addEventListener("DOMContentLoaded", () => {

    const ventasChartCanvas = document.getElementById("ventasChart");

    if (ventasChartCanvas) {

        new Chart(ventasChartCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Lun",
                    "Mar",
                    "Mié",
                    "Jue",
                    "Vie",
                    "Sáb",
                    "Dom"
                ],

                datasets: [
                    {
                        label: "Ventas",

                        data: [
                            125,
                            190,
                            160,
                            240,
                            210,
                            275,
                            180
                        ],

                        backgroundColor: "#2563eb",

                        borderRadius: 8,

                        borderSkipped: false
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor: "#1e293b",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff"

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        }

                    },

                    y: {

                        beginAtZero: true,

                        grid: {

                            color: "#e5e7eb"

                        }

                    }

                }

            }

        });

    }

});

// Guarda el producto del formulario

const listaProductos = [];
const formulario = document.getElementById('formularioAgregarProducto');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombreProducto').value.trim();
    const categoria = document.getElementById('categoriaProducto').value.trim();
    const descripcion = document.getElementById('descripcionProducto').value.trim();
    const precio = document.getElementById('precioRegular').value.trim();
    const stock = document.getElementById('stockDisponible').value.trim();

    const inputArchivo = document.getElementById('archivoProducto');

    const nombreArchivo = inputArchivo.files.length > 0
        ? inputArchivo.files[0].name
        : "Sin archivo adjunto";

    // Valida el nombre
    if (nombre === "") {
        Swal.fire("Campo obligatorio", "Ingresa el nombre del producto", "error");
        console.error("Error: falta el nombre del producto");
        return;
    }

    // Valida la categoría
    if (categoria === "") {
        Swal.fire("Campo obligatorio", "Selecciona una categoría", "error");
        console.error("Error: falta la categoría");
        return;
    }

    // Valida la descripción
    if (descripcion === "") {
        Swal.fire("Campo obligatorio", "Ingresa una descripción", "error");
        console.error("Error: falta la descripción");
        return;
    }

    // Valida el precio
    if (precio === "") {
        Swal.fire("Campo obligatorio", "Ingresa el precio regular", "error");
        console.error("Error: falta el precio");
        return;
    }

    // Valida el stock
    if (stock === "") {
        Swal.fire("Campo obligatorio", "Ingresa el stock disponible", "error");
        console.error("Error: falta el stock");
        return;
    }



        const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: Number(precio),
        stock: Number(stock),
        archivo: nombreArchivo
    };


    listaProductos.push(nuevoProducto);

    console.log("Producto agregado correctamente:");
    console.log(nuevoProducto);

    console.log("Lista de productos:");
    console.log(JSON.stringify(listaProductos, null, 2));


    Swal.fire(
        "Producto agregado",
        "El producto se agregó correctamente",
        "success"
    );

    formulario.reset();
});

