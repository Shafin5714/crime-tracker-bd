# Crime Tracker BD 🚨

A web-based crime reporting and visualization platform for Bangladesh.

## Overview

Crime Tracker BD enables citizens to:

- View real-time and historical crime data on an interactive map
- Submit anonymous crime reports
- Receive location-based safety alerts
- Access emergency services quickly

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Backend  | Express.js, TypeScript, Prisma, Socket.io    |
| Database | PostgreSQL + PostGIS (Neon)                  |
| Maps     | Leaflet, OpenStreetMap                       |

## Prerequisites

- Node.js 18+
- npm 9+
- [Neon](https://neon.tech) account (for PostgreSQL database)

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/your-username/crime-tracker-bd.git
cd crime-tracker-bd
npm install
```

### 2. Environment Setup

```bash
# Server environment (database, auth, server config)
cp server/.env.example server/.env

# Client environment (API URLs)
cp client/.env.example client/.env.local

# Edit both files with your configuration
```

### 3. Database Setup

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to Neon
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

This creates test users for all roles:

| Email                      | Password       | Role        |
| -------------------------- | -------------- | ----------- |
| superadmin@crimetracker.bd | SuperAdmin@123 | SUPER_ADMIN |
| admin@crimetracker.bd      | Admin@123      | ADMIN       |
| moderator@crimetracker.bd  | Moderator@123  | MODERATOR   |
| user@crimetracker.bd       | User@123       | USER        |

### 5. Start Development

```bash
npm run dev
```

This starts both:

- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## Project Structure

```
crime-tracker-bd/
├── client/           # Next.js frontend
├── server/           # Express.js backend
├── shared/           # Shared types & utilities
├── docs/             # Documentation
└── package.json      # Root workspace config
```

## Available Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start both client and server  |
| `npm run dev:client` | Start only the client         |
| `npm run dev:server` | Start only the server         |
| `npm run build`      | Build all workspaces          |
| `npm run lint`       | Lint all workspaces           |
| `npm run db:studio`  | Open Prisma Studio            |
| `npm run db:seed`    | Seed database with test users |

## API Documentation

The backend API is documented using **Swagger/OpenAPI 3.0**. Once the server is running, you can access the interactive API documentation at:

📖 **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Features

- Interactive API explorer
- Request/response examples
- JWT authentication support
- Try out endpoints directly from the browser

### Available API Tags

| Tag    | Description              |
| ------ | ------------------------ |
| Auth   | Authentication endpoints |
| Crimes | Crime report endpoints   |

## Documentation

- [Architecture](./docs/architecture.md)
- [Implementation Plan](./docs/implementation_plan.md)
- [Tech Stack](./docs/tech-stack.md)

## License

MIT
