import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchReports } from './api'
import type { ReportStatus } from './types'

const STATUS_OPTIONS: { value: ReportStatus | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'VALIDATED', label: 'Validado' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'RESOLVED', label: 'Resuelto' },
]

const STATUS_STYLES: Record<ReportStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  VALIDATED: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLES[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

export function ReportsPage() {
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [titleSearch, setTitleSearch] = useState('')

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports', status, titleSearch],
    queryFn: () =>
      fetchReports({
        ...(status && { status }),
        ...(titleSearch.trim() && { title: titleSearch.trim() }),
      }),
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Reportes</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/reports"
              className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50"
            >
              Reportes
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
            >
              Categorías
            </Link>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('cr_admin_token')
                window.location.href = '/login'
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Filtros</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Buscar por título</label>
              <input
                type="text"
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                placeholder="Escribe el título del reporte..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="w-full sm:w-52">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReportStatus | '')}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            Error al cargar reportes. Intenta de nuevo.
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Cargando reportes…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-slate-600 font-semibold px-6 py-4">Título</th>
                    <th className="text-left text-slate-600 font-semibold px-6 py-4">Estado</th>
                    <th className="text-right text-slate-600 font-semibold px-6 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center">
                        <div className="text-slate-400 mb-2">
                          <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-medium">No hay reportes con los filtros seleccionados</p>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{report.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/reports/${report.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 shadow-sm transition-colors"
                          >
                            Ver detalle
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
