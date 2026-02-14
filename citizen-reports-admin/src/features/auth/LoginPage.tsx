import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from './api'
import { AUTH_TOKEN_KEY } from '../../app/config'

const DEFAULT_EMAIL = 'admin@citizenreport.com'
const DEFAULT_PASSWORD = 'AdminPassword123!'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'El correo es obligatorio.'
  if (!EMAIL_REGEX.test(value)) return 'Introduce un correo electrónico válido.'
  return null
}

function validatePassword(value: string): string | null {
  if (!value) return 'La contraseña es obligatoria.'
  if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  return null
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/reports', { replace: true })
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    if (emailError || passwordError) {
      setFieldErrors({
        ...(emailError && { email: emailError }),
        ...(passwordError && { password: passwordError }),
      })
      return
    }

    loginMutation.mutate({ email: email.trim(), password })
  }

  if (localStorage.getItem(AUTH_TOKEN_KEY)) {
    return <Navigate to="/reports" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden login-bg">
      {/* Overlay para legibilidad del formulario */}
      <div className="absolute inset-0 bg-slate-900/50" aria-hidden />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-200/80">
          {/* Logo / marca */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Citizen Reports
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
                }}
                required
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={`w-full rounded-xl bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                  fieldErrors.email ? 'border-2 border-red-400 focus:border-red-400' : 'border border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="admin@citizenreport.com"
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="sr-only">Error:</span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
                }}
                required
                autoComplete="current-password"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className={`w-full rounded-xl bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow ${
                  fieldErrors.password ? 'border-2 border-red-400 focus:border-red-400' : 'border border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="sr-only">Error:</span>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loginMutation.isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-6">
            Acceso restringido a administradores
          </p>
        </div>
      </div>
    </div>
  )
}
