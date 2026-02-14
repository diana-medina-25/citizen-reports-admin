import { http } from '../../shared/api/http'
import type { Report, ReportListParams, UpdateStatusBody, AddCommentBody } from './types'

export function fetchReports(params?: ReportListParams): Promise<Report[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set('status', params.status)
  if (params?.title) search.set('title', params.title)
  const query = search.toString()
  return http<Report[]>(`/reports${query ? `?${query}` : ''}`)
}

export function fetchReportById(id: string): Promise<Report> {
  return http<Report>(`/reports/${id}`)
}

export function updateReportStatus(id: string, body: UpdateStatusBody): Promise<Report> {
  return http<Report>(`/reports/${id}/status`, { method: 'PATCH', body })
}

export function addReportComment(id: string, body: AddCommentBody): Promise<unknown> {
  return http<unknown>(`/reports/${id}/comment`, { method: 'POST', body })
}
