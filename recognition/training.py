import os
import csv
import shutil
from division import split_image, delete_directory

CSV_PATH = "Data/dataset.csv"
FACE_DB_DIR = "face_db"
TEST_FOLDER = "test_folder"
OUTPUT_FOLDER = "output"
USE_SYMLINKS = False  # Set to True if you prefer symlinks


def sanitize(name):
    return name.replace(" ", "_").replace("/", "_")


def split_test_images():
    delete_directory()
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    for filename in os.listdir(TEST_FOLDER):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join(TEST_FOLDER, filename)
            print(f"🧩 Splitting {image_path} into tiles...")
            split_image(image_path, OUTPUT_FOLDER, grid_size=3)
            split_image(image_path, OUTPUT_FOLDER, grid_size=4)


if __name__ == "__main__":
    convert_csv_to_folder_structure(CSV_PATH, FACE_DB_DIR)
    split_test_images()
    print("✅ Training and test data prepared.")
