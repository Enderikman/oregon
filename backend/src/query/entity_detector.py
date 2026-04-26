import re
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from textwrap import dedent

import yaml
from pydantic import BaseModel

from v1 import llm


class Confidence(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


@dataclass
class ResolvedEntity:
    name: str
    entity_type: str
    entity_id: str
    page_path: Path
    confidence: str

    @property
    def slug(self) -> str:
        return f"{self.entity_type}/{self.entity_id}"


def _slug(name: str) -> str:
    return name.lower().replace(" ", "-").replace(",", "").replace(".", "").replace("'", "")


class EntityDetector:
    def __init__(self, output_dir: Path, ontology_path: str = "src/v1/ingest/ontology.yaml"):
        self._output_dir = output_dir
        ontology = yaml.safe_load(Path(ontology_path).read_text())
        self._entity_types = list(ontology["entities"].keys())
        self._candidate_schema = self._build_schema()

    def _build_schema(self):
        EntityType = Enum("EntityType", {t: t for t in self._entity_types})

        class Candidate(BaseModel):
            name: str
            possible_types: list[EntityType]
            confidence: Confidence

        class CandidateList(BaseModel):
            candidates: list[Candidate]

        self._EntityType = EntityType
        return CandidateList

    def detect(self, question: str) -> tuple[list[dict], list[ResolvedEntity]]:
        candidates = self._extract_candidates(question)
        resolved = []
        # try high confidence first, then medium, then low
        for tier in ["high", "medium", "low"]:
            tier_candidates = [c for c in candidates if c["confidence"] == tier]
            for c in tier_candidates:
                entity = self._resolve(c["name"], c["possible_types"], c["confidence"])
                if entity:
                    resolved.append(entity)
            if resolved:
                break
        return candidates, resolved

    def _extract_candidates(self, question: str) -> list[dict]:
        types_str = ", ".join(self._entity_types)
        system = dedent(f"""\
            Extract entity candidates from the question. Be broad — include anything that MIGHT be an entity, not just what's certain.

            Entity types (ONLY these): {types_str}

            For each candidate:
            - List ALL plausible types, not just one. "Project Alpha" could be a Product, Knowledge, or Repository. When in doubt, include more types.
            - Assign a confidence:
              - high: explicitly named entity (e.g. "Aguirre LLC", "Ravi Anand")
              - medium: likely refers to an entity but could be generic (e.g. "Project Alpha", "Kubernetes")
              - low: might be an entity or might be a general concept (e.g. "vendor", "engineering", "M&A")

            Cast a wide net. It's better to over-extract than miss an entity.""")

        result = llm.generate_object(system, question, self._candidate_schema)
        return [
            {
                "name": c.name,
                "possible_types": [t.value for t in c.possible_types],
                "confidence": c.confidence.value,
            }
            for c in result.candidates
        ]

    def _resolve(self, name: str, possible_types: list[str], confidence: str) -> ResolvedEntity | None:
        slug = _slug(name)
        remaining = [t for t in self._entity_types if t not in possible_types]
        types_to_try = possible_types + remaining
        for entity_type in types_to_try:
            # exact slug
            page_path = self._output_dir / entity_type / slug / "page.md"
            if page_path.exists():
                return ResolvedEntity(name=name, entity_type=entity_type, entity_id=slug, page_path=page_path, confidence=confidence)
            # partial slug match
            type_dir = self._output_dir / entity_type
            if not type_dir.exists():
                continue
            for entity_dir in type_dir.iterdir():
                if slug in entity_dir.name or entity_dir.name in slug:
                    page_path = entity_dir / "page.md"
                    if page_path.exists():
                        return ResolvedEntity(name=name, entity_type=entity_type, entity_id=entity_dir.name, page_path=page_path, confidence=confidence)
            # frontmatter name/title match
            for entity_dir in type_dir.iterdir():
                page_path = entity_dir / "page.md"
                if not page_path.exists():
                    continue
                content = page_path.read_text(errors="ignore")
                name_match = re.search(r'^(?:name|title):\s*(.+)$', content, re.MULTILINE)
                if name_match and name.lower() in name_match.group(1).lower():
                    return ResolvedEntity(name=name, entity_type=entity_type, entity_id=entity_dir.name, page_path=page_path, confidence=confidence)
        return None
