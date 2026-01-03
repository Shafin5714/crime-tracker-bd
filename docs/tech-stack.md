# Technology Stack

This document outlines the chosen technology stack for **Crime Tracker BD**, selected for scalability, performance, and developer experience.

## 1. Frontend

The frontend is built for performance and SEO, ensuring a smooth user experience across devices even on slower networks (common in the target demographic).

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
  - _Reasoning_: Provides Server-Side Rendering (SSR) and Static Site Generation (SSG) for fast initial loads and SEO.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - _Reasoning_: Ensures type safety, reducing runtime errors and improving code maintainability.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  - _Reasoning_: Utility-first CSS framework for rapid UI development and easy responsive design.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
  - _Reasoning_: Collection of beautifully designed, accessible, and customizable components built on Radix UI primitives, styled with Tailwind CSS. Components are copy-pasted into the project, giving full control over the code.
- **Icons**: [Lucide React](https://lucide.dev/)
  - _Reasoning_: Clean, consistent, and lightweight icon set.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
  - _Reasoning_: Standardized approach for writing Redux logic, efficient global state management.
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
  - _Reasoning_: Powerful tool for fetching, caching, synchronizing and updating server state.
- **HTTP Client**: [Axios](https://axios-http.com/)
  - _Reasoning_: Promise-based HTTP client with interceptor support for automatically attaching auth tokens and handling API errors globally.
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
  - _Reasoning_: Performant, flexible forms with easy validation integration and minimal re-renders.
- **Schema Validation**: [Zod](https://zod.dev/)
  - _Reasoning_: TypeScript-first schema validation for client-side form validation, shared schemas with backend, and runtime type checking.
- **Date Handling**: [date-fns](https://date-fns.org/)
  - _Reasoning_: Lightweight, modular date utility library for parsing, formatting, and manipulating crime report timestamps.
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
  - _Reasoning_: Full i18n support for Next.js App Router, enabling Bangla and English language support across the platform.
- **PWA Support**: [next-pwa](https://www.npmjs.com/package/next-pwa)
  - _Reasoning_: Enables offline functionality and installable app experience, critical for users in areas with unstable network connectivity.
- **XSS Sanitization**: [DOMPurify](https://github.com/cure53/DOMPurify)
  - _Reasoning_: Sanitizes user-generated content (crime descriptions) to prevent XSS attacks when rendering HTML.
- **Environment Validation**: [@t3-oss/env-nextjs](https://env.t3.gg/)
  - _Reasoning_: Type-safe environment variable validation at build time, preventing runtime errors from missing or invalid configuration.

## 2. Maps & Visualization

The core feature of the application.

- **Map Library**: [Leaflet](https://leafletjs.com/) (via [React Leaflet](https://react-leaflet.js.org/))
  - _Reasoning_: Lightweight, open-source, and mobile-friendly. Avoids the high costs of Google Maps API for a community project.
- **Marker Clustering**: [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
  - _Reasoning_: Groups nearby crime markers at lower zoom levels for better performance and visual clarity.
- **Heatmap Layer**: [leaflet-heat](https://github.com/Leaflet/Leaflet.heat)
  - _Reasoning_: Renders crime density heatmaps for quick visual identification of high-crime areas.
- **Geospatial Analysis**: [@turf/turf](https://turfjs.org/)
  - _Reasoning_: Client-side geospatial calculations for distance, area, and point-in-polygon checks (e.g., "Is user inside danger zone?").
- **Map Tiles**: [OpenStreetMap](https://www.openstreetmap.org/)
  - _Reasoning_: Free and reliable map tile provider.
- **Data Visualization**: [Recharts](https://recharts.org/)
  - _Reasoning_: For displaying crime statistics and trend graphs in the dashboard.

## 3. Backend

A robust and scalable backend to handle concurrent requests and real-time data.

- **Runtime**: [Node.js](https://nodejs.org/)
  - _Reasoning_: Non-blocking I/O model suitable for real-time applications.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - _Reasoning_: Ensures end-to-end type safety across the full stack, enabling shared types between frontend and backend.
- **Framework**: [Express.js](https://expressjs.com/)
  - _Reasoning_: Minimalist and flexible standard for Node.js servers. Easy to structure as a separate micro-service or modular monolith.
- **Validations**: [Zod](https://zod.dev/)
  - _Reasoning_: Schema declaration and validation library to ensure data integrity on incoming requests.
- **Rate Limiting**: [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
  - _Reasoning_: Protects the API from abuse and brute-force attacks by limiting repeated requests.
- **Logging**: [Morgan](https://www.npmjs.com/package/morgan)
  - _Reasoning_: HTTP request logger middleware for monitoring API traffic, debugging, and tracking response times.
- **Security Headers**: [Helmet](https://helmetjs.github.io/)
  - _Reasoning_: Sets various HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, etc.).
- **CORS**: [cors](https://www.npmjs.com/package/cors)
  - _Reasoning_: Enables Cross-Origin Resource Sharing, allowing the frontend to securely communicate with the API.
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) (via swagger-jsdoc + swagger-ui-express)
  - _Reasoning_: Auto-generates interactive API documentation from JSDoc comments, accessible at `/api-docs`. Improves developer experience and API discoverability.

## 4. Database

A relational database with robust geospatial support is chosen to ensure data integrity and scalable location-based queries.

- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Extensions**: [PostGIS](https://postgis.net/)
  - _Reasoning_: The industry-standard spatial database extender for PostgreSQL, providing superior geospatial query capabilities.
- **ORM**: [Prisma](https://www.prisma.io/)
  - _Reasoning_: Modern ORM with excellent TypeScript support, making database interaction type-safe and intuitive.

## 5. Authentication & Security

- **Auth Strategy**: JWT (JSON Web Tokens)
  - _Reasoning_: Stateless authentication suitable for scaling.
- **Encryption**: [Bcrypt](https://www.npmjs.com/package/bcrypt)
  - _Reasoning_: Industry standard for hashing passwords.
- **Error Monitoring**: [Sentry](https://sentry.io/) _(Recommended)_
  - _Reasoning_: Real-time error tracking and performance monitoring for production, enabling quick identification and resolution of issues.

## 6. Real-Time & DevOps

- **Real-Time Updates**: [Socket.io](https://socket.io/)
  - _Reasoning_: For pushing real-time alerts to users in the danger zone without them needing to refresh.
- **Version Control**: [Git](https://git-scm.com/) & GitHub.
- **Package Manager**: npm or pnpm.
- **Monorepo Scripts**: [concurrently](https://www.npmjs.com/package/concurrently)
  - _Reasoning_: Run frontend and backend development servers simultaneously from the root directory with a single command.
