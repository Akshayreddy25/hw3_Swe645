from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from .database import Base


class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    street_address = Column(String(200), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(20), nullable=False)
    telephone = Column(String(30), nullable=False)
    email = Column(String(120), nullable=False)

    date_of_survey = Column(Date, nullable=False)

    liked_most = Column(String(200), nullable=True)
    how_interested = Column(String(200), nullable=True)
    likelihood = Column(String(20), nullable=False)
    comments = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
