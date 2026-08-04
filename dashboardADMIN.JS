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