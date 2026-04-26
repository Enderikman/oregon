import type {
  ActivityEvent,
  AIQuestion,
  Entity,
  Fact,
  GraphEdge,
  GraphNode,
  Source,
  SourceStream,
  User,
} from "./types";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const minutesAgo = (n: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
};
const hoursAgo = (n: number) => {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
};

export const currentUser: User = {
  id: "niko",
  name: "Niko Magklis",
  role: "Memory Steward",
  initials: "NM",
};

// ---------------- Sources ----------------

export const sources: Source[] = [
  {
    id: "src-acme-email-1",
    kind: "email",
    label: "Email · Sarah Lin to deal-team@inazuma · 2 days ago",
    excerpt:
      "Quick update from the Acme call. They're moving forward with the pilot but want pricing adjusted for the EU region. Decision expected end of next week.",
    highlight: "Acme",
  },
  {
    id: "src-acme-email-2",
    kind: "email",
    label: "Email · procurement@acme.com · 4 days ago",
    excerpt:
      "Following up on the Acme pricing thread. Please cc Mei Tanaka on next reply.",
    highlight: "Acme",
  },
  {
    id: "src-acme-crm",
    kind: "crm_row",
    label: "CRM record · ACME-0042",
    excerpt:
      "Account: Acme Corp. Stage: Pilot. ARR (potential): $480k. Owner: Sarah Lin. Renewal: 2026-09-15. Domain: acme.com.",
    highlight: "Acme Corp",
  },
  {
    id: "src-lara-bio",
    kind: "doc",
    label: "Inazuma org chart · last updated 2 months ago",
    excerpt:
      "Lara Voss — Chief Growth Officer (CGO). Reports to: Mira Okada (CEO). Direct reports: Sarah Lin, Marcus Bell, Priya Kumar.",
    highlight: "Chief Growth Officer",
  },
  {
    id: "src-lara-email",
    kind: "email",
    label: "Email · Lara Voss · 6 days ago",
    excerpt:
      "Hi all — as CGO I'll be running the Q4 forecast review on Friday. Please send pipeline updates by Thursday EOD. — Lara",
    highlight: "CGO",
  },
  {
    id: "src-beacon-email",
    kind: "email",
    label: "Email · Beacon Labs · 5 days ago",
    excerpt:
      "Confirming our renewal at the same tier. Please send the new MSA by Friday. — Marcus, Beacon",
  },
  {
    id: "src-beacon-crm",
    kind: "crm_row",
    label: "CRM record · BEACON-0007",
    excerpt:
      "Account: Beacon Labs. Stage: Renewal. ARR: $260k. Renewal: 2026-05-30. Owner: (unassigned).",
    highlight: "(unassigned)",
  },
  {
    id: "src-atlas-doc",
    kind: "doc",
    label: "Atlas Pricing Engine — Roadmap draft",
    excerpt:
      "Atlas v2 roadmap: region-aware tiers (in progress), API rewrite (Q3), public launch tentatively Q2 2026.",
    highlight: "Q2 2026",
  },
  {
    id: "src-pricing-email",
    kind: "email",
    label: "Email thread · 'Re: pricing concerns' · 9 days ago",
    excerpt:
      "We've been comparing Atlas pricing against three competitors and the EU multiplier is a non-starter at our volume. We'd like to revisit before committing to renewal.",
    highlight: "non-starter",
  },
  {
    id: "src-leave-pdf",
    kind: "pdf_excerpt",
    label: "Inazuma Employee Handbook · §4.2 Extended Leave",
    excerpt:
      "Extended leave (>10 consecutive working days) requires written notice to your manager at least 30 days in advance, plus an HR form (HR-204).",
  },
  {
    id: "src-jane-human",
    kind: "human_reply",
    label: "Resolved by Jane Doe · ticket T-401",
    excerpt:
      "Fill HR-204 in the People Ops portal. Tell your manager 30 days ahead. I usually approve same-day if it's outside Q-end weeks.",
    contributor: "jane-doe",
  },
  {
    id: "src-niko-resolution-acme",
    kind: "human_reply",
    label: "Taught by Niko · 18 min ago",
    excerpt:
      "Acme and Acme Corp are the same entity. Canonical name: Acme Corp. Domain: acme.com.",
    contributor: "niko",
  },
  {
    id: "src-q4-doc",
    kind: "doc",
    label: "Q4 Pricing Refresh — Project brief",
    excerpt:
      "Goals: introduce region-aware pricing, simplify tiering from 7 to 4 SKUs, ship by Oct 15. Owner: Niko Magklis. Sponsor: Lara Voss.",
  },
  {
    id: "src-acme-old-procurement",
    kind: "email",
    label: "Email · Acme procurement · 8 months ago",
    excerpt:
      "Our procurement contact is Daniel Park. Please route all contract questions through him going forward.",
  },
];

// ---------------- Facts ----------------

