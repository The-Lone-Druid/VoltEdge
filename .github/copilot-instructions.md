## VoltEdge AI Coding Agent Instructions

### Project Overview

- VoltEdge is a Next.js (app directory) web application for dealers to generate quotations, calculate GST, estimate battery backup/warranty, and manage product catalogs and landing pages.
- Data is managed via Prisma ORM (PostgreSQL) with schema in `prisma/schema.prisma`.
- UI is built with React and Tailwind CSS, see `src/app/` for main pages and global styles.

### Key Workflows

- **Development:**
  - Start dev server: `npm run dev` (uses Next.js with Turbopack)
  - Build: `npm run build` (runs Prisma generate, then Next.js build)
  - Type-check: `npm run type-check`
  - Lint: `npm run lint` (autofix: `npm run lint:fix`)
  - Format: `npm run format` (check: `npm run format:check`)
- **Database:**
  - Generate client: `npm run db:generate`
  - Push schema: `npm run db:push`
  - Migrate: `npm run db:migrate`
  - Seed: `npm run db:seed` (see `prisma/seed.ts` if present)
  - Studio: `npm run db:studio` (visual DB UI)
  - Reset: `npm run db:reset`
- **Release:**
  - Versioning: `npm run release` (see `.versionrc.json` for commit types)

### Conventions & Patterns

- **TypeScript:** Strict mode, paths alias `@/*` to `src/*` (see `tsconfig.json`).
- **Styling:** Tailwind CSS via PostCSS (`postcss.config.mjs`). Prettier config in `.prettierrc` (uses `prettier-plugin-tailwindcss`).
- **Linting:** ESLint config in `eslint.config.mjs` (extends Next.js, ignores build/output folders).
- **Commits:** Conventional Commits enforced by Commitlint (`commitlint.config.js`).
- **Environment:** Use `.env` for secrets and DB config. See `.env.example` for required variables.
- **Images/Assets:** Store in `public/`.
- **Generated Prisma Client:** Output to `src/generated/prisma/` (ignored by git).

### Architecture & Data Flow

- **App Directory:** All pages/components in `src/app/`. Main entry: `src/app/page.tsx`, layout: `src/app/layout.tsx`.
- **Prisma:** Models defined in `prisma/schema.prisma`. DB connection via `DATABASE_URL` in `.env`.
- **Requirements:** See `.github/requirements.md` for feature epics (GST, battery, quotations, dealer landing page, etc.).

### Integration Points

- **Next.js:** Handles routing, SSR, and API routes (if present).
- **Prisma:** ORM for DB access. Use generated client from `src/generated/prisma`.
- **Email/File Upload:** Configurable via `.env` (see `EMAIL_SERVICE`, `UPLOAD_MAX_SIZE`, etc.).

### Examples

- To add a new dealer feature, reference `.github/requirements.md` for user stories and implement UI in `src/app/`, DB model in `prisma/schema.prisma`, and connect via Prisma client.
- For GST calculation logic, ensure both inclusive/exclusive price views are supported as per Epic 1.

### Tips for AI Agents

> Always check `.github/requirements.md` for feature context before implementing business logic.
> Use project scripts for DB and build tasks; do not run Prisma/Next.js commands directly unless necessary.
> Follow commit and formatting conventions for all code changes.
