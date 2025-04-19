import os
import csv
import shutil

CSV_PATH = "Data/dataset.csv"        # Your existing CSV path
OUTPUT_DIR = "face_db"               # Output folder for DeepFace-compatible structure
USE_SYMLINKS = False                 # Set to True to create symlinks instead of copying

def sanitize(name):
    return name.replace(" ", "_").replace("/", "_")

def convert_csv_to_folder_structure(csv_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(csv_path, newline='') as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip header

        for row in reader:
            if len(row) < 2:
                print(f"Skipping invalid row: {row}")
                continue

            name = sanitize(row[0])
            image_paths = [path.strip() for path in row[1:] if path.strip()]
            person_folder = os.path.join(output_dir, name)
            os.makedirs(person_folder, exist_ok=True)

            for image_path in image_paths:
                try:
                    if not os.path.exists(image_path):
                        print(f"Image not found: {image_path}")
                        continue

                    image_name = os.path.basename(image_path)
                    dest_path = os.path.join(person_folder, image_name)

                    if USE_SYMLINKS:
                        os.symlink(os.path.abspath(image_path), dest_path)
                    else:
                        shutil.copy2(image_path, dest_path)

                except Exception as e:
                    print(f"Failed to process {image_path}: {e}")

    print(f"✅ Folder structure created in: {output_dir}")

if __name__ == "__main__":
    convert_csv_to_folder_structure(CSV_PATH, OUTPUT_DIR)
