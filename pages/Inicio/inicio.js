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
            
            // Puedes agregar lógica personalizada según el rol seleccionado
            if (selectedRole === 'admin') {
                // Lógica o redirección para administrador
            } else {
                // Lógica o redirección para usuario estándar
            }
        });
    });

    // --- ENVÍO DE FORMULARIOS (MOCK) ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            console.log('Login Submit:', { email, password, rememberMe });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const termsAccepted = document.getElementById('terms-accept').checked;

            console.log('Register Submit:', { name, email, password, termsAccepted });
        });
    }
});