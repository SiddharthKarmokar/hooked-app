from collections import defaultdict
from src.constants import INTERACTION_WEIGHTS, DECAY_LAMBDA, WEIGHTS, MMR_LAMBDA, N_VALUE, CANDIDATE_POOL_FACTOR
import math
import random
from datetime import datetime, timezone
from dateutil.parser import isoparse
from pymongo import UpdateOne
from src.utils.common import convert_objectid_to_str
from src.database.mongo import users_collection, log_collection, hooks_collection, profile_collection
from src import logger
import asyncio

now = datetime.now(timezone.utc)

def compute_interest_score(hook, interaction):
    try:
        now = datetime.now(timezone.utc)
        created_at = hook.get("metadata", {}).get("createdAt", now)
        if isinstance(created_at, str):
            try:
                created_at = isoparse(created_at)
                if created_at.tzinfo is None:
                    created_at = created_at.replace(tzinfo=timezone.utc)
            except Exception:
                created_at = now

        days_ago = (now - created_at).days if created_at else 0
        decay = math.exp(-DECAY_LAMBDA * days_ago)

        score = 0.0
        action = interaction.get("action")
        duration = interaction.get("duration", 0)

        if action in INTERACTION_WEIGHTS:
            score += INTERACTION_WEIGHTS[action]

        score += duration * INTERACTION_WEIGHTS.get("time_spent", 0)

        return score * decay
    except Exception as e:
        logger.error(f"Failed to compute interest score: {e}")
        return 0.0

def enrich_with_explicit_tags(interest_vector, explicit_tags, implicit_tags):
    try:
        boost = 5.0
        for tag in explicit_tags:
            interest_vector[tag] += boost
        for tag in implicit_tags:
            interest_vector[tag] += boost / 2
        return interest_vector
    except Exception as e:
        logger.error(f"Failed to enrich with tags: {e}")
        return interest_vector

async def update_profile():
    try:
        hooks_cursor = hooks_collection.find()
        hooks = {str(h["_id"]): h async for h in hooks_cursor}

        logs_cursor = log_collection.find()
        user_logs = defaultdict(list)
        async for log in logs_cursor:
            for interaction in log.get("interactions", []):
                user_logs[log["user_id"]].append(interaction)

        users_cursor = users_collection.find()
        users = {str(u["_id"]): u async for u in users_cursor}

        updates = []

        for user_id, interactions in user_logs.items():
            interest_vector = defaultdict(float)
            user = users.get(user_id, {})
            explicit_tags = user.get("tags", [])

            for interaction in interactions:
                try:
                    hook = hooks.get(interaction["hook_id"])
                    if not hook:
                        continue
                    score = compute_interest_score(hook, interaction)
                    for tag in hook.get("tags", []):
                        interest_vector[tag] += score
                    interest_vector = enrich_with_explicit_tags(
                        interest_vector,
                        explicit_tags,
                        interaction.get("implicit_tags", [])
                    )
                except Exception as e:
                    logger.warning(f"Skipping faulty interaction: {e}")

            updates.append(UpdateOne(
                {"user_id": user_id},
                {"$set": {
                    "user_id": user_id,
                    "interest_vector": dict(interest_vector),
                    "last_updated": now
                }},
                upsert=True
            ))

        if updates:
            await profile_collection.bulk_write(updates)
    except Exception as e:
        logger.exception(f"Failed to update profile: {e}")

def compute_reranked_score(hook, base_score, max_views=1):
    try:
        now = datetime.now(timezone.utc)
        created_at_str = hook.get("metadata", {}).get("createdAt")
        try:
            created_at = isoparse(created_at_str)
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
        except Exception:
            created_at = now

        days_old = (now - created_at).days
        recency_score = math.exp(-days_old / 7)

        views = hook.get("views", 0)
        popularity_score = views / max_views if max_views else 0

        exploration_bonus = random.uniform(0.01, 0.1)

        total_score = (
            WEIGHTS["base_score"] * base_score +
            WEIGHTS["recency"] * recency_score +
            WEIGHTS["popularity"] * popularity_score +
            WEIGHTS["exploration_bonus"] * exploration_bonus
        )

        return total_score
    except Exception as e:
        logger.error(f"Failed to compute reranked score: {e}")
        return 0.0

def jaccard_similarity(tags1, tags2):
    try:
        set1, set2 = set(tags1), set(tags2)
        if not set1 or not set2:
            return 0.0
        return len(set1 & set2) / len(set1 | set2)
    except Exception as e:
        logger.error(f"Failed to compute Jaccard similarity: {e}")
        return 0.0

def apply_mmr(scored_hooks, N, lambda_param):
    try:
        selected = []
        candidates = [hook for _, hook in scored_hooks]

        while len(selected) < N and candidates:
            best_score = float("-inf")
            best_hook = None

            for hook in candidates:
                rel_score = next(score for score, h in scored_hooks if h["_id"] == hook["_id"])
                sim_score = max(
                    jaccard_similarity(hook.get("tags", []), other.get("tags", []))
                    for other in selected
                ) if selected else 0

                mmr_score = lambda_param * rel_score - (1 - lambda_param) * sim_score

                if mmr_score > best_score:
                    best_score = mmr_score
                    best_hook = hook

            if best_hook:
                selected.append(best_hook)
                candidates = [c for c in candidates if c["_id"] != best_hook["_id"]]

        return selected
    except Exception as e:
        logger.error(f"Failed to apply MMR: {e}")
        return [hook for _, hook in scored_hooks[:N]]

async def get_candidate_hooks(user_interest_vector, N=100, lambda_param=0.7):
    try:
        K = N * CANDIDATE_POOL_FACTOR
        all_hooks_cursor = hooks_collection.find({})
        all_hooks = []
        max_views = 1

        async for hook in all_hooks_cursor:
            views = hook.get("views", 0)
            max_views = max(max_views, views)
            all_hooks.append(hook)

        scored_hooks = []
        for hook in all_hooks:
            try:
                tags = hook.get("tags", [])
                base_score = sum(user_interest_vector.get(tag, 0) for tag in tags)
                reranked_score = compute_reranked_score(hook, base_score, max_views)
                scored_hooks.append((reranked_score, hook))
            except Exception as e:
                logger.warning(f"Failed scoring a hook: {e}")

        scored_hooks.sort(reverse=True, key=lambda x: x[0])
        top_k = scored_hooks[:K]
        diversified = apply_mmr(top_k, N, lambda_param)

        return diversified
    except Exception as e:
        logger.exception(f"Failed to get candidate hooks: {e}")
        return []

async def generate_mpad_feed(user_id, N=N_VALUE):
    try:
        user_profile = await profile_collection.find_one({"user_id": user_id})
        interest_vector = user_profile.get("interest_vector", {})

        diversified = await get_candidate_hooks(
            user_interest_vector=interest_vector,
            N=N,
            lambda_param=MMR_LAMBDA
        )

        feed = [convert_objectid_to_str(hook) for hook in diversified]
        return feed
    except Exception as e:
        logger.exception(f"Failed to generate MPAD feed: {e}")
        return []

if __name__ == "__main__":
    asyncio.run(generate_mpad_feed('68308a6a3a9384931b941b7b'))
