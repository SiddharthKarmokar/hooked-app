from IPython.display import Image, display
from langchain_core.messages import AIMessage
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import base64
load_dotenv()
import os

# os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
# # Configure the API key
# # genai.configure(api_key=os.environ['GOOGLE_API_KEY'])


llm = ChatGoogleGenerativeAI(model="models/gemini-2.0-flash-preview-image-generation")

message = {
    "role": "user",
    "content": "Generate a photorealistic image of a cuddly dog wearing a hat.",
}

response = llm.invoke(
    [message],
    generation_config=dict(response_modalities=["TEXT", "IMAGE"]),
)   


def _get_image_base64(response: AIMessage) -> None:
    image_block = next(
        block
        for block in response.content
        if isinstance(block, dict) and block.get("image_url")
    )
    return image_block["image_url"].get("url").split(",")[-1]


image_base64 = _get_image_base64(response)
image_bytes = base64.b64decode(image_base64)
with open("cat_image.png", "wb") as f:
    f.write(image_bytes)

print("Image saved as cat_image.png")
# On Windows, you can automatically open it:
os.startfile("cat_image.png")