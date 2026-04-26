"""Mock fixtures for the API surface — shapes mirror frontend src/lib/types.ts."""

CURRENT_USER = {
    "id": "niko",
    "name": "Niko Magklis",
    "role": "Memory Steward",
    "initials": "NM",
}

# ── Entities ────────────────────────────────────────────────────────────

ENTITIES = [
    {
        "id": "acme-corp",
        "type": "client",
        "name": "Acme Corp",
        "summary": "Mid-market client in active pilot, EU pricing pending.",
        "body": "Acme Corp is one of our larger active pilots. Stage: [[Pilot]]. Owner: [[lara-voss]].",
        "factIds": ["f-acme-stage", "f-acme-arr", "f-acme-owner"],
        "backlinks": ["q4-pricing-refresh", "atlas-pricing-engine"],
        "updatedAt": "2026-04-24T00:00:00Z",
    },
    {
        "id": "lara-voss",
        "type": "employee",
        "name": "Lara Voss",
        "summary": "Account exec covering Acme Corp and three other EU pilots.",
        "body": "Lara owns the Acme relationship. Title is currently disputed.",
        "factIds": ["f-lara-title-short", "f-lara-title-long", "f-lara-team"],
        "backlinks": ["acme-corp"],
        "updatedAt": "2026-04-25T00:00:00Z",
    },
    {
        "id": "atlas-pricing-engine",
        "type": "product",
        "name": "Atlas Pricing Engine",
        "summary": "Internal service that computes per-region pricing for all customers.",
        "body": "Atlas powers pricing for [[acme-corp]] and others.",
        "factIds": ["f-atlas-owner", "f-atlas-stack"],
        "backlinks": ["acme-corp", "q4-pricing-refresh"],
        "updatedAt": "2026-04-22T00:00:00Z",
    },
    {
        "id": "q4-pricing-refresh",
        "type": "project",
        "name": "Q4 Pricing Refresh",
        "summary": "Refresh EU pricing tiers ahead of renewal cycle.",
        "body": "Targets [[acme-corp]] and [[atlas-pricing-engine]].",
        "factIds": ["f-q4-status", "f-q4-owner"],
        "backlinks": ["acme-corp", "atlas-pricing-engine"],
        "updatedAt": "2026-04-26T00:00:00Z",
    },
    {
        "id": "policy-data-handling",
        "type": "policy",
        "name": "Customer Data Handling",
        "summary": "How long we retain raw customer artifacts post-ingest.",
        "body": "Sets retention windows.",
        "factIds": ["f-policy-retention"],
        "backlinks": [],
        "updatedAt": "2026-03-12T00:00:00Z",
    },
    {
        "id": "decision-eu-tier",
        "type": "decision",
        "name": "Introduce EU Tier 2",
        "summary": "Decision to add a mid EU tier between starter and enterprise.",
        "body": "Driven by [[q4-pricing-refresh]].",
        "factIds": ["f-decision-eu-tier"],
        "backlinks": ["q4-pricing-refresh"],
        "updatedAt": "2026-04-20T00:00:00Z",
    },
    {
        "id": "aditya-krishnan",
        "type": "employee",
        "name": "Aditya Krishnan",
        "summary": "Sales engineer supporting EU pilots.",
        "body": "Pairs with [[lara-voss]] on [[acme-corp]].",
        "factIds": [],
        "backlinks": [],
        "updatedAt": "2026-04-25T00:00:00Z",
    },
]

# ── Facts ───────────────────────────────────────────────────────────────

