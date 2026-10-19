// API helper for dynamic endpoint resolution between Hostinger (Frontend) and VPS (Backend)
const BASE_URL = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return BASE_URL ? `${BASE_URL}${cleanEndpoint}` : cleanEndpoint;
}
