"""
Model Factory - Unified interface for multiple face recognition models.

Supports all DeepFace-compatible models with configurable detector backends,
distance metrics, and thresholds. This abstraction enables systematic
comparison across models for the ablation study.
"""

import warnings
import numpy as np
import os
import pickle
import time
from typing import Dict, List, Optional, Tuple, Any

import cv2
import pandas as pd
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# DeepFace default thresholds per model and metric
# Source: DeepFace library documentation
MODEL_THRESHOLDS = {
    "VGG-Face": {"cosine": 0.40, "euclidean": 0.60, "euclidean_l2": 0.86},
    "Facenet": {"cosine": 0.40, "euclidean": 10.0, "euclidean_l2": 0.80},
    "Facenet512": {"cosine": 0.30, "euclidean": 23.56, "euclidean_l2": 0.68},
    "OpenFace": {"cosine": 0.10, "euclidean": 0.55, "euclidean_l2": 0.55},
    "DeepFace": {"cosine": 0.23, "euclidean": 64.0, "euclidean_l2": 0.64},
    "DeepID": {"cosine": 0.015, "euclidean": 45.0, "euclidean_l2": 0.17},
    "ArcFace": {"cosine": 0.68, "euclidean": 4.15, "euclidean_l2": 1.13},
    "Dlib": {"cosine": 0.07, "euclidean": 0.60, "euclidean_l2": 0.60},
    "SFace": {"cosine": 0.593, "euclidean": 10.73, "euclidean_l2": 1.055},
    "GhostFaceNet": {"cosine": 0.65, "euclidean": 35.71, "euclidean_l2": 1.10},
}

SUPPORTED_MODELS = list(MODEL_THRESHOLDS.keys())

SUPPORTED_DETECTORS = [
    "opencv", "ssd", "dlib", "mtcnn", "retinaface",
    "mediapipe", "yolov8", "yunet", "fastmtcnn", "centerface"
]

SUPPORTED_METRICS = ["cosine", "euclidean", "euclidean_l2"]