FACTS = [
    {"id": "f-acme-stage", "subject": "acme-corp", "predicate": "is in stage", "object": "Pilot", "confidence": 0.95, "verifiedAt": "2026-04-24T00:00:00Z", "sourceId": "src-acme-crm", "factSource": "ai"},
    {"id": "f-acme-arr", "subject": "acme-corp", "predicate": "expected ARR", "object": "$420k", "confidence": 0.78, "verifiedAt": "2026-04-22T00:00:00Z", "sourceId": "src-acme-email-1", "factSource": "ai"},
    {"id": "f-acme-owner", "subject": "acme-corp", "predicate": "owned by", "object": "Lara Voss", "confidence": 0.99, "verifiedAt": "2026-04-25T00:00:00Z", "sourceId": "src-acme-crm", "factSource": "human", "taughtBy": "niko", "taughtAt": "2026-04-25T08:00:00Z"},
    {"id": "f-lara-title-short", "subject": "lara-voss", "predicate": "title", "object": "CGO", "confidence": 0.78, "verifiedAt": "2026-04-25T00:00:00Z", "sourceId": "src-acme-email-1", "factSource": "ai", "conflictingFactId": "f-lara-title-long"},
    {"id": "f-lara-title-long", "subject": "lara-voss", "predicate": "title", "object": "Chief Growth Officer", "confidence": 0.82, "verifiedAt": "2026-04-25T00:00:00Z", "sourceId": "src-hr-roster", "factSource": "ai", "conflictingFactId": "f-lara-title-short"},
    {"id": "f-lara-team", "subject": "lara-voss", "predicate": "leads team", "object": "EU Sales", "confidence": 0.91, "verifiedAt": "2026-04-23T00:00:00Z", "sourceId": "src-hr-roster", "factSource": "ai"},
    {"id": "f-atlas-owner", "subject": "atlas-pricing-engine", "predicate": "owned by team", "object": "Pricing Platform", "confidence": 0.96, "verifiedAt": "2026-04-20T00:00:00Z", "sourceId": "src-engdoc", "factSource": "ai"},
    {"id": "f-atlas-stack", "subject": "atlas-pricing-engine", "predicate": "uses stack", "object": "Postgres + Go", "confidence": 0.88, "verifiedAt": "2026-04-19T00:00:00Z", "sourceId": "src-engdoc", "factSource": "ai"},
    {"id": "f-q4-status", "subject": "q4-pricing-refresh", "predicate": "status", "object": "in progress", "confidence": 0.90, "verifiedAt": "2026-04-26T00:00:00Z", "sourceId": "src-q4-doc", "factSource": "ai"},
    {"id": "f-q4-owner", "subject": "q4-pricing-refresh", "predicate": "owned by", "object": "Lara Voss", "confidence": 0.85, "verifiedAt": "2026-04-26T00:00:00Z", "sourceId": "src-q4-doc", "factSource": "ai"},
    {"id": "f-policy-retention", "subject": "policy-data-handling", "predicate": "retention window", "object": "180 days", "confidence": 1.0, "verifiedAt": "2026-03-12T00:00:00Z", "sourceId": "src-policy-pdf", "factSource": "human", "taughtBy": "niko", "taughtAt": "2026-03-12T00:00:00Z"},
    {"id": "f-decision-eu-tier", "subject": "decision-eu-tier", "predicate": "approved by", "object": "Pricing Council", "confidence": 0.93, "verifiedAt": "2026-04-20T00:00:00Z", "sourceId": "src-q4-doc", "factSource": "ai"},
]

# ── Sources ─────────────────────────────────────────────────────────────

SOURCES = [
    {"id": "src-acme-crm", "kind": "crm_row", "label": "CRM · Acme Corp account · synced 1h ago", "excerpt": "Stage: Pilot. ARR (forecast): $420k. Owner: Lara Voss.", "highlight": "Pilot"},
    {"id": "src-acme-email-1", "kind": "email", "label": "Email · Sarah Lin → deal-team · 2 days ago", "excerpt": "Quick update from the Acme call — Lara (CGO) is pushing for EU Tier 2.", "highlight": "CGO"},
    {"id": "src-hr-roster", "kind": "doc", "label": "HR roster · Q2 export", "excerpt": "Lara Voss — Chief Growth Officer (EU). Reports to: Sam.", "highlight": "Chief Growth Officer"},
    {"id": "src-engdoc", "kind": "doc", "label": "Engineering wiki · Atlas service page", "excerpt": "Atlas runs on Postgres 15 + Go 1.22. Owned by Pricing Platform.", "highlight": "Pricing Platform"},
    {"id": "src-q4-doc", "kind": "doc", "label": "Strategy doc · Q4 Pricing Refresh", "excerpt": "Status: in progress. Decision: introduce EU Tier 2 by end of quarter."},
    {"id": "src-policy-pdf", "kind": "pdf_excerpt", "label": "Policy PDF · Customer Data Handling v3.2", "excerpt": "Raw customer artifacts retained for 180 days post-ingest.", "highlight": "180 days"},
    {"id": "src-acme-ticket", "kind": "ticket", "label": "Ticket #4812 · Acme onboarding", "excerpt": "Acme reports slow pricing recompute under heavy load."},
    {"id": "src-niko-reply", "kind": "human_reply", "label": "Human reply · Niko · yesterday", "excerpt": "Confirmed Lara owns Acme — corrected from previous extraction.", "contributor": "niko"},
]

