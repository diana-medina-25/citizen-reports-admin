import { Routes, Route, Navigate } from 'react-router-dom'
import { AUTH_TOKEN_KEY } from './config'
import { LoginPage } from '../features/auth/LoginPage'
import { ReportsPage } from '../features/reports/ReportsPage'
import { ReportDetailPage } from '../features/reports/ReportDetailPage'
import { CategoriesPage } from '../features/categories/CategoriesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute>
            <ReportDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/reports" replace />} />
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  )
}
