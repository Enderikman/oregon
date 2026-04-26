import json
from pathlib import Path

import yaml

from v1 import llm

ONTOLOGY_PATH = Path(__file__).parent / "ontology.yaml"
EXAMPLE_MAPPER_PATH = Path(__file__).parent / "mappers" / "enterprisebench.yaml"


def _sample_records(file_path: Path, n: int = 2) -> list[dict]:
    data = json.loads(file_path.read_text())
    if not isinstance(data, list):
        return []
    return data[:n]


def _scan_dataset(dataset_path: Path) -> dict[str, list[dict]]:
    samples = {}
    for f in sorted(dataset_path.rglob("*.json")):
        rel = str(f.relative_to(dataset_path))
        records = _sample_records(f)
        if records:
            samples[rel] = records
    return samples


SYSTEM_PROMPT = """\
You are a data engineer. Given a dataset's file structure with sample records, \
an ontology of entity and communication types, and an example mapper YAML, \
generate a mapper YAML that maps the dataset to the ontology.

Rules:
- Only use entity_type values defined in the ontology.
- Only use communication types defined in the ontology.
- Every entity needs: source, entity_type, id, frontmatter, related_entities.
- Every communication needs: source, type, date, participants. Add persist: true and id if the data has a conversation/thread id.
- id and frontmatter values use {field: <key>} syntax to reference record fields. Use {literal: <value>} for constants.
- Available transforms: slug, str, prefix:<value>.
- related_entities items use {field: <key>} or {field: <key>, type: list} for array fields.
- If a JSON file doesn't clearly map to any ontology type, skip it.
- Output ONLY the YAML, no explanation."""


def generate_mapper(dataset_path: str, output_path: str | None = None) -> str:
    dataset = Path(dataset_path)
    samples = _scan_dataset(dataset)
    if not samples:
        raise ValueError(f"No JSON files found in {dataset_path}")

    ontology = ONTOLOGY_PATH.read_text()
    example = EXAMPLE_MAPPER_PATH.read_text()

    files_description = ""
    for rel_path, records in samples.items():
        files_description += f"\n### {rel_path}\nSample records:\n```json\n{json.dumps(records, indent=2, default=str)[:2000]}\n```\n"

    user_prompt = f"""\
# Ontology
```yaml
{ontology}
```

# Example mapper (for a different dataset — use as format reference only)
```yaml
{example}
```

# Dataset: {dataset.name}
Files and sample records:
{files_description}

Generate the mapper YAML for this dataset. Set base_path to "{dataset.name}/"."""

    result = llm.generate(SYSTEM_PROMPT, user_prompt, model="gemini-2.5-flash")
    yaml_text = result.strip()
    if yaml_text.startswith("```"):
        yaml_text = yaml_text.split("\n", 1)[1]
        yaml_text = yaml_text.rsplit("```", 1)[0]

    yaml.safe_load(yaml_text)

    if output_path is None:
        output_path = str(Path(__file__).parent / "mappers" / f"{dataset.name.lower()}.yaml")
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(yaml_text)
    print(f"Mapper written to {output_path}")
    return output_path
