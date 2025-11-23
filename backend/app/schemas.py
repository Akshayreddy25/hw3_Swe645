from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SurveyBase(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    street_address: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    zip_code: str = Field(..., min_length=1)
    telephone: str = Field(..., min_length=1)
    email: EmailStr
    date_of_survey: date
    liked_most: Optional[str] = None
    how_interested: Optional[str] = None
    likelihood: str = Field(..., min_length=1)
    comments: Optional[str] = None


class SurveyCreate(SurveyBase):
    pass


class SurveyUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    date_of_survey: Optional[date] = None
    liked_most: Optional[str] = None
    how_interested: Optional[str] = None
    likelihood: Optional[str] = None
    comments: Optional[str] = None


class SurveyRead(SurveyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
