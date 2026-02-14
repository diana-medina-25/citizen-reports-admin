import { config, AUTH_TOKEN_KEY } from '../../app/config'

export class HttpError extends Error {
  status: number
  body?: unknown
  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
  headers?: Record<string, string>
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, headers: customHeaders = {} } = options
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = path.startsWith('http') ? path : `${config.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  const response = await fetch(url, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  if (response.status === 401) {
    clearAuthToken()
    window.location.href = '/login'
    throw new HttpError('No autorizado', 401)
  }

  if (!response.ok) {
    let bodyParsed: unknown
    try {
      bodyParsed = await response.json()
    } catch {
      bodyParsed = await response.text()
    }
    throw new HttpError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
      bodyParsed
    )
  }

  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as Promise<T>
}
