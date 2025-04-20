import sys
import os
import json
from flask import Flask, request, jsonify
import datetime
from metrics.division import split_image, delete_directory  # Ensure this imports correctly
from deepface_model.main import recognize_faces_in_directory  # Now this should work
from flask_cors import CORS
from api.email_sending import send_attendance_emails  # Ensure this imports correctly

app = Flask(__name__)

# Folder to temporarily save uploaded images
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def sanitize_face_recognition_result(result):
    for face in result:
        if 'parent_email' in face and (face['parent_email'] == 'NaN' or face['parent_email'] != face['parent_email']):
            face['parent_email'] = None  # or "" if you prefer an empty string
    return result

def validate_json(data):
    try:
        json.dumps(data)
        return True
    except (TypeError, OverflowError):
        return False

@app.route('/')
def index():
    return "Welcome to the Image Upload and Recognition API!"

# CORS configuration
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001"
], supports_credentials=True)

@app.route('/upload', methods=['POST'])
def upload_images():
    # Get the name from the form data
    user_name = request.form.get('name')
    if not user_name:
        return jsonify({"error": "Name is required"}), 400
    subject_name = request.form.get('subject_name')
    if not subject_name:
        return jsonify({"error": "Subject name is required"}), 400

    # Create a directory named after the user and the current timestamp
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    user_output_folder = os.path.join(OUTPUT_FOLDER, f"{user_name}_{timestamp}")
    os.makedirs(user_output_folder, exist_ok=True)

    # Limit: Max 6 images
    images = request.files.getlist('images')
    if len(images) > 6:
        return jsonify({"error": "You can upload a maximum of 6 images"}), 400

    if not images:
        return jsonify({"error": "No images uploaded"}), 400

    # Save uploaded images to the server
    image_paths = []
    for image in images:
        image_filename = os.path.join(UPLOAD_FOLDER, image.filename)
        image.save(image_filename)
        image_paths.append(image_filename)

    # Call split_image function for each image
    for image_path in image_paths:
        split_image(image_path, user_output_folder, grid_size=3)
        split_image(image_path, user_output_folder, grid_size=4)

    # Call recognition_faces_in_directory function from main.py
    face_recognition_result = recognize_faces_in_directory(user_output_folder)

    # Sanitize the face recognition result
    face_recognition_result = sanitize_face_recognition_result(face_recognition_result)

    # Log the face recognition result
    print("Face recognition result:", face_recognition_result)

    # Validate the response data
    if not validate_json(face_recognition_result):
        return jsonify({"error": "Invalid JSON response"}), 500

    try:
        send_attendance_emails(face_recognition_result, subject=subject_name, class_time=timestamp)
    except Exception as e:
        print(f"[ERROR] Sending emails failed: {e}")

    # Delete the output folder after processing
    delete_directory(user_output_folder)

    # Return the list of recognized faces in the response
    return jsonify({"recognized_faces": face_recognition_result})

if __name__ == '__main__':
    app.run(port=8000, debug=True)
