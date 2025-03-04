import cv2
import os
import face_recognition
import pandas as pd
import numpy as np

def show_image(title, img):
    cv2.imshow(title, img)
    cv2.waitKey(1000)
    cv2.destroyAllWindows()

def load_dataset(csv_file):
    df = pd.read_csv(csv_file)
    face_encodings = []
    names = []
    
    for index, row in df.iterrows():
        image_path = row['profile image']
        name = row['name']
        
        if not os.path.exists(image_path):
            print(f"Error: Image {image_path} not found.")
            continue

        image = face_recognition.load_image_file(image_path)  # Loads in RGB
        img = cv2.imread(image_path)  # Loads in BGR (OpenCV format)

        # Convert RGB to BGR before resizing
        small_image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        small_image = cv2.resize(small_image, (0, 0), fx=0.5, fy=0.5)

        # Detect face locations in resized image
        face_locations_small = face_recognition.face_locations(small_image, model="hog")
        
        if not face_locations_small:
            print(f"Warning: No faces detected in {image_path}.")
            continue

        # Scale back face locations to original size
        face_locations = [(int(top * 2), int(right * 2), int(bottom * 2), int(left * 2)) for (top, right, bottom, left) in face_locations_small]
        
        # Encode faces
        face_encoding = face_recognition.face_encodings(image, face_locations)
        
        if face_encoding:
            face_encodings.append(face_encoding[0])
            names.append(name) 

        # Draw face detection box on original image
        for (top, right, bottom, left) in face_locations:
            cv2.rectangle(img, (left, top), (right, bottom), (0, 255, 0), 2)

        show_image(f"Face Detection - {name}", img)
    
    return face_encodings, names

if __name__ == "__main__":
    csv_file = "Data/dataset.csv"
    dataset_encodings, dataset_names = load_dataset(csv_file)
