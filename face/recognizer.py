# recognizer.py
import face_recognition
import cv2
import pickle
import os
import numpy as np

ENCODINGS_PATH = "data/encodings.pkl"

def load_encodings():
    if not os.path.exists(ENCODINGS_PATH):
        print("[ERROR] No registered faces found.")
        return []
    with open(ENCODINGS_PATH, "rb") as f:
        return pickle.load(f)

def recognize_live():
    known_faces = load_encodings()
    if not known_faces:
        return

    known_encodings = [entry["encoding"] for entry in known_faces]
    known_names = [entry["name"] for entry in known_faces]

    video = cv2.VideoCapture(0)
    print("[INFO] Starting webcam...")

    while True:
        ret, frame = video.read()
        if not ret:
            break

        # Resize frame for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Detect faces and encodings in the frame
        face_locations = face_recognition.face_locations(rgb_small)
        face_encodings = face_recognition.face_encodings(rgb_small, face_locations)

        # Compare each face to known encodings
        face_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_encodings, face_encoding)
            name = "Unknown"

            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match = np.argmin(face_distances)
                if matches[best_match]:
                    name = known_names[best_match]

            face_names.append(name)

        # Draw results
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 128, 255), 2)
            cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

        cv2.imshow("Live Recognition", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video.release()
    cv2.destroyAllWindows()
    print("[INFO] Webcam stopped.")


