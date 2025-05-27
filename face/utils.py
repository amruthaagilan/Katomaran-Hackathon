# utils.py
import os
import pickle
import cv2

def load_pickle(path):
    if not os.path.exists(path):
        return []
    with open(path, "rb") as f:
        return pickle.load(f)

def save_pickle(data, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(data, f)

def draw_boxes(image, face_locations, names=None):
    # Convert to BGR for OpenCV if needed
    if image.shape[2] == 3 and image.dtype == 'uint8':
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    for i, (top, right, bottom, left) in enumerate(face_locations):
        cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
        if names and i < len(names):
            cv2.putText(image, names[i], (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    return image
