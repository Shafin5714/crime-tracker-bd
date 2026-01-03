# Implementation Plan

## Crime Tracker BD

> A phased implementation roadmap for building the Crime Tracker BD platform.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Phase 1: Foundation & Setup](#2-phase-1-foundation--setup)
3. [Phase 2: Core Backend Development](#3-phase-2-core-backend-development)
4. [Phase 3: Frontend Development](#4-phase-3-frontend-development)
5. [Phase 4: Map & Visualization](#5-phase-4-map--visualization)
6. [Phase 5: Real-Time Features](#6-phase-5-real-time-features)
7. [Phase 6: Testing & QA](#7-phase-6-testing--qa)
8. [Phase 7: Deployment & Launch](#8-phase-7-deployment--launch)
9. [Timeline Summary](#9-timeline-summary)
10. [Risk Mitigation](#10-risk-mitigation)

---

## 1. Project Overview

### Goals

- Build a functional MVP for crime reporting and visualization in Bangladesh
- Enable citizens to view crime data on an interactive map
- Allow anonymous crime report submissions
- Provide real-time location-based safety alerts

### Success Criteria

- [ ] Users can view crime incidents on an interactive map
- [ ] Users can submit crime reports (authenticated & anonymous)
- [ ] Real-time alerts for nearby incidents
- [ ] Admin moderation panel functional
- [ ] System handles 1000+ concurrent users
- [ ] 99.5% uptime target

---

## 2. Phase 1: Foundation & Setup

**Duration:** Week 1-2

### 2.1 Project Initialization

| Task                      | Description                                        | Priority |
| ------------------------- | -------------------------------------------------- | -------- |
| Repository setup          | Initialize Git repo with proper branching strategy | P0       |
| Monorepo structure        | Set up workspace for client and server             | P0       |
| Concurrently setup        | Configure root scripts to run both servers         | P0       |
| Environment configuration | Configure development, staging, production envs    | P0       |
| Documentation             | Set up README, contributing guidelines             | P1       |

### 2.2 Development Environment

```
crime-tracker-bd/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── map/          # Map-specific components
│   │   │   ├── forms/        # Form components
│   │   │   └── common/       # Shared components
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   └── package.json
├── server/                    # Express.js backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Custom middleware
│   │   ├── routes/           # API routes
│   │   ├── schemas/          # Zod schemas
│   │   ├── socket/           # Socket.io handlers
│   │   └── utils/            # Utilities
│   ├── prisma/               # Database schema
│   └── package.json
├── shared/                    # Shared types/utils
├── docs/                      # Documentation
└── .env.example               # Environment template
```

### 2.3 Database Setup

| Task                    | Description                           | Priority |
| ----------------------- | ------------------------------------- | -------- |
| PostgreSQL installation | Set up PostgreSQL 15+ locally         | P0       |
| PostGIS extension       | Enable PostGIS for geospatial queries | P0       |
| Prisma initialization   | Initialize Prisma with PostgreSQL     | P0       |
| Schema design           | Create initial database schema        | P0       |
| Seed data               | Create seed scripts for development   | P1       |

### 2.4 Deliverables

- [ ] Monorepo with client/server structure
- [ ] PostgreSQL + PostGIS running locally
- [ ] Prisma configured with initial schema
- [ ] CI/CD pipeline skeleton (GitHub Actions)
- [ ] Environment variables configured with @t3-oss/env

---

## 3. Phase 2: Core Backend Development

**Duration:** Week 3-5

### 3.1 Authentication System

| Task               | Description                            | Priority |
| ------------------ | -------------------------------------- | -------- |
| User model         | Create User schema with Prisma         | P0       |
| Registration       | Implement user registration with email | P0       |
| Login              | JWT-based authentication               | P0       |
| Password hashing   | Bcrypt integration (12 rounds)         | P0       |
| Token refresh      | Implement refresh token mechanism      | P1       |
| Email verification | Optional email verification flow       | P2       |

```typescript
// Authentication endpoints
POST / api / auth / register; // User registration
POST / api / auth / login; // User login
POST / api / auth / logout; // User logout
POST / api / auth / refresh; // Refresh access token
GET / api / auth / me; // Get current user
```

### 3.2 Crime Report System

| Task              | Description                           | Priority |
| ----------------- | ------------------------------------- | -------- |
| CrimeReport model | Prisma schema with PostGIS location   | P0       |
| Create report     | Submit new crime report               | P0       |
| List reports      | Get reports with geospatial filtering | P0       |
| Report details    | Get single report by ID               | P0       |
| Validation system | Confirm/deny report mechanism         | P1       |
| Status management | Report status transitions             | P1       |

```typescript
// Crime report endpoints
POST /api/crimes              // Submit new report
GET  /api/crimes              // List with filters (bbox, radius, type)
GET  /api/crimes/:id          // Get report details
POST /api/crimes/:id/validate // Confirm or deny report
GET  /api/crimes/heatmap      // Heatmap aggregation data
```

### 3.3 Middleware Implementation

| Middleware            | Purpose                          | Priority |
| --------------------- | -------------------------------- | -------- |
| Auth middleware       | JWT verification                 | P0       |
| Role middleware       | Role-based access control        | P0       |
| Validation middleware | Zod schema validation            | P0       |
| Rate limiting         | express-rate-limit (100 req/min) | P0       |
| Logging               | Morgan HTTP logging              | P1       |
| Security              | Helmet headers                   | P0       |
| CORS                  | Cross-origin configuration       | P0       |
| Error handler         | Global error handling            | P0       |

### 3.4 Role-Based Access Control (RBAC)

| Task                   | Description                                                    | Priority |
| ---------------------- | -------------------------------------------------------------- | -------- |
| UserRole enum          | Add USER, MODERATOR, ADMIN, SUPER_ADMIN roles to Prisma schema | P0       |
| Role hierarchy utility | Implement `roleHierarchy` map and `hasPermission` function     | P0       |
| requireRole middleware | Middleware to check minimum required role for routes           | P0       |
| Role-based endpoints   | Protect admin/moderator routes with role checks                | P0       |
| Super Admin seeding    | Create initial SUPER_ADMIN user in seed script                 | P1       |
| Role management API    | Endpoints for admins to promote/demote users                   | P1       |

```typescript
// Role hierarchy
const roleHierarchy = { USER: 0, MODERATOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };

// Middleware usage
app.delete("/api/crimes/:id", requireAuth, requireRole("ADMIN"), handler);
app.get("/api/users", requireAuth, requireRole("ADMIN"), handler);
app.put(
  "/api/users/:id/role",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  handler
);
```

### 3.5 Deliverables

- [ ] Complete authentication flow
- [ ] RBAC system with 4 roles implemented
- [ ] CRUD operations for crime reports
- [ ] Geospatial queries working (radius search, bounding box)
- [ ] All middleware configured
- [ ] API documentation (Swagger/OpenAPI)

---

## 4. Phase 3: Frontend Development

**Duration:** Week 6-8

### 4.1 Core Application Setup

| Task                   | Description                                 | Priority |
| ---------------------- | ------------------------------------------- | -------- |
| Next.js initialization | App Router configuration                    | P0       |
| TypeScript setup       | Type-safe development environment           | P0       |
| Tailwind CSS setup     | Design system configuration                 | P0       |
| shadcn/ui setup        | Install and configure UI components         | P0       |
| Lucide React           | Icon library integration                    | P0       |
| Redux Toolkit          | Global state management                     | P0       |
| TanStack Query         | Server state caching & synchronization      | P0       |
| Axios instance         | HTTP client with interceptors               | P0       |
| React Hook Form        | Performant form handling                    | P0       |
| Zod                    | Schema validation (shared with backend)     | P0       |
| date-fns               | Date parsing & formatting for timestamps    | P1       |
| next-intl              | Bangla/English internationalization         | P1       |
| next-pwa               | Offline support & installable app           | P1       |
| DOMPurify              | XSS sanitization for user-generated content | P1       |
| @t3-oss/env-nextjs     | Type-safe environment variable validation   | P0       |

### 4.2 Authentication UI

| Component        | Description               | Priority |
| ---------------- | ------------------------- | -------- |
| Login page       | Email/password login form | P0       |
| Register page    | User registration form    | P0       |
| Auth provider    | Context for auth state    | P0       |
| Protected routes | Route guards for auth     | P0       |
| Password reset   | Forgot password flow      | P2       |

### 4.3 Core Pages

| Page         | Route         | Description                     | Priority | Required Role |
| ------------ | ------------- | ------------------------------- | -------- | ------------- |
| Home         | `/`           | Map view with crime markers     | P0       | Public        |
| Report Crime | `/report`     | Crime submission form           | P0       | USER+         |
| Search       | `/search`     | Location-based search           | P1       | Public        |
| Dashboard    | `/dashboard`  | Analytics & statistics          | P1       | ADMIN+        |
| Profile      | `/profile`    | User settings & saved locations | P2       | USER+         |
| Moderation   | `/moderate`   | Report moderation queue         | P1       | MODERATOR+    |
| Admin        | `/admin`      | User & system management        | P1       | ADMIN+        |
| Super Admin  | `/superadmin` | Role management & audit logs    | P1       | SUPER_ADMIN   |

### 4.4 Role-Based UI Components

| Component        | Description                           | Priority |
| ---------------- | ------------------------------------- | -------- |
| RoleGuard        | HOC to protect routes by role         | P0       |
| useAuth hook     | Hook returning user info & role       | P0       |
| RoleIndicator    | Badge showing user's role             | P1       |
| AdminSidebar     | Navigation for admin panel            | P1       |
| PermissionButton | Button that shows/hides based on role | P1       |

### 4.5 API Services & Integration

| Task                    | Description                                     | Priority |
| ----------------------- | ----------------------------------------------- | -------- |
| Axios client setup      | Configure base URL, interceptors, timeout       | P0       |
| Auth interceptor        | Attach JWT token to requests, handle 401s       | P0       |
| TanStack Query provider | QueryClient configuration with defaults         | P0       |
| Auth API service        | Login, register, logout, refresh token          | P0       |
| Crime API service       | CRUD operations, geospatial queries             | P0       |
| User API service        | Profile, role management (admin)                | P1       |
| Error handling utils    | Centralized API error parsing & toast display   | P0       |
| Type definitions        | Request/response types matching backend schemas | P0       |

#### API Client Configuration

```typescript
// services/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401, refresh tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

#### TanStack Query Setup

```typescript
// providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

#### API Service Modules

```
services/
├── api/
│   ├── client.ts          # Axios instance
│   ├── auth.service.ts    # Auth API calls
│   ├── crime.service.ts   # Crime CRUD + geo queries
│   ├── user.service.ts    # User management
│   └── types.ts           # API request/response types
└── hooks/
    ├── useAuth.ts         # Login, register, logout mutations
    ├── useCrimes.ts       # Crime queries & mutations
    ├── useUsers.ts        # Admin user management
    └── useAlerts.ts       # Real-time alert subscriptions
```

#### Custom React Query Hooks

```typescript
// hooks/useCrimes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crimeService } from "@/services/api/crime.service";

// Fetch crimes with geospatial filters
export const useCrimes = (filters: CrimeFilters) => {
  return useQuery({
    queryKey: ["crimes", filters],
    queryFn: () => crimeService.getCrimes(filters),
  });
};

// Submit a new crime report
export const useSubmitCrime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: crimeService.createCrime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crimes"] });
    },
  });
};

// hooks/useAuth.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem("accessToken"),
  });
};
```

#### API Type Definitions

```typescript
// services/api/types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CrimeFilters {
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  radius?: { lat: number; lng: number; distance: number };
  type?: CrimeType;
  startDate?: string;
  endDate?: string;
  status?: CrimeStatus;
}

export interface CreateCrimeRequest {
  title: string;
  description: string;
  type: CrimeType;
  severity: Severity;
  latitude: number;
  longitude: number;
  occurredAt: string;
  isAnonymous?: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

### 4.6 Reusable Components

```
components/
├── common/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── LoadingSpinner.tsx
│   └── Toast.tsx
├── forms/
│   ├── CrimeReportForm.tsx
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── MobileNav.tsx
└── map/
    ├── CrimeMap.tsx
    ├── HeatmapLayer.tsx
    ├── MarkerCluster.tsx
    └── LocationPicker.tsx
```

### 4.7 Deliverables

- [x] Complete authentication UI
- [ ] Crime report submission form
- [ ] Responsive layout (mobile-first)
- [ ] Loading states and error handling
- [ ] Form validation with React Hook Form + Zod
- [ ] Axios client with auth interceptors
- [ ] TanStack Query hooks for all API endpoints
- [ ] API service modules (auth, crimes, users)
- [ ] Type-safe API request/response definitions

---

## 5. Phase 4: Map & Visualization

**Duration:** Week 9-10

### 5.1 Map Implementation

| Task                   | Description                         | Priority |
| ---------------------- | ----------------------------------- | -------- |
| React Leaflet setup    | Base map configuration              | P0       |
| OpenStreetMap tiles    | Tile layer configuration            | P0       |
| Crime markers          | Display crime locations             | P0       |
| leaflet.markercluster  | Group nearby markers at low zoom    | P0       |
| Popup details          | Crime info on marker click          | P0       |
| Location picker        | Select location for reports         | P0       |
| @turf/turf integration | Client-side geospatial calculations | P1       |

### 5.2 Heatmap Visualization

| Task                  | Description              | Priority |
| --------------------- | ------------------------ | -------- |
| Heatmap layer         | Leaflet.heat integration | P1       |
| Intensity calculation | Based on crime density   | P1       |
| Time-based filtering  | Heatmap by date range    | P1       |
| Type-based filtering  | Heatmap by crime type    | P2       |

### 5.3 Analytics Dashboard

| Component          | Description                     | Priority |
| ------------------ | ------------------------------- | -------- |
| Crime trends chart | Line chart over time (Recharts) | P1       |
| Crime by type      | Pie/bar chart distribution      | P1       |
| Area statistics    | Crime stats by district         | P1       |
| Recent activity    | Live feed of reports            | P2       |

### 5.4 Deliverables

- [ ] Interactive map with crime markers
- [ ] Marker clustering for performance
- [ ] Heatmap overlay toggle
- [ ] Analytics dashboard with charts
- [ ] Map filters (type, severity, date range)

---

## 6. Phase 5: Real-Time Features

**Duration:** Week 11-12

### 6.1 Socket.io Integration

| Task              | Description                    | Priority |
| ----------------- | ------------------------------ | -------- |
| Server setup      | Socket.io server configuration | P0       |
| Client connection | Socket.io client integration   | P0       |
| Authentication    | Socket auth with JWT           | P0       |
| Room management   | Location-based rooms           | P1       |

### 6.2 Real-Time Events

```typescript
// Client → Server
"location:subscribe"; // Subscribe to area alerts
"location:unsubscribe"; // Unsubscribe from alerts

// Server → Client
"alert:new-crime"; // New crime in subscribed area
"crime:updated"; // Crime report updated
"crime:verified"; // Crime became verified
```

### 6.3 Alert System

| Feature               | Description                       | Priority |
| --------------------- | --------------------------------- | -------- |
| Proximity alerts      | Notify when crime reported nearby | P0       |
| Saved location alerts | Alerts for home/work areas        | P1       |
| Push notifications    | Browser push notifications        | P2       |
| Alert preferences     | User notification settings        | P2       |

### 6.4 Deliverables

- [ ] Real-time crime alerts working
- [ ] Location-based subscriptions
- [ ] Live map updates
- [ ] User notification preferences

---

## 7. Phase 6: Testing & QA

**Duration:** Week 13-14

### 7.1 Backend Testing

| Type              | Tool              | Coverage Target |
| ----------------- | ----------------- | --------------- |
| Unit tests        | Jest              | 80%             |
| Integration tests | Supertest         | Key endpoints   |
| Database tests    | Prisma test utils | CRUD operations |

### 7.2 Frontend Testing

| Type            | Tool                         | Coverage Target |
| --------------- | ---------------------------- | --------------- |
| Unit tests      | Jest + React Testing Library | 70%             |
| Component tests | Storybook (optional)         | Key components  |
| E2E tests       | Playwright                   | Critical flows  |

### 7.3 Critical Test Flows

1. **User Registration & Login**
2. **Submit Crime Report**
3. **View Map with Crime Data**
4. **Validate/Dispute Report**
5. **Real-time Alert Reception**
6. **Admin Moderation Actions**
7. **Role-Based Access Control**
   - USER cannot access admin routes
   - MODERATOR can hide but not delete reports
   - ADMIN can manage users but not promote to SUPER_ADMIN
   - SUPER_ADMIN can manage all roles

### 7.4 Performance Testing

| Metric            | Target                 | Tool            |
| ----------------- | ---------------------- | --------------- |
| Initial page load | < 2s on 4G             | Lighthouse      |
| API response time | < 200ms (p95)          | Artillery       |
| Map render time   | < 1s with 1000 markers | Performance API |
| Concurrent users  | 1000+                  | k6              |

### 7.5 Deliverables

- [ ] Test suites for backend and frontend
- [ ] CI/CD pipeline with test gates
- [ ] Performance benchmarks documented
- [ ] Bug fixes from QA testing

---

## 8. Phase 7: Deployment & Launch

**Duration:** Week 15-16

### 8.1 Infrastructure Setup

| Component | Service          | Notes                 |
| --------- | ---------------- | --------------------- |
| Frontend  | Vercel           | Automatic deployments |
| Backend   | Railway / Render | Node.js hosting       |
| Database  | Supabase / Neon  | PostgreSQL + PostGIS  |
| Domain    | Custom domain    | SSL certificates      |

### 8.2 Environment Configuration

| Environment | Purpose                | Database         |
| ----------- | ---------------------- | ---------------- |
| Development | Local development      | Local PostgreSQL |
| Staging     | Pre-production testing | Staging DB       |
| Production  | Live application       | Production DB    |

### 8.3 Monitoring & Observability

| Tool              | Purpose          | Priority |
| ----------------- | ---------------- | -------- |
| Sentry            | Error tracking   | P0       |
| Vercel Analytics  | Frontend metrics | P1       |
| Application logs  | Server logging   | P0       |
| Uptime monitoring | Health checks    | P1       |

### 8.4 Launch Checklist

- [ ] All critical bugs fixed
- [ ] Security audit completed
- [ ] Performance targets met
- [ ] Database backups configured
- [ ] Rate limiting verified
- [ ] Error monitoring active
- [ ] Domain and SSL configured
- [ ] Legal/privacy policy pages
- [ ] User documentation ready

### 8.5 Deliverables

- [ ] Production deployment live
- [ ] Monitoring dashboards configured
- [ ] Rollback procedure documented
- [ ] Launch announcement ready

---

## 9. Timeline Summary

```
Week 1-2   ████████░░░░░░░░░░░░░░░░░░░░░░░░  Phase 1: Foundation
Week 3-5   ░░░░░░░░████████████░░░░░░░░░░░░  Phase 2: Backend
Week 6-8   ░░░░░░░░░░░░░░░░░░░░████████████  Phase 3: Frontend
Week 9-10  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██  Phase 4: Map/Viz
Week 11-12 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 5: Real-Time
Week 13-14 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 6: Testing
Week 15-16 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Phase 7: Deployment
```

| Phase     | Duration     | Deliverable                   |
| --------- | ------------ | ----------------------------- |
| Phase 1   | 2 weeks      | Project setup, database ready |
| Phase 2   | 3 weeks      | Complete backend API          |
| Phase 3   | 3 weeks      | Core frontend application     |
| Phase 4   | 2 weeks      | Map and analytics             |
| Phase 5   | 2 weeks      | Real-time features            |
| Phase 6   | 2 weeks      | Testing and bug fixes         |
| Phase 7   | 2 weeks      | Deployment and launch         |
| **Total** | **16 weeks** | **MVP Launch Ready**          |

---

## 10. Risk Mitigation

### Technical Risks

| Risk                   | Probability | Impact | Mitigation                                    |
| ---------------------- | ----------- | ------ | --------------------------------------------- |
| PostGIS complexity     | Medium      | High   | Early prototyping, documentation              |
| Socket.io scaling      | Low         | Medium | Room-based architecture, fallback polling     |
| Map performance        | Medium      | High   | Clustering, lazy loading, tile caching        |
| Third-party API limits | Low         | Medium | OpenStreetMap (no limits), fallback providers |

### Schedule Risks

| Risk               | Probability | Impact | Mitigation                            |
| ------------------ | ----------- | ------ | ------------------------------------- |
| Scope creep        | High        | High   | Strict MVP definition, feature freeze |
| Integration delays | Medium      | Medium | Early API contracts, mocking          |
| Testing bottleneck | Medium      | High   | Parallel testing, automated CI        |

### Contingency Buffer

- **2 weeks buffer** built into schedule
- Non-critical features (P2) can be deferred to post-MVP

---

## Appendix: Priority Definitions

| Priority | Definition                       |
| -------- | -------------------------------- |
| **P0**   | Critical - Must have for MVP     |
| **P1**   | Important - Should have for MVP  |
| **P2**   | Nice to have - Can defer to v1.1 |

---

## Document Information

| Field            | Value                 |
| ---------------- | --------------------- |
| **Version**      | 1.0                   |
| **Last Updated** | January 3, 2026       |
| **Status**       | Draft                 |
| **Authors**      | Crime Tracker BD Team |

---

_This implementation plan is a living document and will be updated as the project progresses._
