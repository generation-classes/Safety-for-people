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

App.DEFAULT_USERS = [
    { nombre: 'Usuario Demo', email: 'user@safety.com', password: 'User123!', role: 'user' },
    { nombre: 'Administrador', email: 'admin@safety.com', password: 'Admin123!', role: 'admin' },
];

App.DEFAULT_INVENTORY = [
    { id: 1, nombre: 'Pulsera GPS Femenino', categoria: 'Pulseras GPS', descripcion: 'Pulsera con GPS para mayor seguridad.', precio: 199900, stock: 25, imagen: '../../Assets/images/pulsera.png', caracteristicas: ['Botón de emergencia', 'Resistencia al agua', 'Ubicación en tiempo real', 'Batería de larga duración'] },
    { id: 2, nombre: 'Audífonos GPS integrado', categoria: 'Audífonos GPS', descripcion: 'Audífonos inalámbricos con geolocalización.', precio: 399900, stock: 20, imagen: '../../Assets/images/audifono.png', caracteristicas: ['GPS integrado', 'Conexión inalámbrica', 'Ubicación en tiempo real', 'Batería de larga duración'] },
    { id: 3, nombre: 'Reloj GPS Masculino', categoria: 'Relojes GPS', descripcion: 'Reloj inteligente con GPS integrado.', precio: 359900, stock: 15, imagen: '../../Assets/images/reloj.png', caracteristicas: ['GPS integrado', 'Botón de emergencia', 'Resistencia al agua', 'Monitoreo de ubicación'] },
    { id: 4, nombre: 'Reloj GPS Niño', categoria: 'Para niños', descripcion: 'Reloj infantil con localización GPS.', precio: 199900, stock: 16, imagen: '../../Assets/images/relojnino.png', caracteristicas: ['GPS en tiempo real', 'Botón de emergencia', 'Diseño infantil', 'Resistencia al agua'] },
    { id: 5, nombre: 'Pulsera GPS Niña', categoria: 'Para niños', descripcion: 'Pulsera infantil con GPS.', precio: 159900, stock: 25, imagen: '../../Assets/images/manillanina.png', caracteristicas: ['Ubicación en tiempo real', 'Botón de emergencia', 'Diseño infantil', 'Batería de larga duración'] },
    { id: 6, nombre: 'Gafas de sol GPS', categoria: 'GPS', descripcion: 'Gafas de sol con sistema de localización.', precio: 199900, stock: 18, imagen: '../../Assets/images/gafas.png', caracteristicas: ['Sistema GPS', 'Diseño discreto', 'Ubicación en tiempo real', 'Batería recargable'] },
    { id: 7, nombre: 'Arete GPS', categoria: 'GPS', descripcion: 'Aretes discretos con localización.', precio: 159900, stock: 20, imagen: '../../Assets/images/aretes.png', caracteristicas: ['Diseño discreto', 'Ubicación en tiempo real', 'Sistema GPS', 'Batería de larga duración'] },
    { id: 8, nombre: 'Arete GPS Niña', categoria: 'Para niños', descripcion: 'Aretes infantiles con sistema de localización.', precio: 99900, stock: 15, imagen: '../../Assets/images/aretesniña.png', caracteristicas: ['GPS integrado', 'Diseño infantil', 'Ubicación en tiempo real', 'Batería de larga duración'] },
    { id: 9, nombre: 'Llavero GPS Femenino', categoria: 'GPS', descripcion: 'Llavero discreto con rastreador GPS.', precio: 159900, stock: 30, imagen: '../../Assets/images/llavero.png', caracteristicas: ['Rastreador GPS', 'Diseño discreto', 'Ubicación en tiempo real', 'Batería de larga duración'] },
];

App.seedHardcodedData = function () {
    try {
        if (!localStorage.getItem('sape_users')) {
            localStorage.setItem('sape_users', JSON.stringify(App.DEFAULT_USERS));
        }

        if (!localStorage.getItem('sape_inventario')) {
            localStorage.setItem('sape_inventario', JSON.stringify(App.DEFAULT_INVENTORY));
        }
    } catch (error) {
        console.warn('No se pudo inicializar datos harcodeados:', error);
    }
};

