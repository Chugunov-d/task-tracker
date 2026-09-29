from typing import Optional

from sqlalchemy.orm import Session

from app import models, schemas


def get_tasks(db: Session, is_done: Optional[bool] = None, priority: Optional[str] = None):
    query = db.query(models.Task)
    if is_done is not None:
        query = query.filter(models.Task.is_done == is_done)
    if priority is not None:
        query = query.filter(models.Task.priority == priority)
    return query.order_by(models.Task.created_at.desc()).all()


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task is None:
        return None
    for field, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task


def set_done(db: Session, task_id: int, is_done: bool = True):
    db_task = get_task(db, task_id)
    if db_task is None:
        return None
    db_task.is_done = is_done
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task is None:
        return False
    db.delete(db_task)
    db.commit()
    return True
