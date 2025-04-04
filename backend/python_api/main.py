from fastapi import FastAPI
from pydantic import BaseModel
import cv2
import numpy as np
import base64
from deepface import DeepFace
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

THRESHOLD = 0.4

class FaceRequest(BaseModel):
    image1: str  # base64 de l’image capturée
    image2: str  # base64 de l’image stockée en base

def decode_base64_image(base64_str):
    try:
        if base64_str.startswith("data:image"):
            base64_str = base64_str.split(",")[1]
        base64_str = base64_str.replace("\n", "").replace(" ", "").strip()
        image_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(image_data, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        raise ValueError(f"Erreur de décodage de l’image : {e}")

@app.post("/recognize/")
async def recognize(data: FaceRequest):
    try:
        img1 = decode_base64_image(data.image1)
        img2 = decode_base64_image(data.image2)

        result = DeepFace.verify(
            img1_path=img1,
            img2_path=img2,
            enforce_detection=False,
            distance_metric='cosine',  # ou euclidean, euclidean_l2...
            model_name='Facenet',      # ou VGG-Face, OpenFace, etc.
            threshold=THRESHOLD        # 👈 ton seuil personnalisé
        )

        return {
            "verified": result["verified"],
            "distance": result["distance"]
        }

    except Exception as e:
        return {"error": str(e)}
