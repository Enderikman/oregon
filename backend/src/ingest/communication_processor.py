import hashlib
import json
import re
import threading
from pathlib import Path
from textwrap import dedent
from .models import CommunicationRecord
from .entity_index import EntityIndex
from .reverse_index import update_reverse_index
from v1 import llm


def _comm_hash(comm: CommunicationRecord) -> str:
    raw = json.dumps(comm.raw_data, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


class CommCheckpoint:
    def __init__(self, output_dir: Path):
        self._path = output_dir / ".comms_checkpoint"
        self._lock = threading.Lock()
        self._seen: set[str] = set()
        if self._path.exists():
            self._seen = set(self._path.read_text().splitlines())

    def is_done(self, comm: CommunicationRecord) -> bool:
        return _comm_hash(comm) in self._seen

    def mark_done(self, comm: CommunicationRecord):
        h = _comm_hash(comm)
        with self._lock:
            self._seen.add(h)
            with open(self._path, "a") as f:
                f.write(h + "\n")


_page_locks: dict[str, threading.Lock] = {}
_page_locks_lock = threading.Lock()


def _get_page_lock(page_path: str) -> threading.Lock:
    with _page_locks_lock:
        if page_path not in _page_locks:
            _page_locks[page_path] = threading.Lock()
        return _page_locks[page_path]


SYSTEM_PROMPT = dedent("""\
    You are updating a Wikipedia-style article about an entity in a company's internal knowledge graph.

    You will receive:
    1. The current page content (frontmatter + body)
    2. A new communication (email, conversation, or support chat) involving this entity
    3. Context about the entity

    Decide whether this communication is notable enough to update the article. Most communications are routine and don't warrant an update. Only update if the communication reveals:
    - A new project, initiative, or responsibility
    - A status change on something already mentioned
    - A notable collaboration or relationship
    - Something that would help someone understand what this person/org is currently working on

    Respond with one of three options:

    1. If not notable:
    NO_UPDATE

    2. If it adds new information without contradicting existing content:
    EXTEND
    <full updated article body>

    3. If it contradicts or overrides existing information:
    INVALIDATE
    <full updated article body>

    Rules:
    - Use [[Type/id|Display Name]] syntax for entity references.
    - Maintain the existing section structure where possible.
    - Don't include the frontmatter — only the body.""")


def process_communication(
    comm: CommunicationRecord,
    entity_index: EntityIndex,
    output_dir: Path,
    checkpoint: CommCheckpoint | None = None,
):
    if checkpoint and checkpoint.is_done(comm):
        return

    for participant_id in comm.participants:
        entry = entity_index.get_by_id(participant_id)
        if not entry:
            continue

        page_path = output_dir / entry.entity_type / entry.id / "page.md"
        if not page_path.exists():
            continue

        page_lock = _get_page_lock(str(page_path))

        # read current content under lock
        with page_lock:
            current_content = page_path.read_text()

        frontmatter, _ = _split_frontmatter(current_content)
        last_talked = _get_last_talked_about_at(frontmatter)

        index_lines = []
        for pid in comm.participants:
            if pid != participant_id:
                e = entity_index.get_by_id(pid)
                if e:
                    index_lines.append(f"{pid} → {e.entity_type}/{e.id} ({e.name})")
        index_context = "\n".join(index_lines) if index_lines else "(no other participants)"

        user_prompt = dedent(f"""\
            Current page content:
            {current_content}

            New communication ({comm.raw_data.get('date', comm.date)}):
            {_format_communication(comm)}

            Other participants:
            {index_context}

            Should this update the article? Respond with NO_UPDATE, EXTEND, or INVALIDATE followed by the updated body.""")

        result = llm.generate(SYSTEM_PROMPT, user_prompt)
        result = result.strip()

        if result == "NO_UPDATE":
            continue

        action, body = _parse_response(result)
        if not body:
            continue

        comm_date = comm.date[:10]

        # write under lock to avoid race conditions
        with page_lock:
            current_content = page_path.read_text()
            frontmatter, _ = _split_frontmatter(current_content)
            last_talked = _get_last_talked_about_at(frontmatter)

            if action == "INVALIDATE" and last_talked and comm_date < last_talked:
                continue

            new_frontmatter = _set_last_talked_about_at(frontmatter, comm_date)
            page_path.write_text(f"{new_frontmatter}\n{body}\n")
            update_reverse_index(page_path, output_dir)

    if checkpoint:
        checkpoint.mark_done(comm)


def _parse_response(result: str) -> tuple[str, str]:
    for action in ("EXTEND", "INVALIDATE"):
        if result.startswith(action):
            body = result[len(action):].strip()
            return action, body
    return "EXTEND", result


def _get_last_talked_about_at(frontmatter: str) -> str | None:
    match = re.search(r'last_talked_about_at:\s*(.+)', frontmatter)
    return match.group(1).strip() if match else None


def _set_last_talked_about_at(frontmatter: str, date: str) -> str:
    if "last_talked_about_at:" in frontmatter:
        return re.sub(r'last_talked_about_at:\s*.+', f'last_talked_about_at: {date}', frontmatter)
    return frontmatter.replace("---\n", f"---\nlast_talked_about_at: {date}\n", 1)


def _format_communication(comm: CommunicationRecord) -> str:
    raw = comm.raw_data
    if "subject" in raw:
        return f"Email from {raw.get('sender_name', '?')} to {raw.get('recipient_name', '?')}\nSubject: {raw['subject']}\n\n{raw.get('body', '')[:1000]}"
    elif "text" in raw and "conversation_id" in raw:
        return f"Conversation:\n{raw['text'][:1000]}"
    elif "text" in raw and "chat_id" in raw:
        return f"Support chat about {raw.get('product_name', '?')}:\n{raw['text'][:1000]}"
    return str(raw)[:1000]


def _split_frontmatter(content: str) -> tuple[str, str]:
    if not content.startswith("---"):
        return "", content
    end = content.index("---", 3)
    frontmatter = content[:end + 3]
    body = content[end + 3:].strip()
    return frontmatter, body
