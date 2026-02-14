export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://backendreporteciudadano-production.up.railway.app/api',
} as const

export const AUTH_TOKEN_KEY = 'cr_admin_token'
