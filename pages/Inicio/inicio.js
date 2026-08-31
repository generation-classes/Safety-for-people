document.addEventListener('DOMContentLoaded', () => {


    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    
    const goToRegisterBtn = document.getElementById('go-to-register');
    const goToLoginBtn = document.getElementById('go-to-login');
    
    const imgLogin = document.getElementById('img-login');
    const imgRegister = document.getElementById('img-register');
    
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const roleRadios = document.querySelectorAll('input[name="userRole"]');

    // --- ALTERNANCIA ENTRE LOGIN Y REGISTRO ---
    const showRegister = (e) => {
        if (e) e.preventDefault();
        loginFormContainer.classList.remove('active');
        imgLogin.classList.remove('active');

        registerFormContainer.classList.add('active');
        imgRegister.classList.add('active');
    };

    const showLogin = (e) => {
        if (e) e.preventDefault();
        registerFormContainer.classList.remove('active');
        imgRegister.classList.remove('active');

        loginFormContainer.classList.add('active');
        imgLogin.classList.add('active');
    };

    if (goToRegisterBtn) goToRegisterBtn.addEventListener('click', showRegister);
    if (goToLoginBtn) goToLoginBtn.addEventListener('click', showLogin);

    // --- MOSTRAR / OCULTAR CONTRASEÑA ---
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputWrapper = button.closest('.input-wrapper');
            const input = inputWrapper ? inputWrapper.querySelector('input') : null;
            const icon = button.querySelector('i');

            if (input && icon) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                
                // Cambia el icono de FontAwesome entre ojo abierto y cerrado
                icon.classList.toggle('fa-eye', !isPassword);
                icon.classList.toggle('fa-eye-slash', isPassword);
            }
        });
    });

    // --- CONMUTADOR DE ROL (USUARIO / ADMINISTRADOR) ---
    roleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedRole = e.target.value;
            console.log(`Rol seleccionado: ${selectedRole}`);
            
             if (selectedRole === 'admin') {
             } else {
             }
        });
    });

     const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            console.log('Login Submit:', { email, password, rememberMe });

             const usuarioGuardadoString = localStorage.getItem('usuarioRegistrado');

            if (!usuarioGuardadoString) {
                alert('No hay ninguna cuenta registrada. Por favor, regístrate primero.');
                return;
            }

            const usuarioRegistrado = JSON.parse(usuarioGuardadoString);

            if (email === usuarioRegistrado.email && password === usuarioRegistrado.contrasena) {
                localStorage.setItem('sesionIniciada', 'true');
                actualizarInterfazNavbar();
                alert(`¡Bienvenido de nuevo, ${usuarioRegistrado.nombreCompleto}!`);
                loginForm.reset();
            } else {
                alert('Correo electrónico o contraseña incorrectos.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreCompletoInput = document.getElementById('reg-name');
            const numeroTelefonoInput = document.getElementById('reg-phone');
            const correoElectronicoInput = document.getElementById('reg-email');
            const contrasenaInput = document.getElementById('reg-password');
            const confirmarContrasenaInput = document.getElementById('reg-confirm-password');

            const nombreCompleto = nombreCompletoInput.value;
            const numeroTelefono = numeroTelefonoInput.value;
            const correoElectronico = correoElectronicoInput.value;
            const contrasena = contrasenaInput.value;
            const confirmarContrasena = confirmarContrasenaInput.value;

            const mostrarError = (inputElement, mensaje) => {
                const grupoInput = inputElement.closest('.input-group');
                const elementoError = grupoInput.querySelector('.error-message');
                if (elementoError) {
                    elementoError.textContent = mensaje;
                    elementoError.style.display = 'block';
                }
            };

            const limpiarError = (inputElement) => {
                const grupoInput = inputElement.closest('.input-group');
                const elementoError = grupoInput.querySelector('.error-message');
                if (elementoError) {
                    elementoError.textContent = '';
                    elementoError.style.display = 'none';
                }
            };

            let formularioValido = true;

            const soloLetrasEspacios = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!nombreCompleto.trim() || nombreCompleto.length < 3 || nombreCompleto.length > 100 || !soloLetrasEspacios.test(nombreCompleto)) {
                mostrarError(nombreCompletoInput, 'El nombre debe contener solo letras, entre 3 y 100 caracteres.');
                formularioValido = false;
            } else {
                limpiarError(nombreCompletoInput);
            }

            const exactamenteDiezNumeros = /^[0-9]{10}$/;
            if (!exactamenteDiezNumeros.test(numeroTelefono)) {
                mostrarError(numeroTelefonoInput, 'El número de teléfono debe tener exactamente 10 dígitos numéricos.');
                formularioValido = false;
            } else {
                limpiarError(numeroTelefonoInput);
            }

            const validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validarCorreo.test(correoElectronico)) {
                mostrarError(correoElectronicoInput, 'Por favor ingresa un correo electrónico válido.');
                formularioValido = false;
            } else {
                limpiarError(correoElectronicoInput);
            }

            const formatoContrasenaSegura = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
            if (!contrasena || !formatoContrasenaSegura.test(contrasena)) {
                mostrarError(contrasenaInput, 'La contraseña debe tener mínimo 6 caracteres, letras, números, una mayúscula y un símbolo especial.');
                formularioValido = false;
            } else {
                limpiarError(contrasenaInput);
            }

            if (contrasena !== confirmarContrasena) {
                mostrarError(confirmarContrasenaInput, 'Las contraseñas no coinciden.');
                formularioValido = false;
            } else {
                limpiarError(confirmarContrasenaInput);
            }

            if (!formularioValido) {
                return;
            }

            const usuarioJson = JSON.stringify({
                nombreCompleto: nombreCompleto,
                telefono: numeroTelefono,
                email: correoElectronico,
                contrasena: contrasena
            });

            localStorage.setItem('usuarioRegistrado', usuarioJson);

            console.log('Objeto JSON del usuario:', usuarioJson);
            alert('¡Registro exitoso! ');

            registerForm.reset();
        });
    }

    // --- cambio de inicion de sesion en el navbar 
    const authNavAction = document.getElementById('auth-nav-action');

    const actualizarInterfazNavbar = () => {
        if (!authNavAction) return;
        const sesionIniciada = localStorage.getItem('sesionIniciada') === 'true';

        if (sesionIniciada) {
            authNavAction.innerHTML = `
                <div class="dropdown">
                  <a href="#" class="dropdown-toggle text-dark fs-5" id="userProfileDropdown" data-bs-toggle="dropdown"
                    aria-expanded="false" aria-label="Cuenta de usuario">
                    <i class="bi bi-person-circle"></i>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userProfileDropdown">
                    <li>
                      <button class="dropdown-item text-danger d-flex align-items-center gap-2" id="btn-logout">
                        <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </div>
            `;

            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('sesionIniciada');
                    actualizarInterfazNavbar();
                    alert('Has cerrado sesión exitosamente.');
                });
            }
      } else {
            authNavAction.innerHTML = `
                <a href="#" id="btn-show-login" class="fw-semibold text-decoration-none" style="font-size: 1rem !important; padding: 0.35rem 0.75rem !important; border: none !important; color: var(--primary);">Iniciar sesión</a>
            `;

            const nuevoBtnShowLogin = document.getElementById('btn-show-login');
            if (nuevoBtnShowLogin) {
                nuevoBtnShowLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLogin();
                });
            }
        }
    };

     actualizarInterfazNavbar();
});