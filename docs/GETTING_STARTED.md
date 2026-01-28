# 🚀 Getting Started with SpecLens

> **Prerequisites**
> *   **Docker Desktop** (Recommended for NLP Service)
> *   **Bun** (or Node.js v18+)
> *   **Python 3.11+** (Only if running without Docker)

## 1. Environment Setup

**No complex `.env` is required** for local development. The Next.js app defaults to `localhost:8000` for the backend.

---

## 2. Installation & Launch (Hybrid)

We recommend running the **NLP Backend in Docker** and the **Frontend locally** for the best dev experience.

### Step 1: Start NLP Backend
```bash
docker-compose up -d --build
# Verifying:
# curl http://localhost:8000/health
# Response: {"status":"ok"}
```

### Step 2: Start Frontend
```bash
bun install
bun run dev
# Running on http://localhost:3000
```

---

## 3. Manual Python Setup
If you cannot use Docker, run the Python service manually:

```bash
cd nlp
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

---

## 4. Usage Guide

1.  Open `http://localhost:3000`.
2.  **Paste text** into the analyzer (e.g., a paragraph from a System Design doc).
3.  Click **"Analyze"**.
4.  Explore the Tabs:
    *   **Network**: See the entity relationships graph.
    *   **Architecture**: View extracted system components.
    *   **Entities**: See categorized keywords.

---

## 5. Running Tests

### Frontend (Jest)
```bash
bun test
```

### Backend (Pytest)
```bash
docker exec -it speclens-nlp pytest
```
