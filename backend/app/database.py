import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# По умолчанию используем локальный SQLite-файл, чтобы можно было
# запускать проект без установки/поднятия отдельной СУБД.
#
# На этапе Docker Compose мы просто зададим переменную окружения
# DATABASE_URL=postgresql://... и код тут не изменится ни на строчку —
# в этом и есть смысл использовать SQLAlchemy, а не сырые SQL-запросы.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency для FastAPI: выдаёт сессию БД и гарантированно закрывает её."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
