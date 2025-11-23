from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/api/surveys", tags=["surveys"])


@router.post("/", response_model=schemas.SurveyRead, status_code=status.HTTP_201_CREATED)
def create_survey_endpoint(
    survey: schemas.SurveyCreate,
    db: Session = Depends(get_db),
):
    return crud.create_survey(db, survey)


@router.get("/", response_model=List[schemas.SurveyRead])
def list_surveys_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.get_surveys(db, skip=skip, limit=limit)


@router.get("/{survey_id}", response_model=schemas.SurveyRead)
def get_survey_endpoint(survey_id: int, db: Session = Depends(get_db)):
    survey = crud.get_survey(db, survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


@router.put("/{survey_id}", response_model=schemas.SurveyRead)
def update_survey_endpoint(
    survey_id: int,
    updates: schemas.SurveyUpdate,
    db: Session = Depends(get_db),
):
    survey = crud.update_survey(db, survey_id, updates)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_survey_endpoint(survey_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_survey(db, survey_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Survey not found")
    return
