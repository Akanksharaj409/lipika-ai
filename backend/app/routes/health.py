from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.services.ocr_inference import model_manager

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Backend health check endpoint.
    Verifies server availability and model loading status.
    """
    return HealthResponse(
        status="healthy",
        model_loaded=model_manager.is_loaded,
        version="1.0.0",
        target_script="Brahmi MVP"
    )
