# Task Tracker

Учебный проект: небольшое full-stack приложение (FastAPI + React),
которое служит основой для поэтапной DevOps-практики
(Docker → CI/CD → микросервисы → Kubernetes → Ingress → Terraform → мониторинг).

## Стек

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite (локально)
- **Frontend:** React 18, Vite

## Запуск бэкенда

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Бэкенд поднимется на `http://localhost:8000`.
Документация API (Swagger UI): `http://localhost:8000/docs`.
Health-check: `http://localhost:8000/health`.

## Запуск фронтенда

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Фронтенд поднимется на `http://localhost:5173`.

## API

| Метод | Путь               | Описание                    |
|-------|---------------------|------------------------------|
| GET   | /health              | Проверка живости сервиса     |
| GET   | /tasks               | Список задач (фильтры: `done`, `priority`) |
| POST  | /tasks               | Создать задачу               |
| GET   | /tasks/{id}          | Получить задачу              |
| PUT   | /tasks/{id}          | Обновить задачу              |
| PATCH | /tasks/{id}/done     | Отметить выполненной         |
| DELETE| /tasks/{id}          | Удалить задачу               |

## Структура

```
task-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # точка входа FastAPI
│   │   ├── database.py      # подключение к БД (SQLAlchemy)
│   │   ├── models.py        # ORM-модели
│   │   ├── schemas.py       # Pydantic-схемы
│   │   ├── crud.py          # операции с БД
│   │   └── routers/
│   │       └── tasks.py     # эндпоинты /tasks
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── api.js           # обёртка над fetch к бэкенду
│   │   └── index.css
│   └── package.json
└── README.md
```
