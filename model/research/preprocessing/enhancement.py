"""
Image Enhancement - Preprocessing pipeline for face recognition.

Multiple enhancement strategies that can be applied before face detection
and recognition to improve accuracy in challenging conditions (low light,
blur, low resolution).
"""

import cv2
import numpy as np
from typing import Optional


class ImageEnhancer:
    """
    Configurable image enhancement pipeline.

    Supports multiple enhancement methods that can be used individually
    or combined. Each method is designed to address specific image quality
    issues common in classroom photographs.
    """

    def __init__(self, config: Optional[dict] = None):
        config = config or {}
        self.method = config.get("enhancement", "none")
        self.max_dimension = config.get("max_dimension", 0)
        self.ensure_rgb = config.get("ensure_rgb", True)

        # Sharpen config
        sharpen_cfg = config.get("sharpen", {})
        self.sharpen_strength = sharpen_cfg.get("kernel_strength", 5.0)

        # CLAHE config
        clahe_cfg = config.get("clahe", {})
        self.clahe_clip = clahe_cfg.get("clip_limit", 2.0)
        clahe_grid = clahe_cfg.get("tile_grid_size", [8, 8])
        self.clahe_grid = tuple(clahe_grid)

        # Denoise config
        denoise_cfg = config.get("denoise", {})
        self.denoise_h = denoise_cfg.get("h", 10)
        self.denoise_template_ws = denoise_cfg.get("template_window_size", 7)
        self.denoise_search_ws = denoise_cfg.get("search_window_size", 21)

    def enhance(self, image: np.ndarray) -> np.ndarray:
        """
        Apply the configured enhancement pipeline to an image.

        Args:
            image: Input image (BGR numpy array)

        Returns:
            Enhanced image (BGR numpy array)
        """
        if image is None:
            return image

        result = image.copy()

        # Ensure RGB (3 channels)
        if self.ensure_rgb:
            if len(result.shape) == 2 or (len(result.shape) == 3 and result.shape[2] == 1):
                result = cv2.cvtColor(result, cv2.COLOR_GRAY2BGR)

        # Resize if needed
        if self.max_dimension > 0:
            result = self._resize(result)

        # Apply enhancement
        if self.method == "none":
            pass
        elif self.method == "sharpen":
            result = self._sharpen(result)
        elif self.method == "clahe":
            result = self._apply_clahe(result)
        elif self.method == "denoise":
            result = self._denoise(result)
        elif self.method == "combined":
            result = self._denoise(result)
            result = self._apply_clahe(result)
            result = self._sharpen(result)
        elif self.method == "super_resolution":
            # Basic bicubic upscale (real SR models can be added)
            result = cv2.resize(
                result, (0, 0), fx=2, fy=2, interpolation=cv2.INTER_CUBIC
            )

        return result

    def _resize(self, image: np.ndarray) -> np.ndarray:
        """Resize image so largest dimension equals max_dimension."""
        h, w = image.shape[:2]
        max_dim = max(h, w)
        if max_dim <= self.max_dimension:
            return image
        scale = self.max_dimension / max_dim
        new_w, new_h = int(w * scale), int(h * scale)
        return cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)

    def _sharpen(self, image: np.ndarray) -> np.ndarray:
        """Apply sharpening filter."""
        s = self.sharpen_strength
        kernel = np.array(
            [[0, -1, 0], [-1, s, -1], [0, -1, 0]], dtype=np.float32
        )
        return cv2.filter2D(image, -1, kernel)

    def _apply_clahe(self, image: np.ndarray) -> np.ndarray:
        """Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)."""
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        clahe = cv2.createCLAHE(
            clipLimit=self.clahe_clip, tileGridSize=self.clahe_grid
        )
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])
        return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    def _denoise(self, image: np.ndarray) -> np.ndarray:
        """Apply non-local means denoising."""
        return cv2.fastNlMeansDenoisingColored(
            image,
            None,
            self.denoise_h,
            self.denoise_h,
            self.denoise_template_ws,
            self.denoise_search_ws,
        )

    def get_info(self) -> dict:
        """Return enhancement configuration for logging."""
        return {
            "method": self.method,
            "max_dimension": self.max_dimension,
            "ensure_rgb": self.ensure_rgb,
        }
