# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup
- `npm run install-all` - Install all dependencies (root, client, and server)
- `cp server/.env.example server/.env` - Copy environment template (edit with your configuration)

### Running the Application

**Development Mode (with auto-reload):**
- `npm run dev` - Start both client and server in development mode with auto-reload
- `npm run server:dev` - Start only the backend server with nodemon auto-reload

**Production Mode:**
- `npm start` - Start both client and server concurrently
- `npm run server` - Start only the backend server (localhost:5000)
- `npm run client` - Start only the frontend client (localhost:3000)

### Server Commands (in server/ directory)
- `npm run dev` - Start server with nodemon for development
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start compiled server (production)

### Client Commands (in client/ directory)
- `npm start` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm test` - Run React test suite

### Database Setup

**Automatic Setup (Recommended):**
The application automatically creates database tables and seeds sample data when the server starts. Just ensure MySQL is running and configured properly in `.env`.

**Manual Setup (Alternative):**
```bash
mysql -u root -p < server/src/models/database.sql
```

## Architecture Overview

### Monorepo Structure
- **Root**: Orchestrates both client and server with concurrently
- **client/**: React TypeScript frontend with Tailwind CSS
- **server/**: Express TypeScript backend with MySQL

### Backend Architecture
- **Express.js** server with TypeScript
- **MySQL** database with connection pooling (mysql2)
- **JWT authentication** with bcrypt password hashing
- **OpenAI integration** for enhanced search functionality
- **Google Ads API** integration for revenue tracking
- **Rate limiting** and security middleware (helmet, cors)

Key backend files:
- `server/src/index.ts` - Main server entry point with middleware setup
- `server/src/models/db.ts` - MySQL connection pool configuration
- `server/src/routes/` - API route handlers (auth, posts, search, user, admin, api)
- `server/src/middleware/auth.ts` - JWT authentication middleware
- `server/src/utils/earnings.ts` - Revenue calculation utilities

### Frontend Architecture
- **React 18** with TypeScript and React Router v6
- **Tailwind CSS** for styling with PostCSS configuration
- **Axios** for API communication
- **Proxy configuration** to backend (localhost:5000)

Key frontend files:
- `client/src/App.tsx` - Main app with routing setup
- `client/src/components/` - Reusable UI components
- `client/src/pages/` - Page components (Home, Login, Dashboard, etc.)
- `client/src/services/` - API service layer

### Database Schema
Core tables: users, posts, post_clicks, search_queries, api_usage
- Users have subscription tiers (free/pro) and earnings tracking
- Posts support JSON fields for tags, APIs/modules, work environment
- Full-text search on post content with click tracking
- Revenue sharing model (70% creator, 30% platform)

### API Structure
- `/api/auth/*` - Authentication endpoints
- `/api/posts/*` - Post CRUD and click tracking  
- `/api/search/*` - Enhanced search with OpenAI
- `/api/user/*` - User profile and earnings
- `/api/external/*` - Pro subscription API access
- `/api/admin/*` - Admin panel functionality

### Environment Configuration
Required in `server/.env`:
- Database: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Auth: `JWT_SECRET`
- Optional: `OPENAI_API_KEY`, Google Ads credentials