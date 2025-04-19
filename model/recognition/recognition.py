
import face_recognition
import cv2
import numpy as np
import csv
import os
from collections import defaultdict
from face_cache import save_encodings_to_cache, load_encodings_from_cache 
from division import split_image, delete_directory
from training import load_faces_from_csv, upload_and_recognize



'''
Dividing the images of test folder into 3x3 and 4x4 grids
and saving them into the output folder.
'''

TEST_FOLDER = "test_folder"
OUTPUT_FOLDER = "output"
CSV_FILE = "Data/dataset.csv"

delete_directory()
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

for filename in os.listdir(TEST_FOLDER):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        image_path = os.path.join(TEST_FOLDER, filename)
        print(f"\n[PROCESSING] {image_path}")
        split_image(image_path, OUTPUT_FOLDER, grid_size=3)
        split_image(image_path, OUTPUT_FOLDER, grid_size=4)


'''
Loading the face encodings from the CSV file and saving them into the cache.
If the cache is empty, it will load the encodings from the CSV file.
'''
known_face_encodings, known_face_names = load_encodings_from_cache()

if not known_face_encodings or not known_face_names:
    print("Cache not found. Loading from CSV...")
    load_faces_from_csv(CSV_FILE)
    save_encodings_to_cache(known_face_encodings, known_face_names)
else:
    print("Loaded face encodings from cache.")


'''
Uploading the images from the output folder and recognizing the faces.
''' 

upload_and_recognize(OUTPUT_FOLDER)  



'''
Deleting the output folder after processing.
This is optional and can be commented out if you want to keep the output folder.
'''
delete_directory()
