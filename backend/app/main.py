import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, analyze
from app.services.ocr_inference import model_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lipika_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context Manager.
    Loads the trained Brahmi ML model ONCE during server startup.
    """
    logger.info("Initializing Lipika AI Brahmi FastAPI Backend...")
    # Load ML model once on startup
    model_path = os.path.join("models", "lipika_brahmi_model.keras")
    model_manager.load_model(model_path)
    logger.info("Brahmi ML Model loaded successfully once into memory.")
    
    yield
    
    logger.info("Shutting down Lipika AI Backend.")

app = FastAPI(
    title="Lipika AI — Ancient Brahmi Inscription Engine API",
    description="FastAPI Backend for Brahmi Epigraphic Computer Vision, Neural Character Segmentation & Transliteration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers under /api
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Lipika AI Backend API",
        "docs": "/docs",
        "health": "/api/health"
    }
