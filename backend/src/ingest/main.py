import argparse
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from .mapper_loader import load_from_mapper
from .mapper_generator import generate_mapper
from .entity_index import EntityIndex
from .page_writer import write_page
from .reverse_index import update_reverse_index
from .communication_processor import process_communication, CommCheckpoint
from src.query.search import PageIndex


def run(dataset_path: str, output_dir: str | None = None, max_workers: int = 500, mapper_path: str | None = None, just_vectors: bool = False):
    dataset_id = Path(dataset_path).name
    if output_dir is None:
        output_dir = f"output/{dataset_id}"
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)

    if just_vectors:
        print(f"Building search index for {output}...")
        start = time.time()
        PageIndex(output)
        print(f"  Done. ({time.time() - start:.1f}s)")
        return

    if mapper_path is None:
        print(f"No mapper provided — generating one from {dataset_path}...")
        mapper_path = generate_mapper(dataset_path)

    print(f"Ingesting {dataset_id} via {mapper_path} → {output}")
    start = time.time()
    entities, comms = load_from_mapper(mapper_path, dataset_path)
    print(f"  {len(entities)} entities, {len(comms)} communications ({time.time() - start:.1f}s)")

    print("Building entity index...")
    entity_index = EntityIndex.from_records(entities)

    # Phase 1a: write all entity pages (skips existing)
    print(f"Phase 1a: writing entity pages ({max_workers} workers)...")
    start = time.time()
    done = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(write_page, e, entity_index, output): e for e in entities}
        for f in as_completed(futures):
            try:
                f.result()
                done += 1
            except Exception as e:
                failed += 1
                entity = futures[f]
                print(f"  FAILED {entity.entity_type}/{entity.id}: {e}")
            total = done + failed
            if total % 100 == 0:
                print(f"  {total}/{len(entities)} ({time.time() - start:.1f}s)")
    print(f"  Done. {done} written, {failed} failed. ({time.time() - start:.1f}s)")

    # Write communication pages (raw content, no LLM — for keyword search only)
    print("Writing communication pages...")
    start = time.time()
    comm_written = 0
    seen_comm_ids = set()
    for comm in comms:
        if not comm.comm_id:
            continue
        if comm.comm_id in seen_comm_ids:
            # group by thread/conversation — append to existing page
            page_path = output / comm.comm_type / comm.comm_id / "page.md"
            if page_path.exists():
                with open(page_path, "a") as f:
                    f.write(f"\n---\n\n{_format_comm_page(comm)}\n")
            continue
        seen_comm_ids.add(comm.comm_id)
        page_path = output / comm.comm_type / comm.comm_id / "page.md"
        if page_path.exists():
            continue
        page_path.parent.mkdir(parents=True, exist_ok=True)
        page_path.write_text(f"---\ntype: {comm.comm_type}\nid: {comm.comm_id}\ndate: {comm.date}\n---\n\n{_format_comm_page(comm)}\n")
        comm_written += 1
    print(f"  {comm_written} communication pages written ({time.time() - start:.1f}s)")

    # Build reverse index (query-time resource, not baked into pages)
    print("Building reverse index...")
    start = time.time()
    pages = list(output.rglob("page.md"))
    for page_path in pages:
        update_reverse_index(page_path, output)
    indexes = list(output.rglob("_index.md"))
    print(f"  {len(indexes)} _index.md files ({time.time() - start:.1f}s)")

    # Phase 2: process all communications
    checkpoint = CommCheckpoint(output)
    remaining = [c for c in comms if not checkpoint.is_done(c)]
    print(f"Phase 2: processing {len(remaining)} communications ({len(comms) - len(remaining)} already checkpointed, {max_workers} workers)...")
    start = time.time()
    done = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(process_communication, c, entity_index, output, checkpoint): c for c in remaining}
        for f in as_completed(futures):
            try:
                f.result()
                done += 1
            except Exception as e:
                failed += 1
            total = done + failed
            if total % 100 == 0:
                print(f"  {total}/{len(remaining)} ({time.time() - start:.1f}s)")
    print(f"  Done. {done} processed, {failed} failed. ({time.time() - start:.1f}s)")

    # Phase 3: build search index (FTS5 + vector embeddings)
    print("Phase 3: building search index...")
    start = time.time()
    PageIndex(output)
    print(f"  Done. ({time.time() - start:.1f}s)")


def _format_comm_page(comm) -> str:
    raw = comm.raw_data
    if "subject" in raw:
        return f"**Email** [{raw.get('date', '')}] {raw.get('sender_name', '?')} → {raw.get('recipient_name', '?')}\n**Subject:** {raw['subject']}\n\n{raw.get('body', '')}"
    elif "text" in raw and "conversation_id" in raw:
        return f"**Conversation** [{raw.get('date', '')}]\n\n{raw['text']}"
    elif "text" in raw and "chat_id" in raw:
        return f"**Support Chat** [{raw.get('interaction_date', '')}] about {raw.get('product_name', '?')}\n\n{raw['text']}"
    return str(raw)


def cli():
    parser = argparse.ArgumentParser(prog="organon-ingest")
    parser.add_argument("dataset_path", help="Path to dataset (e.g. EnterpriseBench/)")
    parser.add_argument("--output", default=None, help="Output directory (default: output/{dataset_id}/)")
    parser.add_argument("--workers", type=int, default=500, help="Parallel workers")
    parser.add_argument("--mapper", default=None, help="Path to mapper YAML (auto-generated from data if omitted)")
    parser.add_argument("--just-vectors", action="store_true", help="Only build/rebuild the search index")
    parser.add_argument("--local-qwen", action="store_true", help="Use local Qwen via LM Studio instead of Gemini")
    args = parser.parse_args()
    if args.local_qwen:
        from v1 import llm
        llm.use_local("qwen3.6-35b-a3b")
        print("Using local Qwen (qwen3.6-35b-a3b) via LM Studio")
    run(args.dataset_path, args.output, args.workers, args.mapper, args.just_vectors)


if __name__ == "__main__":
    cli()
