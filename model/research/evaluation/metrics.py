"""
Evaluation Metrics - Comprehensive metrics for face recognition evaluation.

Computes standard biometric evaluation metrics including precision, recall,
F1-score, FAR, FRR, and TAR@FAR for systematic comparison of models and
grid strategies.
"""

import json
import os
import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Set, Tuple

import numpy as np
import pandas as pd


class MetricsCalculator:
    """
    Compute recognition metrics by comparing predictions against ground truth.

    Ground truth format (JSON):
    {
        "image_name.jpg": ["person1", "person2", "person3"],
        ...
    }

    Predictions format (from experiment runner):
    {
        "image_name.jpg": [
            {"name": "person1", "similarity": 0.85, ...},
            {"name": "person2", "similarity": 0.72, ...},
        ]
    }
    """

    def __init__(self, ground_truth_path: Optional[str] = None):
        self.ground_truth: Dict[str, List[str]] = {}
        if ground_truth_path and os.path.exists(ground_truth_path):
            with open(ground_truth_path, "r") as f:
                self.ground_truth = json.load(f)

    def compute_all_metrics(
        self,
        predictions: Dict[str, List[Dict]],
        ground_truth: Optional[Dict[str, List[str]]] = None,
    ) -> Dict[str, Any]:
        """
        Compute all evaluation metrics.

        Args:
            predictions: {image_name: [{"name": str, ...}]}
            ground_truth: {image_name: [name1, name2, ...]}

        Returns:
            Dictionary with all computed metrics
        """
        gt = ground_truth or self.ground_truth
        if not gt:
            return {"error": "No ground truth available"}

        # Aggregate across all images
        all_true_positives = 0
        all_false_positives = 0
        all_false_negatives = 0
        all_true_negatives = 0

        per_person_stats = defaultdict(
            lambda: {"tp": 0, "fp": 0, "fn": 0}
        )
        all_persons: Set[str] = set()

        for image_name, expected_names in gt.items():
            expected_set = set(expected_names)
            all_persons.update(expected_set)

            # Get predicted names for this image
            preds = predictions.get(image_name, [])
            predicted_set = set()
            for p in preds:
                name = p.get("name", "Unknown")
                if name != "Unknown":
                    predicted_set.add(name)

            # Compute TP, FP, FN for this image
            tp = expected_set & predicted_set
            fp = predicted_set - expected_set
            fn = expected_set - predicted_set

            all_true_positives += len(tp)
            all_false_positives += len(fp)
            all_false_negatives += len(fn)

            # Per-person stats
            for name in tp:
                per_person_stats[name]["tp"] += 1
            for name in fp:
                per_person_stats[name]["fp"] += 1
            for name in fn:
                per_person_stats[name]["fn"] += 1

        # Compute aggregate metrics
        precision = self._safe_divide(
            all_true_positives, all_true_positives + all_false_positives
        )
        recall = self._safe_divide(
            all_true_positives, all_true_positives + all_false_negatives
        )
        f1 = self._safe_divide(2 * precision * recall, precision + recall)

        total_genuine = all_true_positives + all_false_negatives
        total_impostor = all_false_positives + all_true_negatives

        far = self._safe_divide(all_false_positives, total_impostor) if total_impostor > 0 else self._safe_divide(all_false_positives, all_false_positives + 1)
        frr = self._safe_divide(all_false_negatives, total_genuine)

        accuracy = self._safe_divide(
            all_true_positives,
            all_true_positives + all_false_positives + all_false_negatives,
        )

        # Attendance accuracy (what % of expected people were correctly marked)
        attendance_accuracy = recall  # Same as recall in this context

        metrics = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "accuracy": round(accuracy, 4),
            "far": round(far, 4),
            "frr": round(frr, 4),
            "attendance_accuracy": round(attendance_accuracy, 4),
            "true_positives": all_true_positives,
            "false_positives": all_false_positives,
            "false_negatives": all_false_negatives,
            "total_expected": all_true_positives + all_false_negatives,
            "total_predicted": all_true_positives + all_false_positives,
            "unique_persons": len(all_persons),
        }

        return metrics

    def compute_per_class_metrics(
        self,
        predictions: Dict[str, List[Dict]],
        ground_truth: Optional[Dict[str, List[str]]] = None,
    ) -> pd.DataFrame:
        """Compute per-person (per-class) precision, recall, F1."""
        gt = ground_truth or self.ground_truth
        if not gt:
            return pd.DataFrame()

        person_stats = defaultdict(lambda: {"tp": 0, "fp": 0, "fn": 0})

        for image_name, expected_names in gt.items():
            expected_set = set(expected_names)
            preds = predictions.get(image_name, [])
            predicted_set = {
                p["name"] for p in preds if p.get("name") != "Unknown"
            }

            for name in expected_set & predicted_set:
                person_stats[name]["tp"] += 1
            for name in predicted_set - expected_set:
                person_stats[name]["fp"] += 1
            for name in expected_set - predicted_set:
                person_stats[name]["fn"] += 1

        rows = []
        for name, stats in sorted(person_stats.items()):
            tp, fp, fn = stats["tp"], stats["fp"], stats["fn"]
            p = self._safe_divide(tp, tp + fp)
            r = self._safe_divide(tp, tp + fn)
            f1 = self._safe_divide(2 * p * r, p + r)
            rows.append(
                {
                    "Person": name,
                    "TP": tp,
                    "FP": fp,
                    "FN": fn,
                    "Precision": round(p, 4),
                    "Recall": round(r, 4),
                    "F1": round(f1, 4),
                }
            )

        return pd.DataFrame(rows)

    @staticmethod
    def _safe_divide(numerator: float, denominator: float) -> float:
        """Safe division that returns 0.0 when denominator is 0."""
        return numerator / denominator if denominator > 0 else 0.0

    @staticmethod
    def compute_timing_stats(times: List[float]) -> Dict[str, float]:
        """Compute timing statistics from a list of inference times (ms)."""
        if not times:
            return {"mean_ms": 0, "std_ms": 0, "min_ms": 0, "max_ms": 0}
        return {
            "mean_ms": round(float(np.mean(times)), 2),
            "std_ms": round(float(np.std(times)), 2),
            "min_ms": round(float(np.min(times)), 2),
            "max_ms": round(float(np.max(times)), 2),
        }