export const facts: Fact[] = [
  // Acme Corp (after disambiguation, all routed to acme-corp)
  {
    id: "f-acme-stage",
    subject: "acme-corp",
    predicate: "is in stage",
    object: "Pilot",
    confidence: 0.95,
    verifiedAt: daysAgo(2),
    sourceId: "src-acme-crm",
    factSource: "ai",
  },
  {
    id: "f-acme-arr",
    subject: "acme-corp",
    predicate: "potential ARR",
    object: "$480,000",
    confidence: 0.92,
    verifiedAt: daysAgo(2),
    sourceId: "src-acme-crm",
    factSource: "ai",
  },
  {
    id: "f-acme-renewal",
    subject: "acme-corp",
    predicate: "renews on",
    object: "2026-09-15",
    confidence: 0.99,
    verifiedAt: daysAgo(7),
    sourceId: "src-acme-crm",
    factSource: "ai",
  },
  {
    id: "f-acme-pricing-block",
    subject: "acme-corp",
    predicate: "blocked on",
    object: "EU region pricing approval",
    confidence: 0.88,
    verifiedAt: daysAgo(2),
    sourceId: "src-acme-email-1",
    factSource: "ai",
  },
  {
    id: "f-acme-owner",
    subject: "acme-corp",
    predicate: "owned by",
    object: "Sarah Lin",
    confidence: 0.99,
    verifiedAt: daysAgo(2),
    sourceId: "src-acme-crm",
    factSource: "ai",
  },
  {
    id: "f-acme-domain",
    subject: "acme-corp",
    predicate: "primary domain",
    object: "acme.com",
    confidence: 0.97,
    verifiedAt: daysAgo(2),
    sourceId: "src-acme-crm",
    factSource: "ai",
  },
  // conflict pair on procurement contact
  {
    id: "f-acme-procurement-old",
    subject: "acme-corp",
    predicate: "procurement contact",
    object: "Daniel Park",
    confidence: 0.55,
    verifiedAt: daysAgo(240),
    sourceId: "src-acme-old-procurement",
    factSource: "ai",
    conflictingFactId: "f-acme-procurement-new",
  },
  {
    id: "f-acme-procurement-new",
    subject: "acme-corp",
    predicate: "procurement contact",
    object: "Mei Tanaka",
    confidence: 0.82,
    verifiedAt: daysAgo(4),
    sourceId: "src-acme-email-2",
    factSource: "ai",
    conflictingFactId: "f-acme-procurement-old",
  },
  // Beacon
  {
    id: "f-beacon-stage",
    subject: "beacon-labs",
    predicate: "stage",
    object: "Renewal",
    confidence: 0.95,
    verifiedAt: daysAgo(5),
    sourceId: "src-beacon-crm",
    factSource: "ai",
  },
  {
    id: "f-beacon-arr",
    subject: "beacon-labs",
    predicate: "ARR",
    object: "$260,000",
    confidence: 0.99,
    verifiedAt: daysAgo(5),
    sourceId: "src-beacon-crm",
    factSource: "ai",
  },
  {
    id: "f-beacon-contact",
    subject: "beacon-labs",
    predicate: "primary contact",
    object: "Marcus Reilly",
    confidence: 0.92,
    verifiedAt: daysAgo(5),
    sourceId: "src-beacon-email",
    factSource: "ai",
  },
  {
    id: "f-beacon-renewal-date",
    subject: "beacon-labs",
    predicate: "renews on",
    object: "2026-05-30",
    confidence: 0.99,
    verifiedAt: daysAgo(5),
    sourceId: "src-beacon-crm",
    factSource: "ai",
  },
  // Lara — conflict pair on title
  {
    id: "f-lara-title-short",
    subject: "lara-voss",
    predicate: "title",
    object: "CGO",
    confidence: 0.78,
    verifiedAt: daysAgo(6),
    sourceId: "src-lara-email",
    factSource: "ai",
    conflictingFactId: "f-lara-title-long",
  },
  {
    id: "f-lara-title-long",
    subject: "lara-voss",
    predicate: "title",
    object: "Chief Growth Officer",
    confidence: 0.86,
    verifiedAt: daysAgo(60),
    sourceId: "src-lara-bio",
    factSource: "ai",
    conflictingFactId: "f-lara-title-short",
  },
  {
    id: "f-lara-reports-to",
    subject: "lara-voss",
    predicate: "reports to",
    object: "Mira Okada",
    confidence: 0.9,
    verifiedAt: daysAgo(60),
    sourceId: "src-lara-bio",
    factSource: "ai",
  },
  {
    id: "f-lara-direct-reports",
    subject: "lara-voss",
    predicate: "direct reports",
    object: "Sarah Lin, Marcus Bell, Priya Kumar",
    confidence: 0.88,
    verifiedAt: daysAgo(60),
    sourceId: "src-lara-bio",
    factSource: "ai",
  },
  // Jane (already taught by a human via ticket)
  {
    id: "f-jane-role",
    subject: "jane-doe",
    predicate: "is",
    object: "Support Lead",
    confidence: 1,
    verifiedAt: daysAgo(45),
    sourceId: "src-jane-human",
    factSource: "human",
    taughtBy: "jane-doe",
    taughtAt: daysAgo(45),
  },
  {
    id: "f-jane-owns",
    subject: "jane-doe",
    predicate: "owns",
    object: "People Ops queries",
    confidence: 0.9,
    verifiedAt: daysAgo(45),
    sourceId: "src-jane-human",
    factSource: "human",
    taughtBy: "jane-doe",
    taughtAt: daysAgo(45),
  },
  // Niko
  {
    id: "f-niko-role",
    subject: "niko",
    predicate: "is",
    object: "Memory Steward",
    confidence: 1,
    verifiedAt: daysAgo(60),
    sourceId: "src-q4-doc",
    factSource: "human",
    taughtBy: "niko",
    taughtAt: daysAgo(60),
  },
  {
    id: "f-niko-owns",
    subject: "niko",
    predicate: "owns project",
    object: "Q4 Pricing Refresh",
    confidence: 0.99,
    verifiedAt: daysAgo(20),
    sourceId: "src-q4-doc",
    factSource: "ai",
  },
  // Atlas
  {
    id: "f-atlas-purpose",
    subject: "atlas-pricing-engine",
    predicate: "powers",
    object: "All client pricing decisions",
    confidence: 0.98,
    verifiedAt: daysAgo(40),
    sourceId: "src-atlas-doc",
    factSource: "ai",
  },
  {
    id: "f-atlas-version",
    subject: "atlas-pricing-engine",
    predicate: "current version",
    object: "v2.0 (region-aware in progress)",
    confidence: 0.85,
    verifiedAt: daysAgo(40),
    sourceId: "src-atlas-doc",
    factSource: "ai",
  },
  // Atlas low-confidence (tied to a question)
  {
    id: "f-atlas-launch",
    subject: "atlas-pricing-engine",
    predicate: "launches",
    object: "Q2 2026",
    confidence: 0.64,
    verifiedAt: daysAgo(8),
    sourceId: "src-atlas-doc",
    factSource: "ai",
  },
  // Leave Policy (stale + human)
  {
    id: "f-leave-notice",
    subject: "leave-policy",
    predicate: "requires notice of",
    object: "30 days for >10 day leave",
    confidence: 0.99,
    verifiedAt: daysAgo(200),
    sourceId: "src-leave-pdf",
    factSource: "ai",
  },
  {
    id: "f-leave-form",
    subject: "leave-policy",
    predicate: "uses form",
    object: "HR-204",
    confidence: 0.95,
    verifiedAt: daysAgo(15),
    sourceId: "src-jane-human",
    factSource: "human",
    taughtBy: "jane-doe",
    taughtAt: daysAgo(15),
  },
  {
    id: "f-leave-approval",
    subject: "leave-policy",
    predicate: "approval pattern",
    object: "Same-day outside Q-end weeks",
    confidence: 0.7,
    verifiedAt: daysAgo(15),
    sourceId: "src-jane-human",
    factSource: "human",
    taughtBy: "jane-doe",
    taughtAt: daysAgo(15),
  },
  // Q4 Pricing Refresh
  {
    id: "f-q4-owner",
    subject: "q4-pricing-refresh",
    predicate: "owned by",
    object: "Niko Magklis",
    confidence: 0.99,
    verifiedAt: daysAgo(20),
    sourceId: "src-q4-doc",
    factSource: "ai",
  },
  {
    id: "f-q4-deadline",
    subject: "q4-pricing-refresh",
    predicate: "ships by",
    object: "2026-10-15",
    confidence: 0.85,
    verifiedAt: daysAgo(20),
    sourceId: "src-q4-doc",
    factSource: "ai",
  },
  {
    id: "f-q4-stale-scope",
    subject: "q4-pricing-refresh",
    predicate: "originally scoped",
    object: "7 SKUs reduced to 4",
    confidence: 0.66,
    verifiedAt: daysAgo(220),
    sourceId: "src-q4-doc",
    factSource: "ai",
  },
  // Pricing email — categorization candidate
  {
    id: "f-pricing-email-cat",
    subject: "acme-corp",
    predicate: "open thread category",
    object: "uncategorized",
    confidence: 0.55,
    verifiedAt: daysAgo(9),
    sourceId: "src-pricing-email",
    factSource: "ai",
  },
];

