# Swimory Architecture Overview

## Vision
Swimory is a platform for discovering and managing swim-friendly destinations in Türkiye. The product targets both end-users who want to explore coastal spots and business owners who manage these locations. The solution combines a NestJS GraphQL backend, Angular web app, and a React Native mobile application to deliver a cohesive experience across devices.

## High-Level Architecture
- **Clients**
  - Angular web application (desktop and tablet optimized) using Apollo Client for GraphQL requests.
  - React Native mobile application (with Expo) consuming the GraphQL API via Apollo Client.
- **Backend**
  - NestJS application exposing a GraphQL API (code-first approach) with Prisma ORM and PostgreSQL for data persistence.
  - Authentication handled via JWT access tokens and refresh tokens. Passwords stored with bcrypt.
  - Supabase Storage used for hosting and serving image assets via CDN.
- **Infrastructure**
  - Containerized services using Docker Compose for development.
  - Production deployment target: managed PostgreSQL (e.g., Supabase), backend hosted on a Node-compatible environment (e.g., Render, AWS ECS), web app on Vercel/Netlify, and mobile distributed via app stores.
  - CI/CD pipeline (GitHub Actions) handling linting, testing, and deployments.

## Modules and Responsibilities
### Backend (NestJS)
- **Auth Module**: Registration, login, password reset, and session management.
- **User Module**: Manages profiles, favorites, and role-based access control.
- **Location Module**: CRUD for locations, facilities, images, and affiliate links.
- **Review Module**: Handles user reviews, ratings, and moderation workflows.
- **Reservation Module**: Manages reservation records (future enhancement), including status transitions.

### Web Frontend (Angular)
- **Landing & Discovery**: Location listing with filters (region, rating, facilities).
- **Location Detail**: Image gallery, description, facilities, map embed, reviews, and affiliate/reservation CTA buttons.
- **User Area**: Authentication flows, profile settings, favorites list.
- **Business Dashboard**: Location management, affiliate link administration.

### Mobile Frontend (React Native)
- **Home & Search**: Map and list view optimized for mobile usage.
- **Location Detail**: Quick actions for calling, navigating, and reserving.
- **User Features**: Login/register, favorites, review submissions.

## Data Flow
1. Clients authenticate via GraphQL mutations and receive JWT tokens.
2. Authenticated requests include the access token in headers; refresh handled by dedicated mutation.
3. Images uploaded from clients to Supabase Storage; URLs stored in Prisma.
4. Location queries include aggregated review scores, facility metadata, and affiliate links.
5. Business users can create/update locations via protected mutations.

## Database Schema (Prisma)
```
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        Role     @default(USER)
  favorites   Location[] @relation("FavoriteLocations")
  reviews     Review[]
  reservations Reservation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  BUSINESS
  ADMIN
}

model Location {
  id             String    @id @default(cuid())
  name           String
  description    String
  coordinates    Json
  images         String[]
  facilities     String[]
  reviews        Review[]
  affiliateLinks AffiliateLink[]
  favoritedBy    User[]    @relation("FavoriteLocations")
  reservations   Reservation[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Review {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  location   Location @relation(fields: [locationId], references: [id])
  locationId String
  rating     Int
  comment    String
  createdAt  DateTime @default(now())
}

model Reservation {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  location   Location @relation(fields: [locationId], references: [id])
  locationId String
  status     ReservationStatus @default(PENDING)
  date       DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

model AffiliateLink {
  id         String   @id @default(cuid())
  location   Location @relation(fields: [locationId], references: [id])
  locationId String
  url        String
  partnerName String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## API Design (GraphQL)
- **Queries**
  - `me`: Returns authenticated user details and favorites.
  - `locations(filter, pagination)`: Fetches list with search parameters and aggregated ratings.
  - `location(id)`: Detailed location view including reviews and affiliate links.
- **Mutations**
  - `register`, `login`, `refreshToken`.
  - `toggleFavorite(locationId)`.
  - `createLocation`, `updateLocation`, `deleteLocation` (business/admin roles).
  - `createReview`, `updateReview`, `deleteReview`.
  - `addAffiliateLink`, `updateAffiliateLink`, `removeAffiliateLink`.
  - `createReservation`, `updateReservationStatus` (future).

## Security & Permissions
- JWT-based authentication with NestJS guards.
- Role-based access control using decorators (e.g., `@Roles(Role.BUSINESS)`).
- Input validation via class-validator and pipes.
- Audit logging for critical mutations (location updates, affiliate changes).

## Non-Functional Requirements
- **Performance**: Response times under 300ms for standard queries; caching popular listings with Redis (stretch goal).
- **Scalability**: Separate backend and database tiers; CDN for images; ability to scale horizontally.
- **Observability**: Centralized logging (e.g., Logflare) and monitoring (Prometheus + Grafana).
- **Localization**: Turkish primary language with future multi-language support using i18n libraries on clients.
- **Accessibility**: WCAG AA compliance for web components.

## Roadmap
1. **Phase 1**: Auth, location browsing, favorites, reviews.
2. **Phase 2**: Business dashboard, affiliate link management, basic analytics.
3. **Phase 3**: Reservations, payment integration, realtime updates for availability.
4. **Phase 4**: Advanced discovery (personalized recommendations), push notifications, multi-language support.

## Testing Strategy
- Backend: Unit tests with Jest, e2e tests using Supertest + GraphQL; Prisma test database seeded via migrations.
- Web: Component tests with Jest + Testing Library, e2e flows using Cypress.
- Mobile: Jest component tests, Detox for e2e flows.
- CI integrates linting, tests, and type checks for all packages.

## Deployment Considerations
- Infrastructure-as-code with Terraform or Pulumi for reproducible environments.
- Secrets managed via environment variables stored in a secure vault (e.g., Doppler).
- Zero-downtime deploys for backend; rolling updates for mobile via OTA (Expo Updates).

## Design System Implementation
- Shared tokens for colors, typography, spacing, and border radius via CSS variables (web) and theme files (mobile).
- Component library alignment: buttons, cards, inputs, badges built to spec.
- Documentation hosted in Storybook (web) and React Native Storybook (mobile) for consistency.

