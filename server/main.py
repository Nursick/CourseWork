from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Task.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/tasks/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)


@app.get("/tasks/", response_model=list[schemas.TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_tasks(db, skip=skip, limit=limit)


@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/register/", response_model=schemas.UserCreate)
def register(user: schemas.UserCreate, db: Session  = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.Login == user.Login).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(Login=user.Login, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/check", response_model=schemas.CheckResponse)
def check(request: schemas.CheckRequest, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == request.taskID).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    correct = (
        request.userOutput.strip().split()
        == str(task.outputData).strip().split()
    )

    return {
        "message": "success",
        "correct": correct
    }
