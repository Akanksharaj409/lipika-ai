import cv2
import numpy as np

class ImagePreprocessor:
    """
    OpenCV preprocessing pipeline for ancient stone rubbing and rock edict images.
    """
    
    @staticmethod
    def preprocess_image(image_bytes: bytes) -> tuple[np.ndarray, np.ndarray]:
        """
        Converts raw image bytes into OpenCV format and applies CLAHE & thresholding.
        Returns (original_bgr_image, preprocessed_binary_image).
        """
        # Decode image from bytes
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img_bgr is None:
            raise ValueError("Failed to decode image. File may be corrupt or invalid format.")
            
        # Convert to Grayscale
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced_gray = clahe.apply(gray)
        
        # Denoise using Median Blur
        denoised = cv2.medianBlur(enhanced_gray, 3)
        
        # Otsu's adaptive thresholding for binarization
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        return img_bgr, binary
