# encoder.py
import face_recognition
import cv2
import os

def encode_faces(image_path):
    # Load the image
    image = face_recognition.load_image_file(image_path)

    # Detect face locations
    face_locations = face_recognition.face_locations(image)

    # Encode the faces
    face_encodings = face_recognition.face_encodings(image, face_locations)

    print(f"[INFO] Found {len(face_encodings)} face(s) with encodings.")

    return face_encodings, face_locations

def draw_faces(image_path, face_locations):
    image = face_recognition.load_image_file(image_path)
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    for top, right, bottom, left in face_locations:
        cv2.rectangle(image_bgr, (left, top), (right, bottom), (255, 0, 0), 2)

    cv2.imshow("Encoded Faces", image_bgr)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

