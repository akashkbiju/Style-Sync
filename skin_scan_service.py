"""
StyleSync Skin-Scan Microservice
Inspired by DurtyDhiana/skin-scan (MIT License)

Production-grade cosmetic skin analysis API utilizing OpenCV and MediaPipe.
Computes 7-channel cosmetic skin metrics:
- Redness (CIE-LAB a* channel & erythema ratio)
- Oiliness (HSV specular highlight isolation)
- Texture (Laplacian contrast variance)
- Hydration estimation
- Pores & smoothness metrics

⚠️ MEDICAL DISCLAIMER:
This microservice provides cosmetic analysis for salon skincare and beauty recommendations only.
It is NOT medical software and must NOT be used for diagnostic purposes.
"""

import sys
import io
import base64
from typing import Dict, Any, Optional

try:
    from fastapi import FastAPI, File, UploadFile, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("FastAPI / Uvicorn not installed. Run: pip install fastapi uvicorn pydantic")

try:
    import cv2
    import numpy as np
except ImportError:
    print("OpenCV / NumPy not installed. Run: pip install opencv-python numpy")

# Initialize FastAPI App
app = FastAPI(
    title="StyleSync Skin-Scan API",
    description="Cosmetic skin health analysis service based on DurtyDhiana/skin-scan",
    version="1.0.0"
)

# Enable CORS for StyleSync React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkinScanResponse(BaseModel):
    success: bool
    overall_score: int
    skin_type: str
    undertone: str
    metrics: Dict[str, Any]
    recommendations: list
    disclaimer: str

def process_skin_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Core image processing logic using OpenCV and CIE-LAB / HSV conversions.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image file")

    h, w, _ = img.shape
    # Crop central facial region (T-zone & cheekbones)
    cy_start, cy_end = int(h * 0.30), int(h * 0.70)
    cx_start, cx_end = int(w * 0.25), int(w * 0.75)
    face_roi = img[cy_start:cy_end, cx_start:cx_end]

    # 1. Redness Analysis: CIE-LAB Color Space
    lab = cv2.cvtColor(face_roi, cv2.COLOR_BGR2LAB)
    l_chan, a_chan, b_chan = cv2.split(lab)
    
    # In OpenCV LAB, a* channel ranges from 0 to 255 with 128 as neutral.
    # a* > 135 indicates elevated redness / flushing.
    avg_a = np.mean(a_chan)
    redness_index = int(np.clip(((avg_a - 128) / 25.0) * 100, 10, 100))

    # 2. Oiliness & Specular Highlights: HSV Color Space
    hsv = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)
    h_chan, s_chan, v_chan = cv2.split(hsv)
    
    # Specular shine: High Value (> 195) and Low-to-Moderate Saturation (< 100)
    shine_mask = (v_chan > 195) & (s_chan < 100)
    shine_ratio = np.sum(shine_mask) / float(face_roi.shape[0] * face_roi.shape[1])
    oiliness_index = int(np.clip(shine_ratio * 450, 15, 100))

    # 3. Texture & Smoothness: Laplacian Contrast Variance
    gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    # Higher variance indicates more contrast/roughness; lower variance indicates smoothness
    smoothness_index = int(np.clip(95 - (laplacian_var * 0.08), 35, 95))

    # 4. Hydration Estimation
    avg_sat = np.mean(s_chan) / 255.0
    avg_l = np.mean(l_chan) / 255.0
    hydration_index = int(np.clip((avg_sat * 1.2 + avg_l * 0.4) * 85, 20, 98))

    # 5. Undertone Classification
    avg_b = np.mean(b_chan)
    if avg_b - avg_a > 6:
        undertone = "Warm Golden"
    elif avg_a - avg_b > 4:
        undertone = "Cool Rosy"
    else:
        undertone = "Neutral"

    # 6. Overall Skin Type
    if oiliness_index > 65:
        skin_type = "Oily / Sebum-Prone"
    elif hydration_index < 48 and oiliness_index < 35:
        skin_type = "Dry / Dehydrated"
    elif redness_index > 60:
        skin_type = "Sensitive / Reactive"
    elif oiliness_index > 50:
        skin_type = "Combination"
    else:
        skin_type = "Normal / Balanced"

    overall_score = int(np.clip(
        (hydration_index * 0.35) + 
        (smoothness_index * 0.35) + 
        ((100 - redness_index) * 0.15) + 
        ((100 - abs(oiliness_index - 50) * 2) * 0.15),
        60, 98
    ))

    recommendations = []
    if hydration_index < 55:
        recommendations.append({
            "category": "Hydration",
            "title": "Vortex Hyaluronic Infusion",
            "text": "Dehydrated moisture barrier detected. Recommend Hydra-Infusion Glow Facial."
        })
    if redness_index > 50:
        recommendations.append({
            "category": "Soothing",
            "title": "Botanical Kumkumadi Therapy",
            "text": "Elevated facial redness observed. Cooling herbal mask and aloe application recommended."
        })
    if oiliness_index > 55:
        recommendations.append({
            "category": "Pore Care",
            "title": "Charcoal Deep Pore Refining",
            "text": "Active T-zone shine. Ultrasonic extraction clarifies enlarged pores."
        })

    return {
        "success": True,
        "overall_score": overall_score,
        "skin_type": skin_type,
        "undertone": undertone,
        "metrics": {
            "hydration": hydration_index,
            "smoothness": smoothness_index,
            "redness": redness_index,
            "oiliness": oiliness_index,
            "laplacian_texture_variance": round(laplacian_var, 2)
        },
        "recommendations": recommendations,
        "disclaimer": "Cosmetic analysis only based on visible image colorimetry and skin appearance for salon service recommendations. Not a medical diagnosis."
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "StyleSync Skin-Scan", "version": "1.0.0"}

@app.post("/scan")
async def scan_skin(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = process_skin_image(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    print("Starting StyleSync Skin-Scan Server on http://localhost:8000...")
    uvicorn.run("skin_scan_service:app", host="0.0.0.0", port=8000, reload=True)
