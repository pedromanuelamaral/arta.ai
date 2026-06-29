# ÆRTA AI: MCP Handoff Context (Compact)

**Project**: ÆRTA AI - Multi-Agent Cultural Companion
**Core Engine**: Gemma 4 31B (Cerebras)
**Current Milestone**: MCP Specification Finalized $\rightarrow$ Implementation Phase

## 1. System Architecture

- **Brain**: Gemma 4 (Reasoning/Synthesis).
- **Tooling Layer**: Model Context Protocol (MCP) server.
- **Local Substrate**: SQLite (`arta.db`), Local Files (PDF/EPUB), External APIs (Open Library, TVMaze).
- **Agent Roles**:
  - **Taste Memory**: Manages user taste profiles/signals.
  - **Retrieval**: Local/External data fetching.
  - **Curation**: Candidate discovery & taste filtering.
  - **Multimodal**: Cross-modal extraction.
  - **Editorial Synthesis**: Final output formatting.

## 2. MCP Specification Status (`/docs/mcp_specification.md`)

- **Status**: $\checkmark$ Completed & Lint-Clean.
- **Key Deliverables**:
  - 16 typed tools grouped by agent role.
  - Context compression templates (Taste Signals, Evidence Packets).
  - State management (Caching, Persistence).
  - Standardized error fallbacks.
- **Design Constraints**: Token-efficient, Privacy-first (local data stays local), Idempotent.

## 3. Technical Foundation

- **Data Model**: SQLite tables for `works`, `reactions`, `taste_signals`, `retrieval_cache`.
- **Ingestion**: Normalized schemas in `src/ingestion/schema.ts`.
- **Logic**: Rating mapping in `src/ingestion/ranking_manager.ts`.
- **Critical Logic: Triage Ranking**:
  - **Conservative Rounding**: Only round up if decimal $\ge 0.65$ (e.g., $3.6 \rightarrow$ MEHHH, $3.7 \rightarrow$ INTERESTING).
  - **UX Pattern**: No linear ranking. Use multi-select drag-and-drop into 4 categories: Masterpiece, Interesting, Mehhh, Never Again.
  - **Onboarding**: Support "Surgical" (single art form) vs "Holistic" (cross-modal) setup paths.

## 4. Immediate Roadmap (Next Steps)

### Phase 1: MCP Server Implementation (`mcp_server/src/`)

- [ ] Setup TS project (`package.json`, `tsconfig.json`).
- [ ] Implement Taste Memory tools: `get_taste_signals`, `log_reaction`, `query_seen_works`.
- [ ] Connect to `data/sqlite/arta.db`.
- [ ] Implement caching and API rate limiting.

### Phase 2: Pipeline Integration (`src/ingestion/`)

- [ ] Link `query_seen_works` to normalized SQLite data.
- [ ] Link `log_reaction` to taste signal updates.
- [ ] Implement `extract_text_from_file` (PyMuPDF/epub.js).

### Phase 3: Validation

- [ ] Test API failure fallbacks.
- [ ] Verify token efficiency of compressed signals.
- [ ] End-to-end test: Taste Signal $\rightarrow$ Curation $\rightarrow$ Synthesis.

## 5. Critical References

- **Project Overview**: `/docs/ærta-ai.md`
- **Tool Spec**: `/docs/mcp_specification.md`
- **Schemas**: `/src/ingestion/schema.ts`
