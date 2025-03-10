'''
Main file to recognize the faces of the users which are in the database
'''

import face_recognition
import cv2
import numpy as np
import tkinter as tk
from tkinter import filedialog
import csv

# Paths
CSV_FILE = "Data/dataset.csv"  # Path to your CSV file

# Load known faces and their names from CSV
known_face_encodings = []
known_face_names = []

def load_faces_from_csv(csv_file):
    try:
        with open(csv_file, newline='') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) < 2:
                    print(f"Skipping invalid row: {row}")
                    continue
                image_path, name = row
                try:
                    image = face_recognition.load_image_file(image_path)
                    encoding = face_recognition.face_encodings(image)
                    if encoding:
                        known_face_encodings.append(encoding[0])
                        known_face_names.append(name.strip())
                    else:
                        print(f"Warning: No face found in {image_path}")
                except Exception as e:
                    print(f"Error loading {image_path}: {e}")
    except FileNotFoundError:
        print(f"CSV file '{csv_file}' not found!")

# Load faces from the CSV file
load_faces_from_csv(CSV_FILE)

def upload_and_recognize(test_image):
    root = tk.Tk()
    root.withdraw()
    file_path = test_image

    if not file_path:
        print("No file selected!")
        return

    uploaded_image = face_recognition.load_image_file(file_path)
    frame = cv2.imread(file_path)

    '''
    Screen sizing as per my laptop screen
    '''
    screen_width = 800  
    screen_height = 600  
    h, w, _ = frame.shape
    scaling_factor = min(screen_width / w, screen_height / h)
    new_w = int(w * scaling_factor)
    new_h = int(h * scaling_factor)
    frame_resized = cv2.resize(frame, (new_w, new_h))

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

    # Print the detected face names in the terminal
    if face_names:
        # print("Detected Faces:", ", ".join(face_names))
        return face_names
    else:
        # print("No known faces detected!")
        return None

    
if __name__ == "__main__":
    faces = upload_and_recognize("test/fareednitin.jpg")
    print(faces)