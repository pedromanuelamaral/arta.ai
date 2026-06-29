# ÆRTA AI

## Overview

ÆRTA AI, pronounced simply as Arta AI, is a private artificial intelligence cultural desk for cinema and literature. It is not a generic recommendation engine. It is closer to a personal editorial room: a system that learns what you have seen, what stayed with you, what failed, what wounded you, what bored you, and why.

The project began from a personal desire to encounter more art that is meaningful rather than merely popular. People are moved by different forms of cinema and literature. ÆRTA tries to close the gap between taste and discovery by giving the user a set of cultural research agents that can reason across memory, works, archives, and emotional context.

For the hackathon, the key claim is simple: Gemma 4 is not used as a chatbot attached to a taste profile. It is used as the main reasoning engine inside a multi-agent cultural research system.

## Operating constraints

1. Gemma 4 31B on Cerebras is the primary intelligence layer for the hackathon.
2. The system should remain model-agnostic after the hackathon. Gemma is the main brain now, but the architecture should not hard-code itself to one provider.
3. Token use matters. Gemma should handle judgment, synthesis, multimodal interpretation, and final reasoning. Small local or open-source models can handle cheap tasks such as embedding, clustering, deduplication, and rough classification.
4. The project should use free APIs, local tools, MCP servers, or services with generous free tiers.
5. **Cloud-First, Local-Sync**: Raw personal data is stored in user-controlled cloud folders (Drive/iCloud). The system monitors these folders, normalizes the data locally, and provides compressed taste signals to the AI.
6. The academic retrieval idea belongs in the core product, but as a retrieval and context pipeline, not as fine-tuning or model architecture modification.

## What this is

ÆRTA is a multi-agent cultural companion that helps a person discover, interpret, and remember works of art. The system has five jobs:

1. Build a private taste memory from the user's cultural traces (Cinema & Literature).
2. Search across films, books, and articles.
3. Retrieve supporting academic or textual evidence when a deeper answer is needed.
4. Produce recommendations and analysis that are specific to the user, not to public popularity.
5. Record reactions so the system becomes sharper over time.

The product is built around the idea that taste is not a list of liked items. Taste is a pattern of attention. ÆRTA tries to infer that pattern from viewing history, reading history, saved works, reactions, notes, and explicit feedback.

## Project Summary
This repo contains the ÆRTA AI project workspace scaffold for the Gemma 4 hackathon.

Top-level folders:

- `mcp_server` — Python MCP server and tool definitions
- `brain` — orchestration, curator/critic logic
- `surface` — frontend HTML/JS/CSS
- `data` — local data store; `data/sqlite` for SQLite files
- `research` — research notes and references
- `logs` — runtime and debug logs
- `docs` — project docs and doctrine (already present)

Next steps: implement `mcp_server` tools and SQLite schema.

## Why this is different

Most recommendation systems optimize for engagement, similarity, or crowd behavior. ÆRTA optimizes for a more private question: what should this specific person encounter next if the goal is aesthetic growth, not consumption?

That changes the design.

- **Resonance over Similarity**: It does not ask only "what is similar?" It looks for "Thematic Wounds" (e.g., *the excavation of a family secret that destroys the present*).
- **Intersections over Nodes**: It does not reduce taste to a graph of metadata. It identifies the specific coordinate where disparate works (a film and a poem) vibrate at the same emotional frequency.
- **Tidal vs. Core**: It distinguishes between the **Core** (permanent aesthetic axioms and lifelong values) and the **Tide** (transient moods or current "inklings").
- **The Editor's Move**: It avoids "thematic locking" (echo chambers). Instead of just matching a mood, it decides whether to provide an **Echo** (validation) or a **Counterpoint** (using the Core to stretch the user's attention).

It does not ask what kind of form, wound, rhythm, ambiguity, moral pressure, image, or voice tends to move the user.
It does not treat cinema and literature as separate silos.
It builds cross-modal constellations: a film can lead to a book, a book can lead to a film, and all of them can be tied back to a personal memory.

