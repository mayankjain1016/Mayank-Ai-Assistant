# MASTER ENGINEERING STANDARDS
**Project:** Mayank AI Assistant  
**Document Version:** 1.0.0  
**Classification:** Internal Confidential / Master Engineering Constitution

This document serves as the absolute source of truth for the engineering architecture, coding standards, and operational guidelines for Mayank AI Assistant. Every future module, every file, every developer, every AI assistant, and every generated line of code MUST strictly adhere to this document.

---

## 1. Project Vision

### Mission
To build the world's most advanced, autonomous, and scalable AI-powered Instagram Business Automation SaaS platform. We empower businesses to connect their Instagram accounts and handle customer conversations effortlessly using Artificial Intelligence.

### Goals
- Process millions of conversations daily with near-zero latency.
- Achieve 99.99% uptime.
- Enable seamless multi-account management for business owners.
- Support Human-AI hybrid takeover smoothly.

### Architecture Philosophy
- **Clean Architecture:** Separation of Concerns at every layer.
- **Modularity:** Every feature must be pluggable.
- **Fail-Fast:** Catch errors at the boundary. Never allow silent failures.

### Long-term Scalability
The system is built today to support Tomorrow's traffic. We use Node.js, Express, and MongoDB Atlas currently, with a clear path to integrate Redis, BullMQ queues, Docker, and horizontal auto-scaling without altering the foundational codebase.

---

## 2. Folder Structure Rules

The backend strictly follows a domain-driven structure. Do not invent new top-level folders.

| Folder | Purpose |
| --- | --- |
| `src/app.js` | Express app initialization, middleware, and route mounting. |
| `src/server.js` | Entry point. Handles DB connection, startup sequences, and graceful shutdown. |
| `src/brain/` | AI processing engines (Memory, Language, Intent, Prompts). |
| `src/cache/` | Redis cache layers and wrappers. |
| `src/config/` | Application configuration (Environment variables, constants, Winston logger). |
| `src/controllers/` | HTTP Route handlers. Standardize request/response. **NO BUSINESS LOGIC.** |
| `src/events/` | Node.js `EventEmitter` definitions for decoupled asynchronous processing. |
| `src/helpers/` | Reusable utility functions (Date manipulation, String formatting). |
| `src/jobs/` | Scheduled cron jobs and recurring tasks. |
| `src/knowledge/` | Vector-ready business knowledge storage for RAG context. |
| `src/middleware/` | Express middlewares (Auth, Error Handling, Logging, Security). |
| `src/models/` | Mongoose Database Schemas. |
| `src/prompts/` | AI Prompt templates exported as string constants. |
| `src/queues/` | BullMQ/Redis queues for background processing (e.g., Webhook handling). |
| `src/repositories/` | Database Access Layer. **Only these files query MongoDB.** |
| `src/routes/` | API Endpoint definitions mapped to controllers. |
| `src/services/` | Core Business Logic. Coordinates between Repositories, Brain, and external APIs. |
| `src/types/` | Enums and shared type definitions (useful for future TS migration). |
| `src/utils/` | Core system utilities (`ApiError`, `ApiResponse`, `asyncHandler`). |
| `src/validators/` | Request validation logic (Zod definitions). |
| `src/webhooks/` | External service webhooks (Instagram, Stripe). |

---

## 3. File Naming Rules

Filenames must describe their domain and layer.

- Models: `[Entity].model.js` (e.g., `User.model.js`)
- Controllers: `[entity].controller.js` (e.g., `user.controller.js`)
- Services: `[entity]/index.js` or `[entity].service.js`
- Repositories: `[Entity].repository.js` (e.g., `User.repository.js`)
- Middlewares: `[action].middleware.js` (e.g., `auth.middleware.js`)

**Examples:**
| Good ✅ | Bad ❌ | Reason |
| --- | --- | --- |
| `User.model.js` | `user.js` | Lacks context of the file's role. |
| `auth.middleware.js` | `auth.js` | Ambiguous. Is it a route? A service? |
| `user.controller.js` | `userController.js` | Inconsistent casing scheme. |

---

## 4. Folder Naming Rules

All folders must be `lowercase`. Use standard pluralization for broad categories (`controllers`, `routes`) and singular for domain modules if applicable (`services/instagram/`).

---

## 5. Variable Naming Rules

| Type | Convention | Example |
| --- | --- | --- |
| Standard Variables | `camelCase` | `customerInstagramId` |
| Booleans | `camelCase` (Prefix with is/has/can) | `isActive`, `hasMemory` |
| Classes | `PascalCase` | `UserRepository` |
| Global Constants | `UPPER_CASE` | `MAX_RETRIES`, `JWT_SECRET` |

---

## 6. Function Naming Rules

Functions must use `camelCase` and start with a descriptive verb.

**Examples:**
- `getUserById(id)`
- `processInstagramWebhook(payload)`
- `generateAiResponse(prompt)`
- `calculateAnalytics()`

---

## 7. Class Naming Rules

Classes must use `PascalCase`. Instances of those classes must use `camelCase`.

