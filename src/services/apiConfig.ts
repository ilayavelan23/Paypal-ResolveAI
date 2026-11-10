/**
 * Centralized API Gateway Configuration
 *
 * Configures the backend API base URL using production environment variable `VITE_API_BASE_URL`.
 * - In local development: Left blank or unset to leverage Vite's local reverse proxy (/api -> http://127.0.0.1:8000).
 * - In production (e.g. Vercel): Set VITE_API_BASE_URL=https://paypal-resolveai-backend.onrender.com
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
};