# ── Questions ───────────────────────────────────────────────────────────

QUESTIONS = [
    {
        "id": "q-1-acme-disamb", "type": "disambiguation",
        "question": "Are 'Acme' and 'Acme Corp' the same entity?",
        "reasoning": "I see 'Acme' referenced in 4 emails and 'Acme Corp' in CRM. Spelling and domain match.",
        "sourceIds": ["src-acme-email-1", "src-acme-crm"],
        "affectedFactIds": ["f-acme-stage", "f-acme-arr"],
        "affectedEntityIds": ["acme-corp"],
        "unblocksQuestionIds": ["q-5-pricing-cat"],
        "candidates": ["Same entity", "Different entities"],
        "raisedAt": "2026-04-26T01:00:00Z", "status": "open",
    },
    {
        "id": "q-2-lara-conflict", "type": "conflict",
        "question": "What is Lara Voss's official title?",
        "reasoning": "Email signature says 'CGO'. HR roster says 'Chief Growth Officer'. Likely same — confirm canonical form.",
        "sourceIds": ["src-acme-email-1", "src-hr-roster"],
        "affectedFactIds": ["f-lara-title-short", "f-lara-title-long"],
        "affectedEntityIds": ["lara-voss"],
        "unblocksQuestionIds": [],
        "candidates": ["CGO", "Chief Growth Officer"],
        "raisedAt": "2026-04-26T05:00:00Z", "status": "open",
    },
    {
        "id": "q-3-acme-arr-gap", "type": "gap",
        "question": "What is the expected ARR for Acme Corp?",
        "reasoning": "Mentioned only in one email as '$420k'. No CRM confirmation.",
        "sourceIds": ["src-acme-email-1"],
        "affectedFactIds": ["f-acme-arr"],
        "affectedEntityIds": ["acme-corp"],
        "unblocksQuestionIds": [],
        "raisedAt": "2026-04-26T07:00:00Z", "status": "open",
    },
    {
        "id": "q-4-atlas-low", "type": "low_confidence",
        "question": "Does Atlas Pricing Engine still use Postgres 15?",
        "reasoning": "Wiki page is 6 months old. Stack might have changed.",
        "sourceIds": ["src-engdoc"],
        "affectedFactIds": ["f-atlas-stack"],
        "affectedEntityIds": ["atlas-pricing-engine"],
        "unblocksQuestionIds": [],
        "candidates": ["Yes", "No"],
        "raisedAt": "2026-04-26T09:00:00Z", "status": "open",
    },
    {
        "id": "q-5-pricing-cat", "type": "categorization",
        "question": "Should 'Q4 Pricing Refresh' be tagged as a strategic initiative?",
        "reasoning": "Affects multiple clients. Currently tagged only as 'project'.",
        "sourceIds": ["src-q4-doc"],
        "affectedFactIds": [],
        "affectedEntityIds": ["q4-pricing-refresh"],
        "unblocksQuestionIds": [],
        "candidates": ["Strategic", "Tactical", "Maintenance"],
        "raisedAt": "2026-04-26T10:00:00Z", "status": "open",
    },
    {
        "id": "q-6-aditya-role", "type": "gap",
        "question": "What region does Aditya Krishnan cover?",
        "reasoning": "Listed as Sales Engineer but no region tag.",
        "sourceIds": ["src-hr-roster"],
        "affectedFactIds": [],
        "affectedEntityIds": ["aditya-krishnan"],
        "unblocksQuestionIds": [],
        "raisedAt": "2026-04-26T11:00:00Z", "status": "open",
    },
    {
        "id": "q-7-policy-update", "type": "low_confidence",
        "question": "Is the 180-day retention policy still current?",
        "reasoning": "Last verified March 2026. New legal review pending.",
        "sourceIds": ["src-policy-pdf"],
        "affectedFactIds": ["f-policy-retention"],
        "affectedEntityIds": ["policy-data-handling"],
        "unblocksQuestionIds": [],
        "candidates": ["Yes", "No"],
        "raisedAt": "2026-04-26T12:00:00Z", "status": "open",
    },
    {
        "id": "q-8-decision-owner", "type": "disambiguation",
        "question": "Who chairs the Pricing Council?",
        "reasoning": "Council approved the EU Tier 2 decision but chair is unnamed.",
        "sourceIds": ["src-q4-doc"],
        "affectedFactIds": ["f-decision-eu-tier"],
        "affectedEntityIds": ["decision-eu-tier"],
        "unblocksQuestionIds": [],
        "raisedAt": "2026-04-26T13:00:00Z", "status": "open",
    },
]

