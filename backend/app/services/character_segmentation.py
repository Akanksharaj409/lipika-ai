import cv2
import numpy as np
from typing import List, Dict, Any

class CharacterSegmenter:
    """
    Morphological contour segmentation for Brahmi character bounding box extraction.
    """
    
    @staticmethod
    def segment_characters(binary_img: np.ndarray, img_shape: tuple[int, int, int]) -> List[Dict[str, Any]]:
        """
        Extracts character bounding boxes from binary image.
        Returns list of segment dicts with pixel and percentage bounding coordinates.
        """
        h_img, w_img = img_shape[:2]
        
        # Morphological dilation to connect close character strokes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        dilated = cv2.dilate(binary_img, kernel, iterations=1)
        
        # Find contours
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        segments = []
        min_area = (w_img * h_img) * 0.0005  # Filter tiny noise
        max_area = (w_img * h_img) * 0.45    # Filter whole page contours
        
        boxes = []
        for c in contours:
            area = cv2.contourArea(c)
            if min_area < area < max_area:
                x, y, w, h = cv2.boundingRect(c)
                # Aspect ratio check
                aspect_ratio = w / float(h)
                if 0.15 <= aspect_ratio <= 3.5:
                    boxes.append((x, y, w, h))
                    
        # Sort bounding boxes left-to-right (and top-to-bottom)
        boxes = sorted(boxes, key=lambda b: (b[1] // 40, b[0]))
        
        # If no valid contours found (e.g. uniform image), create fallback grid segments
        if not boxes:
            box_w, box_h = int(w_img * 0.15), int(h_img * 0.25)
            for i in range(4):
                boxes.append((int(w_img * (0.1 + i * 0.2)), int(h_img * 0.35), box_w, box_h))
                
        for idx, (x, y, w, h) in enumerate(boxes):
            pct_x = round((x / w_img) * 100, 2)
            pct_y = round((y / h_img) * 100, 2)
            pct_w = round((w / w_img) * 100, 2)
            pct_h = round((h / h_img) * 100, 2)
            
            # Extract character crop for model inference
            crop = binary_img[y:y+h, x:x+w]
            
            segments.append({
                "index": idx + 1,
                "crop": crop,
                "pixel_x": x,
                "pixel_y": y,
                "pixel_w": w,
                "pixel_h": h,
                "pct_x": pct_x,
                "pct_y": pct_y,
                "pct_w": pct_w,
                "pct_h": pct_h,
            })
            
        return segments
