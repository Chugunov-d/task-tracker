import { useState } from 'react'

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await onCreate({ title: title.trim(), description: description.trim(), priority })
      setTitle('')
      setDescription('')
      setPriority('medium')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        className="task-form__input"
        placeholder="Название задачи"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
      />
      <input
        className="task-form__input"
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
      />
      <select
        className="task-form__select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Низкий приоритет</option>
        <option value="medium">Средний приоритет</option>
        <option value="high">Высокий приоритет</option>
      </select>
      <button className="task-form__submit" type="submit" disabled={submitting}>
        {submitting ? 'Добавление…' : 'Добавить'}
      </button>
    </form>
  )
}
