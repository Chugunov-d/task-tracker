const PRIORITY_LABEL = { low: 'Низкий', medium: 'Средний', high: 'Высокий' }

export default function TaskList({ tasks, onToggleDone, onDelete }) {
  if (tasks.length === 0) {
    return <div className="state-msg">Задач пока нет — добавьте первую выше.</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-card task-card--${task.priority}`}>
          <label className="task-card__check">
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={() => onToggleDone(task)}
            />
          </label>

          <div className="task-card__body">
            <div className={`task-card__title ${task.is_done ? 'task-card__title--done' : ''}`}>
              {task.title}
            </div>
            {task.description && (
              <div className="task-card__description">{task.description}</div>
            )}
            <div className="task-card__meta">
              <span className={`badge badge--${task.priority}`}>
                {PRIORITY_LABEL[task.priority]}
              </span>
              <span className="task-card__date">
                {new Date(task.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            className="task-card__delete"
            onClick={() => onDelete(task.id)}
            aria-label="Удалить задачу"
            title="Удалить"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
