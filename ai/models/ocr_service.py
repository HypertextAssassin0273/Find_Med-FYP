import cv2
from paddleocr import PaddleOCR

class OCRService:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en')

    def read(self, image_bgr):
        # convert to RGB for Paddle
        img_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        result = self.ocr.ocr(img_rgb, cls=True)
        # parse lines -> string
        full_text = " ".join([line[1][0] for line in result[0]]) if result else ""
        return full_text, result
