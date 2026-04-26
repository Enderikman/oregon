from dataclasses import dataclass, field

ENTITY_TYPES = {"Person", "Organization", "Product", "Ticket", "Repository", "Knowledge"}


@dataclass
class EntityRecord:
    entity_type: str
    id: str
    frontmatter: dict
    raw_data: dict
    related_entities: list[str] = field(default_factory=list)


@dataclass
class CommunicationRecord:
    date: str
    participants: list[str]
    raw_data: dict
    comm_type: str = ""
    comm_id: str = ""
