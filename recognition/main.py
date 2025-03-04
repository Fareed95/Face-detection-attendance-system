import cv2
import face_recognition
import pandas as pd
import numpy as np

def load_dataset(excel_file):
    df = pd.read_excel(excel_file)
    face_encodings = []
    names = []
    
    for index, row in df.iterrows():
        image_path = row['profile image']
        name = row['name']
        
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        face_encoding = face_recognition.face_encodings(image, face_locations)
        
        if face_encoding:
            face_encodings.append(face_encoding[0])
            names.append(name)
    
    return face_encodings, name

def find_matching_faces(input_image, dataset_encodings, dataset_names):
    input_img = face_recognition.load_image_file(input_image)
    input_face_locations = face_recognition.face_locations(input_img)
    input_encodings = face_recognition.face_encodings(input_img, input_face_locations)
    
    matched_names = []
    
    for input_encoding in input_encodings:
        matches = face_recognition.compare_faces(dataset_encodings, input_encoding)
        
        for i, match in enumerate(matches):
            if match:
                matched_names.append(dataset_names[i])
    
    return matched_names

if __name__ == "__main__":
    excel_file = "Data/dataset.csv"  # Change this to your actual Excel file
    input_image = "test/hanzala.jpg"  # Change this to your input image
    
    dataset_encodings, dataset_names = load_dataset(excel_file)
    matched_results = find_matching_faces(input_image, dataset_encodings, dataset_names)
    
    if matched_results:
        print("Matching emails found:", matched_results)
    else:
        print("No matching faces found.")