// ---------------- Entities ----------------

export const entities: Entity[] = [
  {
    id: "acme-corp",
    type: "client",
    name: "Acme Corp",
    summary: "Mid-market client in active pilot, EU pricing pending.",
    body: `Acme Corp is one of our larger active pilots. They're evaluating the [[atlas-pricing-engine]] for their EU operations. The pilot is currently blocked on EU region pricing approval, which lives with [[lara-voss]]. The account is owned by Sarah Lin.`,
    factIds: [
      "f-acme-stage",
      "f-acme-arr",
      "f-acme-renewal",
      "f-acme-pricing-block",
      "f-acme-owner",
      "f-acme-domain",
      "f-acme-procurement-old",
      "f-acme-procurement-new",
      "f-pricing-email-cat",
    ],
    backlinks: ["q4-pricing-refresh", "atlas-pricing-engine", "lara-voss"],
    updatedAt: daysAgo(2),
  },
  {
    id: "beacon-labs",
    type: "client",
    name: "Beacon Labs",
    summary: "Renewing client, smooth path, MSA pending. Renewal owner unknown.",
    body: `Beacon Labs is a stable mid-tier client. Renewal confirmed at the same tier. Primary contact is Marcus Reilly. Renewal owner currently missing in CRM — pending steward review.`,
    factIds: ["f-beacon-stage", "f-beacon-arr", "f-beacon-contact", "f-beacon-renewal-date"],
    backlinks: ["lara-voss"],
    updatedAt: daysAgo(5),
  },
  {
    id: "lara-voss",
    type: "employee",
    name: "Lara Voss",
    summary: "Chief Growth Officer. Owns sales forecasts and pricing approvals.",
    body: `Lara is the Chief Growth Officer. She owns sales numbers, forecasts, and final pricing approvals. Reports to Mira Okada (CEO). Direct reports: Sarah Lin, Marcus Bell, Priya Kumar.`,
    factIds: [
      "f-lara-title-short",
      "f-lara-title-long",
      "f-lara-reports-to",
      "f-lara-direct-reports",
    ],
    backlinks: ["acme-corp", "beacon-labs", "q4-pricing-refresh"],
    updatedAt: daysAgo(6),
  },
  {
    id: "jane-doe",
    type: "employee",
    name: "Jane Doe",
    summary: "Support Lead. Owns People Ops queries and leave policy questions.",
    body: `Jane runs Support and is the de-facto owner of People Ops questions, including the [[leave-policy]].`,
    factIds: ["f-jane-role", "f-jane-owns"],
    backlinks: ["leave-policy"],
    updatedAt: daysAgo(45),
  },
  {
    id: "niko",
    type: "employee",
    name: "Niko Magklis",
    summary: "Memory Steward. Curates the AI's company memory.",
    body: `Niko is the Memory Steward at Inazuma. Resolves AI uncertainty, validates extractions, and owns the [[q4-pricing-refresh]] project.`,
    factIds: ["f-niko-role", "f-niko-owns"],
    backlinks: ["q4-pricing-refresh"],
    updatedAt: daysAgo(20),
  },
  {
    id: "atlas-pricing-engine",
    type: "product",
    name: "Atlas Pricing Engine",
    summary: "Internal rules engine that powers all client pricing.",
    body: `Atlas is the rules engine behind every client's pricing. Currently being reshaped by the [[q4-pricing-refresh]] to support region-aware tiers. Public launch date is being verified.`,
    factIds: ["f-atlas-purpose", "f-atlas-version", "f-atlas-launch"],
    backlinks: ["acme-corp", "q4-pricing-refresh"],
    updatedAt: daysAgo(8),
  },
  {
    id: "leave-policy",
    type: "policy",
    name: "Leave Policy",
    summary: "Inazuma's standard and extended leave policy.",
    body: `Standard PTO accrues at 2 days/month. Extended leave (>10 consecutive days) requires 30 days notice and HR-204. Owned operationally by [[jane-doe]].`,
    factIds: ["f-leave-notice", "f-leave-form", "f-leave-approval"],
    backlinks: ["jane-doe"],
    updatedAt: daysAgo(15),
  },
  {
    id: "q4-pricing-refresh",
    type: "project",
    name: "Q4 Pricing Refresh",
    summary: "Region-aware pricing rollout, owned by Niko, sponsored by Lara.",
    body: `Project to introduce region-aware pricing in [[atlas-pricing-engine]] and reduce SKU count. Owned by [[niko]], sponsored by [[lara-voss]]. Ships Oct 15.`,
    factIds: ["f-q4-owner", "f-q4-deadline", "f-q4-stale-scope"],
    backlinks: ["niko", "lara-voss", "atlas-pricing-engine"],
    updatedAt: daysAgo(20),
  },
];

// ---------------- AI Questions (5) ----------------