App.getUsers = function () {
    App.seedHardcodedData();

    try {
        const users = JSON.parse(localStorage.getItem('sape_users') || '[]');
        return Array.isArray(users) ? users : App.DEFAULT_USERS;
    } catch {
        return App.DEFAULT_USERS;
    }
};

App.getInventory = function () {
    App.seedHardcodedData();

    try {
        const inventory = JSON.parse(localStorage.getItem('sape_inventario') || '[]');
        return Array.isArray(inventory) && inventory.length ? inventory : App.DEFAULT_INVENTORY;
    } catch {
        return App.DEFAULT_INVENTORY;
    }
};

App.saveInventory = function (inventory) {
    localStorage.setItem('sape_inventario', JSON.stringify(inventory));
};

App.decreaseInventory = function (productId, quantity = 1) {
    const inventory = App.getInventory();
    const product = inventory.find(item => String(item.id) === String(productId));
    if (!product) return false;

    const amount = Number(quantity || 1);
    if (Number(product.stock || 0) < amount) {
        return false;
    }

    product.stock = Math.max(0, Number(product.stock || 0) - amount);
    App.saveInventory(inventory);
    return true;
};

App.finalizePurchase = function () {
    const cart = App.getCart();
    if (!cart.length) {
        App.notify('Tu carrito está vacío.', 'info');
        return false;
    }

    let inventory = App.getInventory();
    let canFinish = true;

    cart.forEach(item => {
        const product = inventory.find(producto => String(producto.id) === String(item.id));
        if (!product) {
            canFinish = false;
            return;
        }

        if (Number(product.stock || 0) < Number(item.quantity || 0)) {
            canFinish = false;
            App.notify(`No hay stock suficiente para ${item.nombre}.`, 'danger');
        }
    });

    if (!canFinish) {
        return false;
    }

    cart.forEach(item => {
        const product = inventory.find(producto => String(producto.id) === String(item.id));
        if (!product) return;
        product.stock = Math.max(0, Number(product.stock || 0) - Number(item.quantity || 0));
    });

    App.saveInventory(inventory);

    try {
        const eventos = JSON.parse(localStorage.getItem('analiticaProductos') || '[]');
        const compra = cart.map(item => ({
            id: Date.now() + Math.random(),
            evento: 'purchase',
            productoId: item.id,
            producto: item.nombre,
            cantidad: Number(item.quantity || 1),
            precio: Number(item.precio || 0),
            fecha: new Date().toISOString()
        }));
        localStorage.setItem('analiticaProductos', JSON.stringify([...eventos, ...compra]));
    } catch (error) {
        console.warn('No se pudo registrar la compra:', error);
    }

    App.saveCart([]);
    App.notify('Compra finalizada con éxito.', 'success');
    return true;
};

App.getBasePath = function () {
    const match = window.location.pathname.match(/\/pages\/(.+)$/);
    if (!match) return '';
    const depth = match[1].split('/').length;
    return '../'.repeat(depth);
};

App.isLoggedIn = function () {
    return Boolean(localStorage.getItem('sape_session'));
};

App.getRole = function () {
    return localStorage.getItem('sape_role') || 'user';
};

App.logout = function () {
    localStorage.removeItem('sape_session');
    localStorage.removeItem('sape_role');
    localStorage.removeItem('sape_carrito');
    window.location.href = `${App.getBasePath()}pages/Inicio/index.html`;
};

App.updateUserMenu = function () {
    const session = JSON.parse(localStorage.getItem('sape_session') || 'null');
    const role = session?.role || localStorage.getItem('sape_role');
    const loginItem = document.getElementById('loginMenuItem');
    const logoutItem = document.getElementById('logoutMenuItem');
    const sessionLabel = document.getElementById('sessionUserLabel');
    const logoutButton = document.getElementById('logoutButton');

    if (role) {
        if (sessionLabel) {
            sessionLabel.textContent = role === 'admin' ? 'Administrador' : 'Usuario';
        }
        if (loginItem) loginItem.classList.add('d-none');
        if (logoutItem) logoutItem.classList.remove('d-none');
        if (logoutButton) {
            logoutButton.onclick = () => App.logout();
        }
        return;
    }

    if (sessionLabel) {
        sessionLabel.textContent = 'Cuenta';
    }
    if (loginItem) loginItem.classList.remove('d-none');
    if (logoutItem) logoutItem.classList.add('d-none');
};

