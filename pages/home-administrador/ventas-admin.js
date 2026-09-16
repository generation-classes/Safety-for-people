document.addEventListener("DOMContentLoaded", () => {
    if (!window.App || !App.isLoggedIn() || App.getRole() !== "admin") {
        window.location.href = "../Inicio/index.html";
        return;
    }

    const tablaVentas = document.getElementById("tablaVentas");
    const selectPorPagina = document.getElementById("ventasPorPagina");
    const paginacionVentasAdmin = document.getElementById("paginacionVentasAdmin");

    let statuses = [];
    let usuarios = [];
    let ventasCache = [];
    let paginaActual = 1;
    let ventasPorPagina = Number(selectPorPagina.value) || 5;

    function nombreUsuario(userId) {
        const usuario = usuarios.find(u => u.id === userId);
        return usuario?.name || `Usuario #${userId ?? "-"}`;
    }

    function formatearPrecio(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CO") + " COP";
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
    }

    async function cambiarEstado(venta, selectEstado) {
        const nuevoStatusId = Number(selectEstado.value);
        selectEstado.disabled = true;

        const payload = {
            quantity: venta.quantity,
            totalAmount: venta.totalAmount,
            active: venta.active,
            statusId: nuevoStatusId,
            userId: venta.userId,
            items: venta.details.map(detalle => ({
                productId: detalle.productId,
                quantity: detalle.quantity,
            })),
        };

        try {
            await SalesService.update(venta.id, payload);
            App.notify("Estado de la venta actualizado.");
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo actualizar el estado.", "error");
            selectEstado.value = venta.statusId;
        } finally {
            selectEstado.disabled = false;
        }
    }

    async function cargarVentas() {
        tablaVentas.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Cargando ventas...</td></tr>';

        try {
            [statuses, usuarios] = await Promise.all([
                StatusesService.getAll().catch(() => []),
                UsersService.getAll().catch(() => []),
            ]);
            ventasCache = (await SalesService.getAll())
                .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

            paginaActual = 1;
            renderizarTabla();
        } catch (error) {
            tablaVentas.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">No se pudieron cargar las ventas: ${error.message}</td></tr>`;
        }
    }

    function renderizarTabla() {
        if (!ventasCache.length) {
            tablaVentas.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay ventas registradas.</td></tr>';
            paginacionVentasAdmin.innerHTML = "";
            return;
        }

        const totalPaginas = Math.max(1, Math.ceil(ventasCache.length / ventasPorPagina));
        paginaActual = Math.min(paginaActual, totalPaginas);

        const inicio = (paginaActual - 1) * ventasPorPagina;
        const ventasPagina = ventasCache.slice(inicio, inicio + ventasPorPagina);

        tablaVentas.innerHTML = "";
        ventasPagina.forEach(venta => {
            const productosTexto = (venta.details || [])
                .map(detalle => `${detalle.quantity}x ${detalle.productName}`)
                .join(", ");

            // Los estados avanzan en orden (por id): no se puede regresar a uno anterior.
            const opcionesEstado = statuses
                .filter(status => status.id >= venta.statusId)
                .map(status => `<option value="${status.id}" ${status.id === venta.statusId ? "selected" : ""}>${status.name}</option>`)
                .join("");

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>#${venta.id}</td>
                <td>${formatearFecha(venta.createdOn)}</td>
                <td>${productosTexto || "-"}</td>
                <td>${venta.quantity}</td>
                <td>${formatearPrecio(venta.totalAmount)}</td>
                <td>
                    <select class="form-select form-select-sm select-estado" style="min-width:140px;">
                        ${opcionesEstado || '<option value="">Sin estados</option>'}
                    </select>
                </td>
                <td class="text-end">${nombreUsuario(venta.userId)}</td>
            `;

            fila.querySelector(".select-estado").addEventListener("change", (evento) => {
                cambiarEstado(venta, evento.target);
            });

            tablaVentas.appendChild(fila);
        });

        renderizarPaginacionAdmin(totalPaginas);
    }

    function renderizarPaginacionAdmin(totalPaginas) {
        paginacionVentasAdmin.innerHTML = "";
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

        paginacionVentasAdmin.appendChild(ul);
    }

    selectPorPagina.addEventListener("change", () => {
        ventasPorPagina = Number(selectPorPagina.value) || 5;
        paginaActual = 1;
        renderizarTabla();
    });

    cargarVentas();
});
