# Database Architecture Documentation

## Architecture Overview
This document outlines the Database Architecture Layer for Mayank AI Assistant, built with MongoDB Atlas and Mongoose ODM.

The system follows a strict Clean Architecture pattern:
`Application Layer -> Service Layer -> Model Layer -> MongoDB Database`

## Collections and Models

### 1. User Model (`users`)
Manages business owners and authentication.
- **Fields:** `name`, `email`, `password`, `businessName`, `instagramAccountId`, `profileImage`, `role`, `subscriptionPlan`, `isActive`, `lastLogin`, `createdAt`, `updatedAt`
- **Indexes:** `email` (unique), `instagramAccountId`
- **Relationships:** One-to-Many with `Conversation`

### 2. Conversation Model (`conversations`)
Stores the overarching context of an Instagram chat with a customer.
- **Fields:** `businessUserId`, `customerInstagramId`, `customerName`, `conversationStatus`, `leadStatus`, `lastMessageAt`, `aiEnabled`, `createdAt`, `updatedAt`
- **Indexes:** 
  - Compound Unique: `{ businessUserId: 1, customerInstagramId: 1 }`
  - Single: `conversationStatus`, `leadStatus`, `lastMessageAt`
- **Relationships:** Belongs to `User`, One-to-Many with `Message`

### 3. Message Model (`messages`)
Stores individual interaction events within a conversation.
- **Fields:** `conversationId`, `sender`, `message`, `messageType`, `aiGenerated`, `aiModel`, `tokensUsed`, `metadata`, `createdAt`, `updatedAt`
- **Indexes:** `{ conversationId: 1, createdAt: 1 }` (Optimized for feed queries)
- **Relationships:** Belongs to `Conversation`

## Data Flow
1. **API Request** hits a Controller.
2. **Controller** validates request and delegates to a Business Service.
3. **Business Service** executes logic and communicates with the **Database Service** or **Models** directly for CRUD operations.
4. Data is persistently stored in MongoDB.

## Connection Engine
Located at `src/config/database.js`.
Handles connection pooling (`maxPoolSize: 50`), connection timeouts, environment-based configuration, and graceful shutdowns. Failures on startup exit the process to prevent silent failures.

## Scaling Strategy
- **Indexing:** Essential fields are indexed to ensure queries remain O(1) or O(log N) as the data grows to millions of rows.
- **Connection Pooling:** We maintain a pool of reusable connections to avoid TCP overhead on every request.
- **AI Memory Ready:** `Message` and `Conversation` models are designed to store token counts, AI flags, and metadata that will map easily to a Vector database implementation in the future.

## Setup Instructions
1. Get a MongoDB Atlas connection string.
2. Update the `.env` file with `MONGODB_URI` and `DATABASE_NAME`.
3. Start the application. The system will automatically establish a connection or halt if unable to reach the database.
