
document.querySelectorAll('.eye-toggle').forEach(eye => {
    eye.addEventListener('click', function () {
        const card = this.closest('article');
        const socialIcons = card.querySelector('.social-icons');
        const roleText = card.querySelector('.role-text');

        socialIcons.classList.toggle('d-none');

        if (roleText.textContent === this.dataset.bio) {
            roleText.textContent = roleText.dataset.original;
        } else {
            roleText.textContent = this.dataset.bio;
        }

        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
    });
});

const form = document.querySelector(`#contactForm`);

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.Nombre.value.trim();
    const email = form.Email.value.trim();
    const numero = form.Numero.value.trim();
    const mensaje = form.Mensaje.value.trim();

    if (nombre === "") {
        Swal.fire("Error", "Ingresa un nombre", "error");
        return;
    }
    if (email === "") {
        Swal.fire("Error", "Ingresa un email", "error");
        return;
    }
    if (!email.includes(`@`) || !email.includes(`.`)) {
        Swal.fire("Error", "Email invalido, reivsa e intenta de nuevo", "error");
        return;

    }
    if (numero === "") {
        Swal.fire("Error", "Ingresa un numero", "error");
        return;

    }
    if (mensaje === "") {
        Swal.fire("Error", "Ingresa un mensaje", "error");
        return;
    }

    const response = await fetch('https://formspree.io/f/mjgnnndz', {
        method: "post",
        body: new FormData(form),
        headers: { 'accept': 'application/json' }
    });
    if (response.ok) {
        Swal.fire("Gracias por contactarnos", "Responderemos lo mas pronto posible", "succes");
        form.reset();
    }
    else {
        Swal.fire("Tuvimos un problema", "Por favor intentelo de nuevo mas tarde", "error");

    }
});