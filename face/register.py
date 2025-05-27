# register.py
import os
import pickle
from encoder import encode_faces

ENCODINGS_PATH = "data/encodings.pkl"

def load_encodings():
    if not os.path.exists(ENCODINGS_PATH):
        return []
    with open(ENCODINGS_PATH, "rb") as f:
        return pickle.load(f)

def save_encodings(data):
    os.makedirs("data", exist_ok=True)
    with open(ENCODINGS_PATH, "wb") as f:
        pickle.dump(data, f)

def register_face(image_path, name):
    encodings, locations = encode_faces(image_path)

    if len(encodings) == 0:
        print("[ERROR] No faces found. Registration failed.")
        return

    data = load_encodings()
    for encoding in encodings:
        data.append({"name": name, "encoding": encoding})

    save_encodings(data)
    print(f"[INFO] Registered {len(encodings)} face(s) for '{name}'.")


