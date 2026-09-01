document.addEventListener("DOMContentLoaded", () => {
  const sessionActual = JSON.parse(localStorage.getItem("sape_session") || "null");
  const linkInicio = document.querySelector(".navbar-brand");

  if (linkInicio) {
    const destino = sessionActual?.role === "admin"
      ? "../home-administrador/index.html"
      : "../home-usuario/index.html";
    linkInicio.setAttribute("href", destino);
  }

  if (sessionActual && sessionActual.role) {
    const destino = sessionActual.role === "admin"
      ? "../home-administrador/index.html"
      : "../home-usuario/index.html";
    window.location.href = destino;
    return;
  }

  const usuarios = [
    { nombre: "Usuario Demo", email: "user@safety.com", password: "User123!", role: "user" },
    { nombre: "Administrador", email: "admin@safety.com", password: "Admin123!", role: "admin" },
  ];

  const guardarUsuariosBase = () => {
    const usuariosGuardados = JSON.parse(localStorage.getItem("sape_users") || "[]");
    if (!Array.isArray(usuariosGuardados) || usuariosGuardados.length === 0) {
      localStorage.setItem("sape_users", JSON.stringify(usuarios));
    }
  };

  guardarUsuariosBase();

  const loginFormContainer = document.getElementById("login-form-container");
  const registerFormContainer = document.getElementById(
    "register-form-container",
  );

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
      inputElement.closest(".input-wrapper");
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
      inputElement.closest(".input-wrapper");
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
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const rememberMe =
        document.getElementById("remember-me")?.checked || false;

      limpiarError(emailInput);
      limpiarError(passwordInput);

      const usuariosGuardados = JSON.parse(localStorage.getItem("sape_users") || "[]");
      const usuarioValido = [...usuariosGuardados, ...usuarios].find(
        (usuario) =>
          usuario.email.toLowerCase() === emailInput.value.trim().toLowerCase() &&
          usuario.password === passwordInput.value,
      );

      if (!usuarioValido) {
        Swal.fire({
          icon: "error",
          title: "Credenciales inválidas",
          text: "El correo o la contraseña no coinciden con un usuario autorizado.",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      localStorage.setItem("sape_role", usuarioValido.role);
      localStorage.setItem(
        "sape_session",
        JSON.stringify({
          email: usuarioValido.email,
          nombre: usuarioValido.nombre,
          role: usuarioValido.role,
        }),
      );

      console.log("Login exitoso:", {
        email: usuarioValido.email,
        role: usuarioValido.role,
        rememberMe,
      });

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: usuarioValido.role === "admin"
          ? "Has iniciado sesión como administrador."
          : "Inicio de sesión exitoso.",
        confirmButtonText: "Continuar",
      }).then(() => {
        const destino = usuarioValido.role === "admin"
          ? "../home-administrador/index.html"
          : "../home-usuario/index.html";
        window.location.href = destino;
      });
    });
  }

  // --- FORMULARIO DE REGISTRO ---
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    const nombreCompletoInput = document.getElementById("reg-name");
    const numeroTelefonoInput = document.getElementById("reg-phone");
    const correoElectronicoInput = document.getElementById("reg-email");
    const contrasenaInput = document.getElementById("reg-password");
    const confirmarContrasenaInput = document.getElementById(
      "reg-confirm-password",
    );

    // Limpieza de errores en tiempo real mientras el usuario escribe
    [
      nombreCompletoInput,
      numeroTelefonoInput,
      correoElectronicoInput,
      contrasenaInput,
      confirmarContrasenaInput,
    ].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => limpiarError(input));
      }
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreCompleto = nombreCompletoInput
        ? nombreCompletoInput.value.trim()
        : "";
      const numeroTelefono = numeroTelefonoInput
        ? numeroTelefonoInput.value.trim()
        : "";
      const correoElectronico = correoElectronicoInput
        ? correoElectronicoInput.value.trim()
        : "";
      const contrasena = contrasenaInput ? contrasenaInput.value : "";
      const confirmarContrasena = confirmarContrasenaInput
        ? confirmarContrasenaInput.value
        : "";

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
            "El nombre debe contener solo letras, entre 3 y 100 caracteres.",
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
            "El número debe tener exactamente 10 dígitos numéricos.",
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
            "Ingresa un correo electrónico válido.",
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
            "Mínimo 6 caracteres, letras, números, una mayúscula y un símbolo especial.",
          );
          formularioValido = false;
        }
      }

      // Validar Confirmación de Contraseña
      if (confirmarContrasenaInput) {
        if (contrasena !== confirmarContrasena) {
          mostrarError(
            confirmarContrasenaInput,
            "Las contraseñas no coinciden.",
          );
          formularioValido = false;
        }
      }

      if (!formularioValido) return;

      // Guardar en LocalStorage
      const usuarioJson = JSON.stringify({
        nombreCompleto,
        telefono: numeroTelefono,
        email: correoElectronico,
        contrasena,
      });

      localStorage.setItem("usuarioRegistrado", usuarioJson);
      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        registerForm.reset();
        showLogin();
      });

      registerForm.reset();
      showLogin(); // Redirige automáticamente al panel de Login tras registrarse
    });
  }
});
