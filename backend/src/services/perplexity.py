from langchain_core.prompts import ChatPromptTemplate
from langchain_perplexity import ChatPerplexity
from langchain_core.output_parsers import JsonOutputParser
from pathlib import Path
from pydantic import create_model, BaseModel
from src.constants import MODEL_NAME, TEMPERATURE
from src.utils.common import load_json
from src.utils.model import extract_valid_json
from src import logger
from dotenv import load_dotenv
load_dotenv()

class PPLX:
    def __init__(self, model_name=MODEL_NAME, temperature:int=TEMPERATURE):
        self.chat = ChatPerplexity(
            temperature=temperature,
            model=model_name
        )

    def set_template(self, system_msg:str):
        self.template = ChatPromptTemplate.from_messages([
            ('system', system_msg),
            ('human', '{input}')
        ])
        
    def get_prompt(self, input:str, schema:dict):
        if self.chat.model == 'sonar-pro':
            model = self.chat.with_structured_output(schema=schema)
            prompt = self.template.invoke({
            "input": input,
            "format_instructions": None
            })  
            response = model.invoke(prompt)
            print("\n\n",response,"\n\n")
            return response

        sonar_pro_chat = ChatPerplexity(
            temperature=0,
            model="sonar-pro"
        ).with_structured_output(schema=schema)
        prompt = self.template.invoke({
        "input": input
        })
        response = self.chat.invoke(prompt)
        print("\n\n",response,"\n\n")
        prompt_for_sonar = extract_valid_json(response.content)
        result = sonar_pro_chat.invoke(prompt_for_sonar)
        return result


if __name__ == "__main__":    
    # chat = ChatPerplexity(
    #     temperature=0, model="sonar-reasoning"
    # )
    
    # print(chat.model)

    # template = ChatPromptTemplate.from_messages([
    #     ('system', 'you are a helpful assistant'),
    #     ('human', '{input}\n{format_instructions}')
    # ])

    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    SCHEMA_DIR = BASE_DIR / "schema"
    test_schema_filepath = SCHEMA_DIR / "test.json"
    # test_schema = load_json(test_schema_filepath, get_dict=True)
    
    # TestModel = create_model("TestModel", **{
    #     key: (type(value), ...) for key, value in test_schema.items()
    # })
    # parser = JsonOutputParser(pydantic_object=TestModel)

    # prompt = template.invoke({
    #     "input": "Give me a fun one-line analogy about Impressionism like a meme for teens.",
    #     "format_instructions": parser.get_format_instructions()
    #     })
    
    # response = chat.invoke(prompt)
    # print(response)
    # print("\n\n", response, "\n\n")
    # parsed_dict = extract_valid_json(response.content)

    # print("\n\nParsed model output:\n", parsed_dict, "\n\n")

    pplx = PPLX(model_name="sonar-reasoning")
    pplx.set_template(system_msg="you are the hook generator")
    response = pplx.get_prompt(schema=load_json(test_schema_filepath), input="Give me a fun one-line analogy about Impressionism like a meme for teens.")
    print("\n\n", response, "\n\n")

