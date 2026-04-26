import argparse
from pathlib import Path
from textwrap import dedent

from pydantic import BaseModel

from src import llm
from src.query.entity_detector import EntityDetector
from src.query.search import PageIndex


MAX_HOPS = 5


class ReadRequest(BaseModel):
    pages: list[str]


class Answer(BaseModel):
    answer: str


class QueryResponse(BaseModel):
    action: str  # "read" or "answer"
    read_request: ReadRequest | None = None
    answer: Answer | None = None


SYSTEM_PROMPT = dedent("""\
    You answer questions about a company using its internal knowledge graph.

    You have access to entity pages that have been retrieved for you.
    Answer using all relevant information from the retrieved pages — don't omit details that help answer the question.

    Respond with one of two actions:

    1. If you need to read additional pages (e.g. to follow a link like [[Person/emp_0047]]):
       action: "read", with the page slugs you want to read.

    2. If you have enough information to answer:
       action: "answer", with your full answer.""")


def read_page(output_dir: Path, slug: str) -> str | None:
    page_path = output_dir / slug / "page.md"
    if not page_path.exists():
        return None
    content = page_path.read_text()
    index_path = output_dir / slug / "_index.md"
    if index_path.exists():
        content += f"\n\n## Mentioned by\n{index_path.read_text()}"
    return content


def query(question: str, output_dir: Path, ontology_path: str = "src/v1/ingest/ontology.yaml"):
    print(f"Question: {question}\n")

    # Step 1: detect entities
    detector = EntityDetector(output_dir, ontology_path)
    print("── Entity Detection ──")
    candidates, resolved = detector.detect(question)
    if candidates:
        for c in candidates:
            print(f"  [{c['confidence']:6}] \"{c['name']}\" → {c['possible_types']}")
    else:
        print("  (no candidates)")
    if resolved:
        for r in resolved:
            print(f"  resolved: {r.slug} ({r.name}) [{r.confidence}]")
    else:
        print("  → no entities resolved")
    print()

    # Step 2: read initial pages
    context_pages = {}
    for entity in resolved:
        content = read_page(output_dir, entity.slug)
        if content:
            context_pages[entity.slug] = content
            print(f"── Read: {entity.slug} ({len(content.splitlines())} lines) ──")
            print(content)
            print()

    # Step 2b: fallback — if no entities resolved, hybrid search
    if not resolved and candidates:
        print("── Fallback: hybrid search (BM25 + semantic) ──")
        index = PageIndex(output_dir)
        search_query = " ".join(c["name"] for c in candidates)
        results = index.search(search_query, limit=20)
        print(f"  query: \"{search_query}\" → {len(results)} results")
        for r in results:
            context_pages[r.slug] = r.content
            print(f"  [{r.score:.4f}] (bm25_rank={r.bm25_rank} vec_rank={r.vec_rank}) {r.slug} ({len(r.content.splitlines())} lines)")
        print()
        print()

    # Step 3: LLM loop with structured output
    messages = []
    if context_pages:
        pages_text = "\n\n---\n\n".join(
            f"# {slug}\n{content}" for slug, content in context_pages.items()
        )
        messages.append(f"Retrieved pages:\n\n{pages_text}\n\nQuestion: {question}")
    else:
        messages.append(f"No entity pages were found for this question.\n\nQuestion: {question}")

    for hop in range(MAX_HOPS):
        user_msg = "\n\n".join(messages)
        response = llm.generate_object(SYSTEM_PROMPT, user_msg, QueryResponse)

        if response.action == "answer" and response.answer:
            print(f"── Answer (hop {hop}) ──")
            print(response.answer.answer)
            return response.answer.answer

        if response.action == "read" and response.read_request:
            slugs = response.read_request.pages
            print(f"── Hop {hop + 1}: LLM requests {slugs} ──")
            new_pages = {}
            for slug in slugs:
                content = read_page(output_dir, slug)
                if content:
                    context_pages[slug] = content
                    new_pages[slug] = content
                    lines = content.splitlines()
                    print(f"  READ {slug} → {len(lines)} lines")
                else:
                    print(f"  READ {slug} → NOT FOUND")

            if new_pages:
                pages_text = "\n\n---\n\n".join(
                    f"# {slug}\n{content}" for slug, content in new_pages.items()
                )
                # represent the previous action as text for context
                messages.append(f"You requested to read: {', '.join(slugs)}")
                messages.append(f"Here are the pages you requested:\n\n{pages_text}")
            else:
                messages.append(f"You requested to read: {', '.join(slugs)}")
                messages.append("None of the requested pages were found. Please answer with the information you have, or say you don't know.")
            print()
        else:
            # malformed response, force answer
            print(f"── Malformed response at hop {hop}, retrying ──")
            messages.append("Please respond with either action 'read' or 'answer'.")

    print("── Max hops reached, forcing answer ──")
    messages.append("You've reached the maximum number of reads. Please answer now with what you have.")
    response = llm.generate_object(SYSTEM_PROMPT, "\n\n".join(messages), QueryResponse)
    answer_text = response.answer.answer if response.answer else "(no answer)"
    print(answer_text)
    return answer_text


def cli():
    parser = argparse.ArgumentParser(prog="organon-query")
    parser.add_argument("question", help="The question to ask")
    parser.add_argument("--dataset", default="output/EnterpriseBench", help="Path to ingested dataset")
    parser.add_argument("--ontology", default="src/v1/ingest/ontology.yaml", help="Path to ontology YAML")
    args = parser.parse_args()
    query(args.question, Path(args.dataset), args.ontology)


if __name__ == "__main__":
    cli()