For the hackathon, this is a good fit for the Multiverse Agents track because the product is naturally multi-agent and multimodal. The system needs separate agents with different roles: memory, curation, retrieval, critique, multimodal interpretation, and final editorial synthesis.

## Core product experience

The first working version should support four flows.

### 1. Daily cultural briefing

The user opens ÆRTA and receives a small, curated set of works:

- one film
- one literary passage or book recommendation

The briefing is organized around a precise theme, not a broad mood label. A weak theme is "melancholy." A stronger theme is "people who keep functioning after an inner collapse." The output should feel like it came from an editor who understands the user's taste and wants to stretch it.

### 2. Work analysis

The user gives ÆRTA a film or book. Gemma analyzes it through the user's taste profile and, if useful, retrieves external context. The answer should avoid plot summary and generic thematic description. It should produce a thesis: what gives the work its force, what wound it circles, what formal choices matter, and why the user may or may not connect with it.

### 3. Cross-modal bridge

The user enters one work and asks for a constellation around it. ÆRTA returns related works from other media, chosen by emotional logic or philosophical structure rather than topic matching.

Example:

```text
Input: Oslo, August 31st
Output:
- book: a literary work around exhaustion, lucidity, and failed return
- film: a movie with the same suspended inward pressure
```

### 4. Academic retrieval mode

When the user asks for deeper research, ÆRTA uses a retrieval workflow. The model should not pretend to know a book, chapter, essay, or source in detail if the evidence is not in context. It should fetch, extract, chunk, rank, compress, and inject the relevant material before answering.

This is where the academic retrieval skill and backend MCP matter.

```text
Agent: Gemma 4 31B
    ↓
Skill / workflow hook: Academic Retrieval Skill
    ↓
Academic retrieval MCP or local tool
    ↓
Fetch text from an allowed source or user-provided file
    ↓
Extract with PyMuPDF / OCR when needed
    ↓
Chunk with structure-aware splitting
    ↓
Embed with a small open-source embedding model
    ↓
Rank and rerank passages
    ↓
Compress top evidence into a compact context packet
    ↓
Gemma reasons over the retrieved material
```

The important point is architectural: the knowledge is not stored in the model's weights. It is brought into the context when needed.

## Academic Retrieval Skill

```markdown
# Academic Retrieval Skill

Use this skill when the user asks about a book, article, chapter, author, theory, movement, or cultural-historical source where exact textual evidence matters.

Workflow:

1. Interpret the research question.
2. Query available sources:
   - local user library
   - user-provided PDFs / EPUBs
   - public-domain archives
   - configured academic retrieval tools
   - optional LibGen / Anna's Archive connector where legally and personally permitted
3. Select the best candidate source.
4. Extract text with PyMuPDF, EPUB tooling, OCR, or plain text parsing.
5. Split into chunks using chapter headings, page boundaries, and semantic breaks.
6. Embed chunks with a small local embedding model.
7. Rank chunks by relevance to the question.
8. Rerank or filter the top passages.
9. Compress the best evidence into a short context packet.
10. Give Gemma 4 the packet and ask it to answer with citations to retrieved passages.

Rules:

- Do not answer from memory when retrieval is required.
- Do not inject an entire book into context.
- Preserve page numbers, chapter names, or section names when available.
- Separate retrieved evidence from model interpretation.
- If the source cannot be found or extracted, say so.
```

This skill matters because retrieval quality beats fine-tuning for this use case. A LoRA can teach a model a habit. It cannot efficiently make the model contain a private library. ÆRTA should spend its engineering effort on evidence selection, ranking, compression, and context formatting.

## Agent architecture

ÆRTA is made of small agents with clear roles. Gemma 4 is the main reasoning model that coordinates or performs the high-value steps.

### 1. Taste Memory Agent

Builds and updates the user's private taste model.

Inputs:

- Letterboxd exports
- books read or saved
- Kindle / Apple Books notes where available
- Spotify / Apple Music history where available
- YouTube likes or watch history where available
- articles read or saved
- TV Time / Trakt / other media histories
- manual notes and reactions

Outputs:

- taste axioms
- liked and disliked patterns
- recurring themes
- avoided tropes
- favorite formal qualities
- canon shelves
- blind spots
- recent mood and attention patterns

