from langchain_core.prompts import ChatPromptTemplate
from langchain_perplexity import ChatPerplexity
from langchain.output_parsers import PydanticOutputParser
from pathlib import Path
from pydantic import create_model
from src.utils.common import load_json
from src import logger
import re
from dotenv import load_dotenv
load_dotenv()

def strip_think_tags(text: str) -> str:
    """removes <think>...</think> part in the response from sonar reasoning models
    """
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

chat = ChatPerplexity(
    temperature=0, model="sonar-reasoning"
)

if __name__ == "__main__":
    template = ChatPromptTemplate.from_messages([
        ('system', 'you are a helpful assistant'),
        ('human', '{input}')
    ])

    BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
    SCHEMA_DIR = BASE_DIR / "schema"
    test_schema_filepath = SCHEMA_DIR / "test.json"
    test_schema = load_json(test_schema_filepath, get_dict=True)
    TestModel = create_model("TestModel", **{
        key: (type(value), ...) for key, value in test_schema.items()
    })

    prompt = template.invoke({"input": "generate image for a person"})
    result = chat.with_structured_output(test_schema).invoke(prompt)
    print("\n\n",result, "\n\n")
    parser = PydanticOutputParser(pydantic_object=TestModel)
 
    cleaned_result = strip_think_tags(result.content)
    final_result = parser.parse(cleaned_result)
    print(final_result)

