from ultralytics import YOLO
import cv2
import numpy as np

class YOLOService:
    def __init__(self, weights_path):
        self.model = YOLO(weights_path)

    def detect(self, image_bgr):
        # image_bgr: numpy BGR
        results = self.model(image_bgr)
        r = results[0]
        boxes = []
        if hasattr(r, "boxes") and r.boxes is not None:
            for box in r.boxes:
                xyxy = box.xyxy.numpy().tolist()  # [[x1,y1,x2,y2]]
                conf = float(box.conf.numpy())
                cls = int(box.cls.numpy())
                boxes.append({'xyxy': [int(x) for x in xyxy[0]], 'conf': conf, 'cls': cls})
        return boxes, r
