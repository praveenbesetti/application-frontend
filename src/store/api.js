// ─────────────────────────────────────────────────────────
// API CONFIG
// Change BASE_URL here when deploying to production
// ─────────────────────────────────────────────────────────
export const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://34.31.237.54:5000/api';

// Generic fetch wrapper
// Automatically attaches Bearer token if available in localStorage
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('qb_access_token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  // Token expired — clear local auth
  if (res.status === 401 && data.code === 'TOKEN_EXPIRED') {
    localStorage.removeItem('qb_access_token');
    localStorage.removeItem('qb_refresh_token');
    localStorage.removeItem('qb_user');
    window.dispatchEvent(new Event('auth:expired'));
  }

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}`);
  }

  return data;
};
