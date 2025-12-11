#!/bin/bash
DATA_DIR=$1  # path to data/yolo/data.yaml
EPOCHS=${2:-100}
python - <<PY
from ultralytics import YOLO
model = YOLO('yolov8s.pt')
model.train(data='$DATA_DIR', epochs=$EPOCHS, imgsz=640, batch=16, project='runs/train', name='medstrip')
PY
