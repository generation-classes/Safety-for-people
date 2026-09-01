const App = {
    pages: {
        inicio: 'pages/home-usuario/index.html',
        productos: 'pages/productos/index.html',
        categorias: 'pages/categorias/index.html',
        aboutUs: 'pages/about-us/index.html',
        contacto: 'pages/contacto/index.html',
        admin: 'pages/home-administrador/index.html',
        login: 'pages/Inicio/index.html', // Ruta agregada
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

App.getCart = function () {
    try {
        const cart = JSON.parse(localStorage.getItem('sape_carrito') || '[]');
        if (!Array.isArray(cart)) return [];

        return cart.map(item => {
            const product = item.producto && typeof item.producto === 'object' ? item.producto : item;
            const id = item.id ?? product.id;

            return {
            ...item,
            id,
            nombre: item.nombre || item.name || product.nombre || product.name || 'Producto',
            descripcion: item.descripcion || product.descripcion || '',
            precio: Number(item.precio ?? item.price ?? product.precio ?? product.price) || 0,
            quantity: Math.max(1, Number(item.quantity ?? item.cantidad ?? product.quantity ?? 1) || 1),
            imagen: App.normalizeImagePath(item.imagen || item.img || item.image || product.imagen || product.img, id)
            };
        });
    } catch {
        return [];
    }
};

App.normalizeImagePath = function (path, id) {
    const rawPath = path || `/Assets/images/products/${id}.png`;
    const assetsIndex = rawPath.indexOf('Assets/');
    if (assetsIndex === -1) return rawPath;

    const assetsPath = rawPath.slice(assetsIndex);
    return new URL(`${App.getBasePath()}${assetsPath}`, document.baseURI).href;
};

App.notify = function (mensaje, tipo = 'success') {
    let contenedor = document.getElementById('sape-notificaciones');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'sape-notificaciones';
        contenedor.className = 'sape-notificaciones';
        document.body.appendChild(contenedor);
    }

    const aviso = document.createElement('div');
    aviso.className = `sape-notificacion sape-notificacion-${tipo}`;
    aviso.setAttribute('role', 'status');
    aviso.innerHTML = `<i class="bi ${tipo === 'success' ? 'bi-check-circle-fill' : tipo === 'danger' ? 'bi-trash3-fill' : 'bi-info-circle-fill'}"></i><span>${mensaje}</span>`;
    contenedor.appendChild(aviso);
    setTimeout(() => aviso.remove(), 3200);
};

App.saveCart = function (cart) {
    localStorage.setItem('sape_carrito', JSON.stringify(cart));
    App.updateCartBadge();
    document.dispatchEvent(new CustomEvent('sape:cart-updated'));
};

App.addToCart = function (product, quantity = 1) {
    const cart = App.getCart();
    const existing = cart.find(item => String(item.id) === String(product.id));
    const amount = Math.max(1, Number(quantity) || 1);

    if (existing) {
        existing.quantity += amount;
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: Number(product.precio),
            imagen: App.normalizeImagePath(typeof obtenerImagenProducto === 'function'
                ? obtenerImagenProducto(product)
                : product.imagen || product.img, product.id),
            quantity: amount
        });
    }

    App.saveCart(cart);
    App.notify(`${product.nombre} fue agregado al carrito.`);
};

App.changeCartQuantity = function (id, quantity) {
    const cart = App.getCart();
    const item = cart.find(product => String(product.id) === String(id));
    if (!item) return;

    item.quantity = Math.max(1, Number(quantity) || 1);
    App.saveCart(cart);
    App.notify('Cantidad del producto actualizada.');
};

App.removeFromCart = function (id) {
    const cart = App.getCart();
    const removed = cart.find(item => String(item.id) === String(id));
    App.saveCart(cart.filter(item => String(item.id) !== String(id)));
    if (removed) App.notify(`${removed.nombre} fue eliminado del carrito.`, 'info');
};

App.clearCart = function () {
    App.saveCart([]);
    App.notify('El carrito fue vaciado.', 'info');
};

App.setupSearch = function (base) {
    const form = document.querySelector('.buscador');
    const input = form?.querySelector('input[type="search"]');
    if (!form || !input) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const search = input.value.trim();
        const query = search ? `?buscar=${encodeURIComponent(search)}` : '';
        window.location.href = `${base}${App.pages.productos}${query}`;
    });
};

App.updateCartBadge = function () {
    const total = App.getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll('[data-cart-count]').forEach(badge => {
        badge.textContent = total;
        badge.hidden = total === 0;
    });
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

// NUEVO: Función que evalúa si el usuario tiene sesión y renderiza el botón o el perfil.
App.updateAuthUI = function () {
    const authNavAction = document.getElementById('auth-nav-action');
    if (!authNavAction) return;

    const base = App.getBasePath();
    const sesionIniciada = localStorage.getItem('sesionIniciada') === 'true';

    if (sesionIniciada) {
        // Renderizar icono de cuenta si está logueado
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
                App.updateAuthUI(); // Volver a pintar el botón de Iniciar Sesión
                App.notify('Has cerrado sesión exitosamente.', 'info');
            });
        }
    } else {
        // Renderizar botón de Iniciar Sesión que redirige a tu ruta si NO está logueado
        authNavAction.innerHTML = `
            <a href="${base}${App.pages.login}" id="btn-show-login" class="fw-semibold text-decoration-none" style="font-size: 1rem !important; padding: 0.35rem 0.75rem !important; border: none !important; color: var(--primary);">Iniciar sesión</a>
        `;
    }
};

App.loadLayout = async function () {
    const base = App.getBasePath();
    const currentPage = document.body.dataset.page;
    const targets = [
        { id: 'site-header', file: 'components/navbar.html' },
        { id: 'site-footer', file: 'components/footer.html' },
    ];

    // Carga asíncrona de la navbar
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

    // AHORA SÍ: Como la navbar ya cargó en el paso anterior, pintamos el botón o perfil
    App.updateAuthUI();

    App.setupRoleSwitch(base);
    App.setupSearch(base);
    App.updateCartBadge();
};

document.addEventListener('DOMContentLoaded', App.loadLayout);

window.App = App;