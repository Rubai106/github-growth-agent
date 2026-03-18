import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor — always return data.data or throw with message ──
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out. GitHub may be slow — try again.' : null) ||
      (err.code === 'ERR_NETWORK' ? 'Cannot connect to server. Make sure the backend is running on port 5000.' : null) ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const analyzeRepo = (repoUrl) =>
  api.post('/repo/analyze', { repoUrl });

export const generateReadme = (formData) =>
  api.post('/readme/generate', formData);

export const analyzeProfile = (username) =>
  api.get(`/profile/${username}`);

export const checkHealth = () =>
  api.get('/health');

export default api;
