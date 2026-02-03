# BarrelBorn - Dine & Draft

## Overview

BarrelBorn is a luxurious restaurant menu web application for "BarrelBorn - Dine & Draft" restaurant. It features an elegant, interactive UI for sophisticated menu browsing with a modern orange, black, and white brand theme.

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX Preference: Modern, authentic design with sophisticated animations and orange, black, white brand theming.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript
- **Build Tool**: Vite (configured for port 5000, allowedHosts: true for Replit proxy)
- **Styling**: Tailwind CSS with custom theme, Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: MongoDB Atlas (external, connection string in storage.ts)
- **API**: RESTful API with JSON responses

### Project Structure

```
/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/          # Express backend
│   ├── index.ts     # Main server entry point
│   ├── routes.ts    # API routes
│   ├── storage.ts   # MongoDB storage layer
│   └── vite.ts      # Vite dev server integration
├── shared/          # Shared types and schemas
│   └── schema.ts    # Zod schemas and TypeScript types
├── attached_assets/ # Media assets (images, audio)
└── dist/            # Production build output
```

### Running the Application

- **Development**: `npm run dev` - Runs tsx server/index.ts which serves both API and Vite dev server on port 5000
- **Production**: `npm run build` then `npm start` - Builds frontend to dist/public and runs production server

### Key Configuration

- Server binds to `0.0.0.0:5000`
- Vite configured with `allowedHosts: true` for Replit proxy compatibility
- MongoDB Atlas connection is configured in `server/storage.ts`

### Deployment

Configured for autoscale deployment:
- Build: `npm run build`
- Run: `npm start`
