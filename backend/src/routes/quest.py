from fastapi import APIRouter, HTTPException, status
from src.database.mongo import hooks_collection, log_collection
from src.schemas.quiz_schemas import QuizResponse
from src.services.game import generate_quiz, update_xp
import random
import asyncio
from bson import ObjectId
from src import logger

router = APIRouter()

@router.post('/quiz/{profile_id}', response_model=QuizResponse)
async def quiz(profile_id: str, N: int = 1):
    try:
        user_log = await log_collection.find_one({"user_id": profile_id})
        if not user_log or "interactions" not in user_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not exist or User log or interactions was not created"
            )

        interactions = user_log["interactions"]
        if not interactions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hook interactions found for the user"
            )

        user_hooks = []
        for hook in interactions:
            hook_doc = await hooks_collection.find_one({"_id": ObjectId(hook['hook_id'])})
            if hook_doc:
                user_hooks.append(hook_doc)

        if not user_hooks:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No valid hook documents found"
            )

        number_quiz = min(N, len(user_hooks))
        if number_quiz == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User has not viewed any hook yet"
            )

        nums = list(range(len(user_hooks)))
        quiz = []
        for _ in range(number_quiz):
            idx = random.choice(nums)
            nums.remove(idx)
            quiz_data = generate_quiz(user_hooks[idx])
            if quiz_data and isinstance(quiz_data, list):
                quiz.extend(quiz_data)
        return {"quiz": quiz}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in quiz generation: {str(e)}"
        )


@router.post('/xp/{profile_id}')
async def xp(profile_id: str, xp: int):
    try:
        result = await update_xp(user_id=profile_id, xp=xp)
        return {"message": "XP updated successfully", "result": str(result)}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in XP update: {str(e)}"
        )


# Optional for testing
async def main():
    result = await quiz('68308a6a3a9384931b941b7b', 2)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
