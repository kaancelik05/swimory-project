# Swimory Backend

This package hosts the NestJS GraphQL API for Swimory. It is scaffolded for pnpm workspace usage and will expose the code-first schema defined in `docs/architecture.md`.

## Scripts
- `pnpm --filter @swimory/backend start:dev` - Run the NestJS server in watch mode.
- `pnpm --filter @swimory/backend build` - Compile TypeScript sources into the `dist` directory.

Further modules (auth, locations, reviews, reservations) will be added in subsequent iterations.