This agent should not send raw exports to Gemma. It should produce compact local summaries that Gemma can reason over.

### 2. Curation Agent

Chooses candidate works. It uses the taste profile, unseen lists, available metadata, and the current request. It should prefer precise and non-obvious picks over popularity.

The curation agent should know the difference between:

- safe recommendations
- adjacent recommendations
- corrective recommendations
- difficult recommendations
- works likely to matter later, even if they do not satisfy immediately

### 3. Cultural Graph Agent

Builds links between works, artists, periods, movements, national cinemas, poetic traditions, composers, painters, and critical ideas. This is not a social graph. It is a graph of aesthetic relation.

Example relation types:

- shared wound
- shared formal strategy
- historical influence
- thematic inversion
- same moral pressure
- adjacent national cinema
- same relation to silence, time, family, exile, grief, faith, alienation, or political violence

### 4. Retrieval Agent

Finds and prepares evidence. It uses MCP tools, local files, public sources, and configured academic search tools. It should produce compact evidence packets for Gemma instead of dumping raw text.

### 5. Multimodal Interpretation Agent

Uses Gemma 4 image input when the user supplies a still, poster, painting, screenshot, book cover, or visual artwork. It describes visible details, then interprets them against cultural context and user taste.

This is useful for:

- film still analysis
- poster and cover analysis
- visual art interpretation
- moodboard-to-recommendation workflows
- comparing images to films, poems, or music

### 6. Editorial Synthesis Agent

Writes the final answer. It receives structured outputs from the other agents and turns them into a coherent recommendation, briefing, analysis, or research answer.

This is where Gemma should spend most of its reasoning budget.

## System diagram

```text
                              ┌──────────────────────────┐
                              │      User request         │
                              │ text / image / work / mood│
                              └────────────┬─────────────┘
                                           │
                                           ▼
┌──────────────────┐          ┌──────────────────────────┐
│ Local taste data  │─────────▶│  Taste Memory Agent      │
│ exports + notes   │          │  compact taste signals   │
└──────────────────┘          └────────────┬─────────────┘
                                           │
                                           ▼
┌──────────────────┐          ┌──────────────────────────┐
│ Local / web / MCP │─────────▶│  Retrieval Agent         │
│ text sources      │          │  evidence packets        │
└──────────────────┘          └────────────┬─────────────┘
                                           │
                                           ▼
┌──────────────────┐          ┌──────────────────────────┐
│ Images / posters  │─────────▶│  Multimodal Agent        │
│ stills / covers   │          │  visual interpretation   │
└──────────────────┘          └────────────┬─────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────┐
                              │  Gemma 4 Editorial Core  │
                              │  curation + reasoning    │
                              └────────────┬─────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────┐
                              │  UI / briefing / answer  │
                              │  reaction logged locally │
                              └──────────────────────────┘
```

## Data model

For the hackathon, the local database can stay simple.

