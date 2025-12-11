from fastapi import FastAPI, UploadFile, File
from app.yolo.detector import YoloDetector
from app.config import YOLO_WEIGHTS_PATH, YOLO_IMG_SIZE, YOLO_CONF_THRES
import numpy as np
import cv2
import requests
from PIL import Image
from io import BytesIO

app = FastAPI()  # title="FindMed AI Service", version="1.0"

detector = YoloDetector(
    YOLO_WEIGHTS_PATH,
    YOLO_IMG_SIZE,
    YOLO_CONF_THRES
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect")
def detect(file: UploadFile = File(None)):
    if not file:
        return {"error": "No file provided"}
    
    bytes_data = file.file.read()
    try:
        pil_img = Image.open(BytesIO(bytes_data)).convert("RGB")
    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}
    image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

    return {
        "detections": detector.detect(image),
        "meta": {
            "model": "medstrip_yolo_v1",
            "img_size": YOLO_IMG_SIZE
        }
    }
