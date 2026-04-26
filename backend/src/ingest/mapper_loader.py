import json
import re
from pathlib import Path

import yaml

from .models import EntityRecord, CommunicationRecord, ENTITY_TYPES


def _slug(name: str) -> str:
    return name.lower().replace(" ", "-").replace(",", "").replace(".", "")


def _apply_transform(value, transform: str) -> str:
    if transform == "slug":
        return _slug(str(value))
    if transform == "str":
        return str(value)
    if transform.startswith("prefix:"):
        prefix = transform[len("prefix:"):]
        return f"{prefix}{value}"
    return str(value)


def _resolve_value(spec, record: dict):
    if isinstance(spec, dict):
        if "literal" in spec:
            return spec["literal"]
        field = spec.get("field")
        value = record.get(field)
        if value is None and "fallback" in spec:
            value = record.get(spec["fallback"])
        if value is None:
            return ""
        if "transform" in spec:
            return _apply_transform(value, spec["transform"])
        return value
    return record.get(spec, "")


def _resolve_related(specs: list, record: dict) -> list[str]:
    related = []
    for spec in specs:
        if isinstance(spec, dict):
            field = spec.get("field")
            value = record.get(field)
            if value is None:
                continue
            if spec.get("type") == "list" and isinstance(value, list):
                related.extend([str(v) for v in value if v])
            elif value:
                related.append(str(value))
        elif record.get(spec):
            related.append(str(record[spec]))
    return related


def load_from_mapper(mapper_path: str, dataset_path: str | None = None) -> tuple[list[EntityRecord], list[CommunicationRecord]]:
    mapper = yaml.safe_load(Path(mapper_path).read_text())
    base = Path(dataset_path) if dataset_path else Path(mapper_path).parent / mapper.get("base_path", "")

    entities: list[EntityRecord] = []
    comms: list[CommunicationRecord] = []

    for entity_def in mapper.get("entities", []):
        source_path = base / entity_def["source"]
        if not source_path.exists():
            print(f"  SKIP: {source_path} not found")
            continue

        data = json.loads(source_path.read_text())
        entity_type = entity_def["entity_type"]
        assert entity_type in ENTITY_TYPES, f"Unknown entity type: {entity_type}"

        for record in data:
            entity_id = _resolve_value(entity_def["id"], record)
            frontmatter = {"type": entity_type}
            for key, spec in entity_def.get("frontmatter", {}).items():
                frontmatter[key] = _resolve_value(spec, record)
            related = _resolve_related(entity_def.get("related_entities", []), record)

            entities.append(EntityRecord(
                entity_type=entity_type,
                id=entity_id,
                frontmatter=frontmatter,
                raw_data=record,
                related_entities=related,
            ))

    for comm_def in mapper.get("communications", []):
        source_path = base / comm_def["source"]
        if not source_path.exists():
            print(f"  SKIP: {source_path} not found")
            continue

        data = json.loads(source_path.read_text())
        comm_type = comm_def.get("type", "unknown")
        persist = comm_def.get("persist", False)
        for record in data:
            date = _resolve_value(comm_def["date"], record)
            participants = []
            for spec in comm_def.get("participants", []):
                val = _resolve_value(spec, record)
                if val:
                    participants.append(str(val))

            comm_id = ""
            if persist and "id" in comm_def:
                comm_id = str(_resolve_value(comm_def["id"], record))

            comms.append(CommunicationRecord(
                date=str(date),
                participants=participants,
                raw_data=record,
                comm_type=comm_type,
                comm_id=comm_id,
            ))

    comms.sort(key=lambda c: c.date)
    return entities, comms
