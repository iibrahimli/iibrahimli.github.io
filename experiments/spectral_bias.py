"""A dependency-free replication of spectral bias in a tiny tanh MLP.

Run:
    python3 experiments/spectral_bias.py

The target is y(x) = sin(x) + 0.3 sin(8x). The script reports how quickly the
network recovers each Fourier coefficient. It intentionally uses only Python's
standard library so the example is easy to rerun.
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path


SEED = 7
POINTS = 128
HIDDEN = 48
STEPS = 4_000
LEARNING_RATE = 0.01
CHECKPOINTS = {0, 50, 100, 250, 500, 1_000, 2_000, 4_000}


def main() -> None:
    random.seed(SEED)
    xs = [-math.pi + 2 * math.pi * i / POINTS for i in range(POINTS)]
    ys = [math.sin(x) + 0.3 * math.sin(8 * x) for x in xs]

    w1 = [random.gauss(0.0, 0.35) for _ in range(HIDDEN)]
    b1 = [0.0 for _ in range(HIDDEN)]
    w2 = [random.gauss(0.0, 0.15) for _ in range(HIDDEN)]
    b2 = 0.0

    names = ["w1", "b1", "w2", "b2"]
    params = {"w1": w1, "b1": b1, "w2": w2, "b2": [b2]}
    first_moment = {name: [0.0] * len(params[name]) for name in names}
    second_moment = {name: [0.0] * len(params[name]) for name in names}
    beta1, beta2, epsilon = 0.9, 0.999, 1e-8

    history = []
    for step in range(STEPS + 1):
        predictions = []
        activations = []
        for x in xs:
            hidden = [math.tanh(w1[j] * x + b1[j]) for j in range(HIDDEN)]
            predictions.append(sum(w2[j] * hidden[j] for j in range(HIDDEN)) + params["b2"][0])
            activations.append(hidden)

        if step in CHECKPOINTS:
            history.append(measure(step, xs, ys, predictions))
        if step == STEPS:
            break

        grad_w1 = [0.0] * HIDDEN
        grad_b1 = [0.0] * HIDDEN
        grad_w2 = [0.0] * HIDDEN
        grad_b2 = 0.0

        for i, x in enumerate(xs):
            error_grad = 2.0 * (predictions[i] - ys[i]) / POINTS
            grad_b2 += error_grad
            for j in range(HIDDEN):
                hidden = activations[i][j]
                grad_w2[j] += error_grad * hidden
                hidden_grad = error_grad * w2[j] * (1.0 - hidden * hidden)
                grad_w1[j] += hidden_grad * x
                grad_b1[j] += hidden_grad

        grads = {"w1": grad_w1, "b1": grad_b1, "w2": grad_w2, "b2": [grad_b2]}
        for name in names:
            for j, gradient in enumerate(grads[name]):
                first_moment[name][j] = beta1 * first_moment[name][j] + (1 - beta1) * gradient
                second_moment[name][j] = beta2 * second_moment[name][j] + (1 - beta2) * gradient * gradient
                corrected_m = first_moment[name][j] / (1 - beta1 ** (step + 1))
                corrected_v = second_moment[name][j] / (1 - beta2 ** (step + 1))
                params[name][j] -= LEARNING_RATE * corrected_m / (math.sqrt(corrected_v) + epsilon)

    result = {
        "config": {
            "seed": SEED,
            "points": POINTS,
            "hidden_units": HIDDEN,
            "steps": STEPS,
            "learning_rate": LEARNING_RATE,
            "target": "sin(x) + 0.3 sin(8x)",
        },
        "history": history,
    }
    output = Path(__file__).with_name("spectral_bias_results.json")
    output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


def measure(step: int, xs: list[float], ys: list[float], predictions: list[float]) -> dict[str, float]:
    mse = sum((prediction - target) ** 2 for prediction, target in zip(predictions, ys)) / len(xs)
    coefficients = {}
    for frequency in (1, 8):
        basis = [math.sin(frequency * x) for x in xs]
        numerator = sum(prediction * value for prediction, value in zip(predictions, basis))
        denominator = sum(value * value for value in basis)
        coefficients[frequency] = numerator / denominator
    return {
        "step": step,
        "mse": round(mse, 8),
        "low_frequency_coefficient": round(coefficients[1], 6),
        "high_frequency_coefficient": round(coefficients[8], 6),
        "low_frequency_recovery_pct": round(100 * coefficients[1], 2),
        "high_frequency_recovery_pct": round(100 * coefficients[8] / 0.3, 2),
    }


if __name__ == "__main__":
    main()
