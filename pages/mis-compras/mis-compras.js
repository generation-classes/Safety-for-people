document.addEventListener("DOMContentLoaded", () => {
    if (!App.requireLogin()) return;

    const listaCompras = document.getElementById("listaCompras");

    function formatearPrecio(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CO") + " COP";
    }

    function formatearFecha(fecha) {
        if (!fecha) return "-";
        return new Date(fecha).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
    }

    async function cargarCompras() {
        try {
            const [compras, statuses] = await Promise.all([
                SalesService.getMine(),
                StatusesService.getAll().catch(() => []),
            ]);

            if (!compras.length) {
                listaCompras.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-bag-x fs-1 text-muted"></i>
                        <p class="text-muted mt-2">Todavía no tienes compras registradas.</p>
                        <a href="../productos/index.html" class="btn-explorar">Ver productos</a>
                    </div>
                `;
                return;
            }

            const nombreEstado = (statusId) => statuses.find(s => s.id === statusId)?.name || "Pendiente";

            listaCompras.innerHTML = "";
            compras
                .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
                .forEach(compra => {
                    const productos = (compra.details || [])
                        .map(detalle => `<li>${detalle.quantity}x ${detalle.productName} — ${formatearPrecio(detalle.price)}</li>`)
                        .join("");

                    const tarjeta = document.createElement("div");
                    tarjeta.className = "card border-0 shadow-sm rounded-4";
                    tarjeta.innerHTML = `
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                                <div>
                                    <h5 class="fw-bold mb-0">Orden #${compra.id}</h5>
                                    <small class="text-muted">${formatearFecha(compra.createdOn)}</small>
                                </div>
                                <span class="badge bg-info text-dark">${nombreEstado(compra.statusId)}</span>
                            </div>
                            <ul class="mb-2">${productos}</ul>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>${formatearPrecio(compra.totalAmount)}</span>
                            </div>
                        </div>
                    `;
                    listaCompras.appendChild(tarjeta);
                });
        } catch (error) {
            listaCompras.innerHTML = `<p class="text-danger">No se pudieron cargar tus compras: ${error.message}</p>`;
        }
    }

    cargarCompras();
});