```sql
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  medium TEXT NOT NULL,            -- film, book, poem, music, image, article
  title TEXT NOT NULL,
  creator TEXT,
  year INTEGER,
  source_id TEXT,
  source_url TEXT,
  status TEXT,                     -- seen, saved, loved, disliked, abandoned, unknown
  rating REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id TEXT NOT NULL,
  reaction_type TEXT,              -- liked, disliked, moved, bored, confused, admired
  intensity INTEGER,               -- 1-5
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (work_id) REFERENCES works(id)
);

CREATE TABLE taste_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  signal_type TEXT NOT NULL,       -- axiom, pattern, anti_pattern, theme, formal_quality
  value TEXT NOT NULL,
  confidence REAL DEFAULT 0.5,
  evidence TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE retrieval_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_title TEXT,
  source_author TEXT,
  source_path TEXT,
  chunk_text TEXT NOT NULL,
  page_start INTEGER,
  page_end INTEGER,
  embedding_model TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

The database is not the product. It is the memory substrate. The product is the behavior produced by Gemma when this memory is compressed into useful context.

## Taste signal format

Gemma should receive compact context like this:

```json
{
  "user_profile": {
    "cinema_seen_count": 340,
    "strong_affinities": [
      "existential cinema with moral pressure",
      "family rupture without sentimentality",
      "political history treated through human consequence",
      "formal restraint over explanation"
    ],
    "cinema_anchors": [
      "Joachim Trier",
      "Thomas Vinterberg",
      "Denis Villeneuve",
      "Andrei Tarkovsky"
    ],
    "literary_anchors": [
      "Fernando Pessoa",
      "poetry of inward fracture",
      "essayistic criticism with philosophical density"
    ],
    "anti_patterns": [
      "generic prestige recommendations",
      "political instrumentalization",
      "difficulty used as decoration",
      "recommendations based only on genre"
    ],
    "current_search_mode": "meaningful discovery, not comfort"
  }
}
```

This is the central privacy move. The model does not need the user's entire history. It needs the right abstraction of that history.

## MCP layer

The backend MCP should expose tools that let Gemma retrieve only what it needs.

Suggested tools:

```text
get_taste_signals()
query_seen_works(medium, filters)
query_unseen_candidates(medium, constraints)
log_reaction(work_id, reaction_type, intensity, note)
search_cultural_graph(query)
retrieve_academic_context(query, source_hint)
extract_text_from_file(path)
rank_chunks(query, chunk_ids)
compress_context(chunks, budget_tokens)
```

The MCP server is not the intelligence layer. It is the tool layer. Gemma remains the reasoning engine.

## Prompt contracts

### Daily briefing prompt

```text
You are the editorial core of ÆRTA, a private cultural desk for one person.

Your task is to propose a daily cultural briefing.

Taste signals:
{taste_signals_json}

Already known works:
{seen_or_rejected_work_ids}

Available candidates:
{candidate_context}

Return:
1. A precise theme in one sentence.
2. One film.
3. One poem or literary passage.
4. One music piece.
5. Optional visual reference if available.
6. A short explanation of why these works belong together.

Rules:
- Do not recommend works already seen or rejected.
- Do not choose by popularity alone.
- Do not use genre as the main explanation.
- Prefer specific emotional, formal, or philosophical relation.
- Write like a private editor, not a marketing system.
```

### Deep analysis prompt

```text
Analyze the work below for a user who values existential and formal depth over summary.

Work:
{work_metadata}

Taste axioms:
{taste_axioms}

Retrieved evidence, if any:
{evidence_packet}

Return:
1. Thesis: one claim about what gives the work its force.
2. The human wound at the center.
3. How form shapes meaning.
4. What the work refuses to resolve.
5. Why this user may connect with it or resist it.
6. One final distilled insight.

Avoid plot summary unless necessary.
Separate evidence from interpretation.
```

### Cross-modal bridge prompt

```text
Given this work, build a cross-modal constellation around it.

Work:
{work_metadata}

Taste signals:
{taste_signals_json}

Already known works:
{seen_or_rejected_work_ids}

Return:
- one related film, if the input is not a film
- one poem or literary passage
- one music piece
- one visual reference, if useful
- the shared axis connecting them

The relation must be aesthetic, emotional, formal, or philosophical.
Do not rely on surface topic matching.
```

### Academic retrieval prompt

```text
You are answering with retrieved textual evidence.

Question:
{question}

Evidence packet:
{compressed_retrieved_context}

