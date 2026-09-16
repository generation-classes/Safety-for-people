document.addEventListener("DOMContentLoaded", () => {
    if (!window.App || !App.isLoggedIn() || App.getRole() !== "admin") {
        window.location.href = "../Inicio/index.html";
        return;
    }

    const formCuenta = document.getElementById("formCuenta");
    const cuentaNombre = document.getElementById("cuentaNombre");
    const cuentaEmail = document.getElementById("cuentaEmail");
    const cuentaTelefono = document.getElementById("cuentaTelefono");
    const cuentaRol = document.getElementById("cuentaRol");
    App.setupPhoneInput(cuentaTelefono);

    let usuarioActual = null;
    const userId = App.getUserId();

    async function cargarCuenta() {
        if (!userId) {
            Swal.fire("Error", "No se pudo identificar tu usuario. Inicia sesión de nuevo.", "error");
            return;
        }

        try {
            usuarioActual = await UsersService.getById(userId);
            cuentaNombre.value = usuarioActual.name || "";
            cuentaEmail.value = usuarioActual.email || "";
            cuentaTelefono.value = usuarioActual.phoneNumber || "";
            cuentaRol.value = App.getRole() === "admin" ? "Administrador" : "Usuario";
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudo cargar tu información.", "error");
        }
    }

    formCuenta.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        if (!usuarioActual) return;

        const telefono = cuentaTelefono.value.trim();
        if (telefono && !App.esTelefonoValido(telefono)) {
            Swal.fire("Error", "El teléfono debe tener exactamente 10 dígitos numéricos.", "error");
            return;
        }

        const boton = document.getElementById("btnGuardarCuenta");
        boton.disabled = true;
        boton.textContent = "Guardando...";

        const payload = {
            name: cuentaNombre.value.trim(),
            email: usuarioActual.email,
            // El backend exige "password" en el DTO pero UserService.updateUser() nunca la usa al actualizar.
            password: "sin-cambios",
            phoneNumber: telefono,
            active: usuarioActual.active,
            roleId: usuarioActual.roleId,
        };

        try {
            usuarioActual = await UsersService.update(userId, payload);
            App.notify("Datos actualizados correctamente.");
        } catch (error) {
            Swal.fire("Error", error.message || "No se pudieron guardar los cambios.", "error");
        } finally {
            boton.disabled = false;
            boton.textContent = "Guardar cambios";
        }
    });

    cargarCuenta();
});
