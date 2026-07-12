# Mayank AI Assistant - Backend

An enterprise SaaS platform for AI-powered Instagram Business Automation. 

## Purpose
The system supports scalable Instagram automation, integrating Gemini AI, and handling multi-account setups with professional-grade architecture.

## Tech Stack
- **Runtime:** Node.js LTS
- **Framework:** Express.js (ES Modules)
- **Database:** MongoDB / Mongoose (Upcoming)
- **Authentication:** JWT, bcrypt (Upcoming)
- **AI Integration:** Gemini API (Upcoming)
- **Social Graph:** Instagram Graph API (Upcoming)
- **Architecture:** Clean Architecture, SOLID, DRY, KISS

## Folder Structure
```text
backend/
├── src/
│   ├── app.js               # Express application setup
│   ├── server.js            # Server entry point
│   ├── config/              # Configuration (env, constants, logger)
│   ├── controllers/         # Route controllers
│   ├── routes/              # Express routes
│   ├── middleware/          # Express middlewares (error, security, etc.)
│   └── utils/               # Utilities (ApiResponse, ApiError, asyncHandler)
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Environment configuration:
```bash
cp .env.example .env
# Edit .env with your specific secrets
```

## Scripts
- `npm run dev`: Starts the development server using nodemon.
- `npm start`: Starts the production server.
- `npm run lint`: Runs code linter (Placeholder).
- `npm run format`: Runs code formatter (Placeholder).

## Architecture
Follows standard Clean Architecture principles:
- **Routes:** Map endpoints to controllers.
- **Controllers:** Handle HTTP requests and orchestrate services.
- **Services (Future):** Business logic and external API integrations.
- **Models (Future):** Data models and schemas.

## Future Modules
- MongoDB integration
- AI Memory and Smart Conversations
- Instagram Messaging API
- Multi Account Support
- Human Takeover and AI Toggle
- Dashboard and Analytics
- Redis for caching
- Dockerization
