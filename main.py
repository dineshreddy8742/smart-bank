from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from banking.database import engine, Base
from banking import models, schemas, crud
from banking.routers import auth, accounts
from banking.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

print("Initializing FastAPI application...")

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Bank System API",
    description="A modular and secure banking backend.",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("CORS middleware added.")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])

@app.get("/", tags=["Health Check"])
def read_root():
    """Health check endpoint to confirm the API is running."""
    return {"status": "API is running"}

@app.post("/create_test_user")
def create_test_user(db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, "test@test.com")
    if not user:
        user_in = schemas.UserCreate(email="test@test.com", password="password", full_name="Test User")
        user = crud.create_user(db, user_in)
    return user
