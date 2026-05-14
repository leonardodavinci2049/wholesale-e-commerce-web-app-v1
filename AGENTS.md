# Wholesale E-Commerce Web App

## Commands

All scripts wrap through `dotenv -e .env` — **never** run `next` directly.

```
pnpm dev          # dev server (reads .env)
pnpm build        # production build (reads .env)
pnpm start        # start production server (reads .env)
pnpm lint         # biome check
pnpm format       # biome format --write
```

No test runner is configured. No `typecheck` script — run `pnpm build` to verify types.

## Architecture

Next.js 16 App Router monolith. Single-package (not a monorepo). Language/locale: **pt-BR**.

### Directory map

| Path | Purpose |
|------|---------|
| `src/app/(auth)/` | Auth pages (sign-in, forgot/reset password, logout). Redirects to `/dashboard` on session. |
| `src/app/dashboard/` | Main app routes. Sub-routes: `agenda/`, `crm/`, `order/`, `product/`, `report/`, `sales-dashboard/`, `settings/`, `users/` |
| `src/app/actions/` | Next.js Server Actions |
| `src/app/api/auth/` | API route handler for better-auth |
| `src/components/ui/` | shadcn/ui components (relaxed Biome rules in `biome.json` overrides) |
| `src/core/config/` | Server envs (`envs.server.ts`, `import "server-only"`) and client envs (`envs.client.ts`). Validated with Zod at parse time. |
| `src/database/` | `dbConnection.ts` — singleton `DatabaseService` wrapping `mysql2/promise`. `schema.ts` is **auto-generated** (see below). |
| `src/services/api-main/` | 20 service modules for external API integration. Each follows the same layer pattern. |
| `src/services/api-assets/` | Asset/image external API |
| `src/services/api-cep/` | Brazilian CEP lookup (ViaCEP) |
| `src/services/db/` | Local DB query modules (agenda, auth, CRM, users, etc.) |
| `src/lib/auth/` | better-auth config + permission roles. `auth.ts` is server-only. |
| `src/lib/axios/` | Shared Axios client (`server-axios-client.ts`) + `BaseApiService` base class |
| `src/lib/cache-config.ts` | Centralized cache tags and profiles for Next.js `'use cache'` directive |

### Service module pattern (`src/services/api-main/<module>/`)

Every module follows this structure — do not deviate:

```
<module>/
├── index.ts                       # Public exports
├── <module>-service-api.ts        # Class extending BaseApiService — raw API calls
├── <module>-cached-service.ts     # Cached wrapper functions for Server Components
├── types/                         # TypeScript interfaces
├── validation/                    # Zod schemas
└── transformers/                  # API entity → UI DTO transforms
```

Each module has its own `AGENTS.md` with endpoint details and type mappings.

## Key tech choices

- **Package manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **React 19** with **React Compiler** enabled (`next.config.ts: reactCompiler: true`)
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config.*`)
- **shadcn/ui** — radix-luma style, path alias `@/components/ui`
- **Biome** for lint + format (not ESLint/Prettier). Config: `biome.json`. Uses `biome check` and `biome format --write`.
- **Zod 4** for validation
- **better-auth** for auth (MySQL-backed, with GitHub + Google OAuth, admin plugin, Resend email)
- **mysql2** for local DB (singleton pool in `DatabaseService`)
- **axios** for external API calls (server-only)
- **Path alias**: `@/*` → `./src/*`

## Database schema

`src/database/schema.ts` is **auto-generated** by introspecting the MySQL database. Do not edit by hand.

Regenerate:
```bash
node scripts/generate-schema.mjs
```
Requires all `DATABASE_*` env vars to be set (reads `.env` + `.env.local`).

## Git workflow

Uses git-flow. Feature branches: `feature/featr-NNN`. Release script:
```bash
scripts/git-flow-release.sh   # finishes feature → creates release → pushes → starts next feature
```

## Env files

- `.env` — base config (loaded by `dotenv-cli` in all npm scripts)
- `.env.local` — local overrides (also read by schema generator)
- `.env.production` — production overrides
- All `.env*` are gitignored
- Server envs use `import "server-only"` guard
- Client envs are `NEXT_PUBLIC_*` only, validated separately in `envs.client.ts`

## Before committing

1. `pnpm lint` (Biome check — will auto-organize imports)
2. `pnpm build` (catches type errors — no separate typecheck command)
