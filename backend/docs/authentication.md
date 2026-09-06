# Authentication & Authorization Architecture

## Overview
Mayank AI Assistant utilizes a robust, stateless JWT-based authentication system. The backend validates credentials and issues short-lived Access Tokens along with long-lived Refresh Tokens. 

All passwords are automatically salted and hashed via `bcrypt` (12 rounds) within the Mongoose pre-save hooks. Raw passwords are never exposed in any API response or internal object passed around services.

## Authentication Flow

### Removed Public Registration
Because Mayank AI Assistant is a private internal enterprise SaaS, public registration (`/api/v1/auth/register`) has been intentionally removed. All system access must be explicitly granted, initially seeded through the Admin Seed script.

### Admin Seeding
To provision the initial platform owner/administrator, use the idempotent seed system:
```bash
npm run seed:admin
```
This reads from the following environment variables:
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_ROLE`

The script ensures that duplicate administrators are never created, and leverages the same strict password validation as the rest of the application.

### Login Flow
```text
[Client] ──(POST /login)──► [Validator] ──► [Auth Controller]
                                                   │
                                                   ▼
[Client] ◄──(Tokens + User)── [Auth Service] ◄── [User Repository]
                             (Verifies hash)  (Updates lastLogin)
```

### JWT Refresh Flow
Access Tokens are valid for 15 minutes. Once expired, the frontend automatically requests a new one using the Refresh Token.

```text
[Client] ──(POST /refresh)──► [Auth Controller]
                                      │
                                      ▼
[Client] ◄──(New Tokens)── [Auth Service] (Verifies Refresh Token
                                          via jwt.util.js)
```

## Security Measures
- **Never expose internal errors:** Custom `ApiError` format is returned uniformly.
- **Passwords:** `select: false` prevents accidental exposure in normal queries.
- **JWT Secrets:** Separate secrets for Access and Refresh tokens to limit blast radius.
- **Role-Based Access Control (RBAC):** 
  - Controlled via `authorize(...roles)` middleware.
  - Currently supported: `admin`, `owner`, `member`, `manager`, `viewer`.

## Testing REST API

### 1. Login
**POST** `/api/v1/auth/login`
```json
{
  "email": "mayank@example.com",
  "password": "SuperSecretPassword123!"
}
```

### 2. Get Current User
**GET** `/api/v1/auth/me`
*Headers: Authorization: Bearer <access_token>*

### 3. Refresh Token
**POST** `/api/v1/auth/refresh`
```json
{
  "refreshToken": "<refresh_token_here>"
}
```

### 4. Logout
**POST** `/api/v1/auth/logout`
*Headers: Authorization: Bearer <access_token>*
