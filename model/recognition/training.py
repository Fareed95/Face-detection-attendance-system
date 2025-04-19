import face_recognition
import cv2
import numpy as np
import pandas as pd 
import csv
import os
from collections import defaultdict
from face_cache import save_encodings_to_cache, load_encodings_from_cache 
# from division import split_image_3, split_image_4, delete_directory # Import caching functions

# Paths
CSV_FILE = "Data/dataset.csv"  # Path to your CSV file
TEST_FOLDER = "test_folder"  # Folder containing test images

# Load known faces and their names from cache or CSV
known_face_encodings, known_face_names = load_encodings_from_cache()

def load_faces_from_csv(csv_file):
    global known_face_encodings, known_face_names
    known_face_encodings = []
    known_face_names = []

    try:
        with open(csv_file, newline='') as file:
            reader = csv.reader(file)
            next(reader)
            for row in reader:
                if len(row) < 2:
                    print(f"Skipping invalid row: {row}")
                    continue
                
                name = row[0].strip()
                image_paths = [path.strip() for path in row[1:] if path.strip()]
                
                for image_path in image_paths:
                    try:
                        image = face_recognition.load_image_file(image_path)
                        encoding = face_recognition.face_encodings(image)
                        if encoding:
                            known_face_encodings.append(encoding[0])
                            known_face_names.append(name)
                        else:
                            print(f"Warning: No face found in {image_path}")
                    except Exception as e:
                        print(f"Error loading {image_path}: {e}")
    except FileNotFoundError:
        print(f"CSV file '{csv_file}' not found!")

# If cache is empty, load from CSV and save to cache
if not known_face_encodings or not known_face_names:
    print("Cache not found. Loading from CSV...")
    load_faces_from_csv(CSV_FILE)
    save_encodings_to_cache(known_face_encodings, known_face_names)
else:
    print("Loaded face encodings from cache.")
def upload_and_recognize(folder):
    similarity_scores = defaultdict(list)  # To store cumulative similarity scores per user

    for file_name in os.listdir(folder):
        file_path = os.path.join(folder, file_name)
        if not file_path.endswith(('.jpg', '.jpeg', '.png')):
            continue

        uploaded_image = face_recognition.load_image_file(file_path)
        frame = cv2.imread(file_path)

        # Screen sizing as per your laptop
        screen_width = 800  
        screen_height = 600  
        h, w, _ = frame.shape
        scaling_factor = min(screen_width / w, screen_height / h)
        new_w = int(w * scaling_factor)
        new_h = int(h * scaling_factor)
        frame_resized = cv2.resize(frame, (new_w, new_h))

        face_locations = face_recognition.face_locations(uploaded_image)
        face_encodings = face_recognition.face_encodings(uploaded_image, face_locations)

        current_image_names = []  # Avoid duplicate recognition in the same image

        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            name = "Unknown"
            
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                best_match_distance = face_distances[best_match_index]
                
                # Define threshold for 80% match (0.4)
                THRESHOLD = 0.4

                if best_match_distance <= THRESHOLD:
                    name = known_face_names[best_match_index]
                    similarity = round((1 - best_match_distance) * 100, 2)

                    if name not in current_image_names:
                        similarity_scores[name].append(similarity)
                        current_image_names.append(name)

        # Scaling
        scale_x = new_w / w
        scale_y = new_h / h

        for (top, right, bottom, left), name in zip(face_locations, current_image_names):
            top = int(top * scale_y)
            right = int(right * scale_x)
            bottom = int(bottom * scale_y)
            left = int(left * scale_x)

            # Drawing rectangles and labels
            # cv2.rectangle(frame_resized, (left, top), (right, bottom), (0, 0, 255), 2)
            # cv2.rectangle(frame_resized, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            # font = cv2.FONT_HERSHEY_DUPLEX
            # cv2.putText(frame_resized, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Show the image
        # cv2.imshow(f"Uploaded Image - {file_name}", frame_resized)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
    
    # Prepare data for CSV
    data = []
    for name, scores in similarity_scores.items():
        avg_score = round(sum(scores) / len(scores), 2)
        count = len(scores)
        data.append({
            "Name": name,
            "Average Similarity (%)": avg_score,
            "Times Recognized": count
        })

    # Convert to DataFrame and write to CSV
    df = pd.DataFrame(data)
    csv_path = "recognition_results.csv"
    df.to_csv(csv_path, index=False)
    print(f"CSV file saved to: {csv_path}")

    return list(similarity_scores.keys())

if __name__ == "__main__":
    TEST_FOLDER = "test_folder"
    OUTPUT_FOLDER = "output"

    # Clean previous outputs
    # delete_directory()
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    for filename in os.listdir(TEST_FOLDER):
        if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        image_path = os.path.join(TEST_FOLDER, filename)
        # split_image_3(image_path, OUTPUT_FOLDER)
        # split_image_4(image_path, OUTPUT_FOLDER)
