import axios from 'axios';

const API_URL =
  import.meta.env.VITE_APP_BASE_URL  || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL : API_URL + '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export const shortenUrl = async (originalUrl) => {
  if (!originalUrl?.trim()) throw new Error('URL is required');

  const res = await api.post('shorten', { originalUrl: originalUrl.trim() });
  return res.data;
};

export const getAllLinks = async () => {
  const res = await api.get('listLinks');
  return res.data;
};

export const getStats = async (shortCode) => {
  if (!shortCode) throw new Error('Short code is required');
  const res = await api.get(`stats/${shortCode}`);
  return res.data;
};

export const deleteLink = async (id) => {
  if (!id) throw new Error('Link ID is required');
  await api.delete(`cascade/${id}`);
};