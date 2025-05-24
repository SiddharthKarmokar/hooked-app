from collections import defaultdict
from src.constants import INTERACTION_WEIGHTS
import math
from datetime import datetime
from pymongo import UpdateOne
from src.database.mongo import users_collection, log_collection, hooks_collection, profile_collection


def compute_interest_vector(user_interactions, all_hooks):
    interest_vector = defaultdict(float)
    now = datetime.utcnow()

    for hook_id, data in user_interactions["engagement_scores"].items():
        hook = all_hooks[hook_id]

        # Time decay factor (decaying based on days)
        days_ago = (now - hook["metadata"]["created_at"]).days
        time_decay = math.exp(-0.1 * days_ago)

        # Weighted interaction score
        score = (
            data.get("clicks", 0) * INTERACTION_WEIGHTS["clicks"]
            + data.get("saves", 0) * INTERACTION_WEIGHTS["saves"]
            + data.get("shares", 0) * INTERACTION_WEIGHTS["shares"]
            + data.get("time_spent", 0) * INTERACTION_WEIGHTS["time_spent"]
        ) * time_decay

        for tag in hook["tags"]:
            interest_vector[tag] += score

    return dict(interest_vector)

def enrich_with_explicit_tags(interest_vector, explicit_tags, implicit_tags):
    boost = 5.0
    for tag in explicit_tags:
        interest_vector[tag] += boost
    for tag in implicit_tags:
        interest_vector[tag] += boost / 2
    return interest_vector


DECAY_LAMBDA = 0.1  # Decay rate per day

async def update_profile(hook_collection, user_collection, log_collection, profile_collection):
    # Fetch all hooks and map by id
    hooks_cursor = hook_collection.find()
    hooks = {str(h["_id"]): h async for h in hooks_cursor}

    # Fetch all logs and group by user_id
    logs_cursor = log_collection.find()
    user_logs = defaultdict(list)
    async for log in logs_cursor:
        user_logs[log["user_id"]].append(log)

    # Fetch all users and map by id
    users_cursor = user_collection.find()
    users = {str(u["_id"]): u async for u in users_cursor}

    now = datetime.utcnow()
    updates = []

    for user_id, logs in user_logs.items():
        interest_vector = defaultdict(float)

        for log in logs:
            hook = hooks.get(log["hook_id"])
            if not hook:
                continue

            created_at = hook.get("metadata", {}).get("created_at")
            if created_at:
                days_ago = (now - created_at).days
            else:
                days_ago = 0
            decay = math.exp(-DECAY_LAMBDA * days_ago)

            score = (
                log.get("clicks", 0) * INTERACTION_WEIGHTS["clicks"] +
                log.get("saves", 0) * INTERACTION_WEIGHTS["saves"] +
                log.get("shares", 0) * INTERACTION_WEIGHTS["shares"] +
                log.get("time_spent", 0) * INTERACTION_WEIGHTS["time_spent"]
            ) * decay

            for tag in hook.get("tags", []):
                interest_vector[tag] += score

        # Enrich with explicit and implicit tags
        user = users.get(user_id, {})
        for tag in user.get("explicit_tags", []):
            interest_vector[tag] += 5.0
        for tag in user.get("implicit_tags", []):
            interest_vector[tag] += 2.5

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
