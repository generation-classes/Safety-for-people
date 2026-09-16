document.addEventListener("DOMContentLoaded", () => {

    const validarAccesoAdmin = () => {
        if (!window.App || !App.isLoggedIn() || App.getRole() !== "admin") {
            window.location.href = "../Inicio/index.html";
            return false;
        }
        return true;
    };

    if (!validarAccesoAdmin()) return;

    const API_BASE = 'http://localhost:8080/api';

    function obtenerToken() {
        return localStorage.getItem('sape_token') || '';
    }

    function obtenerHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        const token = obtenerToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    function obtenerUserIdDesdeToken() {
        const token = obtenerToken();
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const normalizado = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = JSON.parse(decodeURIComponent(atob(normalizado).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')));
            return json.userId || json.userid || null;
        } catch (error) {
            console.error('Error decodificando el token:', error);
            return null;
        }
    }

    // =========================================================
    // FUNCIONES DE CONEXIÓN AL BACKEND
    // =========================================================

    async function fetchFromBackend(endpoint) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'GET',
                headers: obtenerHeaders()
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    }

    async function postToBackend(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: obtenerHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error posting ${endpoint}:`, error);
            return null;
        }
    }

    // =========================================================
    // SIMULAR COMPRA (SEEDING DE VENTAS EN EL BACKEND)
    // =========================================================

    async function simularCompra() {
        const products = [
            { id: 1, nombre: "Pulsera GPS Femenino", precio: 199900 },
            { id: 2, nombre: "Audífonos GPS integrado", precio: 399900 },
            { id: 3, nombre: "Reloj GPS Masculino", precio: 359900 },
            { id: 4, nombre: "Reloj GPS Niño", precio: 199900 },
            { id: 5, nombre: "Pulsera GPS Niña", precio: 159900 },
            { id: 6, nombre: "Gafas de sol GPS", precio: 199900 },
            { id: 7, nombre: "Arete GPS", precio: 159900 },
            { id: 8, nombre: "Arete GPS Niña", precio: 99900 },
            { id: 9, nombre: "Llavero GPS Femenino", precio: 159900 }
        ];

        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomQuantity = Math.floor(Math.random() * 3) + 1;
        const randomStatus = ['Pendiente', 'Enviado', 'Entregado', 'Pagado'][Math.floor(Math.random() * 4)];

        const statusResponse = await fetchFromBackend('/statuses');
        if (!statusResponse) {
            console.error('No se pudieron cargar los estados');
            return;
        }
        const statusObj = statusResponse.find(s => s.name === randomStatus);
        if (!statusObj) {
            console.error('Estado no encontrado:', randomStatus);
            return;
        }

        const saleData = {
            quantity: randomQuantity,
            totalAmount: randomProduct.precio * randomQuantity,
            active: true,
            statusId: statusObj.id,
            userId: obtenerUserIdDesdeToken(),
            items: [
                {
                    productId: randomProduct.id,
                    quantity: randomQuantity
                }
            ]
        };

        const result = await postToBackend('/sales', saleData);
        if (result) {
            console.log('Venta simulada creada:', result);
            cargarDatosDashboard();
            if (typeof window.App !== 'undefined') {
                window.App.notify(`Venta #${result.id} simulada (${randomProduct.nombre} x${randomQuantity})`, 'success');
            }
        } else {
            console.error('Error al crear la venta simulada');
        }
    }

    // =========================================================
    // CARGAR Y MOSTRAR KPIs DEL DASHBOARD
    // =========================================================

    async function cargarKPIs() {
        const summary = await fetchFromBackend('/dashboard/summary');
        if (!summary) return;

        const ventasEl = document.getElementById('kpiVentas');
        const pedidosEl = document.getElementById('kpiPedidos');
        const inventarioEl = document.getElementById('kpiInventario');
        const usuariosEl = document.getElementById('kpiUsuarios');

        if (ventasEl) {
            const ventasTotales = summary.ventasTotales || 0;
            ventasEl.textContent = `$${Number(ventasTotales).toLocaleString("es-CO")} COP`;
        }

        if (pedidosEl) {
            pedidosEl.textContent = summary.totalPedidos || 0;
        }

        if (inventarioEl) {
            inventarioEl.textContent = summary.productosEnInventario || summary.totalProductos || 0;
        }

        if (usuariosEl) {
            usuariosEl.textContent = summary.totalUsuarios || 0;
        }
    }

    // =========================================================
    // CARGAR PEDIDOS RECIENTES
    // =========================================================

    async function cargarPedidosRecientes() {
        const orders = await fetchFromBackend('/dashboard/pedidos-recientes');
        if (!orders) return;

        const list = document.getElementById('pedidosRecientesList');
        if (!list) return;

        if (orders.length === 0) {
            list.innerHTML = '<li class="list-group-item text-center text-muted">No hay pedidos aún</li>';
            return;
        }

        list.innerHTML = orders.map(order => {
            const badgeClass = obtenerBadgeEstado(order.estado);
            return `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${order.pedido}</strong> - ${order.producto || 'Producto'}
                        <br><small class="text-muted">${order.fecha ? order.fecha.substring(0, 10) : 'Fecha'}</small>
                    </div>
                    <span class="badge ${badgeClass}">${order.estado}</span>
                </li>
            `;
        }).join('');
    }

    function obtenerBadgeEstado(estado) {
        const map = {
            'Entregado': 'bg-success',
            'Enviado': 'bg-primary',
            'Pendiente': 'bg-warning text-dark',
            'Pagado': 'bg-success',
            'Cancelado': 'bg-secondary'
        };
        return map[estado] || 'bg-secondary';
    }

    // =========================================================
    // CARGAR PRODUCTOS MÁS VENDIDOS
    // =========================================================

    async function cargarProductosMasVendidos() {
        const bestSellers = await fetchFromBackend('/dashboard/productos-mas-vendidos');
        if (!bestSellers) return;

        const list = document.getElementById('productosMasVendidosList');
        if (!list) return;

        if (bestSellers.length === 0) {
            list.innerHTML = '<li class="mb-2 d-flex justify-content-between text-muted">Sin datos aún</li>';
            return;
        }

        list.innerHTML = bestSellers.map((item, index) => {
            const emoji = ['🥇', '🥈', '🥉', '⭐', '🏅'][index] || '⭐';
            const color = index === 0 ? '#D4AF37' : index === 1 ? '#A8A9AD' : '#CD7F32';
            return `
                <li class="mb-2 d-flex justify-content-between">
                    <span class="d-flex align-items-center gap-1">
                        <i class="material-icons" style="font-size:18px; color:${color}">${emoji}</i>
                        ${item.nombre}
                    </span>
                    <strong>${item.cantidadVendida}</strong>
                </li>
            `;
        }).join('');
    }

    // =========================================================
    // CARGAR ALERTAS
    // =========================================================

    async function cargarAlertas() {
        const stats = await fetchFromBackend('/dashboard/estadisticas');
        if (!stats) return;

        const list = document.getElementById('alertasList');
        if (!list) return;

        const alertas = [];

        const pendientes = stats.pedidosPendientes || 0;
        const enviados = stats.pedidosEnviados || 0;
        const entregados = stats.pedidosEntregados || 0;

        if (pendientes > 0) {
            alertas.push(`<i class="material-icons" style="font-size:18px; color:#f59e0b">schedule</i> ${pendientes} pedidos pendientes por despachar`);
        }
        if (enviados > 0) {
            alertas.push(`<i class="material-icons" style="font-size:18px; color:#3b82f6">local_shipping</i> ${enviados} pedidos en camino`);
        }
        alertas.push(`<i class="material-icons" style="font-size:18px; color:#10b981">group</i> ${stats.totalUsuarios || 0} usuarios registrados`);

        const ingresoTotal = stats.ingresoTotal || 0;
        alertas.push(`<i class="material-icons" style="font-size:18px; color:#8b5cf6">payments</i> Ingreso total: $${Number(ingresoTotal).toLocaleString("es-CO")} COP`);

        list.innerHTML = alertas.map(a => `
            <div class="list-group-item border-0 px-0 d-flex align-items-center gap-2">${a}</div>
        `).join('');
    }

    // =========================================================
    // GRÁFICA DE VENTAS CON CHART.JS
    // =========================================================

    async function cargarGraficaVentas() {
        const stats = await fetchFromBackend('/dashboard/estadisticas');
        if (!stats) return;

        const canvas = document.getElementById('ventasChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const ventasPorDia = [0, 0, 0, 0, 0, 0, 0];

        const ventasData = await fetchFromBackend('/dashboard/pedidos-recientes');
        if (ventasData) {
            ventasData.forEach(order => {
                if (order.fecha) {
                    const fecha = new Date(order.fecha);
                    const dia = fecha.getDay();
                    const posicion = dia === 0 ? 6 : dia - 1;
                    const monto = Number(order.total) || 0;
                    ventasPorDia[posicion] += monto;
                }
            });
        }

        new Chart(canvas, {
            type: "bar",
            data: {
                labels: dias,
                datasets: [{
                    label: "Ventas ($ COP)",
                    data: ventasPorDia,
                    backgroundColor: "#006D77",
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                }
            }
        });
    }

    // =========================================================
    // DATOS SIMULADOS (FALLBACK si el backend no está disponible)
    // =========================================================

    function usarDatosSimulados() {
        const kpiVentas = document.getElementById('kpiVentas');
        const kpiPedidos = document.getElementById('kpiPedidos');
        const kpiInventario = document.getElementById('kpiInventario');
        const kpiUsuarios = document.getElementById('kpiUsuarios');

        if (kpiVentas) kpiVentas.textContent = '$18.540.000 COP';
        if (kpiPedidos) kpiPedidos.textContent = '325';
        if (kpiInventario) kpiInventario.textContent = '1.254';
        if (kpiUsuarios) kpiUsuarios.textContent = '842';

        const pedidosList = document.getElementById('pedidosRecientesList');
        if (pedidosList) {
            const pedidos = [
                { pedido: '#001', producto: 'Pulsera GPS', estado: 'Entregado', fecha: '2026-09-10' },
                { pedido: '#002', producto: 'Reloj GPS', estado: 'Enviado', fecha: '2026-09-09' },
                { pedido: '#003', producto: 'Audífonos GPS', estado: 'Pendiente', fecha: '2026-09-08' },
                { pedido: '#004', producto: 'Gafas GPS', estado: 'Pagado', fecha: '2026-09-07' },
                { pedido: '#005', producto: 'Arete GPS', estado: 'Entregado', fecha: '2026-09-06' },
            ];
            pedidosList.innerHTML = pedidos.map(p => `
                <li class="list-group-item d-flex justify-content-between">
                    <div><strong>${p.pedido}</strong> - ${p.producto}<br><small class="text-muted">${p.fecha}</small></div>
                    <span class="badge ${obtenerBadgeEstado(p.estado)}">${p.estado}</span>
                </li>
            `).join('');
        }
    }

    // =========================================================
    // BOTÓN DE SIMULAR COMPRA
    // =========================================================

    function agregarBotonSimularCompra() {
        const botonExistente = document.getElementById('btnSimularVenta');
        if (botonExistente) return;

        const container = document.querySelector('.welcome-admin');
        if (!container) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'btnSimularVenta';
        btn.className = 'btn btn-sm shadow-sm ms-2';
        btn.style.cssText = 'background-color: #E63946; color: white; border-radius: 10px;';
        btn.innerHTML = '<i class="bi bi-lightning-fill me-1"></i> Simular Venta';
        btn.addEventListener('click', () => {
            simularCompra();
        });

        const adminBtn = container.querySelector('[data-bs-target="#modalAgregarProducto"]');
        if (adminBtn) {
            adminBtn.parentNode.insertBefore(btn, adminBtn.nextSibling);
        }
    }

    // =========================================================
    // INICIALIZACIÓN
    // =========================================================

    async function init() {
        // Intentar cargar datos del backend
        const summary = await fetchFromBackend('/dashboard/summary');

        if (summary) {
            // Backend disponible - cargar datos reales
            await cargarKPIs();
            await cargarPedidosRecientes();
            await cargarProductosMasVendidos();
            await cargarAlertas();
            await cargarGraficaVentas();
        } else {
            // Backend no disponible - usar datos simulados
            console.warn('Backend no disponible, usando datos simulados');
            usarDatosSimulados();
        }

        // Agregar botón de simular compra
        agregarBotonSimularCompra();
    }

    init();

    // Exponer función global para debug
    window.adminDashboard = {
        cargarDatos: () => init(),
        simularVenta: simularCompra,
        fetchSummary: () => fetchFromBackend('/dashboard/summary')
    };
});