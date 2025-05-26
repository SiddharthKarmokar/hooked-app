from src.services.perplexity import PPLX
from src.utils.common import load_json
from src.constants import SCHEMA_DIR
from src.config.game import QUIZ_SYSTEM_MESSAGE
from src.database.mongo import users_collection
from fastapi import HTTPException, status
from bson import ObjectId
from src import logger

def normalize_quiz(quiz_list):
    cleaned = []
    for item in quiz_list:
        question = item.get("question", "").strip()
        options = [opt.strip() for opt in item.get("options", [])]
        answer = item.get("answer", "").strip()

        if len(answer) == 1 and answer in "ABCD":
            index = "ABCD".index(answer)
            if index < len(options):
                answer = options[index] 

        if answer not in options:
            answer = None

        cleaned.append({
            "question": question,
            "options": options,
            "answer": answer,
        })
    return cleaned

def generate_quiz(hook):
    try:
        pplx = PPLX()
        quiz_schema = load_json((SCHEMA_DIR / 'quiz_response.json'))
        pplx.set_template(system_msg=QUIZ_SYSTEM_MESSAGE)
        
        input_text = f"{hook.get('headline', '')}\n{hook.get('hookText', '')}\n{hook.get('expandedContent', '')}"
        response = pplx.get_prompt(input=input_text, schema=quiz_schema)
        
        if "quiz" in response and isinstance(response["quiz"], list):
            response["quiz"] = response["quiz"][:1]  # Cause there is problem with maxItems of perplexity api
        
        return normalize_quiz(response['quiz'])

    except Exception as e:
        logger.error(f"Failed to generate quiz: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quiz generation failed: {str(e)}"
        )

async def update_xp(user_id: str, xp: int):
    try:
        result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {'$inc': {"xp": xp}}
        )
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found for XP update"
            )
        return {'status': 'ok'}

    except HTTPException:
        raise  
    except Exception as e:
        logger.error(f"Failed to update XP for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"XP update failed: {str(e)}"
        )