export const aiQuestions: AIQuestion[] = [
  {
    id: "q-1-acme-disamb",
    type: "disambiguation",
    question: "Are 'Acme' and 'Acme Corp' the same entity?",
    reasoning:
      "I see 'Acme' referenced in 4 emails and 'Acme Corp' in the CRM record. They share the same domain (acme.com) and primary contact (Sarah Lin). I think they're the same entity but I'm 72% sure.",
    sourceIds: ["src-acme-email-1", "src-acme-email-2", "src-acme-crm"],
    affectedFactIds: [
      "f-acme-stage",
      "f-acme-arr",
      "f-acme-renewal",
      "f-acme-pricing-block",
      "f-acme-owner",
      "f-acme-domain",
      "f-acme-procurement-new",
    ],
    affectedEntityIds: ["acme-corp"],
    unblocksQuestionIds: ["q-5-pricing-cat"],
    candidates: ["Same entity", "Different entities", "Not enough info"],
    raisedAt: hoursAgo(3),
    status: "open",
  },
  {
    id: "q-2-lara-conflict",
    type: "conflict",
    question:
      "Two sources disagree about Lara Voss's title — 'CGO' or 'Chief Growth Officer'. Which is canonical?",
    reasoning:
      "Lara signs her own emails as 'CGO' but the org chart and Inazuma directory list her as 'Chief Growth Officer'. Both refer to the same role; I need a canonical form so downstream answers don't flip-flop.",
    sourceIds: ["src-lara-email", "src-lara-bio"],
    affectedFactIds: ["f-lara-title-short", "f-lara-title-long"],
    affectedEntityIds: ["lara-voss"],
    unblocksQuestionIds: [],
    candidates: ["CGO", "Chief Growth Officer"],
    raisedAt: hoursAgo(5),
    status: "open",
  },
  {
    id: "q-3-beacon-gap",
    type: "gap",
    question: "I don't see who owns the Beacon Labs renewal. Can you tell me?",
    reasoning:
      "Beacon Labs CRM record lists owner as '(unassigned)'. The renewal date is May 30, 2026, only 5 weeks away. Without an owner, follow-up is at risk.",
    sourceIds: ["src-beacon-crm", "src-beacon-email"],
    affectedFactIds: ["f-beacon-stage", "f-beacon-renewal-date"],
    affectedEntityIds: ["beacon-labs"],
    unblocksQuestionIds: [],
    raisedAt: hoursAgo(8),
    status: "open",
  },
  {
    id: "q-4-atlas-low-conf",
    type: "low_confidence",
    question:
      "I extracted 'Atlas Pricing Engine launches Q2 2026' at 64% confidence. Confirm?",
    reasoning:
      "The roadmap doc uses the word 'tentatively' next to Q2 2026. I'm not sure if this is committed or aspirational.",
    sourceIds: ["src-atlas-doc"],
    affectedFactIds: ["f-atlas-launch"],
    affectedEntityIds: ["atlas-pricing-engine"],
    unblocksQuestionIds: [],
    candidates: ["Confirm", "Reject", "Edit and confirm"],
    raisedAt: hoursAgo(12),
    status: "open",
  },
  {
    id: "q-5-pricing-cat",
    type: "categorization",
    question:
      "Is the email thread starting 'Re: pricing concerns' a complaint, churn risk, or feature request?",
    reasoning:
      "The thread expresses dissatisfaction with EU pricing and references competitors, but doesn't explicitly threaten to leave. I need a category to route it correctly.",
    sourceIds: ["src-pricing-email"],
    affectedFactIds: ["f-pricing-email-cat"],
    affectedEntityIds: ["acme-corp"],
    unblocksQuestionIds: [],
    candidates: ["Complaint", "Churn risk", "Feature request", "Other"],
    raisedAt: hoursAgo(18),
    status: "open",
  },
  {
    id: "q-6-acme-renewal",
    type: "low_confidence",
    question: "Acme's renewal looks like it slipped from May to June. Confirm?",
    reasoning:
      "Sarah Lin's last email mentions 'pushing to June' but the CRM still shows May 30. I want to update the fact but I'm not sure if this was approved.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: ["acme-corp"],
    unblocksQuestionIds: [],
    raisedAt: hoursAgo(20),
    status: "open",
  },
  {
    id: "q-7-niko-ooo",
    type: "disambiguation",
    question: "Is Niko out of office Friday?",
    reasoning:
      "Calendar shows 'AFK' for Friday but no formal OOO event. Routing rules need to know whether to defer Niko's threads.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    raisedAt: hoursAgo(22),
    status: "open",
  },
  {
    id: "q-8-vendor-cat",
    type: "categorization",
    question: "How should I file the Stripe MSA — vendor agreement, finance, or legal?",
    reasoning:
      "PDF was attached to a finance thread but it's an MSA, which usually goes under legal. Need a single home so search returns it consistently.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    candidates: ["Vendor agreement", "Finance", "Legal", "All three"],
    raisedAt: hoursAgo(25),
    status: "open",
  },
  {
    id: "q-9-jordan-conflict",
    type: "conflict",
    question:
      "Two emails disagree on Jordan Park's start date — May 12 or May 19. Which is canonical?",
    reasoning:
      "Offer letter says May 12. HR onboarding email says May 19. Probably the second one is the actual date but I can't tell.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    candidates: ["May 12", "May 19"],
    raisedAt: daysAgo(1),
    status: "open",
  },
  {
    id: "q-10-beacon-budget",
    type: "gap",
    question: "I don't have Beacon Labs's 2026 budget approval status. Approved?",
    reasoning:
      "Renewal logic depends on knowing whether their budget has been signed off. No source mentions a final number.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: ["beacon-labs"],
    unblocksQuestionIds: [],
    raisedAt: daysAgo(1),
    status: "open",
  },
  {
    id: "q-11-atlas-owner",
    type: "disambiguation",
    question: "Is Lara Voss still the owner of Atlas Pricing Engine, or did it move to Priya?",
    reasoning:
      "Recent design review was hosted by Priya, but the spec doc still lists Lara. Ownership matters for routing escalations.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: ["atlas-pricing-engine", "lara-voss"],
    unblocksQuestionIds: [],
    candidates: ["Lara Voss", "Priya Kapoor", "Both — co-owners"],
    raisedAt: daysAgo(2),
    status: "open",
  },
  {
    id: "q-12-eu-pricing",
    type: "low_confidence",
    question: "EU pricing tier 'Growth EU' — is this a real SKU or a placeholder?",
    reasoning:
      "Showed up in two pricing threads but never in the official price book. Could be aspirational naming.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    raisedAt: daysAgo(2),
    status: "open",
  },
  {
    id: "q-13-roadmap-q3",
    type: "categorization",
    question: "Is the 'multi-region' item on the roadmap committed for Q3 or just a candidate?",
    reasoning:
      "Roadmap doc lists it under Q3 with a star (★), which usually means 'maybe'. Need a binary so I can answer customer questions consistently.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    candidates: ["Committed", "Candidate", "Cut"],
    raisedAt: daysAgo(3),
    status: "open",
  },
  {
    id: "q-14-support-routing",
    type: "disambiguation",
    question: "Should P1 tickets from Acme route to oncall, or to Sarah directly?",
    reasoning:
      "Sarah said 'just text me' in Slack last month, but the routing playbook says oncall. I default to oncall but flagging.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: ["acme-corp"],
    unblocksQuestionIds: [],
    raisedAt: daysAgo(3),
    status: "open",
  },
  {
    id: "q-15-decision-log",
    type: "gap",
    question: "Why did we drop Postgres logical replication in favor of CDC last quarter?",
    reasoning:
      "Decision shows up in commit history but no decision doc. Future-me will want this when the question comes back.",
    sourceIds: [],
    affectedFactIds: [],
    affectedEntityIds: [],
    unblocksQuestionIds: [],
    raisedAt: daysAgo(4),
    status: "open",
  },
];

