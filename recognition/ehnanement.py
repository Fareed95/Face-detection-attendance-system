import cv2
import os
import numpy as np


def enhance_image(image_path, output_path):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Could not read {image_path}")
        return

    # Resize image to a higher resolution (e.g., 2x original size)
    image = cv2.resize(image, (0, 0), fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # Apply sharpening filter
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    image = cv2.filter2D(image, -1, kernel)

    # Convert to RGB if the image is grayscale (for compatibility)
    if len(image.shape) == 2 or image.shape[2] == 1:  # Grayscale image
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    # Save the enhanced RGB image
    cv2.imwrite(output_path, image)
    print(f"Enhanced image saved at {output_path}")


def process_directory(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            enhance_image(input_path, output_path)


if __name__ == "__main__":
    input_dir = "test_folder"
    output_dir = "enhanced_testingdata"

    process_directory(input_dir, output_dir)
