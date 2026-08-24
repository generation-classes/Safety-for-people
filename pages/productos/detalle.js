const etiquetasCaracteristicas = { emergencia: 'Botón de emergencia', agua: 'Resistencia al agua', ubicacion: 'Ubicación en tiempo real', bateria: 'Batería de larga duración' };
const formatearPrecio = valor => `$${valor.toLocaleString('es-CO')} COP`;
document.addEventListener('DOMContentLoaded', () => {
  const id = Number(new URLSearchParams(window.location.search).get('id'));
  const producto = window.SAPE_PRODUCTOS.find(item => item.id === id);
  if (!producto) { document.querySelector('.detalle-contenido').innerHTML = '<p class="text-center">No encontramos el producto solicitado. <a href="index.html">Volver al catálogo</a></p>'; return; }
  document.title = `${producto.nombre} | SAPE`;
  document.getElementById('breadcrumbProducto').textContent = producto.nombre;
  document.getElementById('imagenProducto').src = producto.imagen;
  document.getElementById('imagenProducto').alt = producto.nombre;
  document.getElementById('categoriaProducto').innerHTML = `<i class="bi bi-tag-fill"></i> ${producto.categoria.toUpperCase()}`;
  document.getElementById('nombreProducto').textContent = producto.nombre;
  document.getElementById('precioProducto').textContent = formatearPrecio(producto.precio);
  document.getElementById('descripcionProducto').textContent = producto.descripcion;
  document.getElementById('caracteristicasProducto').innerHTML = producto.caracteristicas.map(caracteristica => `<li><i class="bi bi-check-circle-fill"></i>${etiquetasCaracteristicas[caracteristica]}</li>`).join('');
  const inputCantidad = document.getElementById('cantidadProducto');
  const cantidadActual = () => Math.max(1, Number(inputCantidad.value) || 1);
  document.getElementById('btnDisminuir').addEventListener('click', () => { inputCantidad.value = Math.max(1, cantidadActual() - 1); });
  document.getElementById('btnAumentar').addEventListener('click', () => { inputCantidad.value = cantidadActual() + 1; });
  inputCantidad.addEventListener('change', () => { inputCantidad.value = cantidadActual(); });
  document.getElementById('btnAgregarCarrito').addEventListener('click', () => {
    App.addToCart(producto, cantidadActual());
  });
});