# ── Activity ────────────────────────────────────────────────────────────

ACTIVITY = [
    {"id": "a-1", "kind": "extracted", "actor": "ai", "summary": "Extracted 3 facts from Acme onboarding ticket", "ts": "2026-04-26T11:30:00Z", "refIds": ["f-acme-stage"]},
    {"id": "a-2", "kind": "raised_question", "actor": "ai", "summary": "Raised conflict on Lara Voss's title", "ts": "2026-04-26T05:02:00Z", "refIds": ["q-2-lara-conflict"]},
    {"id": "a-3", "kind": "resolved_question", "actor": "niko", "summary": "Confirmed Lara owns Acme", "ts": "2026-04-25T08:00:00Z", "refIds": []},
    {"id": "a-4", "kind": "ingested_source", "actor": "ai", "summary": "Ingested HR roster Q2 export", "ts": "2026-04-23T07:00:00Z", "refIds": ["src-hr-roster"]},
    {"id": "a-5", "kind": "edited_fact", "actor": "niko", "summary": "Updated retention policy verification date", "ts": "2026-03-12T09:00:00Z", "refIds": ["f-policy-retention"]},
]

# ── Source streams ──────────────────────────────────────────────────────

SOURCE_STREAMS = [
    {"id": "ss-crm", "name": "CRM (Salesforce)", "status": "up_to_date", "lastIngestedAt": "2026-04-26T12:00:00Z", "factCount": 86},
    {"id": "ss-email", "name": "Email (Gmail)", "status": "up_to_date", "lastIngestedAt": "2026-04-26T11:30:00Z", "factCount": 142},
    {"id": "ss-hr", "name": "HR roster", "status": "up_to_date", "lastIngestedAt": "2026-04-23T07:00:00Z", "factCount": 38},
    {"id": "ss-eng", "name": "Engineering wiki", "status": "pending", "lastIngestedAt": "2026-04-20T00:00:00Z", "factCount": 22},
    {"id": "ss-tickets", "name": "Tickets (Jira)", "status": "up_to_date", "lastIngestedAt": "2026-04-26T10:00:00Z", "factCount": 54},
    {"id": "ss-policy", "name": "Policy docs", "status": "error", "lastIngestedAt": "2026-03-12T00:00:00Z", "factCount": 8},
    {"id": "ss-slack", "name": "Slack channels", "status": "pending", "lastIngestedAt": "2026-04-25T00:00:00Z", "factCount": 0},
    {"id": "ss-zendesk", "name": "Zendesk", "status": "up_to_date", "lastIngestedAt": "2026-04-26T08:00:00Z", "factCount": 17},
]

# ── Health + trends ─────────────────────────────────────────────────────

HEALTH = {
    "factsLearned": 247,
    "confidenceAvg": 0.84,
    "openQuestions": len(QUESTIONS),
    "conflicts": 3,
    "sourcesIngested": sum(1 for s in SOURCE_STREAMS if s["status"] == "up_to_date"),
    "sourcesTotal": len(SOURCE_STREAMS),
    "openInterviews": 12,
    "conflictsPending": 3,
}

