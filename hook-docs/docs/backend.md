# HookED Backend Documentation

> **Status**: Active Development
> **Stack**: FastAPI · Perplexity AI (PPLX) · MongoDB · ECS · Docker

---

##  Project Structure Overview

```
backend/
├── logs/                  # Logging output and debug information
├── schema/                # Pydantic schemas or output formats for model validation
├── src/                   # Main application source code
├── static/                # Static assets, if any (e.g., images, js files)
├── tests/                 # Unit and integration tests
├── main.py                # FastAPI entrypoint
├── Dockerfile             # Docker config for containerizing backend
├── ecs-task-def.json      # AWS ECS task definition for deployment
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── pytest.ini             # Pytest configuration
├── .gitignore             # Git exclusions
```

---

## Language Model Integration: Perplexity AI (PPLX)

This project uses **Perplexity’s conversational APIs** to power AI interactions.

### `PPLX` Interface

```python
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
            prompt = self.template.invoke({"input": input, "format_instructions": None})  
            response = model.invoke(prompt)
            print("\n\n",response,"\n\n")
            return response

        sonar_pro_chat = ChatPerplexity(
            temperature=0,
            model="sonar-pro"
        ).with_structured_output(schema=schema)
        prompt = self.template.invoke({"input": input})
        response = self.chat.invoke(prompt)
        print("\n\n",response,"\n\n")
        prompt_for_sonar = extract_valid_json(response.content)
        result = sonar_pro_chat.invoke(prompt_for_sonar)
        return result
```

---

## JSON Post-Processing Logic

To handle parsing issues with structured output from models like `sonar-reasoning`, `sonar-reasoning-pro`, and `deep-research`, the following helper is used:

### `extract_valid_json`

````python
def extract_valid_json(content: Dict[str, Any]) -> Dict[str, Any]:
    marker = "</think>"
    idx = content.rfind(marker)
    
    if idx == -1:
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError("No </think> marker found and content is not valid JSON") from e
    
    json_str = content[idx + len(marker):].strip()
    
    if json_str.startswith("```json"):
        json_str = json_str[len("```json"):].strip()
    if json_str.startswith("```"):
        json_str = json_str[3:].strip()
    if json_str.endswith("```"):
        json_str = json_str[:-3].strip()
    
    try:
        parsed_json = json.loads(json_str)
        return parsed_json
    except json.JSONDecodeError as e:
        raise ValueError("Failed to parse valid JSON from response content") from e
````

>  **Note**: This approach prevents runtime crashes caused by invalid formatting or hallucinated markdown from LLM responses.

---

##  Configuration

Ensure the following are defined in `.env`:

```env
MODEL_NAME=sonar-reasoning
TEMPERATURE=0.7
```

---

## Deployment

This backend is containerized using Docker and deployed via ECS.

### Dockerfile

```Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

### ECS Task Definition

File: `ecs-task-def.json`
Defines container image, memory, environment vars, and execution role.

---

## Testing

Run tests using:

```bash
pytest tests/
```

Or with coverage:

```bash
pytest --cov=src tests/
```

---

## Summary

* ✅ Uses Perplexity's `ChatPerplexity` for prompt completion
* ✅ Handles JSON parsing gracefully with `</think>` marker support
* ✅ Flexible model selection for `sonar-reasoning`, `sonar-pro`, and `deep-research`
* ✅ Fully Dockerized with ECS compatibility

> 🧠 *Think first. Then query smart.*
> — HOOKED Backend Philosophy

Got it! Here's your previous query, formatted in Markdown for easy reference and documentation:

---

## HookFeedResponse & QuizResponse Schema (for Sonar-Pro)

### 🔹 **HookFeedResponse JSON Schema**

```json
{
  "title": "HookFeedResponse",
  "description": "Detailed schema for a generated educational or informative feed item in 60 words or less",
  "type": "object",
  "properties": {
    "headline": {
      "type": "string",
      "description": "The main hook or title to catch the user's attention in 60 words or less"
    },
    "hookText": {
      "type": "string",
      "description": "A very short, intriguing description expanding on the headline in 60 words or less"
    },
    "analogy": {
      "type": "string",
      "description": "A simple analogy to help users understand the concept in 60 words or less"
    },
    "category": {
      "type": "string",
      "description": "The primary category or domain this content belongs to (e.g., Science, History, Art)"
    },
    "tags": {
      "type": "array",
      "description": "List of descriptive tags to help with discoverability",
      "items": {
        "type": "string",
        "enum": ["science", "memes", "art", "sports", "movies", "music", "technology", "history", "misc"]
      },
      "uniqueItems": true,
      "minItems": 1,
      "maxItems": 5
    },
    "img_desc": {
      "type": "string",
      "description": "A detailed prompt to generate a relevant image for this feed item"
    },
    "expandedContent": {
      "type": "object",
      "description": "Expanded content with structured explanation and real-world connections in 60 words or less",
      "properties": {
        "fullExplanation": {
          "type": "string",
          "description": "A detailed explanation of the concept in 60 words or less"
        },
        "mindBlowingFact": {
          "type": "string",
          "description": "A surprising or impressive fact about the topic in 60 words or less"
        },
        "realWorldConnection": {
          "type": "string",
          "description": "Explanation of how the concept connects to the real world in 60 words or less"
        }
      },
      "required": ["fullExplanation", "mindBlowingFact", "realWorldConnection"]
    },
    "citations": {
      "type": "array",
      "description": "List of source references used in the content in url",
      "items": {
        "type": "string"
      }
    },
    "relatedTopics": {
      "type": "array",
      "description": "Related or follow-up topics for further exploration in 60 words or less",
      "items": {
        "type": "string"
      }
    },
    "sourceInfo": {
      "type": "object",
      "description": "Technical metadata about the topic and generation",
      "properties": {
        "sonarTopicId": {
          "type": "string",
          "description": "Unique identifier for the source or topic (one word describing source or topic)"
        },
        "generatedAt": {
          "type": "string",
          "format": "date-time",
          "description": "Timestamp when the feed item was generated"
        }
      },
      "required": ["sonarTopicId", "generatedAt"]
    }
  },
  "required": [
    "headline",
    "hookText",
    "analogy",
    "category",
    "tags",
    "img_desc",
    "expandedContent",
    "citations",
    "relatedTopics",
    "sourceInfo",
    "metadata"
  ]
}
```

---

### 🔹 **QuizResponse JSON Schema**

```json
{
  "title": "QuizResponse",
  "description": "Schema for a quiz generated from a hook, containing multiple MCQs",
  "type": "object",
  "properties": {
    "quiz": {
      "type": "array",
      "description": "List of multiple choice questions based on the hook",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string",
            "description": "The question to be asked"
          },
          "options": {
            "type": "array",
            "description": "List of 4 options for the question",
            "items": {
              "type": "string"
            },
            "minItems": 4,
            "maxItems": 4
          },
          "answer": {
            "type": "string",
            "description": "The correct answer to the question"
          }
        },
        "required": ["question", "options", "answer"]
      },
      "minItems": 1,
      "maxItems": 1
    }
  },
  "required": ["quiz"]
}
```
