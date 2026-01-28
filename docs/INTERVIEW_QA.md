# 🎤 Interview Cheat Sheet: SpecLens

## 1. The Elevator Pitch (2 Minutes)

"SpecLens is an Intelligent Document Analysis tool that turns unstructured requirements into structured knowledge graphs.

I built a hybrid architecture:
1.  **Frontend**: A high-performance Next.js interface with D3.js visualization.
2.  **Backend**: A Python microservice using **spaCy** for industrial-strength NLP.
3.  **The Bridge**: Why separate them? Because JavaScript NLP ecosystems are still immature compared to Python. I use Next.js API routes to securely bridge the high-interaction UI with the heavy-compute backend."

---

## 2. "Explain Like I'm 5" (The Translator)

"Imagine you have a messy pile of notes about a spaceship.
*   **The Robot (SpecLens)** reads all the notes instantly.
*   It organizes them: 'Here are the Engine parts', 'Here are the Fuel rules'.
*   It draws a picture: 'The Engine connects to the Fuel Tank'.
*   It helps you verify: 'Wait, you said the Engine needs Fuel, but you didn't buy a Tank!'"

---

## 3. Tough Technical Questions

### Q: Why not use an LLM (OpenAI/GPT)?
**A:** "Cost and Determinism.
*   **Cost**: SpecLens runs locally on a CPU for free. GPT-4 costs money per token.
*   **Determinism**: spaCy is a deterministic statistical model. It gives the exact same parse tree every time. LLMs hallucinate. For technical specifications, I prefer the reliability and speed of classical NLP over the 'creativity' of Generative AI."

### Q: How do you visualize the graph?
**A:** "I use **D3.js Force Directed Layout**. It treats nodes like charged particles (repelling each other) and links like springs. This physics simulation automatically untangles the complex web of requirements into a readable cluster, which would be impossible with static charts."
