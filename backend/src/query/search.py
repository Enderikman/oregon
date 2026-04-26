import sqlite3
import struct
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path

import sqlite_vec

from src import llm


@dataclass
class SearchResult:
    slug: str
    score: float
    bm25_rank: int
    vec_rank: int
    content: str


def _serialize_vec(vec: list[float]) -> bytes:
    return struct.pack(f"{len(vec)}f", *vec)


class PageIndex:
    def __init__(self, output_dir: Path):
        self._output_dir = output_dir
        self._db_path = output_dir / ".search.db"
        self._db = self._open_db()
        if not self._is_built():
            self._build()

    def _open_db(self) -> sqlite3.Connection:
        db = sqlite3.connect(str(self._db_path))
        db.enable_load_extension(True)
        sqlite_vec.load(db)
        db.enable_load_extension(False)
        db.execute("PRAGMA journal_mode=WAL")
        return db

    def _is_built(self) -> bool:
        try:
            count = self._db.execute("SELECT COUNT(*) FROM pages").fetchone()[0]
            return count > 0
        except Exception:
            return False

    def _build(self):
        print("  Building search index...")
        db = self._db

        db.executescript("""
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY,
                slug TEXT UNIQUE,
                content TEXT
            );
            CREATE VIRTUAL TABLE IF NOT EXISTS pages_fts USING fts5(
                slug, content, content=pages, content_rowid=id
            );
            CREATE TRIGGER IF NOT EXISTS pages_ai AFTER INSERT ON pages BEGIN
                INSERT INTO pages_fts(rowid, slug, content) VALUES (new.id, new.slug, new.content);
            END;
        """)

        # collect all pages
        rows = []
        for entity_type_dir in self._output_dir.iterdir():
            if not entity_type_dir.is_dir() or entity_type_dir.name.startswith("."):
                continue
            for entity_dir in entity_type_dir.iterdir():
                page_path = entity_dir / "page.md"
                if not page_path.exists():
                    continue
                slug = f"{entity_type_dir.name}/{entity_dir.name}"
                content = page_path.read_text(errors="ignore")
                rows.append((slug, content))

        print(f"  Indexing {len(rows)} pages...")
        db.executemany("INSERT OR IGNORE INTO pages (slug, content) VALUES (?, ?)", rows)
        db.commit()

        # create vec table
        # detect embedding dimension from first batch
        backend = "local" if llm.EMBED_ENDPOINT else "gemini"
        print(f"  Embedding backend: {backend} (model={llm.EMBED_MODEL})")
        sample_vec = llm.embed(["test"])[0]
        dim = len(sample_vec)
        print(f"  Embedding dimension: {dim}")
        db.execute(f"CREATE VIRTUAL TABLE IF NOT EXISTS pages_vec USING vec0(id INTEGER PRIMARY KEY, embedding float[{dim}])")

        # embed in batches
        batch_size = 100
        all_ids = db.execute("SELECT id, slug FROM pages ORDER BY id").fetchall()
        existing_vec_ids = set(r[0] for r in db.execute("SELECT id FROM pages_vec").fetchall())
        to_embed = [(id, slug) for id, slug in all_ids if id not in existing_vec_ids]

        if to_embed:
            # preload all contents from db
            content_map = {}
            for id, slug in to_embed:
                content_map[id] = db.execute("SELECT content FROM pages WHERE id = ?", (id,)).fetchone()[0]

            # split into batches of 100 for the API, run 20 batches in parallel
            batches = []
            for i in range(0, len(to_embed), batch_size):
                batch = to_embed[i:i + batch_size]
                batch_ids = [b[0] for b in batch]
                batch_contents = [content_map[id][:2000] for id in batch_ids]
                batches.append((batch_ids, batch_contents))

            import time as _time
            _start = _time.time()
            print(f"  Computing embeddings for {len(to_embed)} pages ({len(batches)} batches, 5 parallel)...")
            done = 0

            def _embed_batch(args):
                ids, contents = args
                vecs = llm.embed(contents)
                return list(zip(ids, vecs))

            workers = 5 if llm.EMBED_ENDPOINT else 3
            with ThreadPoolExecutor(max_workers=20 if llm.EMBED_ENDPOINT else 5) as pool:
                futures = {pool.submit(_embed_batch, b): b for b in batches}
                for f in as_completed(futures):
                    results = f.result()
                    for id, vec in results:
                        db.execute("INSERT INTO pages_vec (id, embedding) VALUES (?, ?)", (id, _serialize_vec(vec)))
                    done += len(results)
                    if done % 500 < batch_size or done == len(to_embed):
                        elapsed = _time.time() - _start
                        rate = done / elapsed if elapsed > 0 else 0
                        eta = (len(to_embed) - done) / rate if rate > 0 else 0
                        print(f"    {done}/{len(to_embed)} ({elapsed:.0f}s, {rate:.0f}/s, ETA {eta:.0f}s)")
                        db.commit()

            db.commit()
        print(f"  Index ready: {len(all_ids)} pages, {len(all_ids) - len(existing_vec_ids) + len(to_embed)} new embeddings")

    def search(self, query: str, limit: int = 20, bm25_weight: float = 0.5, vec_weight: float = 0.5) -> list[SearchResult]:
        db = self._db

        # BM25 search
        bm25_results = db.execute("""
            SELECT p.id, p.slug, p.content, rank
            FROM pages_fts fts
            JOIN pages p ON p.id = fts.rowid
            WHERE pages_fts MATCH ?
            ORDER BY rank
            LIMIT ?
        """, (query, limit * 2)).fetchall()

        bm25_ranks = {row[0]: i for i, row in enumerate(bm25_results)}
        bm25_pages = {row[0]: (row[1], row[2]) for row in bm25_results}

        # vector search
        query_vec = llm.embed([query])[0]
        vec_results = db.execute("""
            SELECT id, distance
            FROM pages_vec
            WHERE embedding MATCH ?
            ORDER BY distance
            LIMIT ?
        """, (_serialize_vec(query_vec), limit * 2)).fetchall()

        vec_ranks = {row[0]: i for i, row in enumerate(vec_results)}

        # merge candidates
        all_ids = set(bm25_ranks.keys()) | set(vec_ranks.keys())
        max_rank = limit * 2

        scored = []
        for pid in all_ids:
            bm25_r = bm25_ranks.get(pid, max_rank)
            vec_r = vec_ranks.get(pid, max_rank)
            # reciprocal rank fusion
            score = bm25_weight / (60 + bm25_r) + vec_weight / (60 + vec_r)

            if pid in bm25_pages:
                slug, content = bm25_pages[pid]
            else:
                row = db.execute("SELECT slug, content FROM pages WHERE id = ?", (pid,)).fetchone()
                slug, content = row

            scored.append(SearchResult(
                slug=slug,
                score=score,
                bm25_rank=bm25_r,
                vec_rank=vec_r,
                content=content,
            ))

        scored.sort(key=lambda r: r.score, reverse=True)
        return scored[:limit]
