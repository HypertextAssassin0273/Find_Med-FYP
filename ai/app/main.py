from fastapi import FastAPI, UploadFile, File
from app.yolo.detector import YoloDetector
from app.config import *
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
import base64
from paddleocr import PaddleOCR
import re
import html

# --- Globals (initialize once) ---
app = FastAPI()  # title="FindMed AI Service (YOLO+PaddleOCR)", version="1.0"

detector = YoloDetector(
    YOLO_WEIGHTS_PATH,
    YOLO_IMG_SIZE,
    YOLO_CONF_THRES
)

ocr = PaddleOCR(lang="ur", use_angle_cls=True)  # NOTE: set use_angle_cls=True to handle rotated text lines

# --- Helpers ---
def pil_from_bytes(bytes_data: bytes) -> Image.Image:
    return Image.open(BytesIO(bytes_data)).convert("RGB")

def bgr_from_pil(pil_img: Image.Image):
    return cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

def crop_bgr(image_bgr: np.ndarray, xyxy):
    """Crop BGR image with bounding box xyxy = [x1,y1,x2,y2] safely (int)."""
    h, w = image_bgr.shape[:2]
    x1, y1, x2, y2 = map(int, xyxy)
    x1 = max(0, min(w - 1, x1))
    x2 = max(0, min(w, x2))
    y1 = max(0, min(h - 1, y1))
    y2 = max(0, min(h, y2))
    if x2 <= x1 or y2 <= y1: return None
    return image_bgr[y1:y2, x1:x2]

def encode_image_to_base64(pil_img: Image.Image, fmt="JPEG"):
    buf = BytesIO()
    pil_img.save(buf, format=fmt, quality=85)
    return "data:image/{};base64,".format(fmt.lower()) + base64.b64encode(buf.getvalue()).decode("utf-8")

def normalize_text(s: str) -> str:
    """Basic normalization: html unescape, remove weird whitespace, strip punctuation edges."""
    if not s: return ""
    s = html.unescape(s)
    s = s.strip()
    # Replace repeated whitespace
    s = re.sub(r"\s+", " ", s)
    # Remove non-printable control chars
    s = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", s)
    return s

def tokenize_text(s: str):
    """Return tokens: split on whitespace and punctuation, keep Urdu/Arabic letters intact."""
    # Normalize (keep Urdu/Arabic letters)
    s = normalize_text(s)
    # lower ascii letters
    s = s.lower()
    # split on whitespace and punctuation but preserve Arabic/Urdu letters and digits
    tokens = re.findall(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\w%\-]+", s, flags=re.UNICODE)
    return [t for t in tokens if t]

# --- API ---
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect")
def detect(file: UploadFile = File(None)):
    if not file: return {"error": "No file provided"}
    
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

@app.post("/detect_full")
def detect_full(file: UploadFile = File(None), return_crops: bool = False):
    """
    Receives multipart file upload.
    Runs YOLO detection, then runs PaddleOCR (multilingual) on text regions inside each strip crop.
    Returns structured JSON with bbox, detection confidence and OCR tokens + text.
    Set return_crops=True to include crop images (base64) in response (useful for debugging).
    """
    if not file: return {"error": "No file provided"}

    # Read file bytes once
    bytes_data = file.file.read()

    # Decode once (PIL)
    try:
        pil_img = pil_from_bytes(bytes_data)
    except Exception as e:
        return {"error": "Invalid image file", "details": str(e)}

    # Convert to OpenCV BGR for YOLO
    image_bgr = bgr_from_pil(pil_img)

    # Run YOLO
    yolo_detections = detector.detect(image_bgr)  # list of dicts with box/conf/class

    results = []
    for det in yolo_detections:
        bbox = det.get("box")  # [x1,y1,x2,y2]
        det_conf = det.get("confidence", None)
        class_id = det.get("class_id", None)
        class_name = det.get("class_name", None)

        crop = crop_bgr(image_bgr, bbox)
        if crop is None: continue

        # Convert crop to RGB PIL for PaddleOCR
        crop_pil = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))

        # Optionally include the crop image as base64 for debugging/ocr fallback
        crop_b64 = encode_image_to_base64(crop_pil, fmt="JPEG") if return_crops else None

        # PaddleOCR expects numpy array or path; we pass crop_pil converted to array
        crop_np_rgb = np.array(crop_pil)

        # Run OCR: ocr.ocr returns list of [box, (text, conf)] per line
        try:
            # ocr_result = ocr.predict(crop_np_rgb, cls=True)
            ocr_result = ocr.ocr(crop_np_rgb, cls=True)
        except Exception as e:
            # If OCR fails on this crop, return empty ocr result but don't break entire request
            ocr_result = []

        # Parse OCR output into structured tokens
        ocr_entries = []
        for item in ocr_result:
            # item example: [ [box_points], (text, confidence) ] or [ [box_points], [ (text, conf) ] ] depending on version
            try:
                if len(item) == 2 and isinstance(item[1], tuple):
                    box_pts, (txt, conf) = item
                elif len(item) == 2 and isinstance(item[1], list) and item[1]:
                    # sometimes rec result nested
                    box_pts = item[0]
                    txt, conf = item[1][0]
                else:
                    # unpredictable format, try fallback
                    box_pts = item[0]
                    txt = item[1]
                    conf = None
            except Exception:
                box_pts = item[0]
                txt = ""
                conf = None

            txt_norm = normalize_text(txt)
            tokens = tokenize_text(txt_norm)

            # compute bbox (min/max of box_pts)
            xs = [int(p[0]) for p in box_pts]
            ys = [int(p[1]) for p in box_pts]
            tbbox = [min(xs), min(ys), max(xs), max(ys)]

            ocr_entries.append({
                "text": txt_norm,
                "confidence": float(conf) if conf is not None else None,
                "tokens": tokens,
                "box": tbbox
            })

        # Aggregate all OCR text for the crop as a single string
        aggregated_text = " ".join([e["text"] for e in ocr_entries if e["text"]])
        aggregated_tokens = []
        for e in ocr_entries:
            aggregated_tokens.extend(e["tokens"])

        results.append({
            "detection": {
                "box": bbox,
                "confidence": det_conf,
                "class_id": class_id,
                "class_name": class_name
            },
            "ocr": {
                "lines": ocr_entries,            # per-text-line extraction
                "aggregated_text": aggregated_text,
                "aggregated_tokens": aggregated_tokens
            },
            "crop_base64": crop_b64
        })

    return {
        "image_meta": {
            "width": pil_img.width,
            "height": pil_img.height
        },
        "strips": results,
        "meta": {
            "model": "medstrip_yolov8_mvp + paddleocr_multilingual", # NOTE: param set to lang="ur" not "multilingual"
            "yolo_img_size": YOLO_IMG_SIZE
        }
    }
