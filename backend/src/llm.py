import json
import os
import re
import time
from typing import TypeVar

import httpx
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel

load_dotenv()

T = TypeVar("T", bound=BaseModel)

EMBED_MODEL = os.environ.get("EMBED_MODEL", "gemini-embedding-001")
EMBED_ENDPOINT = os.environ.get("EMBED_ENDPOINT", "")  # e.g. http://localhost:1234/v1/embeddings

_client: genai.Client | None = None
_local_model: str | None = None
_local_endpoint: str = "http://localhost:1234/v1"


def use_local(model: str, endpoint: str = "http://localhost:1234/v1"):
    global _local_model, _local_endpoint
    _local_model = model
    _local_endpoint = endpoint


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.environ["GOOGLE_API_KEY"]
        _client = genai.Client(api_key=api_key)
    return _client


def embed(texts: list[str], model: str = EMBED_MODEL, max_retries: int = 10) -> list[list[float]]:
    if EMBED_ENDPOINT:
        return _embed_local(texts, model, max_retries)
    return _embed_gemini(texts, model, max_retries)


def _embed_local(texts: list[str], model: str, max_retries: int) -> list[list[float]]:
    for attempt in range(max_retries):
        try:
            resp = httpx.post(
                EMBED_ENDPOINT,
                json={"input": texts, "model": model},
                timeout=120,
            )
            resp.raise_for_status()
            data = resp.json()
            return [item["embedding"] for item in sorted(data["data"], key=lambda x: x["index"])]
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise


def _embed_gemini(texts: list[str], model: str, max_retries: int) -> list[list[float]]:
    client = _get_client()
    for attempt in range(max_retries):
        try:
            result = client.models.embed_content(model=model, contents=texts)
            return [e.values for e in result.embeddings]
        except Exception as e:
            if attempt < max_retries - 1:
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    wait = min(15 * (attempt + 1), 60)
                else:
                    wait = 2 ** attempt
                time.sleep(wait)
            else:
                raise


def generate(system: str, user: str, model: str = "gemini-2.5-flash-lite", max_retries: int = 5) -> str:
    if _local_model:
        return _generate_local(system, user, max_retries)
    client = _get_client()
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=model,
                contents=user,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system,
                    max_output_tokens=4096,
                ),
            )
            return response.text
        except Exception as e:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                time.sleep(wait)
            else:
                raise


def generate_object(system: str, user: str, schema: type[T], model: str = "gemini-2.5-flash-lite", max_retries: int = 5) -> T:
    if _local_model:
        return _generate_object_local(system, user, schema, max_retries)
    client = _get_client()
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=model,
                contents=user,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system,
                    max_output_tokens=4096,
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
            return schema.model_validate_json(response.text)
        except Exception as e:
            if attempt < max_retries - 1:
                wait = 2 ** attempt
                time.sleep(wait)
            else:
                raise


def _generate_local(system: str, user: str, max_retries: int) -> str:
    for attempt in range(max_retries):
        try:
            resp = httpx.post(
                f"{_local_endpoint}/chat/completions",
                json={
                    "model": _local_model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": 4096,
                },
                timeout=300,
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"] or ""
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise


def _generate_object_local(system: str, user: str, schema: type[T], max_retries: int) -> T:
    schema_json = json.dumps(schema.model_json_schema(), indent=2)
    system_with_schema = f"{system}\n\nRespond with ONLY valid JSON matching this schema:\n{schema_json}"
    for attempt in range(max_retries):
        try:
            resp = httpx.post(
                f"{_local_endpoint}/chat/completions",
                json={
                    "model": _local_model,
                    "messages": [
                        {"role": "system", "content": system_with_schema},
                        {"role": "user", "content": user},
                    ],
                    "max_tokens": 4096,
                    "response_format": {"type": "json_object"},
                },
                timeout=300,
            )
            resp.raise_for_status()
            text = resp.json()["choices"][0]["message"]["content"] or ""
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                text = match.group(0)
            return schema.model_validate_json(text)
        except Exception:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise
