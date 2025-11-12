# Medication & Symptom Tracker

## Overview
A full-stack web application for tracking medication intake and symptoms with persistent database storage. Uses Google's Gemini AI to analyze patterns and correlations between medications and side effects.

## Current State
- **Status**: Fully functional with backend and database
- **Architecture**: Full-stack application
- **Frontend**: React 19 + Vite 6 + TypeScript (Port 5000)
- **Backend**: Express.js REST API (Port 3001)
- **Database**: PostgreSQL with Drizzle ORM
- **Data Storage**: PostgreSQL database (persistent)

## Features
1. **Timeline & Logs**: Add medication doses and symptoms with timestamps (stored in database)
2. **Visualization**: Charts and graphs of medication/symptom patterns
3. **Gemini Analysis**: AI-powered pattern analysis (requires API key)
4. **Settings**: Import/export data, clear logs
5. **Persistent Storage**: All data saved to PostgreSQL database

## Architecture

### Frontend
- React 19 with TypeScript
- Vite 6 dev server with proxy for API calls
- State management: React hooks
- API client: services/apiService.ts
- UI: Tailwind CSS (CDN)

### Backend
- Express.js REST API server
- Port 3001 (proxied through Vite on port 5000)
- CRUD endpoints: GET, POST, DELETE for logs
- Database: Drizzle ORM with Neon PostgreSQL

### Database Schema
- Table: `logs`
- Fields: id (UUID), type, timestamp, notes, medication_name, dosage, severity, description
- ORM: Drizzle with schema defined in `shared/schema.ts`

## Project Structure
```
├── components/          # React UI components
├── hooks/              # Custom React hooks
├── services/           # API services
│   ├── apiService.ts   # Backend API client
│   └── geminiService.ts # Gemini AI integration
├── server/             # Backend server
│   ├── index.ts        # Express API server
│   └── db.ts           # Database connection
├── shared/             # Shared types and schemas
│   └── schema.ts       # Drizzle database schema
├── App.tsx             # Main React app
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration with proxy
└── drizzle.config.ts   # Drizzle ORM configuration
```

## Dependencies

### Frontend
- React 19.2.0
- Vite 6.2.0
- recharts 3.4.1
- TypeScript 5.8.2
- @google/genai 1.29.0

### Backend
- Express 5.1.0
- Drizzle ORM 0.44.7
- @neondatabase/serverless 1.0.2
- cors 2.8.5
- tsx (TypeScript execution)

## Environment Variables
- `GEMINI_API_KEY`: Required for AI analysis feature (get from https://aistudio.google.com/apikey)
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)

## Recent Changes (Nov 12, 2025)

### Initial Setup
- Imported from GitHub
- Configured for Replit environment
- Updated Vite config to use port 5000
- Installed all dependencies

### Backend Integration
- Added PostgreSQL database with Drizzle ORM
- Created Express.js REST API server
- Implemented CRUD endpoints for medication/symptom logs
- Updated frontend to use database instead of localStorage
- Configured Vite proxy for API requests
- Set up concurrent frontend/backend execution

## Development

### Running the App
- `npm run dev` - Runs both frontend (Vite) and backend (Express) concurrently
- `npm run frontend` - Run frontend only
- `npm run backend` - Run backend only

### Database
- `npm run db:push` - Push schema changes to database
- Database queries accessible via server API endpoints

### Build & Deploy
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

## API Endpoints
- `GET /api/logs` - Fetch all logs
- `POST /api/logs` - Create a new log entry
- `DELETE /api/logs/:id` - Delete a log entry
- `GET /api/health` - Health check

## Deployment
- **Type**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: Production server configuration needed
- **Note**: For production, configure proper API URL handling beyond Vite proxy

## Technical Notes
- Vite dev server proxies `/api` requests to backend on port 3001
- Frontend and backend run concurrently via `npm run dev`
- Database connection uses Replit's built-in PostgreSQL
- The Gemini API key is exposed client-side (original design choice)
- Tailwind CSS is loaded from CDN (should be installed for production)
- All medication and symptom data persists in PostgreSQL database
