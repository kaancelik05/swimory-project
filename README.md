# Swimory Project

Swimory is a discovery platform for swimming-friendly destinations across Türkiye. This repository contains planning and architecture documentation for the upcoming backend, web, and mobile implementations.

## Contents
- [`docs/architecture.md`](docs/architecture.md): High-level architecture, data model, and roadmap for the MVP.
- `apps/`: Application packages managed via pnpm workspaces (`backend`, `web`, `mobile`).
- `packages/`: Shared libraries (design system, utils) to be implemented.
- `tools/`: Automation scripts and generators.

## Workspace Overview
This repository is configured as a pnpm workspace. Each app lives under `apps/`, sharing dependencies through a single lockfile. Future shared libraries (e.g., design system tokens) will reside in `packages/`.

Common workspace commands:
- `pnpm install` – Install dependencies once for the entire monorepo.
- `pnpm --filter <package> <command>` – Run a script in a specific package (e.g., `pnpm --filter @swimory/backend start:dev`).

## Next Steps
- Scaffold NestJS GraphQL backend modules (auth, users, locations) using Prisma and PostgreSQL integration.
- Initialize Angular web client with Apollo Client and design system tokens.
- Initialize React Native mobile app with Expo and shared design system tokens.
- Establish CI/CD workflows for linting, testing, and deployments.

