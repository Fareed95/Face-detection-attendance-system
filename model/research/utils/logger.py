"""
Experiment Logger - Structured logging for research experiments.

Provides consistent, timestamped logging for experiment runs with
both console and file output. Captures all parameters, results,
and timing information for reproducibility.
"""

import json
import logging
import os
import sys
import time
from datetime import datetime
from typing import Any, Dict, Optional


class ExperimentLogger:
    """
    Structured logger for research experiments.

    Outputs both human-readable logs and machine-parseable JSON records
    for each experiment run.
    """

    def __init__(
        self,
        log_file: str = "research/results/experiment.log",
        level: str = "INFO",
        console_output: bool = True,
    ):
        os.makedirs(os.path.dirname(log_file) if os.path.dirname(log_file) else ".", exist_ok=True)

        self.logger = logging.getLogger("AdaptiveGrid")
        self.logger.setLevel(getattr(logging, level.upper(), logging.INFO))
        self.logger.handlers = []  # Clear existing handlers

        # File handler
        fh = logging.FileHandler(log_file, mode="a")
        fh.setLevel(logging.DEBUG)
        fh.setFormatter(
            logging.Formatter(
                "%(asctime)s | %(levelname)-8s | %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
        self.logger.addHandler(fh)

        # Console handler
        if console_output:
            ch = logging.StreamHandler(sys.stdout)
            ch.setLevel(getattr(logging, level.upper(), logging.INFO))
            ch.setFormatter(
                logging.Formatter("%(levelname)-8s | %(message)s")
            )
            self.logger.addHandler(ch)

        # JSON log for machine parsing
        self.json_log_path = log_file.replace(".log", "_records.json")
        self.records = []

    def info(self, message: str):
        self.logger.info(message)

    def debug(self, message: str):
        self.logger.debug(message)

    def warning(self, message: str):
        self.logger.warning(message)

    def error(self, message: str):
        self.logger.error(message)

    def log_experiment_start(self, experiment_id: str, config: Dict[str, Any]):
        """Log the start of an experiment with its configuration."""
        self.info(f"{'='*60}")
        self.info(f"EXPERIMENT START: {experiment_id}")
        self.info(f"{'='*60}")
        self.info(f"Config: {json.dumps(config, indent=2, default=str)}")
        self._start_time = time.time()

    def log_experiment_end(
        self,
        experiment_id: str,
        metrics: Dict[str, Any],
        config: Dict[str, Any],
    ):
        """Log the end of an experiment with its results."""
        elapsed = time.time() - getattr(self, "_start_time", time.time())
        self.info(f"EXPERIMENT END: {experiment_id}")
        self.info(f"Duration: {elapsed:.2f}s")
        self.info(f"Results: {json.dumps(metrics, indent=2, default=str)}")
        self.info(f"{'='*60}\n")

        # Save to JSON record
        record = {
            "experiment_id": experiment_id,
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": round(elapsed, 2),
            "config": config,
            "metrics": metrics,
        }
        self.records.append(record)
        self._save_json_records()

    def log_progress(self, current: int, total: int, message: str = ""):
        """Log progress of a batch operation."""
        pct = (current / total * 100) if total > 0 else 0
        self.info(f"[{current}/{total}] ({pct:.1f}%) {message}")

    def _save_json_records(self):
        """Save all experiment records to JSON file."""
        with open(self.json_log_path, "w") as f:
            json.dump(self.records, f, indent=2, default=str)
