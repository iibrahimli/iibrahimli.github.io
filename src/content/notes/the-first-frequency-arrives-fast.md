---
title: "The first frequency arrives fast"
description: "A 48-unit MLP learns 95% of a low-frequency signal in 100 steps, then spends the next 3,900 steps barely touching the high-frequency part."
published: 2026-07-23
tags:
  - Learning dynamics
  - Spectral bias
  - Reproductions
featured: true
readingMinutes: 8
figure: spectral-bias
---

Neural networks can represent very complicated functions. That fact says
nothing about **which functions gradient descent reaches first**.

I wanted the smallest experiment that makes this distinction visible. So I
trained a one-hidden-layer tanh network on a target with just two Fourier
components:

$$
y(x) = \sin(x) + 0.3\sin(8x), \qquad x \in [-\pi, \pi].
$$

The network has 48 hidden units, 128 evenly spaced training points, and no
special frequency features. It is trained for 4,000 full-batch Adam steps. The
entire experiment uses Python's standard library and takes about ten seconds on
my laptop.

## The finding

At step 100, the coefficient on $\sin(x)$ has reached **0.954**—95% of its
target value. The coefficient on $\sin(8x)$ is still slightly negative. At step
4,000, the first coefficient is effectively solved at **0.990**, while the
eighth-frequency coefficient has recovered only **6.1%** of its target.

| Step | MSE | Low-frequency recovery | High-frequency recovery |
| ---: | ---: | ---: | ---: |
| 0 | 0.6466 | -9.6% | 5.8% |
| 50 | 0.0962 | 79.5% | -11.7% |
| 100 | 0.0601 | 95.4% | -5.3% |
| 500 | 0.0448 | 99.1% | 1.1% |
| 1,000 | 0.0434 | 99.9% | 3.3% |
| 4,000 | 0.0420 | 99.0% | 6.1% |

This is a particularly stark instance of **spectral bias**: under ordinary
parameterization and optimization, the network fits the smooth part of the
target first. Rahaman et al. documented this preference across architectures
and datasets in [*On the Spectral Bias of Neural
Networks*](https://proceedings.mlr.press/v97/rahaman19a.html). This note is a
minimal replication, not a new scientific claim.

## What the loss hides

The scalar loss falls quickly from 0.647 to 0.060 in the first 100 steps. If I
watched only that curve, I might describe training as nearly finished. But the
remaining error is structured: almost all of it sits in the high-frequency
component.

That distinction matters whenever the small-scale structure is the thing we
care about—fine image detail, sharp decision boundaries, fast physical modes,
or rare local behavior. A respectable average error can coexist with a
systematic failure at a particular scale.

The useful measurement is not only

$$
\mathcal{L}(\theta)=\frac{1}{n}\sum_i(f_\theta(x_i)-y_i)^2,
$$

but also the projection of the learned function onto each basis component:

$$
\hat{a}_k =
\frac{\sum_i f_\theta(x_i)\sin(kx_i)}
{\sum_i \sin^2(kx_i)}.
$$

For this target, $\hat{a}_1$ should approach $1$ and $\hat{a}_8$ should approach
$0.3$. Tracking those two numbers turns an ambiguous loss curve into a concrete
account of what the network has learned.

## The complete experiment

The runnable source lives in
[`experiments/spectral_bias.py`](https://github.com/iibrahimli/iibrahimli.github.io/blob/main/experiments/spectral_bias.py).
There are no third-party dependencies.

```python
xs = [-pi + 2 * pi * i / 128 for i in range(128)]
ys = [sin(x) + 0.3 * sin(8 * x) for x in xs]

# One hidden layer: 48 tanh units, scalar output.
hidden = [tanh(w1[j] * x + b1[j]) for j in range(48)]
prediction = sum(w2[j] * hidden[j] for j in range(48)) + b2
```

Run it with:

```bash
python3 experiments/spectral_bias.py
```

It writes the exact checkpoints used here to
`experiments/spectral_bias_results.json`. The seed, optimizer, number of points,
width, and learning rate are recorded alongside the results.

## Interpretation, with limits

The narrow conclusion is strong: **in this setup, optimization reaches the
low-frequency solution long before the high-frequency one**.

The broad conclusion needs care. This is one activation function, one width,
one initialization scale, and one optimizer. The data are noise-free and
one-dimensional. Changing the input representation can radically change the
learning dynamics. Tancik et al. showed that a Fourier feature mapping lets
MLPs learn high-frequency functions much more effectively in [*Fourier
Features Let Networks Learn High Frequency Functions in Low Dimensional
Domains*](https://proceedings.neurips.cc/paper/2020/hash/55053683268957697aa39fba6f231c68-Abstract.html).

So I would not summarize this as “neural networks cannot learn high
frequencies.” A better summary is:

> Representation and optimization impose an order on what is learned. Capacity
> alone does not tell us that order.

## What I would test next

Three follow-ups would separate plausible explanations:

1. Replace tanh with ReLU and sinusoidal activations while holding the parameter
   count fixed.
2. Add Fourier features at frequencies 1 through 8, then measure whether the
   ordering disappears or merely weakens.
3. Sweep width and initialization scale across several seeds, reporting the
   distribution of time-to-90%-recovery for each coefficient.

The third test is the important one. A single beautiful curve is an
observation; a distribution across controlled changes starts to become an
explanation.
