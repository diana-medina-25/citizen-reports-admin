import { http } from '../../shared/api/http'
import type { User } from './types'

export function fetchUsers(): Promise<User[]> {
  return http<User[]>('/users')
}
