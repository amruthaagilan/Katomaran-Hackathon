# detector.py
import face_recognition
import cv2
import os

def detect_faces(image_path, show_result=True, save_path=None):
    # Load the image using face_recognition
    image = face_recognition.load_image_file(image_path)

    # Detect face locations
    face_locations = face_recognition.face_locations(image)

    print(f"[INFO] Detected {len(face_locations)} face(s)")

    # Convert to BGR color for OpenCV
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Draw rectangles around detected faces
    for top, right, bottom, left in face_locations:
        cv2.rectangle(image_bgr, (left, top), (right, bottom), (0, 255, 0), 2)

    if show_result:
        cv2.imshow("Detected Faces", image_bgr)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    if save_path:
        cv2.imwrite(save_path, image_bgr)

    return face_locations