// ---------------- Activity ----------------

export const activityEvents: ActivityEvent[] = [
  {
    id: "a-1",
    kind: "extracted",
    actor: "ai",
    summary: "Extracted 12 facts from email batch (sales-team-q2)",
    ts: minutesAgo(4),
  },
  {
    id: "a-2",
    kind: "raised_question",
    actor: "ai",
    summary: "Raised question: 'Are Acme and Acme Corp the same entity?'",
    ts: hoursAgo(3),
    refIds: ["q-1-acme-disamb"],
  },
  {
    id: "a-3",
    kind: "raised_question",
    actor: "ai",
    summary: "Raised question: 'Lara Voss title — CGO vs Chief Growth Officer?'",
    ts: hoursAgo(5),
    refIds: ["q-2-lara-conflict"],
  },
  {
    id: "a-4",
    kind: "ingested_source",
    actor: "ai",
    summary: "Ingested 47 records from CRM (Salesforce sync)",
    ts: hoursAgo(6),
  },
  {
    id: "a-5",
    kind: "raised_question",
    actor: "ai",
    summary: "Raised question: 'Who owns Beacon Labs renewal?'",
    ts: hoursAgo(8),
    refIds: ["q-3-beacon-gap"],
  },
  {
    id: "a-6",
    kind: "extracted",
    actor: "ai",
    summary: "Extracted 4 facts from Atlas roadmap document",
    ts: hoursAgo(10),
  },
  {
    id: "a-7",
    kind: "edited_fact",
    actor: "niko",
    summary: "Edited Q4 Pricing Refresh deadline from 'Oct 1' to '2026-10-15'",
    ts: hoursAgo(11),
  },
  {
    id: "a-8",
    kind: "raised_question",
    actor: "ai",
    summary: "Raised question: 'Atlas launches Q2 2026 — confirm?'",
    ts: hoursAgo(12),
    refIds: ["q-4-atlas-low-conf"],
  },
  {
    id: "a-9",
    kind: "ingested_source",
    actor: "ai",
    summary: "Ingested 138 messages from Workspace channels",
    ts: hoursAgo(14),
  },
  {
    id: "a-10",
    kind: "raised_question",
    actor: "ai",
    summary: "Raised question: 'Categorize \"Re: pricing concerns\" thread'",
    ts: hoursAgo(18),
    refIds: ["q-5-pricing-cat"],
  },
  {
    id: "a-11",
    kind: "resolved_question",
    actor: "niko",
    summary: "Resolved: 'How is extended leave requested?' — taught Jane Doe's flow",
    ts: hoursAgo(20),
  },
  {
    id: "a-12",
    kind: "extracted",
    actor: "ai",
    summary: "Extracted 8 facts from policy PDFs (Employee Handbook v3)",
    ts: hoursAgo(23),
  },
];

// ---------------- Source streams (ingestion list) ----------------

export const sourceStreams: SourceStream[] = [
  { id: "ss-mail", name: "Enterprise mail", status: "up_to_date", lastIngestedAt: minutesAgo(4), factCount: 312 },
  { id: "ss-crm", name: "CRM (Salesforce)", status: "up_to_date", lastIngestedAt: hoursAgo(6), factCount: 187 },
  { id: "ss-hr", name: "HR system", status: "up_to_date", lastIngestedAt: hoursAgo(11), factCount: 64 },
  { id: "ss-tickets", name: "IT Service tickets", status: "pending", lastIngestedAt: hoursAgo(2), factCount: 92 },
  { id: "ss-policies", name: "Policy library", status: "up_to_date", lastIngestedAt: hoursAgo(23), factCount: 41 },
  { id: "ss-workspace", name: "Workspace docs", status: "up_to_date", lastIngestedAt: hoursAgo(14), factCount: 156 },
  { id: "ss-collab", name: "Collaboration tools", status: "up_to_date", lastIngestedAt: hoursAgo(1), factCount: 78 },
  { id: "ss-social", name: "Social platform", status: "error", lastIngestedAt: daysAgo(3), factCount: 12 },
  { id: "ss-business", name: "Business management", status: "pending", lastIngestedAt: hoursAgo(7), factCount: 45 },
  { id: "ss-overflow", name: "Inazuma Overflow Q&A", status: "up_to_date", lastIngestedAt: hoursAgo(9), factCount: 33 },
  { id: "ss-orders", name: "Customer orders", status: "up_to_date", lastIngestedAt: minutesAgo(15), factCount: 211 },
];

// ---------------- Graph (acme-centered subgraph) ----------------

