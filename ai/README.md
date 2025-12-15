# Steps for Running AI Service (Locally)

### 0) Ensure you are in right directory
```
cd ai
```

### 1) Activate virtual environment:-
**windows:**
```
venv\Scripts\activate
``` 
**unix/mac:**
```
source venv/bin/activate
```

### 2) Install/upgrage all python packages in list
```
pip install -r requirements.txt
```

### 3) Start uvicorn server (localhost:8000)
```
uvicorn app.main:app
```
**NOTE:** optional flags `--host` to specify host, `--port` to specify port, `--reload` for auto-reload on code changes


### 4) Test the API Endpoints
**check health/status:**
```
curl -X POST http://localhost:8000/health"
```
**detect medicine strip + visible text in image (using file upload):**
```
curl -X POST http://localhost:8000/detect_full -F "file=@test.jpg"
```
**NOTE:** replace `test.jpg` with your own image file path.
