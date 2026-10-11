import sys
import numpy as np
import cv2
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    print("GET /api/health Status:", response.status_code)
    print("GET /api/health Response:", response.json())
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze():
    # Generate synthetic image bytes (200x100 white image with black text rects)
    img = np.ones((100, 200, 3), dtype=np.uint8) * 255
    cv2.rectangle(img, (20, 20), (60, 80), (0, 0, 0), -1)
    cv2.rectangle(img, (90, 20), (130, 80), (0, 0, 0), -1)
    
    is_success, buffer = cv2.imencode(".png", img)
    image_bytes = buffer.tobytes()
    
    files = {"file": ("test_inscription.png", image_bytes, "image/png")}
    response = client.post("/api/analyze", files=files)
    
    print("POST /api/analyze Response Status:", response.status_code)
    assert response.status_code == 200
    
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "characters" in json_data
    assert len(json_data["characters"]) > 0
    assert "average_confidence" in json_data
    assert "transliteration" in json_data
    assert "translation" in json_data
    
    print("Total characters detected:", json_data["total_characters"])
    print("Average confidence:", json_data["average_confidence"])

if __name__ == "__main__":
    test_health()
    test_analyze()
    print("ALL BACKEND API TESTS PASSED SUCCESSFULLY!")
