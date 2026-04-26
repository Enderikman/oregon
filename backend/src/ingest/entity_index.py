from dataclasses import dataclass
from .models import EntityRecord


@dataclass
class EntityEntry:
    entity_type: str
    name: str
    id: str


class EntityIndex:
    def __init__(self):
        self._by_id: dict[str, EntityEntry] = {}
        self._by_name: dict[str, EntityEntry] = {}

    def add(self, record: EntityRecord):
        name = record.frontmatter.get("name", record.id)
        entry = EntityEntry(entity_type=record.entity_type, name=name, id=record.id)
        self._by_id[record.id] = entry
        self._by_name[name.lower()] = entry

    def get_by_id(self, entity_id: str) -> EntityEntry | None:
        return self._by_id.get(entity_id)

    def get_by_name(self, name: str) -> EntityEntry | None:
        return self._by_name.get(name.lower())

    def wiki_link(self, entity_id: str) -> str:
        entry = self.get_by_id(entity_id)
        if not entry:
            return entity_id
        return f"[[{entry.entity_type}/{entry.id}|{entry.name}]]"

    @classmethod
    def from_records(cls, records: list[EntityRecord]) -> "EntityIndex":
        index = cls()
        for record in records:
            index.add(record)
        return index
