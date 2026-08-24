const productos = window.SAPE_PRODUCTOS;
const $ = selector => document.querySelector(selector);
const formatearPrecio = valor => `$${valor.toLocaleString('es-CO')} COP`;

function obtenerProductosFiltrados() {
  const categoria = $('.filtro-categoria:checked').value;
  const precioMaximo = Number($('#filtroPrecio').value);
  const caracteristicas = [...document.querySelectorAll('.filtro-caracteristica:checked')].map(input => input.value);
  const orden = $('#ordenar').value;
  const resultado = productos.filter(producto => {
    const coincideCategoria = categoria === 'todos' || producto.categoria === categoria || producto.grupo === categoria;
    return coincideCategoria && producto.precio <= precioMaximo && caracteristicas.every(caracteristica => producto.caracteristicas.includes(caracteristica));
  });
  return resultado.sort((a, b) => orden === 'precio-asc' ? a.precio - b.precio : orden === 'precio-desc' ? b.precio - a.precio : a.nombre.localeCompare(b.nombre, 'es'));
}

function renderizarProductos() {
  const filtrados = obtenerProductosFiltrados();
  $('#cantidadProductos').textContent = `Mostrando ${filtrados.length} producto${filtrados.length === 1 ? '' : 's'}`;
  $('#sinResultados').hidden = filtrados.length !== 0;
  $('#productosGrid').innerHTML = filtrados.map(producto => `<article class="producto-card"><a class="producto-imagen" href="detalle.html?id=${producto.id}" aria-label="Ver detalle de ${producto.nombre}"><img src="${producto.imagen}" alt="${producto.nombre}"></a><div class="producto-info"><h3><a class="producto-detalle-link" href="detalle.html?id=${producto.id}">${producto.nombre}</a></h3><p>${producto.descripcion}</p><div class="producto-footer"><span class="producto-precio">${formatearPrecio(producto.precio)}</span><button class="agregar-carrito" type="button" data-id="${producto.id}" aria-label="Agregar ${producto.nombre} al carrito"><i class="bi bi-cart3"></i></button></div></div></article>`).join('');
}

function actualizarFiltros() {
  $('#precioSeleccionado').textContent = formatearPrecio(Number($('#filtroPrecio').value));
  renderizarProductos();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filtro-categoria, .filtro-caracteristica').forEach(input => input.addEventListener('change', renderizarProductos));
  $('#filtroPrecio').addEventListener('input', actualizarFiltros);
  $('#ordenar').addEventListener('change', renderizarProductos);
  $('#productosGrid').addEventListener('click', event => {
    const boton = event.target.closest('.agregar-carrito');
    if (boton) App.addToCart(productos.find(producto => producto.id === Number(boton.dataset.id)));
  });
  actualizarFiltros();
});
