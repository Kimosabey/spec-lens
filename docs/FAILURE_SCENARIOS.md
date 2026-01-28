# 🛡️ Failure Scenarios & Resilience

> "NLP is heavy. The UI must stay light."

This document outlines how SpecLens handles backend latency and failures.

## 1. Failure Matrix

| Component | Failure Mode | Impact | Recovery Strategy |
| :--- | :--- | :--- | :--- |
| **NLP Service** | Down/Crash | **Critical**. Analysis fails. | **Graceful Degradation**. UI shows "Analysis Service Unavailable" but allows browsing static examples. |
| **NLP Service** | Latency (>5s) | **Major**. User frustration. | **Optimistic UI**. Show a "Processing..." loading state with particle animations to keep the user engaged. |
| **Input Text** | Too Large | **Minor**. Timeout. | **Chunking/Truncation**. API limits input to 5,000 characters to prevent DOS. |

---

## 2. Deep Dive: The "Bridge" Resilience

The Next.js API Routes (`/api/analyze`) act as a circuit breaker.
*   **Timeout**: If Python doesn't respond in 10s, Next.js kills the request and returns a user-friendly 504.
*   **Sanitization**: If Python returns malformed JSON, the Bridge catches the parse error and returns a clean 500 structure, preventing the UI from crashing (White Screen of Death).

---

## 3. Resilience Testing

### Test 1: Kill the Backend
1.  `docker stop speclens-nlp`.
2.  Click "Analyze".
3.  **Expectation**: Toasters/Notification shows "Service Offline" (Not a console error dash).

### Test 2: Stress Test
1.  Paste a 10,000 word document.
2.  **Expectation**: Validation error "Text too long (Max 5000 chars)". The server is protected.
