const App = {
    pages: {
        inicio: 'index.html',
        productos: 'pages/productos.html',
        categorias: 'pages/categorias.html',
        aboutUs: 'pages/about-us.html',
        contacto: 'pages/contacto.html',
    },
};

App.getBasePath = function () {
    return /\/pages\//.test(window.location.pathname) ? '../' : '';
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
};

document.addEventListener('DOMContentLoaded', App.loadLayout);

window.App = App;
