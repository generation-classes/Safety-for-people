document.addEventListener("DOMContentLoaded", () => {
  const productos = Array.from(document.querySelectorAll(".producto-card"));

  const cantidadProductos = document.getElementById("cantidadProductos");

  const ordenar = document.getElementById("ordenar");

  const precioMaximo = document.getElementById("precioMaximo");

  const valorPrecio = document.getElementById("valorPrecio");

  const categorias = document.querySelectorAll('input[name="categoria"]');

  // FILTRAR PRODUCTOS

  function filtrarProductos() {
    // Obtener categorías seleccionadas
    const categoriasSeleccionadas = Array.from(categorias)
      .filter((categoria) => categoria.checked)
      .map((categoria) => categoria.value);

    // Obtener precio máximo
    const precioSeleccionado = Number(precioMaximo.value);

    let cantidadVisibles = 0;

    // RECORRER TODOS LOS PRODUCTOS

    productos.forEach((producto) => {
      const categoriaProducto = producto.dataset.categoria;

      const precioProducto = Number(producto.dataset.precio);

      // FILTRO POR CATEGORÍA

      const mostrarPorCategoria =
        categoriasSeleccionadas.length === 0 ||
        categoriasSeleccionadas.includes("todos") ||
        categoriasSeleccionadas.includes(categoriaProducto);

      // FILTRO POR PRECIO

      const mostrarPorPrecio = precioProducto <= precioSeleccionado;

      // MOSTRAR / OCULTAR

      if (mostrarPorCategoria && mostrarPorPrecio) {
        producto.style.display = "";

        cantidadVisibles++;
      } else {
        producto.style.display = "none";
      }
    });

    // ACTUALIZAR CONTADOR

    cantidadProductos.textContent = `Mostrando ${cantidadVisibles} productos`;
  }

  // EVENTOS DE CATEGORÍAS

  categorias.forEach((categoria) => {
    categoria.addEventListener("change", () => {
      if (categoria.value === "todos" && categoria.checked) {
        categorias.forEach((otraCategoria) => {
          if (otraCategoria.value !== "todos") {
            otraCategoria.checked = false;
          }
        });
      }

      // SI SE SELECCIONA OTRA CATEGORÍA

      if (categoria.value !== "todos" && categoria.checked) {
        const todos = document.querySelector(
          'input[name="categoria"][value="todos"]',
        );

        if (todos) {
          todos.checked = false;
        }
      }

      // Si no queda ninguna seleccionada,
      // volver a "Todos"

      const algunaSeleccionada = Array.from(categorias).some(
        (opcion) => opcion.checked,
      );

      if (!algunaSeleccionada) {
        const todos = document.querySelector(
          'input[name="categoria"][value="todos"]',
        );

        if (todos) {
          todos.checked = true;
        }
      }

      filtrarProductos();
    });
  });

  // EVENTO DEL RANGO DE PRECIO

  precioMaximo.addEventListener("input", () => {
    valorPrecio.textContent = `$${Number(precioMaximo.value).toLocaleString(
      "es-CO",
    )} COP`;

    filtrarProductos();
  });

  // ORDENAR PRODUCTOS

  ordenar.addEventListener("change", () => {
    const grid = document.querySelector(".productos-grid");

    const productosOrdenados = [...productos];

    productosOrdenados.sort((a, b) => {
      // POR PRECIO

      if (ordenar.value === "precio") {
        return Number(a.dataset.precio) - Number(b.dataset.precio);
      }

      // POR NOMBRE

      if (ordenar.value === "nombre") {
        const nombreA = a.querySelector("h3").textContent.trim();

        const nombreB = b.querySelector("h3").textContent.trim();

        return nombreA.localeCompare(nombreB, "es", {
          sensitivity: "base",
        });
      }

      return 0;
    });

    // Volver a insertar los productos
    productosOrdenados.forEach((producto) => {
      grid.appendChild(producto);
    });

    // Aplicar nuevamente los filtros
    filtrarProductos();
  });

  filtrarProductos();
});
