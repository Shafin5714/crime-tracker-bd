# Crime Tracker BD 🚨

Full-stack crime reporting platform with interactive map visualization, community-driven verification, and real-time alerts — built for Bangladesh.

## About

Crime Tracker BD is a production-grade web application that enables citizens to **report**, **visualize**, and **track** criminal activity through an interactive map-based interface. The platform combines crowdsourced community reporting with geospatial data visualization, real-time updates, and administrative moderation tools — functioning as a **"Waze for Crime"** adapted for the Bangladesh context.

> This is not a law enforcement tool. It is an informational and awareness-focused platform that aggregates crowdsourced data responsibly while prioritizing user privacy and ethical use.

## Key Features

- **🗺️ Interactive Crime Map** — Leaflet-powered map with clustered markers, crime-type icons, severity color coding, and detail popups
- **📝 Community Reporting** — Structured report submission with 15 crime categories, 4 severity levels, division/district selection, geolocation auto-detect, and anonymous submission
- **✅ Crowdsourced Verification** — Community confirm/deny system with automatic status transitions (Unverified → Verified / Disputed → Hidden)
- **🛡️ Moderation Dashboard** — Queue-based admin interface for reviewing, verifying, or rejecting reports with real-time stats
- **🔐 Role-Based Access Control** — 4-tier permission system (User → Moderator → Admin → Super Admin) governing API access and UI visibility
- **⚡ Real-Time Updates** — Socket.IO-powered live feed for newly submitted crime reports
- **🔍 Area Search** — Location-based search with Bangladesh division/district hierarchy and radius-based crime filtering
- **📡 REST API** — Fully documented with Swagger UI, paginated endpoints, advanced filtering, and structured error responses
- **🌙 Dark Mode** — Full dark/light theme support across all components
- **📱 Responsive & PWA-Ready** — Collapsible dual-sidebar layout, mobile navigation drawer, and progressive web app capabilities

## Technical Highlights

| Area | Implementation |
|---|---|
| **Architecture** | Monorepo with npm workspaces — decoupled Next.js 16 frontend, Express.js REST API, and shared type contracts |
| **Database** | PostgreSQL + PostGIS via Prisma ORM with optimized geospatial, temporal, and composite indexing |
| **API Design** | RESTful endpoints with Swagger/OpenAPI 3.0 docs, Zod schema validation, rate limiting, and structured error handling |
| **Auth** | JWT authentication with bcrypt hashing and hierarchical RBAC middleware |
| **Mapping** | Leaflet + React-Leaflet with marker clustering, custom markers, filter overlays, and a location picker component |
| **State Management** | Redux Toolkit (client state with persistence) + TanStack React Query (server state, caching, optimistic updates) |
| **Real-Time** | Socket.IO integration for live event streaming |
| **UI** | shadcn/ui + Radix UI primitives, Tailwind CSS v4, next-themes for dark mode |
| **Testing** | Jest + Supertest (API integration tests) · Vitest + React Testing Library + MSW (frontend unit/component tests) |
| **Security** | Helmet headers, CORS, rate limiting, DOMPurify XSS protection, input sanitization |
| **i18n** | next-intl for multi-language support |
| **DX** | Concurrent dev servers, Prisma Studio, database seeding, env validation via @t3-oss/env |

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                   MONOREPO (npm workspaces)                │
├─────────────────┬───────────────────┬─────────────────────┤
│    client/      │     server/       │      shared/        │
│                 │                   │                     │
│  Next.js 16     │  Express.js       │  TypeScript         │
│  React 19       │  Prisma ORM       │  Type Contracts     │
│  Tailwind v4    │  Socket.IO        │                     │
│  Redux Toolkit  │  JWT + RBAC       │                     │
│  React Query    │  Swagger/OpenAPI  │                     │
│  Leaflet Maps   │  Zod Validation   │                     │
│  shadcn/ui      │  Jest + Supertest │                     │
│  Vitest + MSW   │                   │                     │
├─────────────────┴───────────────────┴─────────────────────┤
│              PostgreSQL + PostGIS (Neon)                    │
└───────────────────────────────────────────────────────────┘
```

## Project Structure

```
crime-tracker-bd/
├── client/                   # Next.js 16 frontend
│   └── src/
│       ├── app/              # App Router pages (public, admin, auth)
│       ├── components/       # UI components (map, dashboard, forms, layout)
│       ├── hooks/            # Custom hooks (useAuth, useCrimes, useGeolocation)
│       ├── store/            # Redux Toolkit slices (auth, map, ui)
│       ├── services/         # API service layer
│       └── types/            # Client-side type definitions
├── server/                   # Express.js backend
│   └── src/
│       ├── controllers/      # Route handlers (auth, crime, user, area)
│       ├── services/         # Business logic layer
│       ├── middleware/       # Auth, RBAC, validation, error handling
│       ├── routes/           # API route definitions with Swagger docs
│       ├── schemas/          # Zod validation schemas
│       └── __tests__/        # Integration tests
├── shared/                   # Shared TypeScript types
├── docs/                     # Architecture & implementation docs
└── package.json              # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- [Neon](https://neon.tech) account (for hosted PostgreSQL + PostGIS)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/crime-tracker-bd.git
cd crime-tracker-bd
npm install
```

### 2. Environment Setup

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
# Edit both files with your configuration
```

### 3. Database Setup

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

Creates test users for all roles:

| Email | Password | Role |
|---|---|---|
| superadmin@crimetracker.bd | SuperAdmin@123 | SUPER_ADMIN |
| admin@crimetracker.bd | Admin@123 | ADMIN |
| moderator@crimetracker.bd | Moderator@123 | MODERATOR |
| user@crimetracker.bd | User@123 | USER |

### 5. Start Development

```bash
npm run dev
```

- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server concurrently |
| `npm run dev:client` | Start only the Next.js frontend |
| `npm run dev:server` | Start only the Express.js backend |
| `npm run build` | Build all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with test users |

## API Documentation

The backend API is documented using **Swagger/OpenAPI 3.0**. With the server running, access the interactive docs at:

📖 **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

| Tag | Description |
|---|---|
| Auth | Registration, login, token refresh |
| Crimes | CRUD operations, filtering, validation, moderation |
| Users | User management, role assignment, banning |
| Areas | Location/area management |

## Documentation

- [Architecture](./docs/architecture.md) — System design & data flow
- [Implementation Plan](./docs/implementation_plan.md) — Phased development roadmap
- [Tech Stack](./docs/tech-stack.md) — Technology decisions & rationale

## License

MIT
