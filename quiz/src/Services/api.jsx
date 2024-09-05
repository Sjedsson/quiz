import { getToken } from './auth';

const API_BASE_URL = import.meta.env.MODE === 'development' ? '/api' : 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com';

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };


  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }


  return response.json();
};

export const get = (endpoint) => apiFetch(endpoint, { method: 'GET' });

export const post = (endpoint, body) => apiFetch(endpoint, {
  method: 'POST',
  body: JSON.stringify(body),
});

export const put = (endpoint, body) => apiFetch(endpoint, {
  method: 'PUT',
  body: JSON.stringify(body),
});

export const del = (endpoint) => apiFetch(endpoint, { method: 'DELETE' });

export default {
  get,
  post,
  put,
  del,
};
