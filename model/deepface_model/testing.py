import warnings
import numpy as np
import cv2
from deepface_model import DeepFace
import pickle
import os

warnings.filterwarnings("ignore")

# # Step 1: Train using one image
def train_single_person(name, image_path, encoding_file="face_encodings.pkl"):
    if not os.path.exists(image_path):
        print(f"Training image not found: {image_path}")
        return

    try:
        result = DeepFace.represent(image_path, model_name='Facenet', enforce_detection=False)
        encoding = result[0]['embedding']
        face_encodings = {name: encoding}
        with open(encoding_file, 'wb') as f:
            pickle.dump(face_encodings, f)
        print("[✓] Training done successfully.")
    except Exception as e:
        print(f"[✗] Training failed: {e}")


def test_recognition(test_image_path, encoding_file="face_encodings.pkl"):
    if not os.path.exists(test_image_path):
        print(f"Test image not found: {test_image_path}")
        return

    with open(encoding_file, 'rb') as f:
        face_encodings = pickle.load(f)

    try:
        result = DeepFace.represent(img_path=test_image_path, model_name='Facenet', enforce_detection=False)
        face_embedding = result[0]['embedding']
    except Exception as e:
        print(f"[✗] Failed to extract embedding from test image: {e}")
        return

    try:
        distances = {name: np.linalg.norm(np.array(enc) - np.array(face_embedding)) for name, enc in face_encodings.items()}
        recognized_name = min(distances, key=distances.get) if distances else "Unknown"

        print(f"[✓] Recognized as: {recognized_name}")
    except Exception as e:
        print(f"[✗] Recognition failed: {e}")


def recognize_multiple_faces(image_path, encoding_file="face_encodings.pkl"):
    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        return

    # Load trained encodings
    with open(encoding_file, 'rb') as f:
        face_encodings = pickle.load(f)

    # Load and resize image for display
    img = cv2.imread(image_path)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Detect all faces in the image
    try:
        detected_faces = DeepFace.extract_faces(img_path=image_path, detector_backend='retinagface', enforce_detection=False)
    except Exception as e:
        print(f"[✗] Error detecting faces: {e}")
        return

    if not detected_faces:
        print("No faces found.")
        return

    print(f"[✓] {len(detected_faces)} face(s) detected.")

    recognized_names = []

    # For drawing, get scale if resizing is needed
    new_w, new_h = 800, 600
    img_resized = cv2.resize(img_rgb, (new_w, new_h))
    original_h, original_w = img.shape[:2]
    scale_x = new_w / original_w
    scale_y = new_h / original_h

    for i, face_info in enumerate(detected_faces):
        face_img = face_info['face']
        box = face_info.get('box', None)

        try:
            # Get embedding for the face
            embedding = DeepFace.represent(img_path=face_img, model_name='Facenet', enforce_detection=False)[0]['embedding']

            # Compare with saved embeddings
            distances = {name: np.linalg.norm(np.array(enc) - np.array(embedding)) for name, enc in face_encodings.items()}
            recognized_name = min(distances, key=distances.get)
            recognized_names.append(recognized_name)

            # Draw on resized image
            if box:
                x, y, w, h = box
                x = int(x * scale_x)
                y = int(y * scale_y)
                w = int(w * scale_x)
                h = int(h * scale_y)

                cv2.rectangle(img_resized, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(img_resized, recognized_name, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            print(f"[✓] Face {i+1}: {recognized_name}")

        except Exception as e:
            print(f"[✗] Failed to recognize face {i+1}: {e}")
            recognized_names.append("Unknown")

    # Show final image
    final_bgr = cv2.cvtColor(img_resized, cv2.COLOR_RGB2BGR)
    cv2.imshow("Recognized Faces", final_bgr)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    print("\n✅ Final recognized names:", set(recognized_names))

    return recognized_names

def recognize_faces_in_directory(test_dir, encoding_file="face_encodings.pkl"):
    if not os.path.exists(test_dir):
        print(f"Directory not found: {test_dir}")
        return

    # Load trained encodings
    with open(encoding_file, 'rb') as f:
        face_encodings = pickle.load(f)

    recognized_names = set()

    image_files = [f for f in os.listdir(test_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    print(f"\n📂 Found {len(image_files)} images in directory: {test_dir}\n")

    for image_file in image_files:
        image_path = os.path.join(test_dir, image_file)
        print(f"\n📸 Processing image: {image_file}")

        try:
            # Read image
            img = cv2.imread(image_path)
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Detect faces
            detected_faces = DeepFace.extract_faces(img_path=image_path,
                                                     detector_backend='retinaface',
                                                    #  model_name = 'Facenet512',
                                                       enforce_detection=False)

            if not detected_faces:
                print("❌ No faces detected.")
                continue

            print(f"✅ {len(detected_faces)} face(s) found.")

            for i, face_info in enumerate(detected_faces):
                face_img = face_info['face']
                try:
                    embedding = DeepFace.represent(img_path=face_img, model_name='Facenet', enforce_detection=False)[0]['embedding']

                    # Compare embeddings
                    distances = {name: np.linalg.norm(np.array(enc) - np.array(embedding)) for name, enc in face_encodings.items()}
                    recognized_name = min(distances, key=distances.get)
                    recognized_names.add(recognized_name)
                    print(f"   ➤ Face {i+1}: {recognized_name}")

                except Exception as e:
                    print(f"   ✗ Error recognizing face {i+1}: {e}")

        except Exception as e:
            print(f"⚠️ Error processing image {image_file}: {e}")

    print("\n🎯 Final recognized people from all images:")
    print(recognized_names)
    return recognized_names


# Example usage
if __name__ == "__main__":
    # Change these paths for your test
    # train_single_person("Fareed", "Data/fareed1.jpg")  # <- Training image
    # test_recognition("images/yedi.jpg")               # <- Test image
    # recognize_multiple_faces("test_folder/testingdata9.jpg")  # <- Test image with multiple faces
    recognize_faces_in_directory("output")  # <- Directory with multiple images