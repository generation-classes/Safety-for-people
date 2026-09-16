document.addEventListener("DOMContentLoaded", () => {
    if (!window.App || !App.isLoggedIn() || App.getRole() !== "admin") {
        window.location.href = "../Inicio/index.html";
        return;
    }

    const LIMITE_STOCK_BAJO = 5;

    function formatearPrecio(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CO") + " COP";
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
    }

    function badgeEstado(nombreEstado) {
        const mapa = {
            "pendiente": "bg-warning text-dark",
            "enviado": "bg-primary",
            "entregado": "bg-success",
            "pagado": "bg-success",
            "cancelado": "bg-secondary",
        };
        return mapa[String(nombreEstado || "").toLowerCase()] || "bg-secondary";
    }

    function pintarKpis({ ventasTotales, totalPedidos, unidadesEnInventario, totalUsuarios }) {
        document.getElementById("kpiVentas").textContent = formatearPrecio(ventasTotales);
        document.getElementById("kpiPedidos").textContent = totalPedidos;
        document.getElementById("kpiInventario").textContent = Number(unidadesEnInventario).toLocaleString("es-CO");
        document.getElementById("kpiUsuarios").textContent = Number(totalUsuarios).toLocaleString("es-CO");
    }

    function pintarPedidosRecientes(ventas, statusesPorId) {
        const lista = document.getElementById("pedidosRecientesList");

        const recientes = [...ventas]
            .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
            .slice(0, 6);

        if (!recientes.length) {
            lista.innerHTML = '<li class="list-group-item text-center text-muted">No hay pedidos aún</li>';
            return;
        }

        lista.innerHTML = recientes.map(venta => {
            const primerProducto = venta.details?.[0]?.productName || "Producto";
            const extra = (venta.details?.length || 0) > 1 ? ` +${venta.details.length - 1}` : "";
            const nombreEstado = statusesPorId.get(venta.statusId) || "Sin estado";
            return `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>#${venta.id}</strong> - ${primerProducto}${extra}
                        <br><small class="text-muted">${formatearFecha(venta.createdOn)}</small>
                    </div>
                    <span class="badge ${badgeEstado(nombreEstado)}">${nombreEstado}</span>
                </li>
            `;
        }).join("");
    }

    function pintarProductosMasVendidos(ventas, productosPorId) {
        const lista = document.getElementById("productosMasVendidosList");

        const cantidadPorProducto = new Map();
        ventas.forEach(venta => {
            (venta.details || []).forEach(detalle => {
                const actual = cantidadPorProducto.get(detalle.productId) || 0;
                cantidadPorProducto.set(detalle.productId, actual + Number(detalle.quantity || 0));
            });
        });

        const top5 = [...cantidadPorProducto.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        if (!top5.length) {
            lista.innerHTML = '<li class="mb-2 d-flex justify-content-between text-muted">Aún no hay ventas registradas</li>';
            return;
        }

        const colores = ["#D4AF37", "#A8A9AD", "#CD7F32", "#82C4C3", "#82C4C3"];
        lista.innerHTML = top5.map(([productId, cantidad], indice) => {
            const nombre = productosPorId.get(productId)?.name || `Producto #${productId}`;
            return `
                <li class="mb-2 d-flex justify-content-between">
                    <span class="d-flex align-items-center gap-1">
                        <i class="material-icons" style="font-size:18px; color:${colores[indice]}">emoji_events</i>
                        ${nombre}
                    </span>
                    <strong>${cantidad}</strong>
                </li>
            `;
        }).join("");
    }

    function pintarAlertasStockBajo(productos) {
        const lista = document.getElementById("alertasList");

        const stockBajo = productos
            .filter(producto => producto.active && Number(producto.stock) <= LIMITE_STOCK_BAJO)
            .sort((a, b) => Number(a.stock) - Number(b.stock));

        if (!stockBajo.length) {
            lista.innerHTML = `
                <div class="list-group-item border-0 px-0 d-flex align-items-center gap-2">
                    <i class="material-icons text-success" style="font-size:18px">check_circle</i>
                    Todo el inventario tiene stock saludable
                </div>
            `;
            return;
        }

        lista.innerHTML = stockBajo.map(producto => {
            const agotado = Number(producto.stock) === 0;
            return `
                <div class="list-group-item border-0 px-0 d-flex align-items-center gap-2">
                    <i class="material-icons" style="font-size:18px; color:${agotado ? "#d64545" : "#f59e0b"}">warning</i>
                    ${producto.name}: ${agotado ? "sin stock" : `solo ${producto.stock} unidades`}
                </div>
            `;
        }).join("");
    }

    function pintarGraficaVentas(ventas) {
        const canvas = document.getElementById("ventasChart");
        if (!canvas || typeof Chart === "undefined") return;

        const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const ventasPorDia = [0, 0, 0, 0, 0, 0, 0];

        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        const diaActual = hoy.getDay();
        const offsetLunes = diaActual === 0 ? 6 : diaActual - 1;
        inicioSemana.setDate(hoy.getDate() - offsetLunes);
        inicioSemana.setHours(0, 0, 0, 0);

        ventas.forEach(venta => {
            const fecha = new Date(venta.createdOn);
            if (fecha < inicioSemana) return;
            const dia = fecha.getDay();
            const posicion = dia === 0 ? 6 : dia - 1;
            ventasPorDia[posicion] += Number(venta.totalAmount || 0);
        });

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: dias,
                datasets: [{
                    label: "Ventas ($ COP) — esta semana",
                    data: ventasPorDia,
                    backgroundColor: "#006D77",
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                }
            }
        });
    }

    async function inicializar() {
        try {
            const [ventas, productos, usuarios, statuses] = await Promise.all([
                SalesService.getAll(),
                ProductsService.getAll(),
                UsersService.getAll(),
                StatusesService.getAll().catch(() => []),
            ]);

            const productosPorId = new Map(productos.map(p => [p.id, p]));
            const statusesPorId = new Map(statuses.map(s => [s.id, s.name]));

            const ventasActivas = ventas.filter(v => v.active !== false);

            pintarKpis({
                ventasTotales: ventasActivas.reduce((suma, v) => suma + Number(v.totalAmount || 0), 0),
                totalPedidos: ventasActivas.length,
                unidadesEnInventario: productos.reduce((suma, p) => suma + Number(p.stock || 0), 0),
                totalUsuarios: usuarios.length,
            });

            pintarPedidosRecientes(ventasActivas, statusesPorId);
            pintarProductosMasVendidos(ventasActivas, productosPorId);
            pintarAlertasStockBajo(productos);
            pintarGraficaVentas(ventasActivas);
        } catch (error) {
            console.error("Error cargando el dashboard:", error);
            App.notify("No se pudo cargar la información del dashboard.", "danger");
        }
    }

    inicializar();
});
