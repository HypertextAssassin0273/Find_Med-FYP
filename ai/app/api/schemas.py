from pydantic import BaseModel
from typing import Optional, List

class DetectRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    upload_id: Optional[str] = None

class Strip(BaseModel):
    box: list
    conf: float
    pill_count: int
    rows: int
    cols: int
    foil_color: Optional[str]
    ocr_text: str
    tokens: List[str]

class DetectResponse(BaseModel):
    strips: List[Strip]
    meta: dict
