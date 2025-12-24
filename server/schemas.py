from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    description: str
    difficulty: str
    category: str
    inputData: str
    outputData: str


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    Login: str
    password: str


class CheckRequest(BaseModel):
    taskID: int
    userOutput: str


class CheckResponse(BaseModel):
    correct: bool
    message: str
