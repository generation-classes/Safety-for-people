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

// funcione de guardadr informacion del modal

const listaProductos = [];
const formulario = document.getElementById('formularioAgregarProducto');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombreProducto').value;
    const categoria = document.getElementById('categoriaProducto').value;
    const descripcion = document.getElementById('descripcionProducto').value;
    const precio = document.getElementById('precioRegular').value;
    const stock = document.getElementById('stockDisponible').value;
    
    const inputArchivo = document.getElementById('archivoProducto');
    const nombreArchivo = inputArchivo.files.length > 0 ? inputArchivo.files[0].name : "Sin archivo adjunto";

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        stock: parseInt(stock),
        archivo: nombreArchivo
    };

    listaProductos.push(nuevoProducto);

    console.log(JSON.stringify(listaProductos, null, 2));

    formulario.reset();
});