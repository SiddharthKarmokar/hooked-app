from langchain_core.prompts import ChatPromptTemplate
from langchain_perplexity import ChatPerplexity
from langchain.output_parsers import PydanticOutputParser
from pathlib import Path
from pydantic import BaseModel
from src.utils.common import load_json
from src import logger
import re
from dotenv import load_dotenv
load_dotenv()

def strip_think_tags(text: str) -> str:
    """removes <think>...</think> part in the response from sonar reasoning models
    
    Args:
        text(str): raw prompt from reasoning
    
    Returns:
        str
    """
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

chat = ChatPerplexity(
    temperature=0, model="sonar-pro"
)

if __name__ == "__main__":
    template = ChatPromptTemplate.from_messages([
        ('system', 'you are a helpful assistant'),
        ('human', '{input}')
    ])
    BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
    SCHEMA_DIR = BASE_DIR / "schema"
    test_schema_filepath = SCHEMA_DIR / "test.json"
    test_schema = load_json(test_schema_filepath)
    prompt = template.invoke({"input": "how are you"})
    model = chat.with_structured_output(test_schema)
    result = model.invoke(prompt)
    print(result)

