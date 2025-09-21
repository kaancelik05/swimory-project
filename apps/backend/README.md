# Swimory Backend

This package hosts the NestJS GraphQL API for Swimory. It now includes the foundational Auth, Users, and Locations modules backed by Prisma ORM and exposes a code-first GraphQL schema aligned with the architecture plan in `docs/architecture.md`.


## Scripts
- `pnpm --filter @swimory/backend start:dev` - Run the NestJS server in watch mode.
- `pnpm --filter @swimory/backend build` - Compile TypeScript sources into the `dist` directory.
- `pnpm --filter @swimory/backend prisma:generate` - Generate the Prisma client after updating the schema.
- `pnpm --filter @swimory/backend prisma:migrate -- --name <migration>` - Run development migrations against the configured PostgreSQL database.
- `pnpm --filter @swimory/backend prisma:studio` - Open Prisma Studio for inspecting data.

## Environment

Set the following environment variables before running the API:

- `DATABASE_URL` – PostgreSQL connection string for Prisma.
- `JWT_SECRET` – Secret key used to sign access tokens (defaults to `swimory-dev-secret` for local development).

## Modules

- **Auth** – Registration and login mutations with JWT issuance.
- **Users** – Queries and mutations for managing Swimory users and their favorites.
- **Locations** – CRUD operations for swim spots, affiliate links, and metadata.

Upcoming modules (reviews, reservations, business dashboards) will build on this foundation.

Further modules (auth, locations, reviews, reservations) will be added in subsequent iterations.
