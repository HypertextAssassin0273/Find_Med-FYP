import requests
from io import BytesIO
from PIL import Image
import cv2, numpy as np

def load_from_url(url):
    resp = requests.get(url, timeout=10)
    img = Image.open(BytesIO(resp.content)).convert("RGB")
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
