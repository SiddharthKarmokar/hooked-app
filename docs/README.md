# MPAD Feed Generation Engine
This module implements **Multifactor Sequential Reranking with Perception-Aware Diversification (MPAD)** — a hybrid recommendation engine that combines **interest modeling**, **recency/popularity/exploration reranking**, and **MMR-based diversification**.

> **Note:** This implementation makes specific **simplifications and modifications** to the original approach proposed in [MPAD: Multi-factor Sequential Re-ranking with Perception-Aware Diversification](https://arxiv.org/abs/2305.12420). In particular, we **omit** the bi-sequential DPP and the perception-aware similarity kernel described in the original model, favoring a more lightweight and interpretable pipeline.

---

## Overview

The system has three major stages:

1. **User Interest Vector Construction**
2. **Hook Scoring with Popularity, Recency, and Exploration Adjustments**
3. **Diversified Feed Generation via Maximal Marginal Relevance (MMR)**

---

## Key Differences from the Original Paper

This implementation intentionally deviates from the original MPAD model for performance and simplicity:

* ❌ **Bi-Sequential Determinantal Point Process (DPP):**
  Removed in favor of a **simpler MMR-based reranking** for diversity, improving runtime efficiency and easing tuning.

* ❌ **Perception-Aware Kernel for Similarity:**
  Replaced with a **Jaccard similarity on hook tags**, allowing interpretable and tag-based diversity computation without complex embedding comparisons.

These changes maintain the core idea of balancing personalization with diversity and exploration, while enabling easier deployment and scaling.

---

## Stage 1: Interest Vector Computation

### `compute_interest_score(hook, interaction)`

#### Formula:

![score formula](/docs/images/mpad_score.svg)

- ![w_a](/docs/images/w_a.svg) : weight for action (click, like, etc.) from `INTERACTION_WEIGHTS`
- ![d](/docs/images/d.svg) : interaction duration
- ![w_d](/docs/images/w_d.svg) : weight for duration (from `INTERACTION_WEIGHTS['duration']`)
- ![lambda](/docs/images/lambda.svg) : decay rate constant (`DECAY_LAMBDA`)
- ![text{daysAgo}](/docs/images/daysAgo.svg) : days since hook creation

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

![reranking_score](/docs/images/reranking_score.svg)

Where:
- Base score = dot product of interest vector and hook tags
- Recency = ![e_daysAgo](/docs/images/e_daysAgo.svg)
- Popularity = normalized view count
- Exploration = random factor in `[0.01, 0.1]`
- Weights ![abgd](/docs/images/alpha_beta_gamma_delta.svg)  from the `WEIGHTS` dictionary

### Purpose:

Balances **personal relevance** with:
- **Recency**
- **Popularity**
- **Exploration encouragement**

---

## Stage 3: Diversification via MMR

### `apply_mmr(scored_hooks, N, lambda_param)`

#### MMR Formula:

![mmr_formula](/docs/images/mmr_formula.svg)

- ![s](/docs/images/s.svg) : already selected hooks
- Similarity = **Jaccard Similarity** on tags:

![jacard_similarity](/docs/images/jacard_similarity.svg)

### Diversification Tradeoff:

- ![lambda_1](/docs/images/lambda_1.svg) : pure relevance
- ![lambda_0](/docs/images/lambda_0.svg) : pure diversity
- ![lambda_in_01](/docs/images/lambda_in_01.svg) : hybrid

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
