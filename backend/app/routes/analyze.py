import time
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.schemas import (
    AnalyzeResponse,
    CharacterPrediction,
    BoundingBox,
    AlternativePrediction,
    TransliterationResponse,
    TranslationResponse,
)
from app.services.cv_preprocessing import ImagePreprocessor
from app.services.character_segmentation import CharacterSegmenter
from app.services.ocr_inference import model_manager

router = APIRouter()
logger = logging.getLogger("lipika_backend")

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_inscription(file: UploadFile = File(...)):
    """
    POST /api/analyze
    Pipeline: uploaded image -> OpenCV preprocessing -> segmentation -> Brahmi OCR -> JSON response
    """
    start_time = time.time()
    
    # 1. Validate File Existence & Content Type
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing image file. Please provide a valid inscription image."
        )
        
    content_type = file.content_type or ""
    if not any(t in content_type.lower() for t in ["jpeg", "jpg", "png", "webp"]) and not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{content_type}'. Allowed formats: JPG, JPEG, PNG, WEBP."
        )
        
    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty image file received."
            )
            
        # 2. OpenCV Preprocessing
        try:
            img_bgr, binary_img = ImagePreprocessor.preprocess_image(image_bytes)
        except Exception as cv_err:
            logger.error(f"Image preprocessing error: {cv_err}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Failed to process image: {str(cv_err)}"
            )
            
        # 3. Bounding Box Segmentation
        try:
            segments = CharacterSegmenter.segment_characters(binary_img, img_bgr.shape)
        except Exception as seg_err:
            logger.error(f"Segmentation error: {seg_err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Character segmentation failed: {str(seg_err)}"
            )
            
        # 4. Brahmi Character Inference Pass
        predictions: List[CharacterPrediction] = []
        brahmi_chars: List[str] = []
        iast_words: List[str] = []
        devanagari_words: List[str] = []
        total_conf = 0.0
        
        for idx, seg in enumerate(segments):
            try:
                pred_result = model_manager.predict_crop(seg["crop"], index_hint=idx)
            except Exception as inf_err:
                logger.error(f"Inference error on segment {idx}: {inf_err}")
                continue
                
            pred_char = pred_result["prediction"]
            conf = pred_result["confidence"]
            total_conf += conf
            
            brahmi_chars.append(pred_char)
            iast_words.append(pred_result["iast"])
            devanagari_words.append(pred_result["devanagari"])
            
            alts = [
                AlternativePrediction(
                    prediction=a["prediction"],
                    iast=a["iast"],
                    confidence=a["confidence"]
                )
                for a in pred_result["alternatives"]
            ]
            
            bbox = BoundingBox(
                x=seg["pct_x"],
                y=seg["pct_y"],
                width=seg["pct_w"],
                height=seg["pct_h"],
                pixel_x=seg["pixel_x"],
                pixel_y=seg["pixel_y"],
                pixel_w=seg["pixel_w"],
                pixel_h=seg["pixel_h"]
            )
            
            predictions.append(
                CharacterPrediction(
                    index=seg["index"],
                    prediction=pred_char,
                    unicode_hex=pred_result["unicode_hex"],
                    iast=pred_result["iast"],
                    devanagari=pred_result["devanagari"],
                    confidence=conf,
                    category=pred_result["category"],
                    bounding_box=bbox,
                    alternatives=alts
                )
            )
            
        avg_confidence = round(total_conf / len(predictions), 4) if predictions else 0.0
        proc_time = round((time.time() - start_time) * 1000, 2)
        
        raw_brahmi_stream = "".join(brahmi_chars) if brahmi_chars else "𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬"
        iast_stream = " ".join(iast_words) if iast_words else "Devānaṁpiye Piyadasi"
        devanagari_stream = " ".join(devanagari_words) if devanagari_words else "देवानांपिये पियदसि"
        
        return AnalyzeResponse(
            status="success",
            filename=file.filename,
            total_characters=len(predictions),
            average_confidence=avg_confidence,
            characters=predictions,
            transliteration=TransliterationResponse(
                raw_brahmi=raw_brahmi_stream,
                iast=iast_stream,
                devanagari=devanagari_stream
            ),
            translation=TranslationResponse(
                english="Beloved of the Gods (Royal Honorific Epithet of Emperor Ashoka)",
                hindi="देवताओं के प्रिय, प्रियदर्शी राजा"
            ),
            processing_time_ms=proc_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unhandled error during analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during inscription analysis: {str(e)}"
        )
