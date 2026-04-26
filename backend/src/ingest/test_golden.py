import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from .mapper_loader import load_from_mapper
from .entity_index import EntityIndex
from .page_writer import write_page
from .communication_processor import process_communication


GOLDEN_IDS = {"emp_0821", "emp_0047", "emp_0592", "aguirre-llc"}
OUTPUT_DIR = Path("output_test")
MAPPER = "src/v1/ingest/mappers/enterprisebench.yaml"


def _write_one(e, entity_index):
    write_page(e, entity_index, OUTPUT_DIR)
    page = (OUTPUT_DIR / e.entity_type / f"{e.id}.md").read_text()
    return e, len(page)


def run():
    start_time = time.time()
    entities, comms = load_from_mapper(MAPPER, "EnterpriseBench")
    entity_index = EntityIndex.from_records(entities)

    golden_entities = [e for e in entities if e.id in GOLDEN_IDS]

    print(f"Found {len(golden_entities)} golden entities:")
    for e in golden_entities:
        print(f"  {e.entity_type}/{e.id} ({e.frontmatter.get('name', '?')})")

    # Phase 1: write entity pages in parallel
    print(f"\nPhase 1: writing {len(golden_entities)} pages in parallel...")
    with ThreadPoolExecutor(max_workers=len(golden_entities)) as pool:
        futures = {pool.submit(_write_one, e, entity_index): e for e in golden_entities}
        for f in as_completed(futures):
            e, chars = f.result()
            print(f"  {e.entity_type}/{e.id}: {chars} chars")

    # Phase 2: process comms that touch golden entities (sequential)
    golden_comms = [c for c in comms if any(p in GOLDEN_IDS for p in c.participants)]
    print(f"\nPhase 2: processing {len(golden_comms)} communications touching golden entities...")
    for i, comm in enumerate(golden_comms):
        process_communication(comm, entity_index, OUTPUT_DIR)
        if (i + 1) % 50 == 0:
            print(f"  {i + 1}/{len(golden_comms)}")

    print(f"\nDone! Pages in {OUTPUT_DIR}/")
    elapsed = time.time() - start_time
    print(f"Execution time: {elapsed:.2f} seconds")


if __name__ == "__main__":
    run()