Instructions:
- Answer only using the retrieved evidence plus clearly marked interpretation.
- Cite page, chapter, or section markers when available.
- If the evidence is insufficient, say what is missing.
- Do not invent quotations, page numbers, or source claims.
```

## Hackathon MVP

The 24-hour version should be narrow enough to finish.

### Must build

- Local web UI with four tabs:
  - Daily
  - Analyze
  - Bridge
  - Research
- Cerebras Gemma 4 API integration.
- A small local taste profile JSON.
- A simple orchestrator that routes each request to the right workflow.
- Basic MCP or tool-like backend functions for:
  - taste signals
  - seen works
  - reaction logging
  - academic retrieval from local files or configured sources
- Image input demo for one poster, still, cover, or artwork.
- One polished demo flow that judges can understand in under three minutes.

### Should build if time permits

- SQLite persistence.
- Letterboxd CSV/XML ingestion.
- Embedding-based retrieval over one or two local PDFs.
- Cultural graph view.
- Reaction feedback loop.

### Do not build in the hackathon

- Full ingestion for every platform.
- Full LibGen/Anna's Archive automation.
- Fine-tuning.
- Complex account systems.
- Payment, deployment, or mobile app packaging.
- Large-scale scraping.

## Demo flow

The demo should show one coherent story.

1. The user opens ÆRTA.
2. The system loads a compact private taste profile.
3. The user asks for a daily cultural briefing.
4. Gemma produces a film, poem, music piece, and optional image reference around a precise theme.
5. The user selects one recommendation and asks why it fits.
6. The system uses the taste profile and cultural graph to explain the match.
7. The user uploads a poster, still, cover, or artwork.
8. Gemma reads the image and connects it to the user's taste.
9. The user asks a deeper research question.
10. The retrieval workflow extracts and compresses textual evidence.
11. Gemma answers with cited evidence and interpretation.
12. The user logs a reaction, and ÆRTA updates the taste memory.

This proves the system is not a static recommender. It is a loop: memory, retrieval, reasoning, response, reaction, memory.

## Evaluation criteria

For the hackathon, ÆRTA should be evaluated on four things.

### 1. Personal specificity

Does the answer feel tuned to a particular person, or could it be shown to anyone?

### 2. Cross-modal intelligence

Can the system connect film, literature, poetry, music, and image by deeper relation rather than surface topic?

### 3. Retrieval discipline

Does the system fetch and compress evidence before making source-specific claims?

### 4. Editorial quality

Does the final response feel like cultural judgment, or like a list generated from metadata?

## Technical stack

| Layer | Tool | Purpose |
|---|---|---|
| Main model | Gemma 4 31B on Cerebras | reasoning, synthesis, multimodal interpretation |
| Orchestration | Python or TypeScript | route requests through agent workflows |
| Data store | SQLite / JSON for MVP | local memory and reaction log |
| Retrieval | PyMuPDF, EPUB parser, OCR if needed | text extraction |
| Embeddings | small open-source embedding model | chunk ranking |
| MCP/tool layer | local MCP server or direct tool functions | expose memory and retrieval |
| UI | local web app | hackathon demo surface |

## Privacy boundary

Raw user data should stay local:

- full Letterboxd exports
- full watch history
- private journal entries
- reading notes
- music history
- credentials
- local files

Gemma should receive:

- compact taste signals
- explicit user request
- candidate metadata
- compressed evidence packets
- image inputs only when the user intentionally provides them

This keeps the cloud model useful without turning it into the database.

## Product direction after the hackathon

The post-hackathon version should grow in layers:

1. Better ingestion from Letterboxd, Spotify, Apple Music, Kindle, Apple Books, YouTube, TV Time, Trakt, Google Arts & Culture, and saved articles.
2. Stronger cultural graph construction.
3. Better academic retrieval with citations and passage inspection.
4. Personal canon shelves that evolve over time.
5. A local-first memory engine that can be used with different models.
6. A portable `arta-context.md` export that can be pasted into any trusted model.
7. Optional local model fallback for private or offline use.

## What this is not

- It is not a generic recommendation app.
- It is not a chatbot with a prettier prompt.
- It is not a system that stores culture inside fine-tuned weights.
- It is not a scraper-first project.
- It is not a public social network.
- It is not a replacement for human criticism.

ÆRTA is a private cultural desk: memory plus retrieval plus judgment.

## Build priority for the next 24 hours

If time gets tight, cut scope in this order:

1. Keep the Gemma 4 orchestration.
2. Keep the taste profile.
3. Keep the daily briefing.
4. Keep one multimodal image demo.
5. Keep one academic retrieval demo over a local PDF or extracted text.
6. Drop broad ingestion.
7. Drop full MCP polish if direct backend tools are faster.
8. Drop visual graph features.

The winning demo does not need every connector. It needs one convincing loop that shows why a multi-agent cultural companion is different from a normal recommendation system.

