from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import os
from deepface import DeepFace

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REFERENCE_DIR = "known_faces/adam"
THRESHOLD = 0.5

@app.post("/recognize/")
async def recognize(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    try:
        recognized = False
        for filename in os.listdir(REFERENCE_DIR):
            ref_path = os.path.join(REFERENCE_DIR, filename)
            result = DeepFace.verify(img1_path=img, img2_path=ref_path)
            if result["verified"] and result["distance"] < THRESHOLD:
                recognized = True
                break

        if recognized:
            return {"result": "success", "data": "MR / MME"}
        else:
            return {"result": "not_recognized"}

    except Exception as e:
        return {"result": "error", "message": str(e)}
