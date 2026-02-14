export type ReportStatus = 'PENDING' | 'VALIDATED' | 'IN_PROGRESS' | 'RESOLVED'

export type Report = {
  id: string
  title: string
  description: string
  status: ReportStatus
  latitude?: number
  longitude?: number
  imageUrl?: string
  imageBase64?: string
  createdAt?: string
  updatedAt?: string
  categoryId?: string
  userId?: string
  [key: string]: unknown
}

export type ReportListParams = {
  status?: ReportStatus
  title?: string
}

export type UpdateStatusBody = {
  status: ReportStatus
}

export type AddCommentBody = {
  content: string
}
