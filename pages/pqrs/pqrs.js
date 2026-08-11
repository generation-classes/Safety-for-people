const formPQRS = document.getElementById('formPQRS');
const pqrsToastEl = document.getElementById('pqrsToast');
const pqrsToastIcon = document.getElementById('pqrsToastIcon');
const pqrsToastMessage = document.getElementById('pqrsToastMessage');
const pqrsToast = new bootstrap.Toast(pqrsToastEl);

formPQRS.addEventListener('submit', function (event) {
    event.preventDefault();

    const submitBtn = formPQRS.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';

    fetch(formPQRS.action, {
        method: formPQRS.method,
        body: new FormData(formPQRS),
        headers: { Accept: 'application/json' },
    })
        .then((response) => {
            if (response.ok) {
                showPqrsToast('success', 'Envío exitoso', '¡Tu solicitud fue enviada! Te responderemos pronto.');
                formPQRS.reset();
            } else {
                return response.json().then((data) => {
                    const message = data?.errors?.map((err) => err.message).join(', ')
                        || 'Ocurrió un error al enviar tu solicitud. Intenta de nuevo.';
                    showPqrsToast('danger', 'Envío fallido', message);
                });
            }
        })
        .catch(() => {
            showPqrsToast('danger', 'Envío fallido', 'No se pudo enviar tu solicitud. Revisa tu conexión e intenta de nuevo.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        });
});

function showPqrsToast(type, title, message) {
    pqrsToastEl.classList.remove('text-bg-success', 'text-bg-danger');
    pqrsToastEl.classList.add(type === 'success' ? 'text-bg-success' : 'text-bg-danger');
    pqrsToastIcon.className = type === 'success' ? 'bi bi-check-circle-fill fs-5' : 'bi bi-exclamation-triangle-fill fs-5';
    pqrsToastMessage.textContent = `${title}: ${message}`;
    pqrsToast.show();
}
