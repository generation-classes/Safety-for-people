async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('sape_token');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeader,
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        let message = `Error ${response.status} al conectar con la API`;
        try {
            const errorBody = await response.json();
            message = errorBody.message || errorBody.error || message;
        } catch {
            // el backend no siempre devuelve un cuerpo JSON en los errores
        }
        throw new Error(message);
    }

    if (response.status === 204) return null;

    // Algunos endpoints (ej. POST /api/favorites/{id}) responden 200/201 sin cuerpo.
    const texto = await response.text();
    return texto ? JSON.parse(texto) : null;
}

const FavoritesService = {
    getMine: () => apiRequest(ENDPOINTS.favorites.mine),
    add: (productId) => apiRequest(ENDPOINTS.favorites.byProductId(productId), { method: 'POST' }),
    remove: (productId) => apiRequest(ENDPOINTS.favorites.byProductId(productId), { method: 'DELETE' }),
};

const AuthService = {
    login: (email, password) => apiRequest(ENDPOINTS.auth.login, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),
    // data: { email, password, nombre, roleId }
    register: (data) => apiRequest(ENDPOINTS.auth.register, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

const CategoriesService = {
    getAll: () => apiRequest(ENDPOINTS.categories.base),
    getActive: () => apiRequest(ENDPOINTS.categories.active),
    getById: (id) => apiRequest(ENDPOINTS.categories.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.categories.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

const ProductsService = {
    getAll: () => apiRequest(ENDPOINTS.products.base),
    getById: (id) => apiRequest(ENDPOINTS.products.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.products.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(ENDPOINTS.products.byId(id), {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    remove: (id) => apiRequest(ENDPOINTS.products.byId(id), {
        method: 'DELETE',
    }),
};

const RolesService = {
    getAll: () => apiRequest(ENDPOINTS.roles.base),
    getActive: () => apiRequest(ENDPOINTS.roles.active),
    getById: (id) => apiRequest(ENDPOINTS.roles.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.roles.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

const SalesService = {
    getAll: () => apiRequest(ENDPOINTS.sales.base),
    getMine: () => apiRequest(ENDPOINTS.sales.mine),
    getById: (id) => apiRequest(ENDPOINTS.sales.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.sales.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(ENDPOINTS.sales.byId(id), {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    remove: (id) => apiRequest(ENDPOINTS.sales.byId(id), {
        method: 'DELETE',
    }),
};

const StatusesService = {
    getAll: () => apiRequest(ENDPOINTS.statuses.base),
    getById: (id) => apiRequest(ENDPOINTS.statuses.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.statuses.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(ENDPOINTS.statuses.byId(id), {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    remove: (id) => apiRequest(ENDPOINTS.statuses.byId(id), {
        method: 'DELETE',
    }),
};

const UsersService = {
    getAll: () => apiRequest(ENDPOINTS.users.base),
    getById: (id) => apiRequest(ENDPOINTS.users.byId(id)),
    create: (data) => apiRequest(ENDPOINTS.users.base, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiRequest(ENDPOINTS.users.byId(id), {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    remove: (id) => apiRequest(ENDPOINTS.users.byId(id), {
        method: 'DELETE',
    }),
};

window.AuthService = AuthService;
window.FavoritesService = FavoritesService;
window.CategoriesService = CategoriesService;
window.ProductsService = ProductsService;
window.RolesService = RolesService;
window.SalesService = SalesService;
window.StatusesService = StatusesService;
window.UsersService = UsersService;
