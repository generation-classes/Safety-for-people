const App = {
    pages: {
        inicio: 'pages/home-usuario/index.html',
        productos: 'pages/productos/index.html',
        categorias: 'pages/categorias/index.html',
        aboutUs: 'pages/about-us/index.html',
        contacto: 'pages/contacto/index.html',
        admin: 'pages/home-administrador/index.html',
        carrito: 'pages/carrito/index.html',
    },
};

App.getBasePath = function () {
    const match = window.location.pathname.match(/\/pages\/(.+)$/);
    if (!match) return '';
    return '../'.repeat(match[1].split('/').length);
};

App.getRole = function () { return localStorage.getItem('sape_role') || 'user'; };

App.setupRoleSwitch = function (base) {
    const radios = document.querySelectorAll('input[name="userRole"]');
    if (!radios.length) return;
    const currentRole = App.getRole();
    radios.forEach(radio => { radio.checked = radio.value === currentRole; });
    radios.forEach(radio => radio.addEventListener('change', () => {
        if (!radio.checked) return;
        localStorage.setItem('sape_role', radio.value);
        window.location.href = base + (radio.value === 'admin' ? App.pages.admin : App.pages.inicio);
    }));
};

App.getCart = function () {
    try {
        const carrito = JSON.parse(localStorage.getItem('sape_carrito'));
        if (!Array.isArray(carrito)) return [];
        return carrito.filter(item => item && Number(item.id) && Number(item.cantidad) > 0).map(item => {
            const producto = window.SAPE_PRODUCTOS && window.SAPE_PRODUCTOS.find(productoCatalogo => productoCatalogo.id === item.id);
            return producto ? { ...item, nombre: item.nombre || producto.nombre, precio: item.precio || producto.precio, imagen: item.imagen || producto.imagen } : item;
        });
    } catch { return []; }
};

App.saveCart = function (carrito) {
    localStorage.setItem('sape_carrito', JSON.stringify(carrito));
    window.dispatchEvent(new Event('sape:carrito-actualizado'));
};

App.addToCart = function (producto, cantidad = 1) {
    if (!producto) return;
    const carrito = App.getCart();
    const item = carrito.find(itemCarrito => itemCarrito.id === producto.id);
    if (item) {
        item.cantidad += cantidad;
        Object.assign(item, { nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
    } else {
        carrito.push({ id: producto.id, cantidad, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen });
    }
    App.saveCart(carrito);
};

App.changeCartQuantity = function (id, cambio) {
    const carrito = App.getCart();
    const item = carrito.find(itemCarrito => itemCarrito.id === id);
    if (!item) return;
    item.cantidad += cambio;
    App.saveCart(carrito.filter(itemCarrito => itemCarrito.cantidad > 0));
};

App.formatPrice = function (valor) { return `$${Number(valor).toLocaleString('es-CO')} COP`; };

App.updateCartIndicator = function () {
    const link = document.getElementById('navbarCart');
    const icon = document.getElementById('navbarCartIcon');
    const badge = document.getElementById('navbarCartBadge');
    if (!link || !icon || !badge) return;
    const cantidad = App.getCart().reduce((total, item) => total + item.cantidad, 0);
    icon.className = `bi ${cantidad > 0 ? 'bi-cart-fill' : 'bi-cart3'}`;
    link.setAttribute('aria-label', cantidad > 0 ? `Carrito con ${cantidad} producto${cantidad === 1 ? '' : 's'}` : 'Carrito vacío');
    badge.textContent = cantidad;
    badge.hidden = cantidad === 0;
};

App.renderCartComponent = function () {
    const itemsRoot = document.getElementById('carritoItems');
    if (!itemsRoot) return;
    const carrito = App.getCart();
    const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    const total = carrito.reduce((acumulado, item) => acumulado + Number(item.precio || 0) * item.cantidad, 0);
    document.getElementById('contadorCarrito').textContent = totalUnidades;
    document.getElementById('totalCarrito').textContent = App.formatPrice(total);
    document.getElementById('carritoVacio').hidden = carrito.length > 0;
    itemsRoot.innerHTML = carrito.map(item => `<div class="carrito-item"><img src="${item.imagen || ''}" alt=""><div class="carrito-item-info"><strong>${item.nombre || 'Producto'}</strong><span>${App.formatPrice(Number(item.precio || 0) * item.cantidad)}</span><div class="cantidad-control"><button type="button" data-cambio="-1" data-id="${item.id}" aria-label="Restar una unidad">−</button><span>${item.cantidad}</span><button type="button" data-cambio="1" data-id="${item.id}" aria-label="Sumar una unidad">+</button></div></div></div>`).join('');
};

App.setupCartComponent = function () {
    const itemsRoot = document.getElementById('carritoItems');
    if (!itemsRoot) return;
    itemsRoot.addEventListener('click', event => {
        const boton = event.target.closest('[data-cambio]');
        if (boton) App.changeCartQuantity(Number(boton.dataset.id), Number(boton.dataset.cambio));
    });
    App.renderCartComponent();
};

window.addEventListener('sape:carrito-actualizado', () => {
    App.updateCartIndicator();
    App.renderCartComponent();
});
window.addEventListener('storage', event => { if (event.key === 'sape_carrito') { App.updateCartIndicator(); App.renderCartComponent(); } });

App.loadLayout = async function () {
    const base = App.getBasePath();
    const currentPage = document.body.dataset.page;
    const targets = [
        { id: 'site-header', file: 'components/navbar.html' },
        { id: 'site-footer', file: 'components/footer.html' },
        { id: 'cart-component', file: 'components/carrito.html' },
    ];
    await Promise.all(targets.map(async ({ id, file }) => {
        const mount = document.getElementById(id);
        if (!mount) return;
        const response = await fetch(`${base}${file}`);
        const markup = await response.text();
        mount.innerHTML = markup.replaceAll('{{base}}', base);
    }));
    if (currentPage) document.querySelectorAll(`[data-page="${currentPage}"]`).forEach(link => link.classList.add('active'));
    App.setupRoleSwitch(base);
    App.updateCartIndicator();
    App.setupCartComponent();
};

document.addEventListener('DOMContentLoaded', App.loadLayout);
window.App = App;