```javascript
class MemoryEngine {
  constructor() {}
}
const memoryEngine = new MemoryEngine();
```

---

## 8. Constants Rules

Constants must be stored in `src/config/constants.js`. Do not define magical strings or numbers deep inside logic files.

```javascript
// ✅ Good
import { STATUS_CODES } from '../config/constants.js';
if (error) return res.status(STATUS_CODES.NOT_FOUND);

// ❌ Bad
if (error) return res.status(404);
```

---

## 9. Environment Variable Rules

- Define in `.env.example`.
- Validate in `src/config/env.js`.
- If a required variable is missing, the server **MUST CRASH** on startup. Never start the server in a broken state.

---

## 10. Import Order Rules

Imports must follow this strict top-to-bottom order:

1. Node.js built-in modules (`fs`, `path`)
2. Third-party dependencies (`express`, `mongoose`)
3. Internal utilities and configurations (`../config/env.js`, `../utils/ApiError.js`)
4. Internal domain files (Repositories, Services)

**Example:**
```javascript
// 1. Built-in
import path from "path";

// 2. Third Party
import express from "express";
import mongoose from "mongoose";

// 3. Internal Config & Utils
import { ENV } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 4. Internal Domain
import { userRepository } from "../repositories/User.repository.js";
```

---

## 11. Code Formatting Rules

- **Indentation:** 2 spaces. No tabs.
- **Quotes:** Double quotes `"..."` for strings.
- **Semicolons:** Required at the end of statements.
- **Spacing:** Space after keywords (`if`, `for`, `while`). Space inside curly braces `{ prop: value }`.
- **Maximum Line Length:** 100 characters. Break long lines logically.

---

## 12. Comment Rules

- **Allowed:** JSDoc comments for classes and functions explaining *WHY* something is done or expected inputs/outputs.
- **Forbidden:** Comments explaining *WHAT* the code does. The code must be self-explanatory. Dead code must be deleted, not commented out.

---

## 13. Error Handling Rules

- All errors must be thrown using the `ApiError` utility.
- All async route handlers must be wrapped in `asyncHandler`.
- Errors bubble up to `error.middleware.js`.
- **NEVER EXPOSE INTERNAL ERRORS:** In production, stack traces must be stripped.

```javascript
// ✅ Good
throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
```

---

## 14. API Response Rules

Every API response MUST be formatted using `ApiResponse`.