TRENDS = {
    "factsAdded":          [12, 18, 14, 22, 19, 28, 34],
    "confidence":          [0.78, 0.79, 0.80, 0.81, 0.82, 0.83, 0.84],
    "interviewCompletion": [0.62, 0.68, 0.71, 0.69, 0.74, 0.78, 0.82],
    "conflictOpenHours":   [38, 42, 31, 28, 22, 19, 14],
}

# ── Admin interviews ────────────────────────────────────────────────────

ADMIN_INTERVIEWS = [
    {
        "id": "int_142",
        "interviewee": {"name": "Aditya Krishnan", "initials": "AK", "role": "Sales Engineer", "level": "IC"},
        "topic": "Acme pricing escalation", "topicId": "topic_acme_pricing",
        "mode": "voice", "status": "live",
        "startedAt": "2026-04-26T11:30:00Z", "durationMs": 360000,
        "factsAdded": 3, "accuracy": 0.94, "conflictsFound": 1,
        "questionIds": ["q-1-acme-disamb", "q-5-pricing-cat"],
    },
    {
        "id": "int_141",
        "interviewee": {"name": "Lara Voss", "initials": "LV", "role": "Chief Growth Officer", "level": "VP"},
        "topic": "EU Tier 2 strategy", "topicId": "topic_eu_tier",
        "mode": "voice", "status": "completed",
        "startedAt": "2026-04-25T15:00:00Z", "durationMs": 1800000,
        "factsAdded": 11, "accuracy": 0.96, "conflictsFound": 0,
        "questionIds": ["q-5-pricing-cat", "q-8-decision-owner"],
    },
    {
        "id": "int_140",
        "interviewee": {"name": "Niko Magklis", "initials": "NM", "role": "Memory Steward", "level": "M"},
        "topic": "Retention policy review", "topicId": "topic_policy",
        "mode": "swipe", "status": "completed",
        "startedAt": "2026-04-24T09:00:00Z", "durationMs": 720000,
        "factsAdded": 6, "accuracy": 1.0, "conflictsFound": 0,
        "questionIds": ["q-7-policy-update"],
    },
    {
        "id": "int_139",
        "interviewee": {"name": "Sam Hartley", "initials": "SH", "role": "Director of Sales", "level": "D"},
        "topic": "Lara title clarification", "topicId": "topic_lara_title",
        "mode": "voice", "status": "consolidated",
        "startedAt": "2026-04-23T16:00:00Z", "durationMs": 540000,
        "factsAdded": 1, "accuracy": 1.0, "conflictsFound": 1,
        "questionIds": ["q-2-lara-conflict"],
    },
    {
        "id": "int_138",
        "interviewee": {"name": "Priya Shah", "initials": "PS", "role": "Pricing PM", "level": "M"},
        "topic": "Atlas stack audit", "topicId": "topic_atlas",
        "mode": "swipe", "status": "pending",
        "startedAt": "2026-04-26T09:00:00Z", "durationMs": 0,
        "factsAdded": 0, "accuracy": 0, "conflictsFound": 0,
        "questionIds": ["q-4-atlas-low"],
    },
]

# ── Admin conflicts ─────────────────────────────────────────────────────

