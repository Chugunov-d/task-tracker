// URL бэкенда берём из переменной окружения, заданной на этапе сборки.
// Это важно для следующих этапов: в Docker/K8s фронтенд и бэкенд будут
// жить в разных контейнерах/подах, и адрес бэкенда должен настраиваться
// снаружи, а не быть зашит в код.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch {
      // ответ мог быть пустым (например, 204) — это нормально
    }
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  listTasks: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.done !== undefined && filters.done !== null) {
      params.set('done', filters.done)
    }
    if (filters.priority) {
      params.set('priority', filters.priority)
    }
    const qs = params.toString()
    return request(`/tasks${qs ? `?${qs}` : ''}`)
  },
  createTask: (task) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, patch) =>
    request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(patch) }),
  markDone: (id) => request(`/tasks/${id}/done`, { method: 'PATCH' }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
}
