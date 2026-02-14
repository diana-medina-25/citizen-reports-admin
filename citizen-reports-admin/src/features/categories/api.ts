import { http } from '../../shared/api/http'
import type { Category } from './types'

export function fetchCategories(): Promise<Category[]> {
  return http<Category[]>('/categories')
}
