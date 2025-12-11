from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path

class MedstripYOLO:
    def __init__(self, weights_path: str, imgsz: int = 512, conf_thres: float = 0.25):
        self.model = YOLO(weights_path)
        self.imgsz = imgsz
        self.conf_thres = conf_thres

    def _preprocess(self, image_bgr: np.ndarray) -> np.ndarray:
        # YOLO will resize internally; you can still enforce max size if needed.
        return image_bgr

    def predict(self, image_bgr: np.ndarray):
        img = self._preprocess(image_bgr)
        results = self.model(
            img,
            imgsz=self.imgsz,
            conf=self.conf_thres
        )
        r = results[0]
        boxes = []
        if r.boxes is not None:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                boxes.append({
                    "xyxy": [x1, y1, x2, y2],
                    "conf": conf,
                    "class_id": cls
                })
        return boxes, r
