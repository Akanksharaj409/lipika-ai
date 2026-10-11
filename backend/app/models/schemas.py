from pydantic import BaseModel, Field
from typing import List, Optional

class AlternativePrediction(BaseModel):
    prediction: str
    iast: str
    confidence: float

class BoundingBox(BaseModel):
    x: float  # Percentage (0-100)
    y: float
    width: float
    height: float
    pixel_x: int
    pixel_y: int
    pixel_w: int
    pixel_h: int

class CharacterPrediction(BaseModel):
    index: int
    prediction: str
    unicode_hex: str
    iast: str
    devanagari: str
    confidence: float
    category: str
    bounding_box: BoundingBox
    alternatives: List[AlternativePrediction] = []

class TransliterationResponse(BaseModel):
    raw_brahmi: str
    iast: str
    devanagari: str

class TranslationResponse(BaseModel):
    english: str
    hindi: str

class AnalyzeResponse(BaseModel):
    status: str = "success"
    filename: str
    total_characters: int
    average_confidence: float
    characters: List[CharacterPrediction]
    transliteration: TransliterationResponse
    translation: TranslationResponse
    processing_time_ms: float

class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool
    version: str = "1.0.0"
    target_script: str = "Brahmi MVP"
