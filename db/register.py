from database import insert_registration
import numpy as np

def register_face(image_path, name):
    encodings, _ = encode_faces(image_path)
    if not encodings:
        print("[ERROR] No faces found. Registration failed.")
        return

    for encoding in encodings:
        inserted_id = insert_registration(name, encoding)
        print(f"[INFO] Registered face with id: {inserted_id}")
