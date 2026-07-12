# Architecture Upgrade Documentation

## Folder Structure

```text
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── brain/              # AI processing engines
│   ├── cache/              # Redis cache integration
│   ├── config/             # Environment & DB setup
│   ├── controllers/        # Route Handlers
│   ├── events/             # Event Emitters for decoupled logic
│   ├── helpers/            # Reusable utility functions
│   ├── jobs/               # Scheduled tasks
│   ├── knowledge/          # RAG Knowledge base docs
│   ├── middleware/         # Express middlewares
│   ├── models/             # Mongoose Schemas
│   ├── prompts/            # AI Prompt templates
│   ├── queues/             # Background job queues (BullMQ)
│   ├── repositories/       # DB Data Access Layer
│   ├── routes/             # API Endpoints
│   ├── services/           # Business Logic Layer
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── conversation/
│   │   ├── database/
│   │   ├── gemini/
│   │   └── instagram/
│   ├── types/              # Enums and interfaces
│   ├── utils/              # Base system utilities
│   ├── validators/         # Request validation logic
│   └── webhooks/           # External service webhooks
```

## Request Flow

```text
[Incoming Request]
       │
       ▼
   [Routes] ──────► [Middleware] (Auth/Validation)
       │
       ▼
 [Controllers] ───► Standardize Request/Response
       │
       ▼
  [Services] ─────► Core Business Logic & Coordination
       │            (Emits events, calls external APIs, integrates Brain)
       ▼
[Repositories] ───► Database Interaction
       │
       ▼
   [Models] ──────► Mongoose DB operations
```

## Future AI Flow
1. **Webhook** receives message from Instagram.
2. **Service** delegates to **Brain** engines (Intent, Memory).
3. **Brain** pulls **Prompts** and **Knowledge**.
4. **Brain** queries **Gemini API**.
5. Response is stored via **Repositories**.

## Future Instagram Flow
1. **Webhook** endpoint receives events.
2. **Queue** takes the event for background processing.
3. Background job invokes **Instagram Service**.

## Future Dashboard Flow
1. **Frontend** queries Analytics API.
2. **Controller** routes to **Analytics Service**.
3. **Analytics Service** aggregates data using **Repositories**.