class FaceRecognitionModel:
    """
    Unified face recognition model wrapper.

    Provides a consistent interface for training (encoding known faces)
    and recognition (matching unknown faces) across all supported models.
    """

    def __init__(
        self,
        model_name: str = "Facenet512",
        detector_backend: str = "retinaface",
        distance_metric: str = "cosine",
        threshold: Optional[float] = None,
        enforce_detection: bool = False,
        align: bool = True,
        normalization: str = "base",
    ):
        if model_name not in SUPPORTED_MODELS:
            raise ValueError(
                f"Model '{model_name}' not supported. Choose from: {SUPPORTED_MODELS}"
            )
        if detector_backend not in SUPPORTED_DETECTORS:
            raise ValueError(
                f"Detector '{detector_backend}' not supported. Choose from: {SUPPORTED_DETECTORS}"
            )
        if distance_metric not in SUPPORTED_METRICS:
            raise ValueError(
                f"Metric '{distance_metric}' not supported. Choose from: {SUPPORTED_METRICS}"
            )

        self.model_name = model_name
        self.detector_backend = detector_backend
        self.distance_metric = distance_metric
        self.enforce_detection = enforce_detection
        self.align = align
        self.normalization = normalization

        # Use provided threshold or model default
        if threshold is not None:
            self.threshold = threshold
        else:
            self.threshold = MODEL_THRESHOLDS.get(model_name, {}).get(
                distance_metric, 0.5
            )

        self.known_encodings: Dict[str, np.ndarray] = {}
        self._model_loaded = False

    def _warm_up(self):
        """Pre-load model weights by running a dummy representation."""
        if not self._model_loaded:
            try:
                dummy = np.zeros((100, 100, 3), dtype=np.uint8)
                DeepFace.represent(
                    img_path=dummy,
                    model_name=self.model_name,
                    detector_backend="skip",
                    enforce_detection=False,
                )
                self._model_loaded = True
            except Exception:
                self._model_loaded = True  # Mark as attempted

    def get_embedding(self, image_input) -> Optional[List[Dict[str, Any]]]:
        """
        Extract face embeddings from an image.

        Args:
            image_input: File path (str) or numpy array (BGR or RGB).

        Returns:
            List of dicts with 'embedding', 'facial_area', 'face_confidence'
            or None if extraction fails.
        """
        try:
            results = DeepFace.represent(
                img_path=image_input,
                model_name=self.model_name,
                detector_backend=self.detector_backend,
                enforce_detection=self.enforce_detection,
                align=self.align,
                normalization=self.normalization,
            )
            return results
        except Exception as e:
            return None

    def train_from_csv(self, csv_path: str, encoding_file: str = "face_encodings.pkl"):
        """
        Train (encode) all known faces from a CSV dataset.

        CSV format: name, uin, parent_email, image_path1, image_path2, ...

        For each person, we average all their image embeddings to create
        a single robust representation.
        """
        self._warm_up()

        df = pd.read_csv(csv_path)
        self.known_encodings = {}
        stats = {"total_images": 0, "successful": 0, "failed": 0, "persons": 0}

        for _, row in df.iterrows():
            name = row["name"]
            image_paths = [
                str(path).strip()
                for path in row[3:]
                if isinstance(path, str) and str(path).strip()
            ]

            encodings = []
            for image_path in image_paths:
                stats["total_images"] += 1
                if os.path.exists(image_path):
                    result = self.get_embedding(image_path)
                    if result and len(result) > 0:
                        encodings.append(result[0]["embedding"])
                        stats["successful"] += 1
                    else:
                        stats["failed"] += 1
                else:
                    stats["failed"] += 1

            if encodings:
                self.known_encodings[name] = np.mean(encodings, axis=0)
                stats["persons"] += 1

        # Save encodings
        with open(encoding_file, "wb") as f:
            pickle.dump(
                {
                    "model": self.model_name,
                    "detector": self.detector_backend,
                    "metric": self.distance_metric,
                    "encodings": self.known_encodings,
                },
                f,
            )

        return stats

    def load_encodings(self, encoding_file: str = "face_encodings.pkl") -> bool:
        """Load pre-computed encodings from cache file."""
        if not os.path.exists(encoding_file):
            return False

        with open(encoding_file, "rb") as f:
            data = pickle.load(f)

        # Handle both old format (dict of name->encoding) and new format
        if isinstance(data, dict) and "encodings" in data:
            self.known_encodings = data["encodings"]
        elif isinstance(data, dict):
            self.known_encodings = data
        else:
            return False

        return True

    def compute_distance(
        self, embedding1: np.ndarray, embedding2: np.ndarray
    ) -> float:
        """Compute distance between two embeddings using configured metric."""
        if self.distance_metric == "cosine":
            return 1.0 - cosine_similarity([embedding1], [embedding2])[0][0]
        elif self.distance_metric == "euclidean":
            return float(np.linalg.norm(embedding1 - embedding2))
        elif self.distance_metric == "euclidean_l2":
            norm1 = embedding1 / np.linalg.norm(embedding1)
            norm2 = embedding2 / np.linalg.norm(embedding2)
            return float(np.linalg.norm(norm1 - norm2))
        else:
            raise ValueError(f"Unknown metric: {self.distance_metric}")

    def recognize_single(
        self, image_input
    ) -> List[Dict[str, Any]]:
        """
        Recognize all faces in a single image.

        Returns list of dicts:
            [{"name": str, "distance": float, "similarity": float,
              "confidence": float, "facial_area": dict, "time_ms": float}]
        """
        start_time = time.time()
        results = []

        face_data = self.get_embedding(image_input)
        if not face_data:
            return results

        for face in face_data:
            input_embedding = np.array(face["embedding"])
            best_match = "Unknown"
            best_distance = float("inf")

            for name, known_encoding in self.known_encodings.items():
                dist = self.compute_distance(input_embedding, known_encoding)
                if dist < best_distance:
                    best_distance = dist
                    best_match = name

            # Check threshold
            is_match = self._is_match(best_distance)

            result = {
                "name": best_match if is_match else "Unknown",
                "distance": round(best_distance, 4),
                "similarity": round(self._distance_to_similarity(best_distance), 4),
                "is_match": is_match,
                "confidence": face.get("face_confidence", 0.0),
                "facial_area": face.get("facial_area", {}),
                "time_ms": round((time.time() - start_time) * 1000, 2),
            }
            results.append(result)

        return results

    def _is_match(self, distance: float) -> bool:
        """Check if a distance value constitutes a match given the metric."""
        if self.distance_metric == "cosine":
            return distance <= (1.0 - self.threshold) if self.threshold > 0.5 else distance <= self.threshold
        else:
            return distance <= self.threshold

    def _distance_to_similarity(self, distance: float) -> float:
        """Convert distance to similarity score (0-1 range)."""
        if self.distance_metric == "cosine":
            return max(0.0, 1.0 - distance)
        elif self.distance_metric in ("euclidean", "euclidean_l2"):
            return max(0.0, 1.0 / (1.0 + distance))
        return 0.0

    def get_info(self) -> Dict[str, Any]:
        """Return model configuration info for logging."""
        return {
            "model_name": self.model_name,
            "detector_backend": self.detector_backend,
            "distance_metric": self.distance_metric,
            "threshold": self.threshold,
            "enforce_detection": self.enforce_detection,
            "align": self.align,
            "normalization": self.normalization,
            "num_known_faces": len(self.known_encodings),
        }


def create_model_from_config(config: dict) -> FaceRecognitionModel:
    """
    Factory function: create a FaceRecognitionModel from a config dictionary.

    Args:
        config: Dictionary with model configuration (from config.yaml 'model' section)

    Returns:
        Configured FaceRecognitionModel instance
    """
    return FaceRecognitionModel(
        model_name=config.get("recognition_model", "Facenet512"),
        detector_backend=config.get("detector_backend", "retinaface"),
        distance_metric=config.get("distance_metric", "cosine"),
        threshold=config.get("threshold"),
        enforce_detection=config.get("enforce_detection", False),
        align=config.get("align", True),
        normalization=config.get("normalization", "base"),
    )
