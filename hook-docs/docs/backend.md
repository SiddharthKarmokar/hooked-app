# HookED Backend Documentation

> **Status**: Active Development
> **Stack**: FastAPI · Perplexity AI (PPLX) · MongoDB · ECS · Docker · S3

---

## Project Structure Overview

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

## AWS S3 Integration

Image uploads (e.g., for memes or generated visuals) are now handled via **AWS S3**.

### Current Behavior

* Generated images are uploaded to the `my-hooked-images` S3 bucket using `boto3`.
* Each image is stored using a UUID-based key.

### Permissions Requirement

Make sure the IAM role or user (`hooked-admin`) has the following policy:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:GetObject"
  ],
  "Resource": "arn:aws:s3:::my-hooked-images/*"
}
```

> **Troubleshooting**:
> If you see `AccessDenied` for `s3:PutObject`, ensure:
>
> * The IAM user/role is correctly attached to your ECS task or Lambda.
> * The policy above is included.
> * The S3 bucket does **not** have a restrictive bucket policy that overrides it.

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

> **Note**: This prevents runtime crashes due to markdown artifacts from LLM output.

---

## Configuration

Ensure the following are defined in `.env`:

```env
MODEL_NAME=sonar-reasoning
TEMPERATURE=0.7
S3_BUCKET_NAME=my-hooked-images
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
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

* ✅ Uses Perplexity's `ChatPerplexity` for LLM integration
* ✅ Graceful fallback and post-processing with `</think>`-based JSON recovery
* ✅ Flexible support for multiple model types (`sonar-*`, `deep-research`)
* ✅ Fully Dockerized and ECS-ready deployment
* ✅ 🆕 Integrated S3 upload support for image assets with IAM policy checks

> 🧠 *Think first. Then query smart.*
> — **HOOKED Backend Philosophy**
