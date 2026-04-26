import type { Question } from "./quiz-types";

// Plausible demo deck — a triage queue for an AI ops reviewer at a fictional
// SaaS company ("Northwind Cloud"). Mix of moderation, support routing,
// product, growth, and engineering decisions.
// Adapted from archive/project-z mock deck for extra demo coverage.
// Ids prefixed pz- to avoid collision with aiQuestions.
export const extraQuizDeck: Question[] = [
  {
    id: "pz-1",
    type: "yesno",
    question: "Is this email a refund request?",
    context:
      "From: alex.morrison@gmail.com · Subject: \"Need my money back asap\"\n\n\"Hey — I was charged $49 yesterday for the Pro plan but I cancelled last week. Please reverse the charge today, I'll dispute otherwise.\"",
    why: "Auto-routes to Billing if confirmed.",
    clarify:
      "A refund request explicitly asks to reverse a payment, return funds, or cancel a paid order. Threats of chargeback also count.",
    examples: [
      "\"Please refund my last order\"",
      "\"Cancel and return the money\"",
      "\"I'll dispute this with my bank\"",
    ],
    data: {
      sender: "alex.morrison@gmail.com",
      account_age_days: 412,
      ltv_usd: 588,
      charge_usd: 49,
      plan: "Pro (annual)",
      cancelled_at: "2025-04-19T14:22:00Z",
      sentiment: "frustrated",
      raw_email: {
        message_id: "<CAJ8x...@mail.gmail.com>",
        in_reply_to: null,
        attachments: [],
        body_excerpt: "Hey — I was charged $49 yesterday for the Pro plan but I cancelled last week.",
      },
    },
  },
  {
    id: "pz-2",
    type: "yesno",
    question: "Should we treat \"crypto trading bot\" as a restricted topic?",
    context:
      "Affects ad eligibility for ~12,400 seller pages. Current policy flags \"high-risk financial products\" but doesn't name crypto bots specifically.",
    why: "Decision propagates to ad review queue tonight.",
    clarify:
      "Restricted topics require human review before monetization. Financial advice and high-risk investment products typically qualify; tools that automate trades carry implied performance claims.",
    data: {
      affected_pages: 12400,
      policy_doc: {
        name: "AdPolicy_v4.2.pdf",
        url: "s3://policies/AdPolicy_v4.2.pdf",
        size_kb: 842,
        section: "§3.1 High-risk financial products",
      },
      precedents: [
        { topic: "forex signals", restricted: true, year: 2023 },
        { topic: "options alerts", restricted: true, year: 2024 },
        { topic: "stock screeners", restricted: false, year: 2024 },
      ],
      legal_review: { reviewer: "K. Onuoha", status: "pending", due: "2025-04-28" },
      monthly_ad_revenue_usd: 184200,
    },
  },
  {
    id: "pz-3",
    type: "choice",
    question: "Which team should own this ticket?",
    context:
      "User can't reset 2FA after losing their phone. They have an active Enterprise contract and recovery codes were never downloaded.",
    options: ["Support", "Trust & Safety", "Billing", "Engineering"],
    data: {
      ticket_id: "T-44120",
      priority: "P1",
      account: "Brightline Logistics",
      plan: "Enterprise (Annual)",
      mrr_usd: 18400,
      csm: "Lara P.",
      opened_at: "2025-04-25T08:14:00Z",
      tags: ["auth", "2fa", "lost-device"],
      recent_tickets: [
        { id: "T-43901", topic: "SSO setup", resolved: true },
        { id: "T-43770", topic: "API rate limit", resolved: true },
      ],
    },
  },
  {
    id: "pz-4",
    type: "yesno",
    question: "Is this product image on-brand?",
    context:
      "Uploaded by seller \"NorthLeaf Ceramics\" for the Home category.\nGuidelines: white background, product centered, no text overlay, min 1200×1200.",
    clarify:
      "Lifestyle shots with props are allowed in secondary slots only. Slot 1 must be a clean catalog shot.",
    data: {
      seller: "NorthLeaf Ceramics",
      seller_rating: 4.8,
      asset: {
        filename: "stoneware-bowl-slot1.jpg",
        url: "https://cdn.northwind.cloud/uploads/nl-ceramics/stoneware-bowl-slot1.jpg",
        dimensions: "1600x1600",
        size_kb: 412,
        bg_detected: "off-white #F2EDE6",
        text_overlay: false,
      },
      brand_guidelines_pdf: "BrandGuidelines_Home_v3.pdf",
      previous_rejections_30d: 1,
    },
  },
  {
    id: "pz-5",
    type: "yesno",
    question: "Does this review violate our content policy?",
    context:
      "5★ → 1★ edit · Verified buyer · Posted 14 min ago\n\n\"Worst seller ever, total scammer. Do NOT buy from this guy, he steals card info.\"",
    clarify:
      "Personal attacks and unverified accusations of fraud or criminal behavior violate policy. Strong negative opinions about quality, shipping, or service alone do not.",
    examples: [
      "Allowed: \"Item arrived broken, seller ignored my emails for a week.\"",
      "Violates: \"This person is a thief and should be in jail.\"",
    ],
    data: {
      review_id: "R-991204",
      reviewer: { handle: "buyer_2841", verified_purchase: true, total_reviews: 12 },
      seller: "GearVault",
      original_rating: 5,
      edited_rating: 1,
      edited_at: "2025-04-26T11:42:00Z",
      order_id: "A-77820",
      attached_screenshots: ["proof_chat_1.png", "proof_chat_2.png"],
      toxicity_score: 0.81,
    },
  },
  {
    id: "pz-6",
    type: "choice",
    question: "What is the primary intent of this search query?",
    context:
      "Query: \"best running shoes 2025\" · 41,200 monthly searches · current top result is a competitor blog.",
    options: ["Informational", "Commercial", "Navigational", "Transactional"],
    data: {
      query: "best running shoes 2025",
      monthly_searches: 41200,
      cpc_usd: 1.42,
      top_serp: [
        { rank: 1, domain: "runnersworld.com", type: "blog" },
        { rank: 2, domain: "nike.com", type: "brand" },
        { rank: 3, domain: "reddit.com/r/running", type: "forum" },
      ],
      related_queries: ["running shoes for flat feet", "nike pegasus 2025 review"],
      seasonality_index: 1.18,
    },
  },
  {
    id: "pz-7",
    type: "yesno",
    question: "Is this lead a fit for Enterprise outreach?",
    context:
      "Acme Treasury · Fintech · 540 employees · HQ Amsterdam\nSignup source: \"How does your SOC 2 program work?\" docs page.",
    why: "AE capacity is tight this week — only forward strong fits.",
    data: {
      company: "Acme Treasury",
      industry: "Fintech",
      employees: 540,
      hq: "Amsterdam, NL",
      signup_email: "priya.shah@acmetreasury.com",
      signup_title: "VP Engineering",
      enriched: {
        funding_stage: "Series C",
        last_round_usd: 62000000,
        tech_stack: ["AWS", "Kubernetes", "Datadog", "Snowflake"],
      },
      attached_docs: [
        { name: "SOC2_TypeII_Acme_2024.pdf", source: "uploaded by lead" },
        { name: "Security_Questionnaire.xlsx", source: "uploaded by lead" },
      ],
      intent_score: 0.78,
    },
  },
  {
    id: "pz-8",
    type: "yesno",
    question: "Is this transaction likely fraudulent?",
    context:
      "$2,418.00 · New device (Android, Lagos) · Card billing: Munich, DE · 4 declined attempts in last 6 min · Account age: 11 days",
    why: "Confirming will auto-block the card and notify the cardholder.",
    clarify:
      "Strong signals: country mismatch, rapid retries, brand-new account, high ticket size. Single signals alone are usually not enough.",
    data: {
      amount_usd: 2418,
      currency: "USD",
      device: "Android 14",
      device_ip: "102.89.43.21",
      device_country: "NG",
      billing_country: "DE",
      account_age_days: 11,
      declined_attempts_6min: 4,
      risk_score: 0.87,
      mcc: 5732,
      merchant: "BlueOak Electronics",
      device_fingerprint: {
        screen: "412x915",
        timezone: "Africa/Lagos",
        language: "en-US",
        webgl_hash: "a7f3...92c1",
      },
    },
  },
  {
    id: "pz-9",
    type: "choice",
    question: "What's the tone of this customer message?",
    context:
      "From a Pro customer in #feedback:\n\"Hey team, just wanted to say the new dashboard rocks 🚀 — load time feels instant. Only nit: the export button moved and I keep clicking the wrong thing.\"",
    options: ["Positive", "Neutral", "Negative", "Mixed"],
    data: {
      channel: "#feedback",
      author: "marc.r",
      plan: "Pro",
      tenure_months: 14,
      sentiment_score: 0.62,
      emoji_count: 1,
      thread_replies: 3,
    },
  },
  {
    id: "pz-10",
    type: "yesno",
    question: "Localize this campaign copy into Japanese?",
    context:
      "Campaign: \"Ship faster. Think less.\" · Target: Tokyo product launch, Q3 · Estimated cost: ¥180k via current vendor.",
    why: "JP market test — only 8% of current MAU but growing 22% MoM.",
    data: {
      campaign_id: "CMP-2025-Q3-JP",
      vendor: "Linguify K.K.",
      cost_jpy: 180000,
      assets: [
        { name: "hero_copy.docx", words: 412 },
        { name: "email_sequence.pdf", pages: 6 },
        { name: "ad_variants.csv", rows: 24 },
      ],
      jp_mau_share: 0.08,
      jp_growth_mom: 0.22,
    },
  },
  {
    id: "pz-11",
    type: "yesno",
    question: "Is the headline clear without reading the subtitle?",
    context:
      "Hero variant B for the pricing page:\nH1: \"Ship faster. Think less.\"\nSubtitle: \"Northwind Cloud handles infra so your team ships product, not YAML.\"",
    data: {
      page: "/pricing",
      variant: "B",
      mockup: "figma://file/HJ12kx/Pricing?node-id=22%3A410",
      screenshot: "https://cdn.northwind.cloud/qa/pricing-B-1440.png",
      readability_grade: 6.2,
    },
  },
  {
    id: "pz-12",
    type: "choice",
    question: "What severity should this bug get?",
    context:
      "Login button unresponsive on iOS Safari 17.4. Repro 4/5. Workaround: refresh page. Affects ~6% of mobile sessions over the last 24h.",
    options: ["Critical", "High", "Medium", "Low"],
    data: {
      bug_id: "BUG-8821",
      platform: "iOS Safari 17.4",
      repro_rate: "4/5",
      affected_sessions_24h: 0.06,
      first_seen: "2025-04-25T22:11:00Z",
      attached_logs: ["sentry_event_4f2a.json", "session_replay_8821.rrweb"],
      stack_excerpt: "TypeError: Cannot read properties of undefined (reading 'click') at LoginButton.tsx:42",
    },
  },
  {
    id: "pz-13",
    type: "yesno",
    question: "Should the AI assistant auto-reply to this thread?",
    context:
      "Customer: \"Hey, when will order #A-44120 arrive?\"\nOrder is in transit, ETA Friday, tracking link available. No prior complaints.",
    clarify:
      "Auto-reply is appropriate for clearly factual, low-risk questions where we have authoritative data. Avoid auto-reply on emotional, billing, or policy threads.",
    data: {
      order_id: "A-44120",
      status: "in_transit",
      carrier: "DHL",
      tracking_url: "https://dhl.com/track/2X44120",
      eta: "2025-05-02",
      customer_csat_avg: 4.6,
      prior_complaints: 0,
      ai_confidence: 0.94,
    },
  },
  {
    id: "pz-14",
    type: "yesno",
    question: "Is this a duplicate of an existing feature request?",
    context:
      "New: \"Add dark mode to the mobile app\" · 3 upvotes\nExisting: FR-218 \"Dark theme on iOS/Android\" · 412 upvotes · status: planned Q3.",
    data: {
      new_request_id: "FR-901",
      existing_request_id: "FR-218",
      similarity_score: 0.96,
      embedding_distance: 0.04,
      keywords_overlap: ["dark", "mode", "theme", "mobile"],
    },
  },
  {
    id: "pz-15",
    type: "text",
    question: "Suggest a canonical category name.",
    context:
      "Items being grouped: yoga mat, resistance bands, foam roller, jump rope, ankle weights.\nCurrent guess: \"Fitness Accessories\".",
    data: {
      sample_skus: ["YM-441", "RB-203", "FR-118", "JR-009", "AW-552"],
      sibling_categories: ["Yoga", "Strength", "Cardio"],
      avg_price_usd: 24.5,
      monthly_units: 8420,
    },
  },
  {
    id: "pz-16",
    type: "yesno",
    question: "Does this contract clause need legal review?",
    context:
      "Vendor MSA, §7.2: \"Either party may terminate this Agreement for convenience upon seven (7) days' written notice. Prepaid fees are non-refundable.\"",
    why: "Standard SLA is 30-day notice with pro-rated refund.",
    data: {
      vendor: "Skylight Analytics",
      contract: {
        name: "MSA_Skylight_v3.pdf",
        url: "gdrive://1aB2cD/MSA_Skylight_v3.pdf",
        pages: 28,
        clause: "§7.2 Termination",
      },
      annual_value_usd: 84000,
      diff_vs_template: ["notice_period: 30d → 7d", "refund: pro-rated → none"],
      reviewer_suggested: "legal@northwind.cloud",
    },
  },
  {
    id: "pz-17",
    type: "choice",
    question: "Best channel for this announcement?",
    context:
      "New \"Team\" pricing tier launches Monday at $29/seat. Replaces Pro for orgs >5 seats. ~3,800 customers affected.",
    options: ["Email", "In-app", "Blog post", "All channels"],
    data: {
      affected_customers: 3800,
      avg_open_rate_email: 0.41,
      in_app_dau_reach: 0.78,
      assets_ready: ["launch_post.md", "email_template.html", "in_app_banner.png"],
      launch_date: "2025-05-05",
    },
  },
  {
    id: "pz-18",
    type: "yesno",
    question: "Is this account at risk of churning?",
    context:
      "Northwind Pro · 14 seats · DAU dropped from 11 → 3 over 30 days. Last call transcript: \"We're evaluating Linear and budget is tight after Q2.\"",
    why: "Triggers a CSM intervention if confirmed.",
    data: {
      account: "Helix Robotics",
      mrr_usd: 1218,
      seats: 14,
      dau_30d_ago: 11,
      dau_today: 3,
      health_score: 32,
      last_call: {
        date: "2025-04-22",
        recording: "gong://call/9912/replay",
        transcript_file: "helix_qbr_apr22.txt",
        keywords: ["evaluating Linear", "budget", "Q2"],
      },
      open_tickets: 2,
    },
  },
  {
    id: "pz-19",
    type: "yesno",
    question: "Tag this image as containing a person?",
    context:
      "Submitted to stock library. Wide shot of beach at sunset; a silhouette is visible on the right third, no facial features identifiable.",
    clarify:
      "Tag \"person\" if a human form is recognizable, even as a silhouette. Releases are only required for identifiable faces.",
    data: {
      asset_id: "IMG-44091",
      filename: "sunset_beach_wide_44091.jpg",
      url: "s3://stock-library/incoming/sunset_beach_wide_44091.jpg",
      dimensions: "5472x3648",
      vision_model_tags: { person: 0.71, beach: 0.99, sunset: 0.97 },
      face_detected: false,
      release_on_file: false,
    },
  },
  {
    id: "pz-20",
    type: "yesno",
    question: "Should we A/B test the new onboarding flow?",
    context:
      "Current funnel: 12% drop-off at step 3 (\"connect your repo\"). New flow defers repo connection until after first dashboard view.",
    why: "Test would run 2 weeks at 50/50 on new signups (~6k users).",
    data: {
      experiment_id: "EXP-onb-2025-04",
      control: "current_flow",
      variant: "deferred_repo",
      traffic_split: "50/50",
      duration_days: 14,
      sample_size: 6000,
      mde: 0.03,
      design_doc: "onboarding_v2_design.pdf",
    },
  },
  {
    id: "pz-21",
    type: "choice",
    question: "Which persona does this signup match?",
    context:
      "Email: jess@maker.dev · Title: \"Indie hacker\" · Company size: 1 · Source: ProductHunt · Plan interest: Free.",
    options: ["Solo / Indie", "Startup", "SMB", "Enterprise"],
    data: {
      email_domain: "maker.dev",
      domain_type: "personal_pro",
      utm_source: "producthunt",
      utm_campaign: "launch-day",
      github_followers: 1240,
      enriched_company: null,
    },
  },
  {
    id: "pz-22",
    type: "yesno",
    question: "Approve auto-merge for this dependency PR?",
    context:
      "dependabot/lodash 4.17.20 → 4.17.21 · CHANGELOG: prototype-pollution patch · CI: 412/412 green · 0 type errors · No app code changes.",
    data: {
      pr_number: 8821,
      author: "dependabot[bot]",
      package: "lodash",
      from: "4.17.20",
      to: "4.17.21",
      cve: "CVE-2020-8203",
      severity: "high",
      ci: { passed: 412, failed: 0, duration_s: 184 },
      diff_url: "https://github.com/northwind/app/pull/8821.diff",
      changelog_excerpt: "Fix prototype pollution in zipObjectDeep.",
    },
  },
  {
    id: "pz-23",
    type: "yesno",
    question: "Is this feedback actionable this quarter?",
    context:
      "From Pro user (8 mo tenure): \"I wish the calendar view showed ISO week numbers — I plan sprints around them.\" · 7 similar requests this month.",
    why: "Calendar refactor is already on the Q3 roadmap.",
    data: {
      feedback_id: "FB-3320",
      similar_count_30d: 7,
      roadmap_item: { id: "RM-Q3-Calendar", status: "scheduled", quarter: "Q3" },
      effort_estimate_days: 1.5,
      requesters_arr_usd: 41200,
    },
  },
  {
    id: "pz-24",
    type: "yesno",
    question: "Does this support reply need a human follow-up?",
    context:
      "AI agent replied to a billing dispute (\"I was double-charged in March\") with a generic FAQ link about subscription management. Customer hasn't responded in 6h.",
    data: {
      ticket_id: "T-44211",
      ai_reply_confidence: 0.41,
      topic: "billing_dispute",
      customer_sentiment: "frustrated",
      hours_since_reply: 6,
      transcript_file: "T-44211_transcript.txt",
      attached_invoice: "INV-2025-03-Helix.pdf",
      duplicate_charge_detected: true,
    },
  },
  {
    id: "pz-25",
    type: "choice",
    question: "Which tag fits this article best?",
    context:
      "Engineering blog draft · Title: \"Scaling Postgres past 100M rows without rewriting your app\" · 2,400 words · code samples in Go.",
    options: ["Database", "Performance", "Backend", "Tutorial"],
    data: {
      doc: "blog_postgres_100m.md",
      author: "tomas.l",
      word_count: 2400,
      code_blocks: 14,
      languages: ["go", "sql"],
      reading_time_min: 11,
      similar_published: ["scaling-redis", "denormalize-or-die"],
    },
  },
  {
    id: "pz-26",
    type: "yesno",
    question: "Reject this proof-of-purchase screenshot?",
    context:
      "User-submitted, attached to a warranty claim. Image is 480×640, heavily compressed, order ID partially unreadable, date is legible.",
    clarify:
      "Reject only if essential fields (order ID, date, item) cannot be reasonably verified, even at full zoom.",
    data: {
      claim_id: "WC-7720",
      attachment: {
        filename: "receipt_blurry.jpg",
        url: "s3://claims/WC-7720/receipt_blurry.jpg",
        dimensions: "480x640",
        size_kb: 78,
      },
      ocr_result: {
        order_id: "A-77??0",
        date: "2025-01-14",
        item: "(unreadable)",
        confidence: 0.52,
      },
      claim_amount_usd: 189,
    },
  },
  {
    id: "pz-27",
    type: "yesno",
    question: "Is \"Start free trial\" the right CTA for this audience?",
    context:
      "Landing page: northwind.cloud/enterprise · Audience: enterprise procurement · Avg deal cycle: 47 days · Current CTA converts at 0.8%.",
    data: {
      page: "/enterprise",
      visitors_30d: 12400,
      cta_clicks_30d: 99,
      conversion_rate: 0.008,
      avg_deal_cycle_days: 47,
      heatmap: "https://cdn.northwind.cloud/qa/enterprise-heatmap.png",
      alt_ctas_tested: ["Talk to sales", "Book a demo", "Get a quote"],
    },
  },
  {
    id: "pz-28",
    type: "text",
    question: "Write a one-line summary for this report.",
    context:
      "Q1 board update: revenue up 18% QoQ to $4.2M ARR · gross churn down to 2.1% · headcount flat · NPS +6 points.",
    data: {
      report: {
        name: "Q1_2025_Board_Update.pdf",
        url: "gdrive://0z9/Q1_2025_Board_Update.pdf",
        pages: 22,
      },
      kpis: {
        arr_usd: 4200000,
        arr_growth_qoq: 0.18,
        gross_churn: 0.021,
        nps_delta: 6,
        headcount: 84,
      },
      audience: "board",
    },
  },
  {
    id: "pz-29",
    type: "yesno",
    question: "Does this username violate naming policy?",
    context:
      "Newly registered handle: \"admin_official_2025\" · Account age: 3 min · No avatar, no posts yet.",
    clarify:
      "Impersonation of staff, system roles, or official accounts is prohibited — including suffixes like _official, _team, _admin, _support.",
    data: {
      handle: "admin_official_2025",
      account_id: "U-991204",
      age_minutes: 3,
      signup_ip: "45.88.12.4",
      ip_country: "RU",
      reserved_terms_hit: ["admin", "official"],
      similar_handles: ["admin_official_2024", "support_official"],
    },
  },
  {
    id: "pz-30",
    type: "yesno",
    question: "Ship this hotfix to production now?",
    context:
      "Patch fixes a login crash on Android 14. 1 file changed, +6/-3 lines. Tests pass. On-call eng available. Affects ~3% of active users today.",
    why: "Outside the normal Tue/Thu deploy window.",
    data: {
      pr_number: 8830,
      author: "sara.k",
      diff: { files: 1, additions: 6, deletions: 3 },
      ci: { passed: 412, failed: 0 },
      affected_users_pct: 0.03,
      on_call: "ravi.m",
      rollback_plan: "rollback.sh → previous SHA a7f3c91",
      runbook: "runbooks/hotfix_android_login.md",
    },
  },
];
