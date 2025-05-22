from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from src import logger
import base64
from src.constants import IMAGE_MODEL_NAME
load_dotenv()


class GEMINI:
    def __init__(self, model_name=IMAGE_MODEL_NAME):
        self.chat = ChatGoogleGenerativeAI(
            model=model_name
        )

    def get_image(self, input: str):
        try:
            response = self.chat.invoke(
                [input],
                generation_config=dict(response_modalities=["IMAGE", "TEXT"])
            )
            
            image_base64 = self._extract_image_base64(response)
            if not image_base64:
                logger.error("No image found in the response for prompt: %s", input)
                raise ValueError("Image generation failed: no image data found in the response.")

            # image_bytes = base64.b64decode(image_base64)
            return image_base64

        except Exception as e:
            logger.exception("Exception occurred during image generation: %s", e)
            raise RuntimeError(f"Failed to generate image for prompt: {input}") from e

    def _extract_image_base64(self, response):
        try:
            image_block = next(
                block
                for block in response.content
                if isinstance(block, dict) and block.get("image_url")
            )
            image_url = image_block["image_url"].get("url")
            if not image_url:
                logger.warning("Image URL missing in the image block.")
                return None

            base64_data = image_url.split(",")[-1]
            return base64_data

        except (StopIteration, AttributeError, KeyError) as e:
            logger.warning("Failed to extract image base64 data: %s", e)
            return None


if __name__ == "__main__":
    gemi = GEMINI()
    prompt_text = "A cartoon image of tom and jerry"
    try:
        image_bytes = gemi.get_image(input=prompt_text)
        print(f"Successfully generated image of size: {len(image_bytes)} bytes")
    except RuntimeError as err:
        print(f"Image generation failed: {err}")