App.getRoleHomePage = function () {
    const base = App.getBasePath();
    const role = App.getRole();
    const target = role === 'admin'
        ? `${base}pages/home-administrador/index.html`
        : `${base}pages/home-usuario/index.html`;
    return target;
};

App.redirectToLogin = function () {
    const base = App.getBasePath();
    window.location.href = `${base}pages/Inicio/index.html`;
};

App.redirectToRoleHome = function () {
    if (!App.isLoggedIn()) return false;

    const currentPath = window.location.pathname.toLowerCase();
    const target = App.getRoleHomePage();
    const normalizedTarget = new URL(target, window.location.href).pathname.toLowerCase();

    if (currentPath === normalizedTarget) return true;

    const isLoginPage = currentPath.includes('/pages/inicio/') || currentPath.endsWith('/pages/inicio/index.html') || currentPath.endsWith('/pages/inicio/');
    const isUserHome = currentPath.includes('/pages/home-usuario/');
    const isAdminHome = currentPath.includes('/pages/home-administrador/');

    if (isLoginPage) {
        window.location.replace(target);
        return true;
    }

    if (isUserHome && App.getRole() === 'admin') {
        window.location.replace(target);
        return true;
    }

    if (isAdminHome && App.getRole() !== 'admin') {
        window.location.replace(target);
        return true;
    }

    return false;
};

App.requireLogin = function () {
    if (!App.isLoggedIn()) {
        App.notify('Debes iniciar sesión para continuar.', 'danger');
        setTimeout(() => App.redirectToLogin(), 900);
        return false;
    }
    return true;
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
            imagen: App.ajustarRutaImagen(item.imagen || item.img || item.image || product.imagen || product.img, id)
            };
        });
    } catch {
        return [];
    }
};

App.ajustarRutaImagen = function (path, id) {
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

App.getProductStock = function (productId) {
    const inventory = App.getInventory();
    const product = inventory.find(item => String(item.id) === String(productId));
    return Number(product?.stock || 0);
};

App.addToCart = function (product, quantity = 1) {
    if (!App.requireLogin()) return;

    if (App.getRole() === 'admin') {
        App.notify('Los administradores no pueden comprar productos desde este portal.', 'danger');
        return;
    }

    const stockDisponible = App.getProductStock(product.id);
    if (stockDisponible <= 0) {
        App.notify('Este producto no tiene stock disponible.', 'danger');
        return;
    }

    const cart = App.getCart();
    const existing = cart.find(item => String(item.id) === String(product.id));
    const amount = Math.min(Math.max(1, Number(quantity) || 1), stockDisponible);
    const totalRequested = (existing ? Number(existing.quantity) : 0) + amount;

    if (totalRequested > stockDisponible) {
        App.notify(`Solo quedan ${stockDisponible - (existing ? Number(existing.quantity) : 0)} unidades disponibles.`, 'info');
        return;
    }

    if (existing) {
        existing.quantity = totalRequested;
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: Number(product.precio),
            imagen: App.ajustarRutaImagen(typeof obtenerImagenProducto === 'function'
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

    const stockDisponible = App.getProductStock(id);
    const nextValue = Math.max(1, Number(quantity) || 1);
    const cappedValue = stockDisponible > 0 ? Math.min(nextValue, stockDisponible) : 1;

    if (stockDisponible > 0 && cappedValue !== nextValue) {
        App.notify(`Máximo disponible: ${stockDisponible} unidades.`, 'info');
    }

    item.quantity = cappedValue;
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

App.updateHomeLinks = function () {
    const role = App.getRole();
    const homePath = role === 'admin'
        ? 'pages/home-administrador/index.html'
        : 'pages/home-usuario/index.html';

    document.querySelectorAll('[data-home-link], .navbar-brand').forEach(link => {
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (href.includes('pages/home-usuario') || href.includes('pages/home-administrador') || href.includes('pages/Inicio')) {
            link.setAttribute('href', `${App.getBasePath()}${homePath}`);
        }
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
    App.updateUserMenu();
    App.updateHomeLinks();
    App.updateCartBadge();
};

document.addEventListener('DOMContentLoaded', App.loadLayout);

window.App = App;