import store from '../app/store';
import { expireSession } from '../features/auth/authSlice';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Base fetch wrapper with automatic JWT header injection and 401 session expiry handling
 */
export async function apiRequest(endpoint, options = {}) {
  const token = store.getState().auth.token || localStorage.getItem('warehouse_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    // If session expired or unauthorized
    if (response.status === 401 || response.status === 403) {
      if (store.getState().auth.isAuthenticated) {
        store.dispatch(expireSession());
      }
    }

    const data = await response.json().catch(() => ({}));
    return { response, data, ok: response.ok };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}
