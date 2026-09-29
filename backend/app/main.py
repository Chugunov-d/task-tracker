from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import tasks

# Для учебного проекта создаём таблицы прямо на старте приложения.
# В "боевом" проекте тут были бы Alembic-миграции, но для наших целей
# (Docker/K8s практика) это осознанное упрощение.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Tracker API", version="1.0.0")

# CORS открыт широко — это учебный проект. В реальном проде список origins
# был бы ограничен конкретным доменом фронтенда.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/health")
def health():
    return {"status": "ok"}