export const acmeGraph: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: "acme-corp", label: "Acme Corp", kind: "entity", entityType: "client" },
    { id: "lara-voss", label: "Lara Voss", kind: "entity", entityType: "employee" },
    { id: "atlas-pricing-engine", label: "Atlas Pricing Engine", kind: "entity", entityType: "product" },
    { id: "q4-pricing-refresh", label: "Q4 Pricing Refresh", kind: "entity", entityType: "project" },
    { id: "beacon-labs", label: "Beacon Labs", kind: "entity", entityType: "client" },
    { id: "niko", label: "Niko Magklis", kind: "entity", entityType: "employee" },
    { id: "f-acme-stage", label: "stage: Pilot", kind: "fact" },
    { id: "f-acme-arr", label: "ARR: $480k", kind: "fact" },
    { id: "f-acme-renewal", label: "renews 2026-09-15", kind: "fact" },
    { id: "f-acme-pricing-block", label: "blocked: EU pricing", kind: "fact" },
    { id: "f-acme-owner", label: "owner: Sarah Lin", kind: "fact" },
    { id: "f-acme-domain", label: "domain: acme.com", kind: "fact" },
    { id: "f-lara-title-long", label: "title: Chief Growth Officer", kind: "fact" },
    { id: "f-lara-reports-to", label: "reports to: Mira Okada", kind: "fact" },
    { id: "f-atlas-version", label: "v2.0 region-aware", kind: "fact" },
    { id: "f-q4-owner", label: "owner: Niko", kind: "fact" },
    { id: "f-q4-deadline", label: "ships 2026-10-15", kind: "fact" },
    { id: "f-beacon-stage", label: "stage: Renewal", kind: "fact" },
    { id: "f-beacon-arr", label: "ARR: $260k", kind: "fact" },
    { id: "f-niko-owns", label: "owns: Q4 project", kind: "fact" },
    { id: "f-acme-procurement-new", label: "procurement: Mei Tanaka", kind: "fact" },
    { id: "f-lara-direct-reports", label: "direct reports: 3", kind: "fact" },
  ],
  edges: [
    { id: "e1", source: "acme-corp", target: "f-acme-stage", label: "has fact" },
    { id: "e2", source: "acme-corp", target: "f-acme-arr", label: "has fact" },
    { id: "e3", source: "acme-corp", target: "f-acme-renewal", label: "has fact" },
    { id: "e4", source: "acme-corp", target: "f-acme-pricing-block", label: "has fact" },
    { id: "e5", source: "acme-corp", target: "f-acme-owner", label: "has fact" },
    { id: "e6", source: "acme-corp", target: "f-acme-domain", label: "has fact" },
    { id: "e7", source: "f-acme-pricing-block", target: "lara-voss", label: "needs" },
    { id: "e8", source: "lara-voss", target: "f-lara-title-long", label: "has fact" },
    { id: "e9", source: "lara-voss", target: "f-lara-reports-to", label: "has fact" },
    { id: "e10", source: "lara-voss", target: "f-lara-direct-reports", label: "has fact" },
    { id: "e11", source: "atlas-pricing-engine", target: "f-atlas-version", label: "has fact" },
    { id: "e12", source: "atlas-pricing-engine", target: "q4-pricing-refresh", label: "shaped by" },
    { id: "e13", source: "q4-pricing-refresh", target: "f-q4-owner", label: "has fact" },
    { id: "e14", source: "q4-pricing-refresh", target: "f-q4-deadline", label: "has fact" },
    { id: "e15", source: "f-q4-owner", target: "niko", label: "refers to" },
    { id: "e16", source: "niko", target: "f-niko-owns", label: "has fact" },
    { id: "e17", source: "beacon-labs", target: "f-beacon-stage", label: "has fact" },
    { id: "e18", source: "beacon-labs", target: "f-beacon-arr", label: "has fact" },
    { id: "e19", source: "lara-voss", target: "beacon-labs", label: "manages" },
    { id: "e20", source: "lara-voss", target: "acme-corp", label: "approves pricing for" },
    { id: "e21", source: "acme-corp", target: "f-acme-procurement-new", label: "has fact" },
    { id: "e22", source: "q4-pricing-refresh", target: "acme-corp", label: "unblocks" },
  ],
};

// ---------------- Admin dashboard fixtures ----------------

export interface AdminMetrics {
  factsLearned: number;
  confidenceAvg: number; // 0..1
  openInterviews: number;
  conflictsPending: number;
  sourcesConnected: number;
  sourcesTotal: number;
}

export const adminMetrics: AdminMetrics = {
  factsLearned: 247,
  confidenceAvg: 0.84,
  openInterviews: 12,
  conflictsPending: 3,
  sourcesConnected: 8,
  sourcesTotal: 11,
};

export interface AdminTrends {
  // 7 daily points, oldest -> newest
  factsAdded: number[];
  confidence: number[]; // 0..1
  interviewCompletion: number[]; // 0..1
  conflictOpenHours: number[]; // hours; lower is better
}

export const adminTrends: AdminTrends = {
  factsAdded:           [12, 18, 14, 22, 19, 28, 34],
  confidence:           [0.78, 0.79, 0.80, 0.81, 0.82, 0.83, 0.84],
  interviewCompletion:  [0.62, 0.68, 0.71, 0.69, 0.74, 0.78, 0.82],
  conflictOpenHours:    [38, 42, 31, 28, 22, 19, 14],
};

// ---------------- Test page fixture (the wow shot) ----------------

export interface TestAnswer {
  text: string;
  citations: { marker: string; sourceId: string }[];
  citedFactIds: string[];
  confidence: number;
  factsByAi: number;
  factsByHuman: number;
  humanTaughtFactIds: string[];
}

export const testAnswers: { before: TestAnswer; after: TestAnswer } = {
  before: {
    text:
      "Lara Voss's title appears as both {{entity:lara-voss}} 'CGO' (per her own email signature) and 'Chief Growth Officer' (per the Inazuma org chart)[^1][^2]. I'm not sure which form is canonical — can you tell me? She reports to Mira Okada (CEO) and has 3 direct reports.",
    citations: [
      { marker: "1", sourceId: "src-lara-email" },
      { marker: "2", sourceId: "src-lara-bio" },
    ],
    citedFactIds: ["f-lara-title-short", "f-lara-title-long", "f-lara-reports-to", "f-lara-direct-reports"],
    confidence: 0.6,
    factsByAi: 4,
    factsByHuman: 0,
    humanTaughtFactIds: [],
  },
  after: {
    text:
      "{{entity:lara-voss}} is Inazuma's Chief Growth Officer (CGO)[^1]. She reports to Mira Okada (CEO) and has 3 direct reports: Sarah Lin, Marcus Bell, Priya Kumar.",
    citations: [
      { marker: "1", sourceId: "src-lara-bio" },
    ],
    citedFactIds: ["f-lara-title-long", "f-lara-reports-to", "f-lara-direct-reports"],
    confidence: 1,
    factsByAi: 2,
    factsByHuman: 1,
    humanTaughtFactIds: ["f-lara-title-long"],
  },
};


// ---------------- Admin · Interview tracking ----------------

