import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routers import assessments
from .services.data_loader import load_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager:
    1. Load data to memory on startup
    2. Cleanup on shutdown
    """
    load_data()
    yield
  
app = FastAPI(title="Psynth Technical Assessment API", lifespan=lifespan)

# CORS Configuration
# 1. Define local development origins
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# 2. Add production origins from Environment Variable
# Expects a comma-separated string: "https://myapp.onrender.com,https://another.com"
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    origins.extend([origin.strip() for origin in env_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register router
app.include_router(assessments.router, prefix="/api")

@app.get("/")
def read_root():
    """Health check endpoint"""
    
    return {"message": "Psynth Technical Assessment API is running!", "docs_url": "/docs"}
    