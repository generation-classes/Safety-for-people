const App = {
    pages: {
        inicio: 'pages/home-usuario/index.html',
        productos: 'pages/productos/index.html',
        categorias: 'pages/categorias/index.html',
        aboutUs: 'pages/about-us/index.html',
        contacto: 'pages/contacto/index.html',
        admin: 'pages/home-administrador/index.html',
    },
};

App.getBasePath = function () {
    const match = window.location.pathname.match(/\/pages\/(.+)$/);
    if (!match) return '';
    const depth = match[1].split('/').length;
    return '../'.repeat(depth);
};

App.getRole = function () {
    return localStorage.getItem('sape_role') || 'user';
};

App.setupRoleSwitch = function (base) {
    const radios = document.querySelectorAll('input[name="userRole"]');
    if (!radios.length) return;

    const currentRole = App.getRole();
    radios.forEach(radio => {
        radio.checked = radio.value === currentRole;
    });

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (!radio.checked) return;
            localStorage.setItem('sape_role', radio.value);
            const target = radio.value === 'admin' ? App.pages.admin : App.pages.inicio;
            window.location.href = base + target;
        });
    });
};

App.loadLayout = async function () {
    const base = App.getBasePath();
    const currentPage = document.body.dataset.page;
    const targets = [
        { id: 'site-header', file: 'components/navbar.html' },
        { id: 'site-footer', file: 'components/footer.html' },
    ];

    await Promise.all(targets.map(async ({ id, file }) => {
        const mount = document.getElementById(id);
        if (!mount) return;
        const response = await fetch(`${base}${file}`);
        const markup = await response.text();
        mount.innerHTML = markup.replaceAll('{{base}}', base);
    }));

    if (currentPage) {
        document.querySelectorAll(`[data-page="${currentPage}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    App.setupRoleSwitch(base);
};

document.addEventListener('DOMContentLoaded', App.loadLayout);

window.App = App;
