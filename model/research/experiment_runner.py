"""
Experiment Runner - Main orchestrator for the AdaptiveGrid research framework.

Reads the config.yaml, runs experiments (single or ablation study),
collects metrics, and generates results tables and visualizations.

Usage:
    # Single experiment with config.yaml settings:
    python experiment_runner.py

    # Ablation study (sweep all parameter combinations):
    python experiment_runner.py --ablation

    # Custom config file:
    python experiment_runner.py --config path/to/config.yaml
"""

import argparse
import itertools
import json
import os
import sys
import time
from copy import deepcopy
from typing import Any, Dict, List, Optional

import cv2
import numpy as np
import pandas as pd
import yaml

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models.model_factory import FaceRecognitionModel, create_model_from_config
from grid.grid_strategy import GridStrategy, create_grid_from_config
from preprocessing.enhancement import ImageEnhancer
from evaluation.metrics import MetricsCalculator
from evaluation.visualizer import ResultsVisualizer
from utils.logger import ExperimentLogger


def load_config(config_path: str = "research/config.yaml") -> dict:
    """Load experiment configuration from YAML file."""
    with open(config_path, "r") as f:
        return yaml.safe_load(f)


def run_single_experiment(
    config: dict,
    logger: ExperimentLogger,
    experiment_id: str = "exp_001",
) -> Dict[str, Any]:
    """
    Run a single experiment with the given configuration.

    Pipeline:
    1. Initialize model, grid strategy, and enhancer from config
    2. Train (encode) known faces from CSV
    3. For each test image:
       a. Apply enhancement
       b. Apply grid tiling (split into tiles)
       c. Run face recognition on each tile
       d. Deduplicate results
    4. Compare against ground truth
    5. Compute and return metrics

    Args:
        config: Full configuration dictionary
        logger: Experiment logger instance
        experiment_id: Unique identifier for this experiment

    Returns:
        Dictionary with experiment results, metrics, and timing
    """
    model_cfg = config.get("model", {})
    grid_cfg = config.get("grid", {})
    preprocess_cfg = config.get("preprocessing", {})
    dataset_cfg = config.get("dataset", {})
    dedup_cfg = config.get("deduplication", {})
    eval_cfg = config.get("evaluation", {})
    output_cfg = config.get("output", {})

    # Log experiment start
    experiment_config = {
        "model": model_cfg.get("recognition_model"),
        "detector": model_cfg.get("detector_backend"),
        "metric": model_cfg.get("distance_metric"),
        "threshold": model_cfg.get("threshold"),
        "grid_enabled": grid_cfg.get("enabled"),
        "grid_sizes": grid_cfg.get("sizes"),
        "grid_overlap": grid_cfg.get("overlap"),
        "enhancement": preprocess_cfg.get("enhancement"),
    }
    logger.log_experiment_start(experiment_id, experiment_config)

    # Initialize components
    model = create_model_from_config(model_cfg)
    grid = create_grid_from_config(grid_cfg)
    enhancer = ImageEnhancer(preprocess_cfg)
    metrics_calc = MetricsCalculator(dataset_cfg.get("ground_truth"))

    # Step 1: Train / load encodings
    encoding_file = dataset_cfg.get("encoding_cache", "face_encodings.pkl")
    # Build a model-specific encoding filename
    model_encoding_file = encoding_file.replace(
        ".pkl", f"_{model_cfg.get('recognition_model', 'model')}.pkl"
    )

    train_start = time.time()
    csv_path = dataset_cfg.get("train_csv", "Data/dataset.csv")
    if os.path.exists(csv_path):
        stats = model.train_from_csv(csv_path, model_encoding_file)
        logger.info(f"Training stats: {stats}")
    elif os.path.exists(model_encoding_file):
        model.load_encodings(model_encoding_file)
        logger.info(f"Loaded cached encodings from {model_encoding_file}")
    else:
        logger.warning(f"No training data or cache found. Skipping training.")
    train_time = time.time() - train_start

    # Step 2: Process test images
    test_dir = dataset_cfg.get("test_dir", "test_folder")
    if not os.path.exists(test_dir):
        logger.warning(f"Test directory not found: {test_dir}")
        return {"error": "Test directory not found"}

    predictions = {}
    timing_records = []
    image_files = [
        f
        for f in os.listdir(test_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    confidence_filter = grid_cfg.get("confidence_filter", {})
    min_confidence = confidence_filter.get("min_confidence", 0.0) if confidence_filter.get("enabled") else 0.0

    for img_idx, img_file in enumerate(image_files):
        logger.log_progress(img_idx + 1, len(image_files), f"Processing {img_file}")
        img_path = os.path.join(test_dir, img_file)
        image = cv2.imread(img_path)
        if image is None:
            continue

        # Apply enhancement
        image = enhancer.enhance(image)

        # Apply grid tiling
        tiles = grid.process_image(image)
        logger.debug(f"  Generated {len(tiles)} tiles for {img_file}")

        # Recognize faces in each tile
        all_detections = []
        img_start = time.time()

        for tile_img, tile_meta in tiles:
            results = model.recognize_single(tile_img)

            for r in results:
                # Apply confidence filter
                if r.get("confidence", 1.0) >= min_confidence and r["is_match"]:
                    r["tile_metadata"] = tile_meta
                    all_detections.append(r)

        img_time_ms = (time.time() - img_start) * 1000
        timing_records.append(img_time_ms)

        # Deduplicate
        deduped = _deduplicate(all_detections, dedup_cfg)

        predictions[img_file] = deduped
        logger.debug(
            f"  {len(all_detections)} raw detections → {len(deduped)} after dedup"
        )

    # Step 3: Compute metrics
    metrics = metrics_calc.compute_all_metrics(predictions)
    timing_stats = MetricsCalculator.compute_timing_stats(timing_records)

    # Compile results
    result = {
        "experiment_id": experiment_id,
        "model_name": model_cfg.get("recognition_model"),
        "detector_backend": model_cfg.get("detector_backend"),
        "distance_metric": model_cfg.get("distance_metric"),
        "grid_config": {
            "enabled": grid_cfg.get("enabled"),
            "sizes": grid_cfg.get("sizes"),
            "overlap": grid_cfg.get("overlap"),
        },
        "enhancement": preprocess_cfg.get("enhancement"),
        "metrics": metrics,
        "timing": timing_stats,
        "train_time_s": round(train_time, 2),
        "num_test_images": len(image_files),
        "num_known_persons": len(model.known_encodings),
        "model_info": model.get_info(),
        "grid_info": grid.get_info(),
    }

    logger.log_experiment_end(experiment_id, metrics, experiment_config)
    return result


def _deduplicate(
    detections: List[Dict], config: dict
) -> List[Dict]:
    """
    Remove duplicate detections from overlapping tiles.

    Strategies:
    - none: Keep all detections
    - name_based: Keep one detection per unique name (highest similarity)
    - embedding_nms: Non-maximum suppression based on spatial overlap
    - voting: Keep names detected in at least min_votes tiles
    """
    strategy = config.get("strategy", "name_based")

    if strategy == "none" or not detections:
        return detections

    if strategy == "name_based":
        best_per_name = {}
        for d in detections:
            name = d.get("name", "Unknown")
            if name == "Unknown":
                continue
            if name not in best_per_name or d["similarity"] > best_per_name[name]["similarity"]:
                best_per_name[name] = d
        return list(best_per_name.values())

    if strategy == "voting":
        min_votes = config.get("min_votes", 2)
        name_counts = {}
        name_best = {}
        for d in detections:
            name = d.get("name", "Unknown")
            if name == "Unknown":
                continue
            name_counts[name] = name_counts.get(name, 0) + 1
            if name not in name_best or d["similarity"] > name_best[name]["similarity"]:
                name_best[name] = d
        return [
            name_best[name]
            for name, count in name_counts.items()
            if count >= min_votes
        ]

    # Default: name_based
    return _deduplicate(detections, {"strategy": "name_based"})


def run_ablation_study(config: dict, logger: ExperimentLogger) -> List[Dict]:
    """
    Run full ablation study by sweeping over parameter combinations.

    Creates a cartesian product of all sweep parameters and runs
    each combination as a separate experiment.
    """
    ablation_cfg = config.get("ablation", {})
    sweep = ablation_cfg.get("sweep", {})
    max_experiments = ablation_cfg.get("max_experiments", 500)

    if not sweep:
        logger.warning("No sweep parameters defined in ablation config.")
        return []

    # Build parameter combinations
    param_names = list(sweep.keys())
    param_values = list(sweep.values())
    combinations = list(itertools.product(*param_values))

    if len(combinations) > max_experiments:
        logger.warning(
            f"Too many combinations ({len(combinations)}). "
            f"Limiting to {max_experiments}."
        )
        combinations = combinations[:max_experiments]

    logger.info(f"Ablation study: {len(combinations)} experiments to run")
    all_results = []

    for i, combo in enumerate(combinations):
        # Build experiment-specific config
        exp_config = deepcopy(config)
        params = dict(zip(param_names, combo))

        # Map sweep params to config structure
        if "recognition_model" in params:
            exp_config["model"]["recognition_model"] = params["recognition_model"]
        if "detector_backend" in params:
            exp_config["model"]["detector_backend"] = params["detector_backend"]
        if "grid_enabled" in params:
            exp_config["grid"]["enabled"] = params["grid_enabled"]
        if "grid_sizes" in params:
            exp_config["grid"]["sizes"] = params["grid_sizes"]
            if not params["grid_sizes"]:
                exp_config["grid"]["enabled"] = False
        if "enhancement" in params:
            exp_config["preprocessing"]["enhancement"] = params["enhancement"]
        if "threshold" in params:
            exp_config["model"]["threshold"] = params["threshold"]

        exp_id = f"ablation_{i+1:03d}"
        logger.info(f"\n--- Ablation {i+1}/{len(combinations)} ---")
        logger.info(f"Params: {params}")

        try:
            result = run_single_experiment(exp_config, logger, exp_id)
            result["ablation_params"] = params
            all_results.append(result)
        except Exception as e:
            logger.error(f"Experiment {exp_id} failed: {e}")
            all_results.append(
                {"experiment_id": exp_id, "error": str(e), "ablation_params": params}
            )

    return all_results


def main():
    parser = argparse.ArgumentParser(description="AdaptiveGrid Research Framework")
    parser.add_argument(
        "--config",
        type=str,
        default="research/config.yaml",
        help="Path to configuration YAML file",
    )
    parser.add_argument(
        "--ablation",
        action="store_true",
        help="Run full ablation study",
    )
    args = parser.parse_args()

    # Load config
    config = load_config(args.config)

    # Setup logger
    log_cfg = config.get("logging", {})
    logger = ExperimentLogger(
        log_file=log_cfg.get("log_file", "research/results/experiment.log"),
        level=log_cfg.get("level", "INFO"),
        console_output=log_cfg.get("console_output", True),
    )

    # Setup output
    output_cfg = config.get("output", {})
    results_dir = output_cfg.get("results_dir", "research/results")
    os.makedirs(results_dir, exist_ok=True)

    if args.ablation:
        logger.info("=" * 60)
        logger.info("STARTING ABLATION STUDY")
        logger.info("=" * 60)

        results = run_ablation_study(config, logger)

        # Generate comparison visualizations
        visualizer = ResultsVisualizer(os.path.join(results_dir, "plots"))
        valid_results = [r for r in results if "error" not in r]

        if valid_results:
            visualizer.plot_model_comparison(valid_results)
            visualizer.plot_grid_comparison(valid_results)
            visualizer.plot_speed_accuracy_tradeoff(valid_results)
            df = visualizer.generate_results_table(valid_results)
            visualizer.generate_ablation_table(valid_results)
            logger.info(f"\nResults saved to {results_dir}/")
            logger.info(f"Total experiments: {len(results)}")
            logger.info(f"Successful: {len(valid_results)}")
            logger.info(f"Failed: {len(results) - len(valid_results)}")

    else:
        logger.info("=" * 60)
        logger.info("RUNNING SINGLE EXPERIMENT")
        logger.info("=" * 60)

        result = run_single_experiment(config, logger, "single_exp")

        # Save result
        result_path = os.path.join(results_dir, "single_experiment_result.json")
        with open(result_path, "w") as f:
            json.dump(result, f, indent=2, default=str)

        logger.info(f"\nResult saved to {result_path}")

        # Print summary
        metrics = result.get("metrics", {})
        logger.info("\n--- RESULTS SUMMARY ---")
        for key, value in metrics.items():
            logger.info(f"  {key}: {value}")


if __name__ == "__main__":
    main()
