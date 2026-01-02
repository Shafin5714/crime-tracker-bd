# System Architecture Document

## Crime Tracker BD

> A comprehensive architecture overview for the Crime Tracker BD platform — a web-based crime reporting and visualization system for Bangladesh.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Goals](#2-architecture-goals)
3. [High-Level Architecture](#3-high-level-architecture)
4. [System Components](#4-system-components)
5. [Data Architecture](#5-data-architecture)
6. [API Design](#6-api-design)
7. [Security Architecture](#7-security-architecture)
8. [Real-Time Communication](#8-real-time-communication)
9. [Performance & Scalability](#9-performance--scalability)
10. [Future Considerations](#10-future-considerations)

---

## 1. Overview

Crime Tracker BD is an **informational and awareness-focused platform** that enables citizens of Bangladesh to:

- View real-time and historical crime data on an interactive map
- Submit anonymous crime reports
- Receive location-based safety alerts
- Access emergency services quickly

This document outlines the technical architecture supporting these capabilities.

---

## 2. Architecture Goals

| Goal             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| **Performance**  | Initial map load within 2 seconds on average 4G connections |
| **Scalability**  | Handle traffic spikes during emergencies or viral incidents |
| **Availability** | Target 99.5% uptime                                         |
| **Security**     | All sensitive data encrypted in transit and at rest         |
| **Privacy**      | Reporter identity is never publicly visible                 |
| **Localization** | Optimized for Bangladesh locations and address formats      |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Next.js Frontend (App Router)                   │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │  React       │  │  Leaflet     │  │  TanStack Query          │   │    │
│  │  │  Components  │  │  Map Engine  │  │  (Server State)          │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │  Redux       │  │  Tailwind    │  │  Socket.io Client        │   │    │
│  │  │  Toolkit     │  │  CSS         │  │  (Real-time)             │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / WSS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Express.js Backend Server                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │  REST API    │  │  Socket.io   │  │  Zod Validation          │   │    │
│  │  │  Endpoints   │  │  Server      │  │  Middleware              │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │  Auth        │  │  Rate        │  │  Geospatial              │   │    │
│  │  │  Middleware  │  │  Limiting    │  │  Query Handler           │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Prisma ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              PostgreSQL + PostGIS (Geospatial Database)              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │  Crime       │  │  User        │  │  Spatial                 │   │    │
│  │  │  Reports     │  │  Data        │  │  Indexes                 │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern

The system follows a **Modular Monolith** pattern for the MVP, with clear separation of concerns that allows future migration to microservices if needed.

---

## 4. System Components

### 4.1 Frontend Layer

| Component          | Technology           | Purpose                                      |
| ------------------ | -------------------- | -------------------------------------------- |
| **Framework**      | Next.js (App Router) | SSR/SSG for SEO and fast initial loads       |
| **Language**       | TypeScript           | Type safety and maintainability              |
| **Styling**        | Tailwind CSS         | Utility-first responsive design              |
| **Icons**          | Lucide React         | Lightweight, consistent iconography          |
| **Global State**   | Redux Toolkit        | Client-side state management                 |
| **Server State**   | TanStack Query       | Caching, fetching, and synchronization       |
| **HTTP Client**    | Axios                | Promise-based HTTP with interceptor support  |
| **Forms**          | React Hook Form      | Performant forms with validation integration |
| **Date Handling**  | date-fns             | Lightweight date parsing and formatting      |
| **Env Validation** | @t3-oss/env-nextjs   | Type-safe environment variable validation    |
| **Maps**           | React Leaflet        | Interactive map rendering                    |
| **Charts**         | Recharts             | Crime statistics visualization               |

#### Frontend Module Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Home (Map View)
│   │   ├── search/        # Location search
│   │   └── report/        # Report crime
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Analytics dashboard
│   └── admin/             # Moderator panel
├── components/
│   ├── map/               # Map-related components
│   │   ├── CrimeMap.tsx
│   │   ├── HeatmapLayer.tsx
│   │   └── MarkerCluster.tsx
│   ├── common/            # Shared UI components
│   └── forms/             # Form components
├── hooks/                 # Custom React hooks
├── store/                 # Redux store configuration
├── services/              # API service layer
└── types/                 # TypeScript type definitions
```

### 4.2 Backend Layer

| Component         | Technology         | Purpose                              |
| ----------------- | ------------------ | ------------------------------------ |
| **Runtime**       | Node.js            | Non-blocking I/O for real-time apps  |
| **Language**      | TypeScript         | End-to-end type safety               |
| **Framework**     | Express.js         | RESTful API server                   |
| **Validation**    | Zod                | Schema validation for requests       |
| **ORM**           | Prisma             | Type-safe database access            |
| **Real-Time**     | Socket.io          | Push notifications & alerts          |
| **Auth**          | JWT + Bcrypt       | Stateless authentication             |
| **Rate Limiting** | express-rate-limit | API abuse and brute-force protection |
| **Logging**       | Morgan             | HTTP request logging & monitoring    |
| **Security**      | Helmet             | HTTP security headers                |
| **CORS**          | cors               | Cross-origin resource sharing        |

#### Backend Module Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── crime.controller.ts
│   │   └── user.controller.ts
│   ├── services/          # Business logic
│   │   ├── crime.service.ts
│   │   ├── notification.service.ts
│   │   └── geospatial.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── routes/            # API route definitions
│   ├── schemas/           # Zod validation schemas
│   ├── socket/            # Socket.io event handlers
│   └── utils/             # Helper functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
└── tests/                 # Test files
```

### 4.3 Data Layer

| Component            | Technology    | Purpose                                |
| -------------------- | ------------- | -------------------------------------- |
| **Database**         | PostgreSQL    | Relational data storage                |
| **Extension**        | PostGIS       | Geospatial queries & indexing          |
| **Maps**             | OpenStreetMap | Free map tile provider                 |
| **Error Monitoring** | Sentry        | Real-time error tracking (Recommended) |

---

## 5. Data Architecture

### 5.1 Entity Relationship Diagram

```
┌─────────────────────┐     ┌─────────────────────┐
│       User          │     │     CrimeReport     │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────<│ id (PK)             │
│ email               │     │ userId (FK)         │
│ passwordHash        │     │ crimeType           │
│ role                │     │ description         │
│ isVerified          │     │ severity            │
│ createdAt           │     │ location (POINT)    │
│ savedLocations[]    │     │ address             │
└─────────────────────┘     │ occurredAt          │
                            │ status              │
                            │ verificationCount   │
                            │ denialCount         │
                            │ createdAt           │
                            └─────────────────────┘
                                      │
                                      │
                            ┌─────────────────────┐
                            │   CrimeValidation   │
                            ├─────────────────────┤
                            │ id (PK)             │
                            │ reportId (FK)       │
                            │ userId (FK)         │
                            │ type (confirm/deny) │
                            │ createdAt           │
                            └─────────────────────┘
```

### 5.2 Crime Report Schema

```typescript
// Prisma Schema Definition
model CrimeReport {
  id                String   @id @default(cuid())
  userId            String
  crimeType         CrimeType
  description       String
  severity          Severity
  location          Unsupported("GEOGRAPHY(Point, 4326)")
  address           String
  occurredAt        DateTime
  status            ReportStatus @default(UNVERIFIED)
  verificationCount Int      @default(0)
  denialCount       Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id])
  validations       CrimeValidation[]

  @@index([location], type: Gist)
  @@index([crimeType])
  @@index([occurredAt])
}

enum CrimeType {
  ROBBERY
  HIJACKING
  HARASSMENT
  THEFT
  ASSAULT
  VANDALISM
  OTHER
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum ReportStatus {
  UNVERIFIED
  VERIFIED
  DISPUTED
  HIDDEN
  REMOVED
}
```

### 5.3 Geospatial Queries

PostGIS enables efficient location-based queries:

```sql
-- Find crimes within 2km radius of user location
SELECT * FROM crime_reports
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint($longitude, $latitude), 4326)::geography,
  2000  -- meters
)
AND occurred_at > NOW() - INTERVAL '7 days';

-- Generate heatmap data
SELECT
  ST_X(location::geometry) as lng,
  ST_Y(location::geometry) as lat,
  COUNT(*) as intensity
FROM crime_reports
WHERE occurred_at > NOW() - INTERVAL '30 days'
GROUP BY location;
```

---

## 6. API Design

### 6.1 RESTful Endpoints

#### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login`    | User login        |
| POST   | `/api/auth/logout`   | User logout       |
| GET    | `/api/auth/me`       | Get current user  |

#### Crime Reports

| Method | Endpoint                   | Description                           |
| ------ | -------------------------- | ------------------------------------- |
| GET    | `/api/crimes`              | List crimes (with geospatial filters) |
| GET    | `/api/crimes/:id`          | Get crime details                     |
| POST   | `/api/crimes`              | Submit new crime report               |
| POST   | `/api/crimes/:id/validate` | Confirm or deny a report              |
| GET    | `/api/crimes/heatmap`      | Get heatmap data                      |

#### Analytics

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| GET    | `/api/analytics/trends`  | Crime trends over time     |
| GET    | `/api/analytics/by-type` | Crime distribution by type |
| GET    | `/api/analytics/by-area` | Crime stats by area        |

#### Emergency

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/emergency/nearby` | Nearby police/hospitals |

### 6.2 Request/Response Examples

#### Submit Crime Report

```http
POST /api/crimes
Authorization: Bearer <token>
Content-Type: application/json

{
  "crimeType": "ROBBERY",
  "description": "Two individuals on motorcycle snatched phone near the intersection",
  "severity": "HIGH",
  "location": {
    "lat": 23.7937,
    "lng": 90.4066
  },
  "address": "Road 11, Gulshan 1, Dhaka",
  "occurredAt": "2025-01-02T18:30:00Z"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "crimeType": "ROBBERY",
    "status": "UNVERIFIED",
    "verificationCount": 0,
    "createdAt": "2025-01-02T19:00:00Z"
  }
}
```

---

## 7. Security Architecture

### 7.1 Authentication Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │         │ Backend │         │   DB    │
└────┬────┘         └────┬────┘         └────┬────┘
     │   Login Request   │                   │
     │──────────────────>│                   │
     │                   │   Verify Creds    │
     │                   │──────────────────>│
     │                   │   User Data       │
     │                   │<──────────────────│
     │   JWT Token       │                   │
     │<──────────────────│                   │
     │                   │                   │
     │   API Request     │                   │
     │   + JWT Header    │                   │
     │──────────────────>│                   │
     │                   │   Validate JWT    │
     │                   │   (Stateless)     │
     │   Response        │                   │
     │<──────────────────│                   │
```

### 7.2 Security Measures

| Layer              | Measure               | Implementation                               |
| ------------------ | --------------------- | -------------------------------------------- |
| **Transport**      | TLS/SSL               | HTTPS for all communications                 |
| **Authentication** | JWT                   | Short-lived tokens (15 min) + refresh tokens |
| **Password**       | Bcrypt                | Salted hashing with 12 rounds                |
| **API**            | Rate Limiting         | 100 req/min per IP, 10 reports/hour per user |
| **Input**          | Validation            | Zod schema validation on all inputs          |
| **Database**       | Parameterized Queries | Prisma ORM prevents SQL injection            |
| **CORS**           | Whitelist             | Only allowed origins can access API          |

### 7.3 Privacy Protection

- **Anonymous Reporting**: User IDs are never exposed in public responses
- **Location Fuzzing**: Saved home/work locations are stored with reduced precision
- **Data Encryption**: Sensitive user data encrypted at rest
- **Audit Logs**: All moderation actions are logged

### 7.4 Role-Based Access Control (RBAC)

The system uses a simple role hierarchy with four levels:

#### Role Hierarchy

```
SUPER_ADMIN (Level 3)
    │
    ▼
  ADMIN (Level 2)
    │
    ▼
MODERATOR (Level 1)
    │
    ▼
   USER (Level 0)
```

#### Role Definitions

| Role            | Description              | Use Case                              |
| --------------- | ------------------------ | ------------------------------------- |
| **USER**        | Default registered user  | Citizens reporting and viewing crimes |
| **MODERATOR**   | Trusted community member | First-line content moderation         |
| **ADMIN**       | Platform manager         | Full platform management              |
| **SUPER_ADMIN** | System owner             | Technical administration              |

#### Permissions Matrix

| Permission                 | USER | MODERATOR | ADMIN | SUPER_ADMIN |
| -------------------------- | :--: | :-------: | :---: | :---------: |
| View crime map             |  ✓   |     ✓     |   ✓   |      ✓      |
| Submit crime report        |  ✓   |     ✓     |   ✓   |      ✓      |
| Validate/deny reports      |  ✓   |     ✓     |   ✓   |      ✓      |
| Save locations             |  ✓   |     ✓     |   ✓   |      ✓      |
| Receive alerts             |  ✓   |     ✓     |   ✓   |      ✓      |
| Flag suspicious reports    |  –   |     ✓     |   ✓   |      ✓      |
| Hide reports temporarily   |  –   |     ✓     |   ✓   |      ✓      |
| View moderation queue      |  –   |     ✓     |   ✓   |      ✓      |
| Remove reports permanently |  –   |     –     |   ✓   |      ✓      |
| Suspend/ban users          |  –   |     –     |   ✓   |      ✓      |
| View full analytics        |  –   |     –     |   ✓   |      ✓      |
| Manage moderators          |  –   |     –     |   ✓   |      ✓      |
| Manage admins              |  –   |     –     |   –   |      ✓      |
| System configuration       |  –   |     –     |   –   |      ✓      |
| View audit logs            |  –   |     –     |   –   |      ✓      |

#### Role Enum Schema

```typescript
// Prisma Schema
enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(USER)
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  reports       CrimeReport[]
  validations   CrimeValidation[]
}
```

#### Authorization Middleware

```typescript
// Role hierarchy for permission checks
const roleHierarchy: Record<UserRole, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

// Middleware to check minimum required role
function requireRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || "USER";

    if (roleHierarchy[userRole] >= roleHierarchy[minRole]) {
      next();
    } else {
      res.status(403).json({ error: "Insufficient permissions" });
    }
  };
}

// Usage example
app.delete(
  "/api/crimes/:id",
  requireAuth,
  requireRole("ADMIN"),
  deleteCrimeReport
);
```

---

## 8. Real-Time Communication

### 8.1 Socket.io Events

```typescript
// Client -> Server Events
interface ClientToServerEvents {
  "location:subscribe": (coords: {
    lat: number;
    lng: number;
    radius: number;
  }) => void;
  "location:unsubscribe": () => void;
}

// Server -> Client Events
interface ServerToClientEvents {
  "alert:new-crime": (data: CrimeAlertPayload) => void;
  "crime:updated": (data: CrimeUpdatePayload) => void;
  "crime:verified": (data: { reportId: string }) => void;
}
```

### 8.2 Alert Distribution Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         New Crime Report                              │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Geospatial Query Service                           │
│  Find all users subscribed within X radius of crime location          │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Socket.io Broadcast                                │
│  Emit "alert:new-crime" to matching user rooms                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance & Scalability

### 10.1 Optimization Strategies

| Strategy               | Implementation                       |
| ---------------------- | ------------------------------------ |
| **Database Indexing**  | GiST indexes on spatial columns      |
| **Query Optimization** | Spatial bounding box pre-filtering   |
| **Caching**            | TanStack Query client-side cache     |
| **Map Clustering**     | Marker clustering at low zoom levels |
| **Lazy Loading**       | Code splitting for dashboard/admin   |
| **SSR/SSG**            | Next.js for initial page loads       |

### 10.2 Scalability Path

```
Phase 1 (MVP)              Phase 2 (Growth)           Phase 3 (Scale)
─────────────────          ─────────────────          ─────────────────
Single Server              Horizontal Scaling         Microservices
     │                           │                          │
     │                           │                          │
     ▼                           ▼                          ▼
┌─────────┐              ┌─────────────────┐        ┌───────────────┐
│ Monolith│              │ Load Balanced   │        │ Service Mesh  │
│ Server  │              │ + Read Replicas │        │ + Event Queue │
└─────────┘              └─────────────────┘        └───────────────┘
```

---

## 10. Future Considerations

### 11.1 Planned Enhancements

| Enhancement              | Architectural Impact                         |
| ------------------------ | -------------------------------------------- |
| **Media Uploads**        | Add object storage (S3/Cloudinary)           |
| **AI Credibility**       | Integrate ML service for report scoring      |
| **Mobile App**           | React Native app consuming same API          |
| **Gov Data Integration** | ETL pipeline for official datasets           |
| **Advanced Analytics**   | Time-series database for historical analysis |

### 11.2 Migration Path to Microservices

If scaling demands increase, the following services can be extracted:

1. **Auth Service** - User authentication and authorization
2. **Crime Service** - Report management and validation
3. **Notification Service** - Real-time alerts and push notifications
4. **Analytics Service** - Data aggregation and statistics
5. **Geospatial Service** - Location-based queries

---

## 11. DevOps & Tooling

| Component           | Technology   | Purpose                     |
| ------------------- | ------------ | --------------------------- |
| **Version Control** | Git + GitHub | Source code management      |
| **Package Manager** | npm / pnpm   | Dependency management       |
| **Error Tracking**  | Sentry       | Production error monitoring |

---

## Document Information

| Field            | Value                 |
| ---------------- | --------------------- |
| **Version**      | 1.0                   |
| **Last Updated** | January 2, 2026       |
| **Status**       | Draft                 |
| **Authors**      | Crime Tracker BD Team |

---

_This architecture document is a living document and will be updated as the system evolves._
