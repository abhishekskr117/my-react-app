import useAuthStore from '../stores/authStore';

const API_BASE_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = useAuthStore.getState().token;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

export const authAPI = {
  login: (credentials) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  create: (item) => apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
};

export const salesAPI = {
  getAll: () => apiRequest('/sales'),
  create: (sale) => apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(sale),
  }),
};

export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  create: (order) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
};

export const workordersAPI = {
  getAll: () => apiRequest('/workorders'),
  create: (workorder) => apiRequest('/workorders', {
    method: 'POST',
    body: JSON.stringify(workorder),
  }),
};

export const reportsAPI = {
  getSalesReport: () => apiRequest('/reports/sales'),
  getInventoryReport: () => apiRequest('/reports/inventory'),
};