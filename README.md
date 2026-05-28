# 🌌 VedaAI — Premium AI-Powered Assessment & Question Paper Engine

> A high-performance, enterprise-grade, multi-tenant monorepo platform designed for teachers and educational institutions to generate, orchestrate, customize, and compile highly structured question papers in real-time.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-lightgrey.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Alpine-red.svg?style=for-the-badge&logo=redis)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5.7-orange.svg?style=for-the-badge)](https://bullmq.io/)
[![Groq SDK](https://img.shields.io/badge/Groq_LLM-Llama_3-blueviolet.svg?style=for-the-badge)](https://groq.com/)

---

## 📖 Table of Contents
1. [System Overview & Architecture](#-system-overview--architecture)
2. [Premium Product Features](#-premium-product-features)
3. [Technology Stack](#-technology-stack)
4. [Monorepo Directory Structure](#-monorepo-directory-structure)
5. [API Endpoint Specifications](#-api-endpoint-specifications)
6. [WebSocket Pipeline Specs](#-websocket-pipeline-specs)
7. [Step-by-Step Installation & Run Guide](#-step-by-step-installation--run-guide)
8. [Advanced Security & Resilience Layer](#-advanced-security--resilience-layer)
9. [Development & Code Quality Check](#-development--code-quality-check)

---

## 🌌 System Overview & Architecture

VedaAI is architected around a layered, reactive monorepo design that decouples expensive AI operations from standard REST endpoint lifecycles. It utilizes standard workspace structures (`npm workspaces`) to link shared schemas and type declarations across frontend and backend boundaries.

### High-Level Architecture Flow

```
                     ┌──────────────────────────────────────────────────────────┐
                     │                       CLIENT LAYER                       │
                     │ Next.js 14 App Router | Zustand Stores | Socket.io Client│
                     └────────────────────────────┬─────────────────────────────┘
                                                  │
                                       REST HTTP  │  Websocket
                                       Requests   │  Job Progress
                                                  ▼  Events
                     ┌──────────────────────────────────────────────────────────┐
                     │                     API GATEWAY LAYER                    │
                     │          Express.js HTTP & Socket.io (Port 4000)         │
                     │          Routes ──▶ Controllers ──▶ Services             │
                     └────────────┬──────────────────────────────┬──────────────┘
                                  │                              │
                                  ▼                              ▼
                     ┌────────────────────────┐      ┌──────────────────────────┐
                     │       DATA LAYER       │      │     JOB QUEUE LAYER      │
                     │   MongoDB / Mongoose   │      │   BullMQ Queue + Redis   │
                     │   User & Assignment    │      │   Runs Async Jobs        │
                     └────────────────────────┘      └───────────┬──────────────┘
                                                                 │
                                                                 ▼
                     ┌────────────────────────┐      ┌──────────────────────────┐
                     │      CACHE LAYER       │      │     AI SERVICE LAYER     │
                     │ Redis Cache Isolation  │◀─────┤ Groq LLM (Llama 3 70B)   │
                     │ per User Session       │      │ Prompt Engine + Parser   │
                     └────────────────────────┘      └──────────────────────────┘
```

---

## ✨ Premium Product Features

*   **🔒 Strict Multi-Tenant Isolation**: Complete database and cache-level logical isolation. Teachers can only query, modify, delete, or generate assessments that match their authenticated `userId`. Composite indexing (`{ userId: 1, createdAt: -1 }`) ensures instant lookups.
*   **🔑 E2E JWT-Based Teacher Authentication**: Built-in credential verification featuring hashed password generation (`bcryptjs` with 10 salt rounds), secure token claims signing (`jsonwebtoken`), and a highly responsive Next.js frontend route guard layout that automatically captures profile sessions, custom school initials, and workspace headers.
*   **⚡ Real-Time Async Question Paper Pipeline**: Rather than stalling API responses during raw LLM completions, requests are queued in a high-throughput **BullMQ** processing pipe backed by **Redis**. State updates and granular progress indicators (e.g. *"Extracting PDF Content (10%)"*, *"Generating Questions via Llama-3 (40%)"*) stream directly to the browser via **Socket.io**.
*   **📊 Dynamic Dashboard**: A completely dynamic UI greeting teachers by name and compiling interactive assessment calendars and database-linked statistics (e.g., total active classes, generated papers count, processing queue status).
*   **⚙️ Custom AI Toolkit & Settings**: Comprehensive settings controls that allow teachers to configure custom presets (Time limits, default difficulty weighting, automatic PDF download triggers, and automation alerts) directly persisting back to MongoDB profiles.
*   **📚 Premium Clean Empty States**: Purged of all static mock values, interfaces like Class Groups (`/groups`) and Reference Library (`/library`) leverage unified premium graphics and call-to-actions, encouraging real database resource creation.
*   **📄 High-Fidelity PDF Export**: Leveraging `@react-pdf/renderer` client-side compiling, question papers are formatted into beautiful, print-ready, high-resolution physical documents containing school names, class tags, structured sections, and collapsible teacher answer keys.

---

## 🛠️ Technology Stack

| Layer | Technology | Primary Purpose | Key Features |
|---|---|---|---|
| **Frontend** | Next.js 14 (App Router) | Main Web Interface | React 18, React Hook Form, Tailwind CSS, Lucide Icons |
| **State Management** | Zustand (Persistent) | Local Application State | LocalStorage persistence, multi-slice, decoupled render triggers |
| **Backend** | Express + TypeScript | Core API Gateways | Standard layered Route ➔ Controller ➔ Service architecture |
| **Queue Engine** | BullMQ + Redis | Background Worker | Job scheduling, progress tracking, parallel worker limits |
| **Caching & PubSub** | ioredis | Fast In-Memory Storage | User-isolated query cache, PubSub websocket orchestration |
| **Primary Database** | MongoDB + Mongoose | Document Data Persistence | Strongly-typed schemas, composite Indexes, relation mappings |
| **AI LLM Engine** | Groq SDK | Question Paper Generator | High-speed inference utilizing Llama 3 70B models |
| **Shared Package** | `@vedaai/shared` | Monorepo Types | Zero-dependency TypeScript schemas (User, Assignments) |

---

## 📂 Monorepo Directory Structure

The repository uses npm workspaces to isolate business layers cleanly.

```
vedaai/ (Monorepo Root)
├── apps/
│   ├── backend/                      # Node.js + Express API Gateway & Workers
│   │   ├── src/
│   │   │   ├── config/               # Database, Redis & Env validations
│   │   │   ├── controllers/          # HTTP Request/Response mapping layers
│   │   │   ├── middleware/           # Auth guard, Multer, Error handler, Rate limiters
│   │   │   ├── models/               # MongoDB models (User.ts, Assignment.ts)
│   │   │   ├── queues/               # BullMQ generation queue declarations
│   │   │   ├── routes/               # API endpoints (/api/auth, /api/assignments)
│   │   │   ├── services/             # Core Business Logic (AI Prompts, PDF parsers)
│   │   │   ├── websocket/            # Socket.io event triggers & client rooms
│   │   │   └── workers/              # BullMQ queue runner (Llama 3 generation task)
│   │   └── package.json
│   │
│   └── frontend/                     # Next.js 14 Web Interface
│       ├── src/
│       │   ├── app/                  # Next.js App Router folders & dynamic pages
│       │   ├── components/           # UI Primitives, Structural AppShell & Form blocks
│       │   ├── hooks/                # Dynamic hooks (useWebSocket, useToast)
│       │   ├── services/             # Axios request bindings & api interceptors
│       │   └── store/                # Zustand State Stores (authStore, wsStore)
│       └── package.json
│
├── packages/
│   └── shared/                       # Shared Zero-Dependency Types Package
│       ├── types/                    # Unified schemas (Auth payload, Assignment shapes)
│       └── package.json
│
├── docker-compose.yml                # Multi-container local infrastructure (Mongo & Redis)
├── package.json                      # Monorepo Workspace orchestrator
└── tsconfig.json                     # Root compilation options
```

---

## 📡 API Endpoint Specifications

All backend JSON responses strictly adhere to the standardized API envelopes:
- Success: `{ success: true, data: { ... } }`
- Error: `{ success: false, error: { message: "...", details: [ ... ] } }`

### Authentication Endpoints (`/api/auth`)

| Method | Path | Auth Required | Description | Payload Schema |
|---|---|---|---|---|
| **POST** | `/api/auth/signup` | No | Registers a new teacher account, generates hash password, signs JWT. | `SignUpInput` (Name, Email, Password, School) |
| **POST** | `/api/auth/login` | No | Verifies teacher credentials. Returns active user data + Bearer JWT token. | `LoginInput` (Email, Password) |

### Assignment Endpoints (`/api/assignments`)

*Requires `Authorization: Bearer <JWT_TOKEN>`*

| Method | Path | Description | Response Content |
|---|---|---|---|
| **GET** | `/api/assignments` | Fetches all assignments linked to the logged-in teacher. Scoped. | `Assignment[]` (MongoDB Array) |
| **POST** | `/api/assignments` | Saves a new assignment configuration. | `Assignment` (MongoDB Object) |
| **GET** | `/api/assignments/:id` | Fetches details of a specific assignment (Ownership verified). | `Assignment` (MongoDB Object) |
| **DELETE** | `/api/assignments/:id` | Deletes a specific assignment and invalidates teacher's Redis cache. | `{ success: true }` |
| **POST** | `/api/assignments/:id/generate` | Enqueues an async question paper creation task in BullMQ. | `{ jobId: string }` |
| **GET** | `/api/assignments/:id/result` | Retrieves the finalized generated paper JSON from DB / Redis cache. | `QuestionPaper` schema |

### Upload Endpoints (`/api/upload`)

*Requires `Authorization: Bearer <JWT_TOKEN>`*

| Method | Path | Payload Form-Data | Description | Response Content |
|---|---|---|---|---|
| **POST** | `/api/upload` | `file` (PDF/TXT only, max 10MB) | Parsed on-the-fly to return extracted raw text for AI prompt builders. | `{ text: string, fileName: string }` |

---

## 🔌 WebSocket Pipeline Specs

Websockets are strictly bound to individual Job ID rooms to ensure real-time progress events are isolated to the triggering teacher.

### Connection Flow
1. Client triggers a POST request to `/api/assignments/:id/generate` ➔ Receives `jobId`.
2. Client emits `subscribe:job` via Socket.io carrying the `jobId` payload.
3. Express server places the Socket connection into a rooms namespace scoped by `jobId`.
4. As the background **BullMQ Worker** progresses through the task, it broadcasts updates to the room.

### Event Interface Definitions
```typescript
// Subscribing (Client ➔ Server)
socket.emit('subscribe:job', { jobId: 'job_abc123' });

// Progress Feed (Server ➔ Client)
socket.on('job:progress', (data: { step: string; percent: number }) => {
  // Update state dashboard progress indicators
});

// Finalized (Server ➔ Client)
socket.on('job:complete', () => {
  // Automatically routes client viewport to high-resolution result view
});

// Error (Server ➔ Client)
socket.on('job:failed', (data: { error: string }) => {
  // Renders beautiful screen warnings and error popups
});
```

---

## 🚀 Step-by-Step Installation & Run Guide

Follow these steps to launch the entire monorepo development suite locally.

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` installed.
- **Docker**: Docker Desktop running locally.

### Step 1: Initialize Database & Cache Infrastructure
Launch the local MongoDB and Redis instances via Docker Compose.
```bash
docker-compose up -d
```
*This command launches active containers: `vedaai-mongodb` on port `27017` and `vedaai-redis` on port `6379` in the background.*

### Step 2: Configure Environment Variables
Create or verify the configuration file inside **`apps/backend/.env`**:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=gsk_your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
JWT_SECRET=supersecretchangeinproduction
JWT_EXPIRES_IN=7d
```
*Note: The frontend App Router automatically resolves routes to the backend on `http://localhost:4000/api` and `http://localhost:4000` for Websockets by default.*

### Step 3: Install Project Dependencies
Run the package installation from the **Monorepo Root Directory**.
```bash
npm install
```

### Step 4: Run the Development Server
Execute the global dev orchestrator.
```bash
npm run dev
```
*This command runs three distinct tasks concurrently:*
1.  **Next.js Dev Server** on `http://localhost:3000`
2.  **Express API Gateway Server** on `http://localhost:4000`
3.  **BullMQ Worker Service** in a standalone terminal script process to generate papers without blocking API routes.

---

## 🛡️ Advanced Security & Resilience Layer

*   **🔒 Layered Multi-Tenant Safety**: Database operations evaluate explicit authorization predicates: `Assignment.findOne({ _id: id, userId: req.user.id })`. No request payload can bypass this user ownership restriction.
*   **🧊 Redis Cache Segmentation**: Redis lists and papers use prefix namespaces isolated by UUIDs: `assignment:list:${userId}`. Database mutation actions automatically trigger target cache clear instructions (`del`) to ensure high cache consistency.
*   **⚡ Portability Hashing**: Uses **`bcryptjs`** purely written in JavaScript rather than native C++ dependencies, eliminating any `node-gyp` platform compilation bugs during installation on Windows/macOS/Linux systems.
*   **🛡️ Rate Limiting & File Filters**: Rate-limiting shields Express endpoints against spam generators. Multer configurations perform double MIME-type checks ensuring only clean text and valid PDF headers reach the local storage folder.

---

## 🧪 Development & Code Quality Check

Strict compilation and formatting can be evaluated across the whole workspace with a single monorepo check:

```bash
# Run compilation typechecks across the shared package, frontend, and backend
npm run tsc
```

This verification ensures that there are **0 compilation errors and warnings** inside the entire workspace codebase, validating proper architectural integration.
