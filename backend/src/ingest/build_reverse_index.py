"""Migrate flat .md files into folder structure and build reverse index from existing pages. No LLM calls."""

from pathlib import Path
from .reverse_index import update_reverse_index

OUTPUT_DIR = Path("output")


def run():
    # Step 1: migrate flat files into folders
    migrated = 0
    for type_dir in OUTPUT_DIR.iterdir():
        if not type_dir.is_dir() or type_dir.name.startswith("."):
            continue
        for f in list(type_dir.glob("*.md")):
            if f.name == "_index.md" or f.name == "page.md":
                continue
            entity_id = f.stem
            folder = type_dir / entity_id
            folder.mkdir(exist_ok=True)
            f.rename(folder / "page.md")
            migrated += 1

    print(f"Migrated {migrated} files to folder structure")

    # Step 2: build reverse index from all page.md files
    pages = list(OUTPUT_DIR.rglob("page.md"))
    print(f"Building reverse index from {len(pages)} pages...")
    for i, page_path in enumerate(pages):
        update_reverse_index(page_path, OUTPUT_DIR)
        if (i + 1) % 1000 == 0:
            print(f"  {i + 1}/{len(pages)}")

    indexes = list(OUTPUT_DIR.rglob("_index.md"))
    print(f"Done. {len(indexes)} _index.md files created.")


if __name__ == "__main__":
    run()
