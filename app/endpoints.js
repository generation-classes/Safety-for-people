const API_BASE_URL = 'https://safety-for-people-backend.onrender.com';

const ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
    },
    favorites: {
        mine: `${API_BASE_URL}/api/favorites/mine`,
        byProductId: (productId) => `${API_BASE_URL}/api/favorites/${productId}`,
    },
    categories: {
        base: `${API_BASE_URL}/api/categories`,
        active: `${API_BASE_URL}/api/categories/active`,
        byId: (id) => `${API_BASE_URL}/api/categories/${id}`,
    },
    products: {
        base: `${API_BASE_URL}/api/productos`,
        byId: (id) => `${API_BASE_URL}/api/productos/${id}`,
        imagen: (id) => `${API_BASE_URL}/api/productos/${id}/imagen`,
    },
    roles: {
        base: `${API_BASE_URL}/api/roles`,
        active: `${API_BASE_URL}/api/roles/active`,
        byId: (id) => `${API_BASE_URL}/api/roles/${id}`,
    },
    sales: {
        base: `${API_BASE_URL}/api/sales`,
        mine: `${API_BASE_URL}/api/sales/mine`,
        byId: (id) => `${API_BASE_URL}/api/sales/${id}`,
    },
    statuses: {
        base: `${API_BASE_URL}/api/statuses`,
        byId: (id) => `${API_BASE_URL}/api/statuses/${id}`,
    },
    users: {
        base: `${API_BASE_URL}/api/users`,
        byId: (id) => `${API_BASE_URL}/api/users/${id}`,
    },
};

window.API_BASE_URL = API_BASE_URL;
window.ENDPOINTS = ENDPOINTS;
