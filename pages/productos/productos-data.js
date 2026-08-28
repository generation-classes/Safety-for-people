const productos = [
    {
        id: 1,
        nombre: "Pulsera GPS Femenino",
        descripcion: "Ubicación en tiempo real, botón SOS y resistencia al agua para el día a día de los más pequeños.",
        precio: 189900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["emergencia", "ubicacion", "agua"],
        icono: "bi-smartwatch",
        color: "#DDEFFB",
        img: "../../Assets/images/products/1.png"
    },
    {
        id: 2,
        nombre: "Audifonos GPS integrado",
        descripcion: "Diseñada para jovenes y niños. con sistema inalámbrico y geolocalización.",
        precio: 199900,
        categoria: "audifonos",
        grupo: "adultos",
        caracteristicas: ["emergencia", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 3,
        nombre: "Reloj GPS Masculino",
        descripcion: "Localización precisa y monitoreo constante en un diseño elegante para uso diario.",
        precio: 249900,
        categoria: "relojes",
        grupo: "adultos",
        caracteristicas: ["ubicacion", "bateria"],
        icono: "bi-smartwatch",
        color: "#DFE8EC"
    },
    {
        id: 4,
        nombre: "Reloj GPS Explorer Boy",
        descripcion: "Resistente al agua y a los golpes, pensado para las aventuras diarias de los niños.",
        precio: 209900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 5,
        nombre: "Reloj GPS Explorer Girl",
        descripcion: "Resistente al agua y a los golpes, pensado para las aventuras diarias de los niños.",
        precio: 209900,
        categoria: "relojes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },

    {
        id: 6,
        nombre: "Gafas de sol GPS",
        descripcion: "Fácil de usar, con botón de emergencia.",
        precio: 159900,
        categoria: "gafas",
        grupo: "adultos",
        caracteristicas: ["emergencia", "ubicacion"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 7,
        nombre: "Arete GPS",
        descripcion: "Resistente al agua con batería de larga duración.",
        precio: 229900,
        categoria: "aretes",
        grupo: "ninos",
        caracteristicas: ["emergencia", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 8,
        nombre: "Arete GPS  Niña",
        descripcion: "Ligera y resistente al agua, ideal para acompañar a las niñas en sus actividades.",
        precio: 169900,
        categoria: "aretes",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 9,
        nombre: "Llavero GPS Femenino",
        descripcion: "Un accesorio discreto con seguimiento en tiempo real, ideal para el uso diario.",
        precio: 179900,
        categoria: "llavero",
        grupo: "adultos",
        caracteristicas: ["ubicacion"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 10,
        nombre: "Cadena GPS Delicada",
        descripcion: "Un accesorio discreto con seguimiento en tiempo real, ideal para el uso diario.",
        precio: 179900,
        categoria: "cadenas",
        grupo: "adultos",
        caracteristicas: ["ubicacion"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 11,
        nombre: "Pulsera GPS Básica Kids",
        descripcion: "Fácil de usar, con botón de emergencia al alcance de los más pequeños.",
        precio: 159900,
        categoria: "pulseras",
        grupo: "ninos",
        caracteristicas: ["emergencia", "ubicacion"],
        icono: "bi-smartwatch",
        color: "#DDEFFB"
    },
    {
        id: 12,
        nombre: "Pulsera GPS SOS Plus",
        descripcion: "Resistente al agua con batería de larga duración, pensada para adultos mayores.",
        precio: 229900,
        categoria: "pulseras",
        grupo: "adultos",
        caracteristicas: ["emergencia", "agua", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
    {
        id: 13,
        nombre: "Pulsera GPS Deportiva",
        descripcion: "Ligera y resistente al agua, ideal para acompañar a los niños en sus actividades deportivas.",
        precio: 169900,
        categoria: "cadenas",
        grupo: "ninos",
        caracteristicas: ["ubicacion", "agua"],
        icono: "bi-gem",
        color: "#FBE4EC"
    },
    {
        id: 14,
        nombre: "Pulsera GPS SOS Confort",
        descripcion: "Diseñada para adultos mayores, con botón de emergencia y batería de larga duración.",
        precio: 199900,
        categoria: "pulseras",
        grupo: "adultos",
        caracteristicas: ["emergencia", "bateria"],
        icono: "bi-smartwatch",
        color: "#DCEFEC"
    },
];

const MapaCaracteristicas = {
    emergencia: "Botón de emergencia",
    ubicacion: "Ubicación en tiempo real",
    agua: "Resistencia al agua",
    bateria: "Batería de larga duración"
};

function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-CO") + " COP";
}

function obtenerImagenProducto(producto) {
    return App.normalizeImagePath(producto.img, producto.id);
}