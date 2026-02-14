import { config, AUTH_TOKEN_KEY } from '../../app/config'
import type { LoginCredentials, LoginResponse } from './types'

/** Mensaje amigable cuando el backend devuelve error genérico (ej. 500 Internal Server Error por credenciales incorrectas) */
function getLoginErrorMessage(status: number, body: unknown): string {
  const message = typeof body === 'object' && body !== null && 'message' in body
    ? String((body as { message: unknown }).message)
    : ''

  const isAuthError = status === 401
  const isServerError = status >= 500
  const isInternalError = /internal\s*server\s*error/i.test(message)

  if (isAuthError || (isServerError && isInternalError)) {
    return 'Correo o contraseña incorrectos. Verifica tus credenciales.'
  }
  if (message) return message
  if (status === 401) return 'Correo o contraseña incorrectos.'
  if (status >= 500) return 'Error del servidor. Intenta de nuevo en unos momentos.'
  return 'No se pudo iniciar sesión. Verifica tus datos.'
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const url = `${config.apiBaseUrl.replace(/\/$/, '')}/auth/login`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  let body: unknown
  try {
    const text = await response.text()
    body = text ? JSON.parse(text) : {}
  } catch {
    body = {}
  }

  if (!response.ok) {
    throw new Error(getLoginErrorMessage(response.status, body))
  }

  const data = body as LoginResponse
  if (data.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token)
  }
  return data
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  window.location.href = '/login'
}
