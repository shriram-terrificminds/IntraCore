// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// /**
//  * Fetch inventory requests with optional filters (status, search, role_id, pagination, etc.)
//  * @param {object} params - Filters and pagination (status, search, role_id, page, etc.)
//  */
// // export const getInventoryRequests = (params = {}) =>
// //   api.post('/inventory-requests/list', params).then(res => res.data);

// export const getInventoryRequests = (params = {}) =>
//   api.get('/inventory-requests', { params }).then(res => res.data);


// /**
//  * Create a new inventory request
//  * @param {object} data - { title, description, role_id }
//  */
// export const createInventoryRequest = (data) =>
//   api.post('/inventory-requests', data).then(res => res.data);

// /**
//  * Update the status of an inventory request
//  * @param {string|number} id - Inventory request ID
//  * @param {string} status - New status (Approved, Rejected, etc.)
//  */
// export const updateInventoryRequestStatus = (id, status) =>
//   api.patch(`/inventory-requests/${id}/status`, { status }).then(res => res.data);

// export default api; 


// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Log error but don't block frontend UI rendering
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getInventoryRequests = async (params = {}) => {
  try {
    const res = await api.post('/inventory-requests/list', params);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch inventory requests:', error);
    return { data: [], last_page: 1 }; // return empty fallback
  }
};

export const createInventoryRequest = async (data) => {
  try {
    const res = await api.post('/inventory-requests', data);
    return res.data?.data || res.data; // return newly created request
  } catch (error) {
    console.error('Failed to create inventory request:', error);
    throw error;
  }
};

export const updateInventoryRequestStatus = async (id, status) => {
  try {
    const res = await api.patch(`/inventory-requests/${id}/status`, { status });
    return res.data;
  } catch (error) {
    console.error('Failed to update inventory request status:', error);
    throw error;
  }
};

export default api;
