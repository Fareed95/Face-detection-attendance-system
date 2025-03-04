import face_recognition
import cv2
import numpy as np
import tkinter as tk
from tkinter import filedialog

# Load known faces and their names
known_face_encodings = []
known_face_names = []

# Load a sample picture and learn how to recognize it.
nitin_image = face_recognition.load_image_file("images/nitin.jpg")
nitin_face_encoding = face_recognition.face_encodings(nitin_image)[0]
known_face_encodings.append(nitin_face_encoding)
known_face_names.append("Nitin")

zaid_image = face_recognition.load_image_file("images/zaid.jpg")
zaid_face_encoding = face_recognition.face_encodings(zaid_image)[0]
known_face_encodings.append(zaid_face_encoding)
known_face_names.append("Zaid")

def upload_and_recognize():
    # Open file dialog to select an image
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename()

    if not file_path:
        print("No file selected!")
        return

    # Load the uploaded image
    uploaded_image = face_recognition.load_image_file(file_path)
    
    # Convert to OpenCV format for display
    frame = cv2.imread(file_path)

    # Resize image for better display (keeping aspect ratio)
    screen_width = 800  # Adjust based on your screen
    screen_height = 600  # Adjust based on your screen
    h, w, _ = frame.shape
    scaling_factor = min(screen_width / w, screen_height / h)
    new_w = int(w * scaling_factor)
    new_h = int(h * scaling_factor)
    frame_resized = cv2.resize(frame, (new_w, new_h))

    # Find all the faces and face encodings in the uploaded image
    face_locations = face_recognition.face_locations(uploaded_image)
    face_encodings = face_recognition.face_encodings(uploaded_image, face_locations)

    face_names = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]

        face_names.append(name)

    # Adjust face location scaling based on resized image
    scale_x = new_w / w
    scale_y = new_h / h

    for (top, right, bottom, left), name in zip(face_locations, face_names):
        top = int(top * scale_y)
        right = int(right * scale_x)
        bottom = int(bottom * scale_y)
        left = int(left * scale_x)

        # Draw a box around the face
        cv2.rectangle(frame_resized, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.rectangle(frame_resized, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame_resized, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    # Show the resized image
    cv2.imshow("Uploaded Image", frame_resized)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    upload_and_recognize()