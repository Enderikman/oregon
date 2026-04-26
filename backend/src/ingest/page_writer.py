import json
from pathlib import Path
from textwrap import dedent
from .models import EntityRecord
from .entity_index import EntityIndex
from .reverse_index import update_reverse_index
from v1 import llm


SYSTEM_PROMPT = dedent("""\
    You are writing a Wikipedia-style article about an entity in a company's internal knowledge graph.

    You will receive:
    1. The entity type and frontmatter fields
    2. The full raw data from the source system
    3. An entity index mapping IDs to names (for creating wiki-links)

    Write a concise, informative article in markdown. Rules:
    - Use [[Type/id|Display Name]] syntax for references to other entities in the graph. These are traversable links, not decorative.
    - Use regular markdown links for external URLs.
    - Use ## headers to organize sections where natural. Don't force sections — only create them if there's enough content.
    - Write in third person, present tense.
    - Include all notable information from the raw data. Don't drop fields — weave them into prose.
    - Don't include the frontmatter — that's handled separately.
    - Don't include a top-level heading with the entity name — that's in the frontmatter.""")


def write_page(record: EntityRecord, entity_index: EntityIndex, output_dir: Path, force: bool = False):
    page_path = output_dir / record.entity_type / record.id / "page.md"
    if page_path.exists() and not force:
        return

    frontmatter_str = _format_frontmatter(record)
    index_context = _build_index_context(record, entity_index)

    user_prompt = dedent(f"""\
        Entity type: {record.entity_type}
        Frontmatter: {json.dumps(record.frontmatter, indent=2)}

        Raw data from source system:
        {json.dumps(record.raw_data, indent=2)}

        Entity index (use these to create [[wiki-links]]):
        {index_context}

        Write the article body.""")

    body = llm.generate(SYSTEM_PROMPT, user_prompt)

    page_path.parent.mkdir(parents=True, exist_ok=True)
    page_path.write_text(f"{frontmatter_str}\n{body}\n")
    update_reverse_index(page_path, output_dir)


def _format_frontmatter(record: EntityRecord) -> str:
    lines = ["---"]
    for k, v in record.frontmatter.items():
        if isinstance(v, bool):
            lines.append(f"{k}: {str(v).lower()}")
        elif isinstance(v, str) and "[[" in v:
            lines.append(f'{k}: "{v}"')
        else:
            lines.append(f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines)


def _build_index_context(record: EntityRecord, entity_index: EntityIndex) -> str:
    lines = []
    for entity_id in record.related_entities:
        entry = entity_index.get_by_id(entity_id)
        if entry:
            lines.append(f"{entity_id} → {entry.entity_type}/{entry.id} ({entry.name})")
    if not lines:
        return "(no related entities)"
    return "\n".join(lines)
