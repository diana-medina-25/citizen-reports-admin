export type ReportStatus =
  | 'PENDING'
  | 'VALIDATED'
  | 'OBSERVED'
  | 'REJECTED'
  | 'IN_PROCESS'
  | 'CANCELLED'
  | 'FINALIZED'

export type ReportImage = {
  id: number
  report_id: number
  image_url: string
  created_at?: string
}

export type ReportHistoryEntry = {
  id: number
  admin?: { first_name: string; last_name: string; email: string } | null
  previous_status: ReportStatus | null
  new_status: ReportStatus
  comment: string | null
  created_at: string
}

export type Report = {
  id: string | number
  title: string
  description: string | null
  status: ReportStatus
  latitude?: number | string
  longitude?: number | string
  address?: string
  reference?: string
  country?: string
  department?: string
  district?: string
  imageUrl?: string
  imageBase64?: string
  images?: ReportImage[]
  history?: ReportHistoryEntry[]
  user?: { first_name: string; last_name: string; email: string }
  user_id?: number
  category_id?: number
  createdAt?: string
  updatedAt?: string
  created_at?: string
  updated_at?: string
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
  comment: string
}
