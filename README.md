# LocalAI Study Intelligence Platform 🧠⚡

A full-stack, developer-grade study intelligence platform powered 100% locally by **Ollama** and **Llama 3.2**. Zero cloud APIs, complete data privacy, and purpose-built study modes for computer science and engineering students.

---

## 🏛️ Architecture Overview

```text
React Frontend (Vite + Tailwind CSS)
        │
        ▼ HTTP (REST / SSE Stream)
Express Backend (Node.js)
        │
        ▼ HTTP (Port 11434)
Ollama REST Engine (http://127.0.0.1:11434)
        │
        ▼ Local Inference
Llama 3.2 Model (Local Weights)
```

### Key Principles
- **100% Local Inference**: Runs directly on your hardware via Ollama. No OpenAI, Gemini, Claude, or external cloud LLM dependencies.
- **Direct REST Integration**: Communicates directly with the Ollama REST API (`/api/chat` and `/api/tags`) to master the fundamentals of local LLM orchestration before introducing abstractions like LangChain or LangGraph.
- **Engineered Study Modes**: Tailored system prompts and output formatting for:
  1. *Explain Simply* (Beginner-friendly conceptual breakdown)
  2. *Technical Explanation* (In-depth CS architecture & tradeoffs)
  3. *Exam Answer* (Structured 2-mark, 5-mark, and 10-mark university formats)
  4. *Interview Mode* (Technical interview questioning & answer evaluation)
  5. *MCQ Generator* (4-option conceptual testing)
  6. *Quiz Mode* (Interactive step-by-step assessment)
  7. *Summarizer* (Key points & revision digests)

---

## 📁 Repository Structure

```text
Student Intelligence/
├── backend/
│   ├── config/             # Centralized environment configuration
│   ├── controllers/        # Express route controllers (chat, health)
│   ├── middleware/         # Error handling & validation middleware
│   ├── prompts/            # Dedicated system prompt engineering
│   ├── routes/             # API route declarations
│   ├── services/           # Direct Ollama REST client & stream handler
│   ├── .env.example        # Environment variable template
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express app entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (Chat, Modes, Status, Metrics)
│   │   ├── hooks/          # Custom hooks (useChat, useOllamaStatus)
│   │   ├── pages/          # Home & Dashboard pages
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx         # Root app layout & theme
│   │   └── main.jsx        # React entrypoint
│   └── package.json        # Frontend dependencies & scripts
│
├── .gitignore              # Git ignore rules for node_modules and env
└── README.md               # Project documentation & roadmap
```

---

## 🗺️ Implementation Roadmap

- [x] **Phase 1: Project Structure & Setup**
- [ ] **Phase 2: Express Backend Foundation**
- [ ] **Phase 3: Ollama Service Layer & Health Verification**
- [ ] **Phase 4: Backend API Testing (`POST /api/chat`, `GET /api/health`)**
- [ ] **Phase 5: React Frontend Initialization**
- [ ] **Phase 6: Developer Dark-Mode Chat Interface**
- [ ] **Phase 7: Frontend-to-Backend Integration**
- [ ] **Phase 8: Specialized Study Modes & System Prompts**
- [ ] **Phase 9: Multi-Turn Conversation History**
- [ ] **Phase 10: LocalStorage Session Persistence**
- [ ] **Phase 11: Real-Time Token Streaming (SSE)**
- [ ] **Phase 12: Local AI Telemetry Dashboard**
- [ ] **Phase 13: UI/UX Refinement & Markdown/Code Highlighting**
- [ ] **Phase 14: Error Handling & Fault-Tolerance**
- [ ] **Phase 15: Production Hardening & Verification**
