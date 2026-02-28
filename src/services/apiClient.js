import { API_BASE_URL } from '../config/api'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = payload?.message || payload?.title || payload?.error || `Error HTTP ${response.status}`
    throw new Error(message)
  }

  return payload
}
