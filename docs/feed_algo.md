# MPAD Feed Generation Engine

This module implements **Multifactor Sequential Reranking with Perception-Aware Diversification (MPAD)** — a hybrid recommendation engine that combines **interest modeling**, **recency/popularity/exploration reranking**, and **MMR-based diversification**.

---

## Overview

The system has three major stages:

1. **User Interest Vector Construction**  
2. **Hook Scoring with Popularity, Recency, and Exploration Adjustments**  
3. **Diversified Feed Generation via Maximal Marginal Relevance (MMR)**

---

## Stage 1: Interest Vector Computation

### `compute_interest_score(hook, interaction)`

#### Formula:

\[
\text{score} = \left(w_a + d \cdot w_d\right) \cdot e^{-\lambda \cdot \text{daysAgo}}
\]

- \( w_a \): weight for action (click, like, etc.) from `INTERACTION_WEIGHTS`
- \( d \): interaction duration
- \( w_d \): weight for duration (from `INTERACTION_WEIGHTS['duration']`)
- \( \lambda \): decay rate constant (`DECAY_LAMBDA`)
- \( \text{daysAgo} \): days since hook creation

### Decay Rationale:

Older content becomes less relevant over time using an **exponential decay**.

---

### `enrich_with_explicit_tags(interest_vector, explicit_tags, implicit_tags)`

- Boosts interest in explicitly and implicitly tagged categories.
- Boost values:
  - Explicit tag: `+5.0`
  - Implicit tag: `+2.5` (half)

---

## Stage 2: Hook Scoring

### `compute_reranked_score(hook, base_score, max_views)`

#### Formula:

\[
\text{total\_score} = \alpha \cdot \text{base} + \beta \cdot \text{recency} + \gamma \cdot \text{popularity} + \delta \cdot \text{exploration}
\]

Where:
- Base score = dot product of interest vector and hook tags
- Recency = \( e^{-\frac{\text{daysOld}}{7}} \)
- Popularity = normalized view count
- Exploration = random factor in `[0.01, 0.1]`
- Weights \( \alpha, \beta, \gamma, \delta \) from the `WEIGHTS` dictionary

### Purpose:

Balances **personal relevance** with:
- **Recency**
- **Popularity**
- **Exploration encouragement**

---

## Stage 3: Diversification via MMR

### `apply_mmr(scored_hooks, N, lambda_param)`

#### MMR Formula:

\[
\text{MMR}(h) = \lambda \cdot \text{Relevance}(h) - (1 - \lambda) \cdot \max_{s \in S} \text{Similarity}(h, s)
\]

- \( S \): already selected hooks
- Similarity = **Jaccard Similarity** on tags:
  \[
  \text{sim}(A, B) = \frac{|A \cap B|}{|A \cup B|}
  \]

### Diversification Tradeoff:

- \( \lambda = 1 \): pure relevance
- \( \lambda = 0 \): pure diversity
- \( \lambda \in (0, 1) \): hybrid

---

## 🔧 Feed Generation Pipeline

### `update_profile()`

- Iterates all users and logs
- Computes updated interest vectors
- Stores them in the `profile_collection`

---

### `get_candidate_hooks(user_interest_vector, N, lambda_param)`

- Collects all hooks
- Reranks each with `compute_reranked_score`
- Sorts and selects top-K candidates (based on `CANDIDATE_POOL_FACTOR`)
- Applies MMR to get final top-N diversified results

---

### `generate_mpad_feed(user_id, N)`

- Loads user profile
- Computes feed using reranking and MMR
- Returns list of hook documents

---

## Constants

These are defined in `src.constants`:

```python
INTERACTION_WEIGHTS = {
    "clicks": 1.0,
    "likes": 2.0,
    "saves": 2.5,
    "shares": 2.5,
    "duration": 0.05,
}

DECAY_LAMBDA = 0.1

WEIGHTS = {
    "base_score": 0.5,
    "recency": 0.2,
    "popularity": 0.2,
    "exploration_bonus": 0.1,
}

MMR_LAMBDA = 0.7
N_VALUE = 2
CANDIDATE_POOL_FACTOR = 3