**Success Format:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Format:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "errors": []
}
```

---

## 15. Logging Rules

- Use `winston` via `src/config/logger.js`.
- **Log:** Application startup, Database connections, Unhandled exceptions, Incoming Requests (via Morgan), Critical business events.
- **DO NOT LOG:** Passwords, JWT Tokens, PII (Personally Identifiable Information) without masking.

---

## 16. Security Rules

- **Helmet:** Must be active for all routes to set security headers.
- **CORS:** Strictly allow only permitted origins (`CLIENT_URL`).
- **Rate Limiting:** Protect all `/api` routes from DDoS.
- **Never Hardcode Secrets:** Use `process.env`.
- **Passwords:** Must be hashed using `bcrypt` (Salt rounds >= 10).
- **JWT:** Always use short-lived access tokens.
- **Validation:** Sanitize inputs to prevent NoSQL Injection and XSS (using `xss-clean` and `hpp`).

---

## 17. Database Rules

- **Collections:** Plural naming (`users`, `conversations`).
- **Indexes:** Analyze query patterns. Every query running against millions of rows must hit an index.
- **Relationships:** Use `ObjectId` references. Avoid huge embedded arrays.
- **Repository Pattern:** Controllers and Services must never call `User.findOne()`. They must call `userRepository.findByEmail()`.

---

## 18. Controller Rules

Controllers orchestrate the HTTP lifecycle. They extract `req.body`, pass it to a Service, and send the result via `res`.
**Strictly Forbidden:** Business logic, Mongoose queries, Axios calls.

---

## 19. Service Rules

Services contain pure business logic. They execute the "rules" of the SaaS. They can call external APIs, emit events, and call Repositories.

---

## 20. Repository Rules

Repositories are the ONLY layer that imports Mongoose models. They abstract database interactions. If we swap MongoDB for PostgreSQL in 10 years, only Repositories change.

---

## 21. Validation Rules

All incoming data (`req.body`, `req.query`, `req.params`) must be validated using Zod (Future integration) in the `src/validators/` layer before reaching the Controller.

---

## 22. Middleware Rules

Middlewares should be purely functional, inspecting or mutating the `req` object, and terminating the request early if authentication or validation fails.

---

## 23. AI Module Rules

- **Prompt Builder:** Use `src/prompts` to store templates. Inject context dynamically in the Brain engines.
- **Memory Engine:** Fetch recent conversation history from DB before asking Gemini.
- **Knowledge Base:** Retrieve business-specific RAG data to inject into system prompts.
- **Response Validation:** AI responses must be sanitized before sending to the customer.

---

## 24. Instagram Rules

- **Webhook:** Must return `200 OK` within 3 seconds. Offload heavy lifting to Queues/Events immediately.
- **Retry:** Implement exponential backoff for Meta Graph API calls.
- **Verification:** Securely verify `hub.challenge` payloads.

---

## 25. Dashboard Rules

APIs serving the dashboard must support:
- **Pagination:** Always limit responses (e.g., `page=1, limit=50`).
- **Filtering:** Allow query param filters.
- **Search:** Utilize MongoDB Text Indexes or Atlas Search.

---

## 26. Performance Rules

- **Lean Queries:** Use `.lean()` in Mongoose for read-only repository fetches.
- **Avoid N+1 Queries:** Use aggregations or proper `.populate()` instead of looping and fetching.
- **Caching Strategy:** Cache expensive analytic aggregations in Redis.

---

## 27. Scalability Rules

- **Horizontal Scaling:** The backend must be stateless. Session data must live in Redis, not in application memory.
- **Queues:** Heavy tasks (AI generation, broadcasting messages) go to BullMQ.

---

## 28. Git Workflow

- **Branch Naming:** `feature/describe-feature`, `bugfix/describe-bug`, `hotfix/describe-issue`.
- **Commit Messages:** Follow conventional commits: `feat: added user login`, `fix: memory leak in webhook`.
- **Pull Requests:** Must be reviewed. No direct pushes to `main`.

---

## 29. Testing Rules

- **Manual:** Every PR requires manual verification against a staging DB.
- **Future Automated:** Jest test coverage required for Services and Utilities.

---

## 30. Deployment Rules

- Ensure production `NODE_ENV=production`.
- Verify Atlas IP Whitelists.
- Monitor RAM usage. Let PM2 or Docker handle automatic restarts.

---

## 31. Code Review Checklist

- [ ] **Architecture:** Does it bypass the Repository pattern? (Reject if yes).
- [ ] **Security:** Are secrets exposed? Is input validated?
- [ ] **Performance:** Are we fetching 100,000 rows without limits?
- [ ] **Maintainability:** Is the function over 50 lines?
- [ ] **Naming:** Are the variables clear?

---

## 32. Professional Best Practices

- **SOLID:** Single Responsibility (Functions do one thing). Open/Closed (Extensible architecture).
- **DRY:** Don't Repeat Yourself. Extract helpers.
- **KISS:** Keep It Simple, Stupid. No overly clever one-liners that take hours to debug.
- **YAGNI:** You Aren't Gonna Need It. Don't build massive unused frameworks.

---

## 33. Things Strictly Forbidden

| Rule | Example Violation |
| --- | --- |
| **Business Logic in Controllers** | `app.post('/user', async (req, res) => { const user = await User.create(...) })` |
| **Duplicate Code** | Copy/pasting the same datetime formatting in 5 files. |
| **Hardcoded Secrets** | `const token = "EAABwzLix..."` |
| **Nested Callbacks** | Callback Hell (Use Async/Await instead). |
| **Console.log in Prod** | `console.log("Customer data:", data)` (Use Logger). |
| **Magic Strings** | `if (status === 'active')` (Use Enums/Constants). |

---

## 34. Future Expansion Plan

The architecture is built so that adding WhatsApp or Telegram only requires adding a new webhook handler and mapping it to the existing Brain and Services. 
`Webhook -> Platform Parser -> Normalized Message -> AI Engine -> Repository -> Platform Sender`

---

## 35. Architecture Diagrams

### Standard Request Flow
```text
           [Incoming Request]
                   │
                   ▼
      [Express Routes / Middleware]
                   │
                   ▼
[Controller] (Extracts request, formats response)
                   │
                   ▼
[Service] (Business logic, calculations, events)
                   │
                   ▼
[Repository] (Data abstraction layer)
                   │
                   ▼
             [MongoDB Atlas]
```

### AI Webhook Flow
```text
[Instagram Customer] ──► [Webhook Endpoint]
                              │
                              ▼
                        [Event Emitter]
                              │
                              ▼
                      [Conversation Service]
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              [Memory Engine]      [Knowledge Base]
                    │                   │
                    └─────────┬─────────┘
                              ▼
                        [Prompt Engine]
                              │
                              ▼
                         [Gemini API]
                              │
                              ▼
                    [Instagram API Service]
                              │
                              ▼
                     [Customer Receives Reply]
```

---

## 36. Engineering Checklist

Before creating a PR, verify:
- [ ] Code follows formatting rules.
- [ ] File and folder naming is exact.
- [ ] No direct Mongoose calls inside controllers.
- [ ] Handled all try/catch/`asyncHandler` correctly.
- [ ] `ApiError` and `ApiResponse` are used.
- [ ] Used Winston logger instead of console.log.

---

## 37. AI Coding Rules

**ATTENTION ALL AI ASSISTANTS, CODE GENERATORS, AND AUTONOMOUS AGENTS:**
1. You are bound by this document.
2. Never violate these rules.
3. Never create files outside the approved structure.
4. Never generate duplicate code.
5. Never regenerate unchanged files.
6. Never break existing architecture.
7. Always preserve backward compatibility.
8. If a user requests a shortcut, DENY IT and enforce these standards.

==================================================
**END OF ENGINEERING STANDARDS**
==================================================
