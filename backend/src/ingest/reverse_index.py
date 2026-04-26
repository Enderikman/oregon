import re
from pathlib import Path
from collections import defaultdict
from .models import ENTITY_TYPES


WIKILINK_PATTERN = re.compile(r'\[\[([A-Z][a-z]+)/([^|\]]+)(?:\|([^\]]+))?\]\]')


def update_reverse_index(page_path: Path, output_dir: Path):
    content = page_path.read_text()
    source_type = page_path.parent.parent.name
    source_id = page_path.parent.name
    source_link = f"[[{source_type}/{source_id}]]"

    frontmatter = _get_frontmatter(content)
    source_name = frontmatter.get("name", source_id)
    source_relationship = frontmatter.get("relationship", "")
    if source_name != source_id:
        source_link = f"[[{source_type}/{source_id}|{source_name}]]"

    label = f" ({source_relationship})" if source_relationship else ""

    for match in WIKILINK_PATTERN.finditer(content):
        target_type, target_id, _ = match.groups()
        if target_type not in ENTITY_TYPES:
            continue
        target_page = output_dir / target_type / target_id / "page.md"
        if not target_page.exists():
            continue
        index_path = output_dir / target_type / target_id / "_index.md"
        _append_to_index(index_path, source_type, source_link, label)


def _append_to_index(index_path: Path, source_type: str, source_link: str, label: str):
    index_path.parent.mkdir(parents=True, exist_ok=True)

    existing = index_path.read_text() if index_path.exists() else ""

    if source_link in existing:
        return

    groups = _parse_index(existing)
    groups.setdefault(source_type, []).append(f"- {source_link}{label}")

    lines = ["# Mentioned by\n"]
    for group_type in sorted(groups):
        lines.append(f"## {group_type}")
        lines.extend(sorted(groups[group_type]))
        lines.append("")

    index_path.write_text("\n".join(lines))


def _parse_index(content: str) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = defaultdict(list)
    current_type = None
    for line in content.splitlines():
        if line.startswith("## "):
            current_type = line[3:].strip()
        elif line.startswith("- ") and current_type:
            groups[current_type].append(line)
    return dict(groups)


def _get_frontmatter(content: str) -> dict:
    if not content.startswith("---"):
        return {}
    end = content.index("---", 3)
    fm = {}
    for line in content[3:end].strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"')
    return fm
