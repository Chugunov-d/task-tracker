import { useEffect, useState, useCallback } from 'react'
import { api } from './api'
import TaskForm from './TaskForm.jsx'
import TaskList from './TaskList.jsx'

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'done', label: 'Выполненные' },
]

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const doneFilter = filter === 'done' ? true : filter === 'active' ? false : undefined
      const data = await api.listTasks({ done: doneFilter })
      setTasks(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleCreate(task) {
    await api.createTask(task)
    loadTasks()
  }

  async function handleToggleDone(task) {
    if (task.is_done) {
      await api.updateTask(task.id, { is_done: false })
    } else {
      await api.markDone(task.id)
    }
    loadTasks()
  }

  async function handleDelete(id) {
    await api.deleteTask(id)
    loadTasks()
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Tracker</h1>
        <p className="app__subtitle">Учебный проект: сначала код, дальше — DevOps</p>
      </header>

      <main className="app__main">
        <TaskForm onCreate={handleCreate} />

        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filters__btn ${filter === f.key ? 'filters__btn--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <div className="error-banner">Ошибка: {error}</div>}
        {loading ? (
          <div className="state-msg">Загрузка…</div>
        ) : (
          <TaskList tasks={tasks} onToggleDone={handleToggleDone} onDelete={handleDelete} />
        )}
      </main>
    </div>
  )
}
