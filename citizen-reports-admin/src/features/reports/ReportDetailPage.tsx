import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchReportById, updateReportStatus, addReportComment } from './api'
import type { ReportStatus } from './types'

const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'VALIDATED', label: 'Validado' },
  { value: 'OBSERVED', label: 'Observado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'IN_PROCESS', label: 'En proceso' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'FINALIZED', label: 'Finalizado' },
]

const STATUS_STYLES: Record<ReportStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  VALIDATED: 'bg-blue-100 text-blue-800 border-blue-200',
  OBSERVED: 'bg-sky-100 text-sky-800 border-sky-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  IN_PROCESS: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
  FINALIZED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

function StatusBadge({ status }: { status: ReportStatus }) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${style}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => fetchReportById(id!),
    enabled: !!id,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: ReportStatus) => updateReportStatus(id!, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['report', id] }),
  })

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) => addReportComment(id!, { comment }),
    onSuccess: () => {
      setComment('')
      queryClient.invalidateQueries({ queryKey: ['report', id] })
    },
  })

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">ID de reporte no válido.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Cargando reporte…</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <p className="text-red-600 font-medium mb-4">No se pudo cargar el reporte.</p>
          <Link to="/reports" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Volver a reportes
          </Link>
        </div>
      </div>
    )
  }

  const imgSrc = report.imageUrl ?? report.imageBase64
  const mapsUrl =
    report.latitude != null && report.longitude != null
      ? `https://www.google.com/maps?q=${report.latitude},${report.longitude}`
      : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Reportes
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/reports" className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50">Reportes</Link>
            <Link to="/categories" className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100">Categorías</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusBadge status={report.status} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">{report.title}</h1>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{report.description}</p>

            {(report.latitude != null || report.longitude != null) && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-1">Ubicación</p>
                <p className="text-slate-700 text-sm">{report.latitude}, {report.longitude}</p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    Ver en Google Maps
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {imgSrc && (
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-500 mb-2">Evidencia</p>
                <img
                  src={imgSrc}
                  alt="Evidencia del reporte"
                  className="rounded-xl border border-slate-200 max-w-full max-h-96 object-contain bg-slate-50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Cambiar estado */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Cambiar estado</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateStatusMutation.mutate(opt.value)}
                disabled={updateStatusMutation.isPending || report.status === opt.value}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors disabled:opacity-50 ${
                  report.status === opt.value
                    ? STATUS_STYLES[opt.value]
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comentario */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Añadir comentario</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => comment.trim() && addCommentMutation.mutate(comment.trim())}
              disabled={addCommentMutation.isPending || !comment.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 disabled:opacity-50 shadow-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
