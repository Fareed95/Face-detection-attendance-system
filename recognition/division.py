import cv2
import os
import shutil

def split_image(image_path, output_folder, grid_size):
    image = cv2.imread(image_path)
    if image is None:
        print(f"[ERROR] Could not load image: {image_path}")
        return

    image_name = os.path.splitext(os.path.basename(image_path))[0]
    height, width, _ = image.shape
    tile_height = height // grid_size
    tile_width = width // grid_size

    count = 0
    for i in range(grid_size):
        for j in range(grid_size):
            x_start, y_start = j * tile_width, i * tile_height
            x_end, y_end = x_start + tile_width, y_start + tile_height
            tile = image[y_start:y_end, x_start:x_end]

            tile_filename = os.path.join(
                output_folder, f"{image_name}_size_{grid_size}_tile_{count}.png"
            )
            saved = cv2.imwrite(tile_filename, tile)
            print(f"[Saved] {tile_filename}, Success: {saved}")
            count += 1

def delete_directory():
    if os.path.exists('output'):
        shutil.rmtree('output')
        print("[INFO] Output directory deleted.")

if __name__ == "__main__":
    TEST_FOLDER = "test_folder"
    OUTPUT_FOLDER = "output"

    delete_directory()
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    for filename in os.listdir(TEST_FOLDER):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            image_path = os.path.join(TEST_FOLDER, filename)
            print(f"\n[PROCESSING] {image_path}")
            split_image(image_path, OUTPUT_FOLDER, grid_size=3)
            split_image(image_path, OUTPUT_FOLDER, grid_size=4)
