from ultralytics import YOLO
import numpy as np

class YoloDetector:
    def __init__(self, weights_path: str, imgsz: int, conf: float):
        self.model = YOLO(weights_path)
        self.imgsz = imgsz
        self.conf = conf

    def detect(self, image_bgr: np.ndarray):
        results = self.model(image_bgr, imgsz=self.imgsz, conf=self.conf)
        r = results[0]

        detections = []
        if r.boxes is not None:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                detections.append({
                    "box": [x1, y1, x2, y2],
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0]),
                    "class_name": self.model.names[int(box.cls[0])]
                })
        return detections
