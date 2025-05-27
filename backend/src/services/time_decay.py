from src.constants import POPULARITY_WEIGHTS
import numpy as np
from datetime import datetime, timezone
from src.database.mongo import hooks_collection
from src import logger
from dateutil.parser import parse as parse_date
import re

def decayed_score(hook):
    try:
        now = datetime.now(timezone.utc)
        created_str = hook["metadata"]["createdAt"]

            # Remove both if both are present
        if re.search(r'\+00:00Z$', created_str):
            created_str = created_str.replace('+00:00Z', '+00:00')
        elif created_str.endswith('Z') and '+00:00' in created_str:
            created_str = created_str.replace('Z', '')  # Remove Z only

        created = parse_date(created_str)

        age_days = max((now - created).total_seconds() / 86400, 1)

        weights = POPULARITY_WEIGHTS
        raw = sum(hook["metadata"].get(k, 0) * v for k, v in weights.items())
        decay = 1 / (1 + np.log(age_days))

        return raw * decay
    except Exception:
        logger.exception(f"Error computing decayed score for hook ID {hook.get('_id', 'unknown')}")
        return 0


async def update_popularity():
    try:
        async for hook in hooks_collection.find():
            try:
                popularity = decayed_score(hook)
                hooks_collection.update_one(
                    {'_id': hook['_id']},
                    {'$set': {'metadata.popularity': round(popularity, 3)}}
                )
            except Exception as e:
                logger.exception(f"Failed to update popularity for hook ID {hook.get('_id', 'unknown')}")
    except Exception as e:
        logger.exception("Failed to iterate through hooks collection for popularity update")
