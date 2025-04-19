import warnings
import numpy as np
import cv2
from deepface import DeepFace
import pickle
import pandas as pd
import os
# from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity
# import os
from PIL import Image

# Suppress unnecessary warnings
warnings.filterwarnings("ignore", category=UserWarning, module="deepface")
warnings.filterwarnings("ignore", category=RuntimeWarning, module="tensorflow")


def train_faces(csv_path, encoding_file="face_encodings.pkl"):
    df = pd.read_csv(csv_path)
    face_encodings = {}

    for index, row in df.iterrows():
        name = row['name']
        image_paths = [path.strip() for path in row[1:] if isinstance(path, str) and path.strip()]
        encodings = []

        for image_path in image_paths:
            if os.path.exists(image_path):
                try:
                    result = DeepFace.represent(image_path, model_name='Facenet', enforce_detection=False)
                    encodings.append(result[0]['embedding'])
                except Exception as e:
                    print(f"[Error] {image_path}: {e}")
            else:
                print(f"[Missing] Image file not found: {image_path}")

        if encodings:
            face_encodings[name] = np.mean(encodings, axis=0)

    with open(encoding_file, 'wb') as f:
        pickle.dump(face_encodings, f)

    print(f"[Info] Training complete. Encodings saved to '{encoding_file}'.")

def recognize_face(image_path, encoding_file="face_encodings.pkl", threshold=0.7):
    if not os.path.exists(encoding_file):
        print(f"[Error] Encoding file '{encoding_file}' not found.")
        return None

    with open(encoding_file, 'rb') as f:
        face_encodings = pickle.load(f)

    if not os.path.exists(image_path):
        print(f"[Error] Input image file '{image_path}' not found.")
        return None

    try:
        result = DeepFace.represent(image_path, model_name='Facenet', enforce_detection=False)
        input_embedding = np.array(result[0]['embedding'])
    except Exception as e:
        print(f"[Error] Could not process image: {e}")
        return None

    best_match = None
    best_score = -1

    for name, encoding in face_encodings.items():
        similarity = cosine_similarity([input_embedding], [encoding])[0][0]
        if similarity > best_score:
            best_score = similarity
            best_match = name

    if best_score >= threshold:
        print(f"[Match] Recognized as: {best_match} (Similarity: {best_score:.2f})")
        return best_match
    else:
        print(f"[No Match] No similar face found (Best similarity: {best_score:.2f})")
        return None
    
def recognize_faces_in_directory(directory_path, encoding_file="face_encodings.pkl", threshold=0.7):
    if not os.path.exists(encoding_file):
        print(f"[Error] Encoding file '{encoding_file}' not found.")
        return []

    with open(encoding_file, 'rb') as f:    
        face_encodings = pickle.load(f)

    recognized_faces = set()

    for filename in os.listdir(directory_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(directory_path, filename)
            print(f"\n📷 Processing {filename}...")

            try:
                # This will detect multiple faces and return their embeddings
                results = DeepFace.represent(img_path=image_path, model_name='Facenet', enforce_detection=False)

                for face in results:
                    input_embedding = np.array(face['embedding'])
                    best_match = None
                    best_score = -1

                    for name, encoding in face_encodings.items():
                        similarity = cosine_similarity([input_embedding], [encoding])[0][0]
                        if similarity > best_score:
                            best_score = similarity
                            best_match = name

                    if best_score >= threshold:
                        print(f"✅ Found: {best_match} (Similarity: {best_score:.2f})")
                        recognized_faces.add(best_match)
                    else:
                        print(f"❌ Unknown face (Similarity: {best_score:.2f})")

            except Exception as e:
                print(f"[Error] Failed to process {filename}: {e}")

    print("\n🧠 Final recognized faces:")
    for name in recognized_faces:
        print(f" - {name}")

    return list(recognized_faces)
# Example usage
if __name__ == "__main__":
    # Train the model (you can comment this out if already trained)
    train_faces("Data/dataset_copy.csv")

    # Recognize faces in a test image
    # recognize_face("images/yedi.jpg")
    # Recognize faces in a directory
    recognized_faces = recognize_faces_in_directory("output")
