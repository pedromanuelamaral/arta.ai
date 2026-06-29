# Data Integration Strategy: Cinema & Literature

This document outlines the phased approach for integrating data from various cinema and literature sources while respecting API rate limits (RPM) and prioritizing the Cloud-First architecture.

## 🏗️ Core Integration Principle: "The Buffer"
To avoid hitting RPM limits and ensure stability, we will implement a **Buffered Sync Pipeline**:
`Source API` → `Rate-Limited Collector` → `Cloud Storage (JSON/CSV)` → `Local Indexer` → `Brain`.

---

## 🎬 Phase 1: Cinema Integration

### Stage 1: Manual/Export-Based (Low Friction)
These sources provide CSV/JSON exports that the user simply uploads to their cloud folder.
- **Letterboxd**: User uploads `watched.csv`.
- **IMDb**: User uploads data from "Your Data" export.
- **TV Time**: User uploads export file.

### Stage 2: Semi-Automated (API-Based with Throttling)
These require API keys and a script that runs with a "minute-by-minute" frame.
- **JustWatch / Rotten Tomatoes**: Use a throttled collector that fetches one movie/show every 2-5 seconds.
- **Stremio**: Integration via local addon API.

---

## 📚 Phase 2: Literature Integration

### Stage 1: Manual/Export-Based
- **Goodreads**: User uploads `goodreads_library.csv`.
- **Amazon Kindle**: User uploads "My Content" export.
- **Kobo**: User uploads export file.

### Stage 2: API-Based (Throttled)
- **Google Play Books**: Use Google Books API with a strict 1-request-per-second limit.
- **Substack**: Use RSS feeds or API (where available) with a slow-crawl strategy.
- **Audible**: Use a specialized parser for account exports.

---

## ⏱️ Rate Limit Management (The "Minute-by-Minute" Frame)

To prevent account bans or API blocks, the collectors will implement the following:

1. **Token Bucket Algorithm**: A local counter that allows $X$ requests per minute.
2. **Exponential Backoff**: If a `429 Too Many Requests` error is received, the script doubles the wait time before retrying.
3. **Sequential Processing**: Instead of parallel requests, the collector will process sources one by one:
   - Minute 1: Fetch 10 books from Goodreads.
   - Minute 2: Fetch 10 movies from IMDb.
   - Minute 3: Sleep/Cooldown.

## 📅 Implementation Roadmap

| Stage | Focus | Goal | Priority |
| :--- | :--- | :--- | :--- |
| **S1** | Manual Uploads | Establish the `/cinema` and `/literature` cloud folders. | High |
| **S2** | Throttled Scripts | Build the first "Slow Collector" for Google Books/IMDb. | Medium |
| **S3** | Auto-Indexing | Create the local watcher that turns cloud CSVs into Brain context. | High |