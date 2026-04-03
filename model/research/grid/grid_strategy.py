"""
Grid Strategy - Configurable multi-resolution image tiling.

Implements the core research contribution: splitting group photographs
into overlapping or non-overlapping grids at multiple resolutions to
improve face detection in crowded/unconstrained settings.
"""

import cv2
import numpy as np
import os
import shutil
from typing import List, Tuple, Optional


class GridStrategy:
    """
    Multi-resolution grid tiling strategy for face detection enhancement.

    Key idea: Large group photos often contain small faces that detectors miss.
    By splitting the image into tiles, each face occupies a larger portion of
    the tile, improving detection accuracy.

    Supports:
    - Multiple grid sizes (e.g., 2x2, 3x3, 4x4)
    - Overlapping tiles for faces on grid boundaries
    - Minimum tile size filtering
    - Optional inclusion of the original full image
    """

    def __init__(
        self,
        enabled: bool = True,
        sizes: Optional[List[int]] = None,
        include_original: bool = True,
        overlap: float = 0.0,
        min_tile_size: int = 64,
    ):
        self.enabled = enabled
        self.sizes = sizes if sizes else [3, 4]
        self.include_original = include_original
        self.overlap = max(0.0, min(0.9, overlap))  # Clamp to [0, 0.9]
        self.min_tile_size = min_tile_size

    def split_image(
        self,
        image: np.ndarray,
        grid_size: int,
    ) -> List[Tuple[np.ndarray, dict]]:
        """
        Split an image into grid_size x grid_size tiles.

        Args:
            image: Input image (BGR numpy array)
            grid_size: Number of divisions along each axis (e.g., 3 for 3x3)

        Returns:
            List of (tile_image, metadata) tuples where metadata contains:
                - grid_size: int
                - row: int, col: int
                - x_start, y_start, x_end, y_end: int (original image coords)
                - tile_index: int
        """
        if image is None or len(image.shape) < 2:
            return []

        height, width = image.shape[:2]
        tiles = []

        # Calculate tile dimensions with overlap
        if self.overlap > 0:
            # Effective stride is smaller than tile size
            tile_height = height // grid_size
            tile_width = width // grid_size
            stride_h = int(tile_height * (1 - self.overlap))
            stride_w = int(tile_width * (1 - self.overlap))

            tile_index = 0
            row = 0
            y = 0
            while y + tile_height <= height:
                col = 0
                x = 0
                while x + tile_width <= width:
                    tile = image[y : y + tile_height, x : x + tile_width]

                    # Skip tiles that are too small
                    if tile.shape[0] >= self.min_tile_size and tile.shape[1] >= self.min_tile_size:
                        metadata = {
                            "grid_size": grid_size,
                            "row": row,
                            "col": col,
                            "x_start": x,
                            "y_start": y,
                            "x_end": x + tile_width,
                            "y_end": y + tile_height,
                            "tile_index": tile_index,
                            "overlap": self.overlap,
                        }
                        tiles.append((tile, metadata))

                    tile_index += 1
                    col += 1
                    x += stride_w

                row += 1
                y += stride_h
        else:
            # Non-overlapping: standard grid
            tile_height = height // grid_size
            tile_width = width // grid_size

            tile_index = 0
            for i in range(grid_size):
                for j in range(grid_size):
                    y_start = i * tile_height
                    x_start = j * tile_width
                    y_end = y_start + tile_height
                    x_end = x_start + tile_width

                    tile = image[y_start:y_end, x_start:x_end]

                    if tile.shape[0] >= self.min_tile_size and tile.shape[1] >= self.min_tile_size:
                        metadata = {
                            "grid_size": grid_size,
                            "row": i,
                            "col": j,
                            "x_start": x_start,
                            "y_start": y_start,
                            "x_end": x_end,
                            "y_end": y_end,
                            "tile_index": tile_index,
                            "overlap": 0.0,
                        }
                        tiles.append((tile, metadata))

                    tile_index += 1

        return tiles

    def process_image(
        self, image: np.ndarray
    ) -> List[Tuple[np.ndarray, dict]]:
        """
        Apply complete grid strategy to an image.

        Generates tiles at all configured grid sizes, optionally including
        the original full image.

        Args:
            image: Input image (BGR numpy array)

        Returns:
            List of (tile_image, metadata) tuples
        """
        all_tiles = []

        if not self.enabled:
            # No grid: return just the original image
            metadata = {
                "grid_size": 0,
                "row": 0,
                "col": 0,
                "x_start": 0,
                "y_start": 0,
                "x_end": image.shape[1] if image is not None else 0,
                "y_end": image.shape[0] if image is not None else 0,
                "tile_index": 0,
                "overlap": 0.0,
                "is_original": True,
            }
            return [(image, metadata)]

        # Include original full image
        if self.include_original and image is not None:
            metadata = {
                "grid_size": 0,
                "row": 0,
                "col": 0,
                "x_start": 0,
                "y_start": 0,
                "x_end": image.shape[1],
                "y_end": image.shape[0],
                "tile_index": 0,
                "overlap": 0.0,
                "is_original": True,
            }
            all_tiles.append((image, metadata))

        # Generate tiles at each grid size
        for size in self.sizes:
            tiles = self.split_image(image, size)
            all_tiles.extend(tiles)

        return all_tiles

    def save_tiles_to_directory(
        self,
        image_path: str,
        output_dir: str,
    ) -> List[str]:
        """
        Split an image file and save all tiles to a directory.

        Args:
            image_path: Path to input image
            output_dir: Directory to save tiles

        Returns:
            List of saved file paths
        """
        image = cv2.imread(image_path)
        if image is None:
            return []

        os.makedirs(output_dir, exist_ok=True)
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        saved_paths = []

        tiles = self.process_image(image)
        for tile_img, metadata in tiles:
            if metadata.get("is_original"):
                filename = f"{base_name}_original.png"
            else:
                gs = metadata["grid_size"]
                idx = metadata["tile_index"]
                filename = f"{base_name}_grid{gs}_tile{idx}.png"

            filepath = os.path.join(output_dir, filename)
            cv2.imwrite(filepath, tile_img)
            saved_paths.append(filepath)

        return saved_paths

    def get_info(self) -> dict:
        """Return strategy configuration for logging."""
        return {
            "enabled": self.enabled,
            "sizes": self.sizes,
            "include_original": self.include_original,
            "overlap": self.overlap,
            "min_tile_size": self.min_tile_size,
            "total_tiles_per_image": self._estimate_tiles(),
        }

    def _estimate_tiles(self) -> int:
        """Estimate total number of tiles per image."""
        count = 1 if self.include_original else 0
        for size in self.sizes:
            if self.overlap > 0:
                # Approximate — exact count depends on image dimensions
                effective_grid = int(size / (1 - self.overlap))
                count += effective_grid * effective_grid
            else:
                count += size * size
        return count


def create_grid_from_config(config: dict) -> GridStrategy:
    """
    Factory function: create a GridStrategy from a config dictionary.

    Args:
        config: Dictionary with grid configuration (from config.yaml 'grid' section)

    Returns:
        Configured GridStrategy instance
    """
    return GridStrategy(
        enabled=config.get("enabled", True),
        sizes=config.get("sizes", [3, 4]),
        include_original=config.get("include_original", True),
        overlap=config.get("overlap", 0.0),
        min_tile_size=config.get("min_tile_size", 64),
    )


def cleanup_output_directory(directory: str = "output"):
    """Remove output directory and its contents."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
