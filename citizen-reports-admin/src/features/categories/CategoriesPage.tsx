import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from './api'

export function CategoriesPage() {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Categorías</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/reports"
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100"
            >
              Reportes
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50"
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
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            Error al cargar categorías.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Cargando categorías…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-slate-600 font-semibold px-6 py-4">Nombre</th>
                    <th className="text-left text-slate-600 font-semibold px-6 py-4">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-16 text-center text-slate-500 font-medium">
                        No hay categorías.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{cat.name}</td>
                        <td className="px-6 py-4 text-slate-600">{cat.description ?? '—'}</td>
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