ADMIN_CONFLICTS = [
    {
        "id": "conf_lara_title",
        "entityId": "lara-voss", "entityName": "Lara Voss",
        "predicate": "title",
        "factPairIds": ["f-lara-title-short", "f-lara-title-long"],
        "questionId": "q-2-lara-conflict",
        "status": "escalated", "kind": "escalation",
        "recommendedAction": "escalate",
        "recommendedChoice": "Chief Growth Officer",
        "recommendedReason": "HR roster is canonical. Email signatures use abbreviation.",
        "respondents": [
            {"name": "Aditya Krishnan", "initials": "AK", "role": "Sales Engineer", "level": "IC", "answer": "CGO", "factId": "f-lara-title-short", "interviewId": "int_142", "answeredAt": "2026-04-26T08:00:00Z", "confidence": 0.78},
            {"name": "Sam Hartley", "initials": "SH", "role": "Director of Sales", "level": "D", "answer": "Chief Growth Officer", "factId": "f-lara-title-long", "interviewId": "int_139", "answeredAt": "2026-04-23T16:30:00Z", "confidence": 0.95},
        ],
        "escalationChain": [
            {"name": "Aditya Krishnan", "level": "IC", "status": "asked"},
            {"name": "Sam Hartley", "level": "D", "status": "asked"},
            {"name": "Lara Voss", "level": "VP", "status": "next"},
        ],
        "raisedAt": "2026-04-26T05:00:00Z", "ageMs": 18000000,
        "affectedFactCount": 4, "affectedEntityIds": ["lara-voss", "acme-corp"],
    },
    {
        "id": "conf_acme_arr",
        "entityId": "acme-corp", "entityName": "Acme Corp",
        "predicate": "expected ARR",
        "factPairIds": ["f-acme-arr", "f-acme-arr"],
        "questionId": "q-3-acme-arr-gap",
        "status": "open", "kind": "consensus",
        "recommendedAction": "pick_canonical",
        "recommendedChoice": "$420k",
        "recommendedReason": "Single email mention with 0.78 confidence — needs human confirmation.",
        "respondents": [],
        "escalationChain": [{"name": "Lara Voss", "level": "VP", "status": "next"}],
        "raisedAt": "2026-04-26T07:00:00Z", "ageMs": 7200000,
        "affectedFactCount": 1, "affectedEntityIds": ["acme-corp"],
    },
    {
        "id": "conf_atlas_stack",
        "entityId": "atlas-pricing-engine", "entityName": "Atlas Pricing Engine",
        "predicate": "uses stack",
        "factPairIds": ["f-atlas-stack", "f-atlas-stack"],
        "questionId": "q-4-atlas-low",
        "status": "open", "kind": "override",
        "recommendedAction": "override",
        "recommendedChoice": "Postgres 16 + Go",
        "recommendedReason": "Wiki is 6 months stale. Recent commit history shows Postgres upgrade.",
        "respondents": [
            {"name": "Priya Shah", "initials": "PS", "role": "Pricing PM", "level": "M", "answer": "Postgres 16 + Go", "factId": "f-atlas-stack", "interviewId": "int_138", "answeredAt": "2026-04-26T09:30:00Z", "confidence": 0.88},
        ],
        "escalationChain": [{"name": "Priya Shah", "level": "M", "status": "asked"}],
        "raisedAt": "2026-04-26T09:00:00Z", "ageMs": 3600000,
        "affectedFactCount": 1, "affectedEntityIds": ["atlas-pricing-engine"],
    },
]

# ── Quiz: backend "open-questions" simple shape ─────────────────────────

OPEN_QUESTIONS = [
    {"question": {"id": "q-1-acme-disamb", "text": "Are 'Acme' and 'Acme Corp' the same entity?"}, "poi": ["acme-corp"]},
    {"question": {"id": "q-2-lara-conflict", "text": "Is Lara Voss's official title 'Chief Growth Officer'?"}, "poi": ["lara-voss"]},
    {"question": {"id": "q-3-acme-arr-gap", "text": "Is the expected ARR for Acme Corp around $420k?"}, "poi": ["acme-corp"]},
    {"question": {"id": "q-4-atlas-low", "text": "Does Atlas Pricing Engine still use Postgres 15?"}, "poi": ["atlas-pricing-engine"]},
    {"question": {"id": "q-5-pricing-cat", "text": "Should Q4 Pricing Refresh be tagged as a strategic initiative?"}, "poi": ["q4-pricing-refresh"]},
    {"question": {"id": "q-6-aditya-role", "text": "Does Aditya Krishnan cover the EU region?"}, "poi": ["aditya-krishnan"]},
    {"question": {"id": "q-7-policy-update", "text": "Is the 180-day retention policy still current?"}, "poi": ["policy-data-handling"]},
    {"question": {"id": "q-8-decision-owner", "text": "Does Lara Voss chair the Pricing Council?"}, "poi": ["decision-eu-tier", "lara-voss"]},
]
