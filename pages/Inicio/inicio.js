// El registro público siempre crea usuarios normales (rol "USER" = id 2 en Supabase).
// Los administradores no se crean desde el frontend, solo directamente en la base de datos.
const DEFAULT_USER_ROLE_ID = 2;

function decodificarJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalizado = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalizado)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function resolverRolDesdeToken(token) {
  const claims = decodificarJwt(token);
  // Revisa si las claims o autoridades traen ADMIN explícitamente, de lo contrario fuerza 'user'
  const rolesCadena = JSON.stringify(claims).toUpperCase();
  return rolesCadena.includes("ADMIN") ? "admin" : "user";
}

function guardarSesion(token, email, nombre, rol) {
  const claims = decodificarJwt(token);

  localStorage.setItem("sape_token", token);
  localStorage.setItem("sape_role", rol);
  localStorage.setItem(
    "sape_session",
    JSON.stringify({ role: rol, email, nombre, userId: claims.userId ?? null })
  );

  if (window.App && typeof App.updateAuthUI === "function") {
    App.updateAuthUI();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginFormContainer = document.getElementById("login-form-container");
  const registerFormContainer = document.getElementById("register-form-container");

  const goToRegisterBtn = document.getElementById("go-to-register");
  const goToLoginBtn = document.getElementById("go-to-login");

  const imgLogin = document.getElementById("img-login");
  const imgRegister = document.getElementById("img-register");

  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  const roleRadios = document.querySelectorAll('input[name="userRole"]');
  const authContainer = document.querySelector(".auth-container");

  // --- FUNCIONES AUXILIARES DE ERROR ---
  const mostrarError = (inputElement, mensaje) => {
    if (!inputElement) return;
    const grupoInput =
      inputElement.closest(".input-group") ||
      inputElement.closest(".input-wrapper") ||
      inputElement.closest(".form-options") ||
      inputElement.closest(".checkbox-container") ||
      inputElement.parentElement;

    let elementoError = grupoInput.querySelector(".error-message");
    if (!elementoError) {
      elementoError = document.createElement("span");
      elementoError.className = "error-message";
      grupoInput.appendChild(elementoError);
    }
    elementoError.textContent = mensaje;
    elementoError.style.display = "block";
    inputElement.classList.add("is-invalid");
  };

  const limpiarError = (inputElement) => {
    if (!inputElement) return;
    const grupoInput =
      inputElement.closest(".input-group") ||
      inputElement.closest(".input-wrapper") ||
      inputElement.closest(".form-options") ||
      inputElement.closest(".checkbox-container") ||
      inputElement.parentElement;

    const elementoError = grupoInput.querySelector(".error-message");
    if (elementoError) {
      elementoError.textContent = "";
      elementoError.style.display = "none";
    }
    inputElement.classList.remove("is-invalid");
  };

  // --- ALTERNANCIA ENTRE LOGIN Y REGISTRO ---
  const showRegister = (e) => {
    if (e) e.preventDefault();
    if (authContainer) authContainer.style.flexDirection = "row-reverse";

    loginFormContainer.classList.remove("active");
    imgLogin.classList.remove("active");

    registerFormContainer.classList.add("active");
    imgRegister.classList.add("active");
  };

  const showLogin = (e) => {
    if (e) e.preventDefault();
    if (authContainer) authContainer.style.flexDirection = "row";

    registerFormContainer.classList.remove("active");
    imgRegister.classList.remove("active");

    loginFormContainer.classList.add("active");
    imgLogin.classList.add("active");
  };

  if (goToRegisterBtn) goToRegisterBtn.addEventListener("click", showRegister);
  if (goToLoginBtn) goToLoginBtn.addEventListener("click", showLogin);

  // --- MOSTRAR / OCULTAR CONTRASEÑA ---
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const inputWrapper = button.closest(".input-wrapper");
      const input = inputWrapper ? inputWrapper.querySelector("input") : null;
      const icon = button.querySelector("i");

      if (input && icon) {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        if (icon.classList.contains("bi")) {
          icon.classList.toggle("bi-eye", !isPassword);
          icon.classList.toggle("bi-eye-slash", isPassword);
        } else {
          icon.classList.toggle("fa-eye", !isPassword);
          icon.classList.toggle("fa-eye-slash", isPassword);
        }
      }
    });
  });

  // --- CONMUTADOR DE ROL ---
  roleRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const selectedRole = e.target.value;
      console.log(`Rol seleccionado: ${selectedRole}`);
    });
  });

  // --- FORMULARIO DE LOGIN ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");

      limpiarError(emailInput);
      limpiarError(passwordInput);

      const emailVal = emailInput.value.trim();
      const passwordVal = passwordInput.value;

      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        const { token } = await AuthService.login(emailVal, passwordVal);
        const rol = resolverRolDesdeToken(token);
        const nombre = emailVal.split("@")[0];

        guardarSesion(token, emailVal, nombre, rol);

        await Swal.fire({
          icon: "success",
          title: rol === "admin" ? "¡Bienvenido Administrador!" : `¡Bienvenido de nuevo, ${nombre}!`,
          text: "Inicio de sesión exitoso.",
          confirmButtonText: "Continuar",
        });

        loginForm.reset();
        window.location.href = window.App ? App.getRoleHomePage() : "../home-usuario/index.html";
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "No se pudo iniciar sesión",
          text: error.message || "Verifica tu correo y contraseña.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // --- FORMULARIO DE REGISTRO ---
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    const nombreCompletoInput = document.getElementById("reg-name");
    const numeroTelefonoInput = document.getElementById("reg-phone");
    const correoElectronicoInput = document.getElementById("reg-email");
    const contrasenaInput = document.getElementById("reg-password");
    const confirmarContrasenaInput = document.getElementById("reg-confirm-password");
    
    // Referencia al ID real de tu HTML:
    const terminosInput = document.getElementById("terms-accept");

    App.setupPhoneInput(numeroTelefonoInput);

    // Limpieza de errores en tiempo real
    [
      nombreCompletoInput,
      numeroTelefonoInput,
      correoElectronicoInput,
      contrasenaInput,
      confirmarContrasenaInput,
      terminosInput,
    ].forEach((input) => {
      if (input) {
        const evento = input.type === "checkbox" ? "change" : "input";
        input.addEventListener(evento, () => limpiarError(input));
      }
    });

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreCompleto = nombreCompletoInput ? nombreCompletoInput.value.trim() : "";
      const numeroTelefono = numeroTelefonoInput ? numeroTelefonoInput.value.trim() : "";
      const correoElectronico = correoElectronicoInput ? correoElectronicoInput.value.trim() : "";
      const contrasena = contrasenaInput ? contrasenaInput.value : "";
      const confirmarContrasena = confirmarContrasenaInput ? confirmarContrasenaInput.value : "";

      let formularioValido = true;

      // Validar Nombre
      if (nombreCompletoInput) {
        const soloLetrasEspacios = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (
          !nombreCompleto ||
          nombreCompleto.length < 3 ||
          nombreCompleto.length > 100 ||
          !soloLetrasEspacios.test(nombreCompleto)
        ) {
          mostrarError(
            nombreCompletoInput,
            "El nombre debe contener solo letras, entre 3 y 100 caracteres."
          );
          formularioValido = false;
        }
      }

      // Validar Teléfono
      if (numeroTelefonoInput) {
        const exactamenteDiezNumeros = /^[0-9]{10}$/;
        if (!exactamenteDiezNumeros.test(numeroTelefono)) {
          mostrarError(
            numeroTelefonoInput,
            "El número debe tener exactamente 10 dígitos numéricos."
          );
          formularioValido = false;
        }
      }

      // Validar Correo
      if (correoElectronicoInput) {
        const validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validarCorreo.test(correoElectronico)) {
          mostrarError(
            correoElectronicoInput,
            "Ingresa un correo electrónico válido."
          );
          formularioValido = false;
        }
      }

      // Validar Contraseña
      if (contrasenaInput) {
        const formatoContrasenaSegura = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!contrasena || !formatoContrasenaSegura.test(contrasena)) {
          mostrarError(
            contrasenaInput,
            "Mínimo 6 caracteres, letras, números, una mayúscula y un símbolo especial."
          );
          formularioValido = false;
        }
      }

      // Validar Confirmación de Contraseña
      if (confirmarContrasenaInput) {
        if (contrasena !== confirmarContrasena) {
          mostrarError(
            confirmarContrasenaInput,
            "Las contraseñas no coinciden."
          );
          formularioValido = false;
        }
      }

      // Validar Términos y Condiciones
      if (terminosInput && !terminosInput.checked) {
        mostrarError(
          terminosInput,
          "Debes aceptar los términos y condiciones para continuar."
        );
        formularioValido = false;
      }

      if (!formularioValido) return;

      const submitButton = registerForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        const { token } = await AuthService.register({
          email: correoElectronico,
          password: contrasena,
          nombre: nombreCompleto,
          phoneNumber: numeroTelefono,
          roleId: DEFAULT_USER_ROLE_ID,
        });

        const rol = resolverRolDesdeToken(token);
        guardarSesion(token, correoElectronico, nombreCompleto, rol);

        await Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Tu cuenta ha sido creada. Ya iniciaste sesión.",
          confirmButtonText: "Continuar",
        });

        registerForm.reset();
        window.location.href = window.App ? App.getRoleHomePage() : "../home-usuario/index.html";
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "No se pudo completar el registro",
          text: error.message || "Intenta de nuevo más tarde.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
});