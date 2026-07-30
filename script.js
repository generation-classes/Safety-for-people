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
