from sqlalchemy import Column, Integer, String, Text
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    difficulty = Column(String, default="medium")
    category = Column(String)
    inputData = Column(String)
    outputData = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    Login = Column(String, index=True)
    password = Column(String, index=True)