export type InterviewStatus = "pending" | "live" | "completed" | "consolidated";
export type InterviewMode = "voice" | "swipe";
export type IntervieweeLevel = "IC" | "M" | "D" | "VP";

export interface AdminInterview {
  id: string;
  interviewee: { name: string; initials: string; role: string; level: IntervieweeLevel };
  topic: string;
  topicId: string;
  mode: InterviewMode;
  status: InterviewStatus;
  startedAt: string;
  durationMs: number;
  factsAdded: number;
  accuracy: number; // 0..1
  conflictsFound: number;
  questionIds: string[];
}

const min = (n: number) => n * 60_000;

export const adminInterviews: AdminInterview[] = [
  {
    id: "int_142",
    interviewee: { name: "Aditya Krishnan", initials: "AK", role: "Sales Engineer", level: "IC" },
    topic: "Acme pricing escalation",
    topicId: "topic_acme_pricing",
    mode: "voice",
    status: "live",
    startedAt: minutesAgo(6),
    durationMs: min(6),
    factsAdded: 3,
    accuracy: 0.94,
    conflictsFound: 1,
    questionIds: ["q-1-acme-disamb", "q-5-pricing-cat"],
  },
  {
    id: "int_141",
    interviewee: { name: "Sarah Lin", initials: "SL", role: "Account Executive", level: "IC" },
    topic: "Acme procurement contact",
    topicId: "topic_acme_procurement",
    mode: "swipe",
    status: "completed",
    startedAt: hoursAgo(2),
    durationMs: min(4),
    factsAdded: 2,
    accuracy: 0.97,
    conflictsFound: 1,
    questionIds: ["q-1-acme-disamb"],
  },
  {
    id: "int_140",
    interviewee: { name: "Lara Voss", initials: "LV", role: "Chief Growth Officer", level: "VP" },
    topic: "Title canonicalization",
    topicId: "topic_lara_title",
    mode: "voice",
    status: "consolidated",
    startedAt: hoursAgo(5),
    durationMs: min(7),
    factsAdded: 4,
    accuracy: 0.99,
    conflictsFound: 1,
    questionIds: ["q-2-lara-conflict"],
  },
  {
    id: "int_139",
    interviewee: { name: "Marcus Bell", initials: "MB", role: "Renewals Manager", level: "M" },
    topic: "Beacon Labs renewal owner",
    topicId: "topic_beacon_owner",
    mode: "swipe",
    status: "pending",
    startedAt: hoursAgo(7),
    durationMs: 0,
    factsAdded: 0,
    accuracy: 0,
    conflictsFound: 0,
    questionIds: ["q-3-beacon-gap"],
  },
  {
    id: "int_138",
    interviewee: { name: "Priya Kumar", initials: "PK", role: "Product Manager", level: "M" },
    topic: "Atlas v2 launch confidence",
    topicId: "topic_atlas_launch",
    mode: "voice",
    status: "completed",
    startedAt: hoursAgo(9),
    durationMs: min(5),
    factsAdded: 1,
    accuracy: 0.62,
    conflictsFound: 0,
    questionIds: ["q-4-atlas-low-conf"],
  },
  {
    id: "int_137",
    interviewee: { name: "Mira Okada", initials: "MO", role: "CEO", level: "VP" },
    topic: "Q4 pricing project sponsor confirmation",
    topicId: "topic_q4_sponsor",
    mode: "swipe",
    status: "completed",
    startedAt: hoursAgo(11),
    durationMs: min(3),
    factsAdded: 2,
    accuracy: 0.91,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_136",
    interviewee: { name: "Jane Doe", initials: "JD", role: "Support Lead", level: "M" },
    topic: "Extended leave approval flow",
    topicId: "topic_leave_policy",
    mode: "voice",
    status: "consolidated",
    startedAt: hoursAgo(20),
    durationMs: min(9),
    factsAdded: 5,
    accuracy: 0.96,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_135",
    interviewee: { name: "Daniel Park", initials: "DP", role: "Procurement Liaison", level: "IC" },
    topic: "Stale procurement contact",
    topicId: "topic_acme_old_contact",
    mode: "swipe",
    status: "completed",
    startedAt: hoursAgo(26),
    durationMs: min(2),
    factsAdded: 1,
    accuracy: 0.58,
    conflictsFound: 1,
    questionIds: ["q-1-acme-disamb"],
  },
  {
    id: "int_134",
    interviewee: { name: "Mei Tanaka", initials: "MT", role: "Procurement Lead", level: "M" },
    topic: "New Acme procurement contact",
    topicId: "topic_acme_new_contact",
    mode: "voice",
    status: "completed",
    startedAt: hoursAgo(30),
    durationMs: min(4),
    factsAdded: 2,
    accuracy: 0.93,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_133",
    interviewee: { name: "Tom Reilly", initials: "TR", role: "VP Engineering", level: "VP" },
    topic: "Atlas API rewrite timeline",
    topicId: "topic_atlas_api",
    mode: "swipe",
    status: "pending",
    startedAt: hoursAgo(34),
    durationMs: 0,
    factsAdded: 0,
    accuracy: 0,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_132",
    interviewee: { name: "Elena Ruiz", initials: "ER", role: "Director of Sales", level: "D" },
    topic: "EU pricing approval chain",
    topicId: "topic_eu_pricing",
    mode: "voice",
    status: "completed",
    startedAt: daysAgo(2),
    durationMs: min(11),
    factsAdded: 6,
    accuracy: 0.88,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_131",
    interviewee: { name: "Hiro Yamada", initials: "HY", role: "Solutions Architect", level: "IC" },
    topic: "Beacon contract terms",
    topicId: "topic_beacon_msa",
    mode: "swipe",
    status: "completed",
    startedAt: daysAgo(2),
    durationMs: min(3),
    factsAdded: 2,
    accuracy: 0.79,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_130",
    interviewee: { name: "Nina Patel", initials: "NP", role: "Director of Operations", level: "D" },
    topic: "Q4 SKU consolidation scope",
    topicId: "topic_q4_skus",
    mode: "voice",
    status: "consolidated",
    startedAt: daysAgo(3),
    durationMs: min(8),
    factsAdded: 4,
    accuracy: 0.95,
    conflictsFound: 0,
    questionIds: [],
  },
  {
    id: "int_129",
    interviewee: { name: "Owen Brooks", initials: "OB", role: "Junior Analyst", level: "IC" },
    topic: "Pricing competitor research",
    topicId: "topic_competitor_pricing",
    mode: "swipe",
    status: "completed",
    startedAt: daysAgo(4),
    durationMs: min(2),
    factsAdded: 1,
    accuracy: 0.66,
    conflictsFound: 0,
    questionIds: [],
  },
];

