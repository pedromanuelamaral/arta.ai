-- ÆRTA AI Temporal Taste Database
-- Designed for Emotional Archaeology

-- Works: The raw archive of cultural encounters
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

-- Reactions: The "Thematic Wounds" and emotional signals
-- This table is critical for distinguishing the "Tide" from the "Core"
CREATE TABLE reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id TEXT NOT NULL,
  reaction_type TEXT,              -- liked, disliked, moved, bored, confused, admired, uneasy, wounded
  intensity INTEGER,               -- 1-5
  note TEXT,                       -- The specific "why" (e.g., "the silence between them")
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (work_id) REFERENCES works(id)
);

-- Taste Signals: The abstracted axioms and patterns
CREATE TABLE taste_signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  signal_type TEXT NOT NULL,       -- axiom, pattern, anti_pattern, theme, formal_quality
  value TEXT NOT NULL,             -- e.g., "formal restraint over explanation"
  confidence REAL DEFAULT 0.5,
  evidence TEXT,                   -- Reference to work_ids that support this signal
  created_at TEXT DEFAULT (datetime('now'))
);

-- Retrieval Cache: For academic and textual evidence
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

-- Indexes for Temporal Archaeology
CREATE INDEX idx_works_created ON works(created_at);
CREATE INDEX idx_reactions_created ON reactions(created_at);
CREATE INDEX idx_reactions_work ON reactions(work_id);