// Ajusta este ID al id real del estado (ej. "PENDIENTE") en tu tabla `status` de Supabase.
const DEFAULT_SALE_STATUS_ID = 1;

function formatearPrecioPago(valor) {
    return "$" + Number(valor).toLocaleString("es-CO") + " COP";
}

document.addEventListener("DOMContentLoaded", () => {
    if (!App.requireLogin()) return;

    const cart = App.getCart();
    if (!cart.length) {
        App.notify("Tu carrito está vacío.", "info");
        window.location.href = "index.html";
        return;
    }

    const resumenItems = document.getElementById("resumenItems");
    const totalPago = document.getElementById("totalPago");
    const metodosPago = document.getElementById("metodosPago");
    const pasoMetodo = document.getElementById("paso-metodo");
    const pasosPago = document.querySelectorAll(".paso-pago");
    const accionesPago = document.getElementById("accionesPago");
    const btnCambiarMetodo = document.getElementById("btnCambiarMetodo");
    const btnPagar = document.getElementById("btnPagar");
    const estadoProcesando = document.getElementById("estadoProcesando");
    const estadoExito = document.getElementById("estadoExito");
    const numeroOrden = document.getElementById("numeroOrden");

    const numeroTarjeta = document.getElementById("numeroTarjeta");
    const nombreTarjeta = document.getElementById("nombreTarjeta");
    const vencimientoTarjeta = document.getElementById("vencimientoTarjeta");
    const cvvTarjeta = document.getElementById("cvvTarjeta");

    let metodoSeleccionado = null;

    const total = cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.quantity), 0);

    resumenItems.innerHTML = "";
    cart.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "resumen-item";
        fila.innerHTML = `
            <span class="nombre">${item.quantity}x ${item.nombre}</span>
            <span>${formatearPrecioPago(item.precio * item.quantity)}</span>
        `;
        resumenItems.appendChild(fila);
    });
    totalPago.textContent = formatearPrecioPago(total);

    metodosPago.querySelectorAll(".metodo-pago-card").forEach(boton => {
        boton.addEventListener("click", () => {
            metodoSeleccionado = boton.dataset.metodo;

            metodosPago.querySelectorAll(".metodo-pago-card").forEach(b => b.classList.remove("active"));
            boton.classList.add("active");

            pasosPago.forEach(paso => paso.classList.add("d-none"));
            const formularioId = metodoSeleccionado === "tarjeta" ? "formTarjeta"
                : metodoSeleccionado === "pse" ? "formPse"
                    : "formContraentrega";
            document.getElementById(formularioId).classList.remove("d-none");

            accionesPago.classList.remove("d-none");
        });
    });

    btnCambiarMetodo.addEventListener("click", () => {
        metodoSeleccionado = null;
        pasosPago.forEach(paso => paso.classList.add("d-none"));
        accionesPago.classList.add("d-none");
        metodosPago.querySelectorAll(".metodo-pago-card").forEach(b => b.classList.remove("active"));
    });

    numeroTarjeta?.addEventListener("input", () => {
        const digitos = numeroTarjeta.value.replace(/\D/g, "").slice(0, 16);
        numeroTarjeta.value = digitos.replace(/(.{4})/g, "$1 ").trim();
    });

    vencimientoTarjeta?.addEventListener("input", () => {
        let digitos = vencimientoTarjeta.value.replace(/\D/g, "").slice(0, 4);
        if (digitos.length > 2) {
            digitos = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
        }
        vencimientoTarjeta.value = digitos;
    });

    cvvTarjeta?.addEventListener("input", () => {
        cvvTarjeta.value = cvvTarjeta.value.replace(/\D/g, "").slice(0, 3);
    });

    function validarFormularioPago() {
        if (metodoSeleccionado !== "tarjeta") return true;

        if (numeroTarjeta.value.replace(/\s/g, "").length !== 16) {
            App.notify("Ingresa un número de tarjeta válido (16 dígitos).", "danger");
            return false;
        }
        if (!nombreTarjeta.value.trim()) {
            App.notify("Ingresa el nombre que aparece en la tarjeta.", "danger");
            return false;
        }
        if (!/^\d{2}\/\d{2}$/.test(vencimientoTarjeta.value)) {
            App.notify("Ingresa una fecha de vencimiento válida (MM/AA).", "danger");
            return false;
        }
        if (cvvTarjeta.value.length !== 3) {
            App.notify("Ingresa un CVV válido (3 dígitos).", "danger");
            return false;
        }
        return true;
    }

    btnPagar.addEventListener("click", async () => {
        if (!metodoSeleccionado) {
            App.notify("Selecciona un método de pago.", "info");
            return;
        }
        if (!validarFormularioPago()) return;

        pasoMetodo.classList.add("d-none");
        pasosPago.forEach(paso => paso.classList.add("d-none"));
        accionesPago.classList.add("d-none");
        estadoProcesando.classList.remove("d-none");

        const payload = {
            quantity: cart.reduce((sum, item) => sum + Number(item.quantity), 0),
            totalAmount: total,
            active: true,
            statusId: DEFAULT_SALE_STATUS_ID,
            userId: App.getUserId(),
            items: cart.map(item => ({
                productId: Number(item.id),
                quantity: Number(item.quantity)
            }))
        };

        setTimeout(async () => {
            try {
                const venta = await SalesService.create(payload);

                App.saveCart([]);

                estadoProcesando.classList.add("d-none");
                estadoExito.classList.remove("d-none");
                numeroOrden.textContent = `#${venta.id}`;
            } catch (error) {
                estadoProcesando.classList.add("d-none");
                pasoMetodo.classList.remove("d-none");
                document.getElementById(
                    metodoSeleccionado === "tarjeta" ? "formTarjeta"
                        : metodoSeleccionado === "pse" ? "formPse"
                            : "formContraentrega"
                ).classList.remove("d-none");
                accionesPago.classList.remove("d-none");

                Swal.fire({
                    icon: "error",
                    title: "No se pudo procesar el pago",
                    text: error.message || "Intenta de nuevo más tarde.",
                    confirmButtonText: "Aceptar",
                });
            }
        }, 1500);
    });
});