// ---------------- Admin · Conflicts queue ----------------

export type ConflictStatus = "open" | "escalated" | "resolved";
export type ConflictKind = "consensus" | "escalation" | "override";
export type RecommendedAction = "pick_canonical" | "escalate" | "override";

export interface ConflictRespondent {
  name: string;
  initials: string;
  role: string;
  level: IntervieweeLevel;
  answer: string;
  factId: string;
  interviewId: string;
  answeredAt: string;
  confidence: number;
}

export interface ConflictEscalationStep {
  name: string;
  level: IntervieweeLevel;
  status: "asked" | "pending" | "next";
}

export interface AdminConflict {
  id: string;
  entityId: string;
  entityName: string;
  predicate: string;
  factPairIds: [string, string];
  questionId?: string;
  status: ConflictStatus;
  kind: ConflictKind;
  recommendedAction: RecommendedAction;
  recommendedChoice?: string;
  recommendedReason: string;
  respondents: ConflictRespondent[];
  escalationChain: ConflictEscalationStep[];
  raisedAt: string;
  ageMs: number;
  affectedFactCount: number;
  affectedEntityIds: string[];
}

const hr = (n: number) => n * 3_600_000;

export const adminConflicts: AdminConflict[] = [
  {
    id: "conf_lara_title",
    entityId: "lara-voss",
    entityName: "Lara Voss",
    predicate: "title",
    factPairIds: ["f-lara-title-short", "f-lara-title-long"],
    questionId: "q-2-lara-conflict",
    status: "escalated",
    kind: "escalation",
    recommendedAction: "escalate",
    recommendedChoice: "Chief Growth Officer",
    recommendedReason:
      "Two ICs agree on the short form, but the canonical title needs Lara's own confirmation before downstream answers stabilize.",
    respondents: [
      {
        name: "Aditya Krishnan",
        initials: "AK",
        role: "Sales Engineer",
        level: "IC",
        answer: "CGO",
        factId: "f-lara-title-short",
        interviewId: "int_142",
        answeredAt: hoursAgo(6),
        confidence: 0.78,
      },
      {
        name: "Sarah Lin",
        initials: "SL",
        role: "Account Executive",
        level: "IC",
        answer: "CGO",
        factId: "f-lara-title-short",
        interviewId: "int_141",
        answeredAt: hoursAgo(4),
        confidence: 0.81,
      },
      {
        name: "Inazuma Org Chart",
        initials: "OC",
        role: "Source · org chart",
        level: "M",
        answer: "Chief Growth Officer",
        factId: "f-lara-title-long",
        interviewId: "int_140",
        answeredAt: hoursAgo(60),
        confidence: 0.86,
      },
    ],
    escalationChain: [
      { name: "Aditya K.", level: "IC", status: "asked" },
      { name: "Sarah L.", level: "IC", status: "asked" },
      { name: "Marcus B.", level: "M", status: "pending" },
      { name: "Lara V.", level: "VP", status: "next" },
    ],
    raisedAt: hoursAgo(5),
    ageMs: hr(5),
    affectedFactCount: 4,
    affectedEntityIds: ["lara-voss", "acme-corp"],
  },
  {
    id: "conf_acme_procurement",
    entityId: "acme-corp",
    entityName: "Acme Corp",
    predicate: "procurement contact",
    factPairIds: ["f-acme-procurement-old", "f-acme-procurement-new"],
    questionId: "q-1-acme-disamb",
    status: "open",
    kind: "consensus",
    recommendedAction: "pick_canonical",
    recommendedChoice: "Mei Tanaka",
    recommendedReason:
      "Newer source (4d vs 240d), higher-seniority respondent (M vs IC), and matches the inbound email signature on procurement@acme.com.",
    respondents: [
      {
        name: "Daniel Park",
        initials: "DP",
        role: "Procurement Liaison",
        level: "IC",
        answer: "Daniel Park",
        factId: "f-acme-procurement-old",
        interviewId: "int_135",
        answeredAt: hoursAgo(26),
        confidence: 0.55,
      },
      {
        name: "Mei Tanaka",
        initials: "MT",
        role: "Procurement Lead",
        level: "M",
        answer: "Mei Tanaka",
        factId: "f-acme-procurement-new",
        interviewId: "int_134",
        answeredAt: hoursAgo(30),
        confidence: 0.82,
      },
    ],
    escalationChain: [
      { name: "Daniel P.", level: "IC", status: "asked" },
      { name: "Mei T.", level: "M", status: "asked" },
    ],
    raisedAt: hoursAgo(28),
    ageMs: hr(28),
    affectedFactCount: 6,
    affectedEntityIds: ["acme-corp"],
  },
  {
    id: "conf_atlas_launch",
    entityId: "atlas-pricing-engine",
    entityName: "Atlas Pricing Engine",
    predicate: "launch quarter",
    factPairIds: ["f-atlas-launch", "f-atlas-launch"],
    questionId: "q-4-atlas-low-conf",
    status: "open",
    kind: "override",
    recommendedAction: "override",
    recommendedReason:
      "PM and VP Engineering disagree across functions. Manual override or a roadmap review session is required — no automatic winner.",
    respondents: [
      {
        name: "Priya Kumar",
        initials: "PK",
        role: "Product Manager",
        level: "M",
        answer: "Q2 2026 (tentative)",
        factId: "f-atlas-launch",
        interviewId: "int_138",
        answeredAt: hoursAgo(9),
        confidence: 0.64,
      },
      {
        name: "Tom Reilly",
        initials: "TR",
        role: "VP Engineering",
        level: "VP",
        answer: "Q3 2026",
        factId: "f-atlas-launch",
        interviewId: "int_133",
        answeredAt: hoursAgo(34),
        confidence: 0.71,
      },
    ],
    escalationChain: [
      { name: "Priya K.", level: "M", status: "asked" },
      { name: "Tom R.", level: "VP", status: "asked" },
      { name: "Admin", level: "D", status: "next" },
    ],
    raisedAt: hoursAgo(34),
    ageMs: hr(34),
    affectedFactCount: 2,
    affectedEntityIds: ["atlas-pricing-engine"],
  },
];
