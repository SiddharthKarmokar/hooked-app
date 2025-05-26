from pydantic import BaseModel, Field
from typing import List

class MCQ(BaseModel):
    question: str = Field(..., description="The question to be asked")
    options: List[str] = Field(..., min_items=4, max_items=4, description="List of 4 options for the question")
    answer: str = Field(..., description="The correct answer to the question")

class QuizResponse(BaseModel):
    quiz: List[MCQ] = Field(..., min_items=1, description="List of multiple choice questions based on the hook")
