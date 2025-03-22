import face_recognition
import cv2
import numpy as np
import csv
import os
from collections import defaultdict

# Paths
CSV_FILE = "Data/dataset.csv"  # Path to your CSV file
TEST_FOLDER = "enhanced_testingdata"  # Folder containing test images

# Load known faces and their names from CSV
known_face_encodings = []
known_face_names = []

def load_faces_from_csv(csv_file):
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

# Load faces from the CSV file
load_faces_from_csv(CSV_FILE)

def upload_and_recognize():
    similarity_scores = defaultdict(list)  # To store cumulative similarity scores per user

    for file_name in os.listdir(TEST_FOLDER):
        file_path = os.path.join(TEST_FOLDER, file_name)
        if not file_path.endswith(('.jpg', '.jpeg', '.png')):
            continue

        uploaded_image = face_recognition.load_image_file(file_path)
        frame = cv2.imread(file_path)

        # Screen sizing as per my laptop screen
        screen_width = 800  
        screen_height = 600  
        h, w, _ = frame.shape
        scaling_factor = min(screen_width / w, screen_height / h)
        new_w = int(w * scaling_factor)
        new_h = int(h * scaling_factor)
        frame_resized = cv2.resize(frame, (new_w, new_h))

        face_locations = face_recognition.face_locations(uploaded_image)
        face_encodings = face_recognition.face_encodings(uploaded_image, face_locations)

        current_image_names = []  # To avoid duplicate recognition in the same image

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

            # Finding the faces and drawing rectangles
            cv2.rectangle(frame_resized, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.rectangle(frame_resized, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame_resized, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Final screen
        cv2.imshow(f"Uploaded Image - {file_name}", frame_resized)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    
    # Calculate average similarity for each detected user
    final_recognized_users = {}
    for name, scores in similarity_scores.items():
        average_similarity = sum(scores) / len(scores)
        if average_similarity >= 80:
            final_recognized_users[name] = round(average_similarity, 2)
    
    return final_recognized_users


if __name__ == "__main__":
    recognized_users = upload_and_recognize()
    if recognized_users:
        print("\nFinal Recognized Users:")
        for name, similarity in recognized_users.items():
            print(f"{name}: {similarity}% similarity")
    else:
        print("No user matched above 80% similarity in the images.")
