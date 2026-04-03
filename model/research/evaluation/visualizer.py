"""
Results Visualizer - Generate comparison charts and tables for experiments.

Produces publication-quality figures for the research paper including:
- Model comparison bar charts
- Grid strategy comparison
- Confusion matrices
- ROC-style plots
"""

import os
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

try:
    import matplotlib

    matplotlib.use("Agg")  # Non-interactive backend for server
    import matplotlib.pyplot as plt

    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False


class ResultsVisualizer:
    """Generate publication-quality charts from experiment results."""

    def __init__(self, output_dir: str = "research/results/plots"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def plot_model_comparison(
        self,
        results: List[Dict[str, Any]],
        metric: str = "f1_score",
        filename: str = "model_comparison.png",
    ):
        """
        Bar chart comparing different models on a specific metric.

        Args:
            results: List of experiment result dicts with 'model_name' and metric
            metric: Which metric to plot
            filename: Output filename
        """
        if not HAS_MATPLOTLIB:
            return

        models = [r.get("model_name", "Unknown") for r in results]
        values = [r.get("metrics", {}).get(metric, 0) for r in results]

        fig, ax = plt.subplots(figsize=(10, 6))
        bars = ax.bar(models, values, color=plt.cm.Set2(np.linspace(0, 1, len(models))))

        ax.set_xlabel("Recognition Model", fontsize=12)
        ax.set_ylabel(metric.replace("_", " ").title(), fontsize=12)
        ax.set_title(
            f"Model Comparison - {metric.replace('_', ' ').title()}", fontsize=14
        )
        ax.set_ylim(0, 1.05)

        # Add value labels on bars
        for bar, val in zip(bars, values):
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.01,
                f"{val:.3f}",
                ha="center",
                va="bottom",
                fontsize=10,
            )

        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(
            os.path.join(self.output_dir, filename), dpi=300, bbox_inches="tight"
        )
        plt.close()

    def plot_grid_comparison(
        self,
        results: List[Dict[str, Any]],
        filename: str = "grid_comparison.png",
    ):
        """
        Grouped bar chart comparing grid strategies across metrics.

        Args:
            results: List of experiment results with grid_config and metrics
            filename: Output filename
        """
        if not HAS_MATPLOTLIB:
            return

        metrics_to_plot = ["precision", "recall", "f1_score"]
        grid_labels = []
        metric_values = {m: [] for m in metrics_to_plot}

        for r in results:
            grid_cfg = r.get("grid_config", {})
            if not grid_cfg.get("enabled"):
                label = "No Grid"
            else:
                sizes = grid_cfg.get("sizes", [])
                label = "+".join([f"{s}x{s}" for s in sizes])
            grid_labels.append(label)

            for m in metrics_to_plot:
                metric_values[m].append(r.get("metrics", {}).get(m, 0))

        x = np.arange(len(grid_labels))
        width = 0.25
        fig, ax = plt.subplots(figsize=(12, 6))

        for i, (metric, values) in enumerate(metric_values.items()):
            offset = (i - 1) * width
            bars = ax.bar(x + offset, values, width, label=metric.replace("_", " ").title())

        ax.set_xlabel("Grid Strategy", fontsize=12)
        ax.set_ylabel("Score", fontsize=12)
        ax.set_title("Grid Strategy Comparison", fontsize=14)
        ax.set_xticks(x)
        ax.set_xticklabels(grid_labels, rotation=45, ha="right")
        ax.legend()
        ax.set_ylim(0, 1.05)

        plt.tight_layout()
        plt.savefig(
            os.path.join(self.output_dir, filename), dpi=300, bbox_inches="tight"
        )
        plt.close()

    def plot_speed_accuracy_tradeoff(
        self,
        results: List[Dict[str, Any]],
        filename: str = "speed_accuracy_tradeoff.png",
    ):
        """
        Scatter plot showing speed vs accuracy tradeoff across models.
        """
        if not HAS_MATPLOTLIB:
            return

        models = []
        accuracies = []
        times = []

        for r in results:
            models.append(r.get("model_name", "Unknown"))
            accuracies.append(r.get("metrics", {}).get("f1_score", 0))
            timing = r.get("timing", {})
            times.append(timing.get("mean_ms", 0))

        fig, ax = plt.subplots(figsize=(10, 6))
        scatter = ax.scatter(times, accuracies, s=100, c=range(len(models)), cmap="Set2")

        for i, model in enumerate(models):
            ax.annotate(
                model,
                (times[i], accuracies[i]),
                textcoords="offset points",
                xytext=(5, 5),
                fontsize=9,
            )

        ax.set_xlabel("Average Inference Time (ms)", fontsize=12)
        ax.set_ylabel("F1 Score", fontsize=12)
        ax.set_title("Speed vs. Accuracy Trade-off", fontsize=14)

        plt.tight_layout()
        plt.savefig(
            os.path.join(self.output_dir, filename), dpi=300, bbox_inches="tight"
        )
        plt.close()

    def generate_results_table(
        self,
        results: List[Dict[str, Any]],
        filename: str = "results_table.csv",
    ) -> pd.DataFrame:
        """
        Generate a comprehensive results table as CSV.

        Args:
            results: List of experiment result dicts
            filename: Output CSV filename

        Returns:
            DataFrame with all results
        """
        rows = []
        for r in results:
            grid_cfg = r.get("grid_config", {})
            if not grid_cfg.get("enabled"):
                grid_label = "No Grid"
            else:
                sizes = grid_cfg.get("sizes", [])
                grid_label = "+".join([f"{s}x{s}" for s in sizes])

            row = {
                "Model": r.get("model_name", "Unknown"),
                "Detector": r.get("detector_backend", "Unknown"),
                "Grid Strategy": grid_label,
                "Enhancement": r.get("enhancement", "none"),
                "Precision": r.get("metrics", {}).get("precision", 0),
                "Recall": r.get("metrics", {}).get("recall", 0),
                "F1 Score": r.get("metrics", {}).get("f1_score", 0),
                "Accuracy": r.get("metrics", {}).get("accuracy", 0),
                "FAR": r.get("metrics", {}).get("far", 0),
                "FRR": r.get("metrics", {}).get("frr", 0),
                "Avg Time (ms)": r.get("timing", {}).get("mean_ms", 0),
                "TP": r.get("metrics", {}).get("true_positives", 0),
                "FP": r.get("metrics", {}).get("false_positives", 0),
                "FN": r.get("metrics", {}).get("false_negatives", 0),
            }
            rows.append(row)

        df = pd.DataFrame(rows)
        df.to_csv(os.path.join(self.output_dir, filename), index=False)
        return df

    def generate_ablation_table(
        self,
        results: List[Dict[str, Any]],
        filename: str = "ablation_table.csv",
    ) -> pd.DataFrame:
        """
        Generate ablation study table (model × grid strategy matrix).
        """
        rows = []
        for r in results:
            grid_cfg = r.get("grid_config", {})
            if not grid_cfg.get("enabled"):
                grid_label = "No Grid"
            else:
                sizes = grid_cfg.get("sizes", [])
                grid_label = "+".join([f"{s}x{s}" for s in sizes])

            rows.append(
                {
                    "Model": r.get("model_name", ""),
                    "Grid": grid_label,
                    "F1": r.get("metrics", {}).get("f1_score", 0),
                    "Precision": r.get("metrics", {}).get("precision", 0),
                    "Recall": r.get("metrics", {}).get("recall", 0),
                }
            )

        df = pd.DataFrame(rows)
        # Pivot for matrix format
        if not df.empty:
            pivot = df.pivot_table(
                index="Model", columns="Grid", values="F1", aggfunc="first"
            )
            pivot.to_csv(os.path.join(self.output_dir, filename))
            return pivot

        return df
