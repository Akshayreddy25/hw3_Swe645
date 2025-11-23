from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas


def create_survey(db: Session, data: schemas.SurveyCreate) -> models.Survey:
    obj = models.Survey(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_surveys(db: Session, skip: int = 0, limit: int = 100) -> List[models.Survey]:
    return (
        db.query(models.Survey)
        .order_by(models.Survey.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_survey(db: Session, survey_id: int) -> Optional[models.Survey]:
    return db.query(models.Survey).filter(models.Survey.id == survey_id).first()


def update_survey(
    db: Session, survey_id: int, updates: schemas.SurveyUpdate
) -> Optional[models.Survey]:
    obj = get_survey(db, survey_id)
    if not obj:
        return None

    for field, value in updates.dict(exclude_unset=True).items():
        setattr(obj, field, value)

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def delete_survey(db: Session, survey_id: int) -> bool:
    obj = get_survey(db, survey_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
