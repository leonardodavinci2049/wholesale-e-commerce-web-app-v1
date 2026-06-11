# Wholesale E-Commerce Web App

Multi-tenant B2B wholesale e-commerce web application built with Next.js App Router. The platform combines a public institutional storefront with a protected customer dashboard for registered resellers and wholesale buyers.

The public experience presents the company, product categories, brands, commercial information, contact channels, and physical store details. Authenticated customers can access a purchasing area with product catalog browsing, order creation, order tracking, reports, CRM-related workflows, and account management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [External Services](#external-services)
- [Authentication](#authentication)
- [Caching](#caching)
- [Code Quality](#code-quality)
- [Development Notes](#development-notes)

## Features

- Public institutional website for a wholesale business.
- Product category, brand, and product discovery flows.
- Protected B2B customer area with authentication.
- Customer purchasing dashboard with catalog, orders, budgets, reports, and profile pages.
- CRM area for leads, pipeline, tasks, reports, and related customer workflows.
- Administrative user management and settings sections.
- External API integration layer for products, brands, suppliers, customers, orders, taxonomies, carriers, and product types.
- Local MySQL-backed services for authentication, agenda, CRM, logs, sessions, users, and user metadata.
- Brazilian CEP lookup integration through ViaCEP.
- Asset/image API integration.
- Server-side environment validation with Zod.
- Next.js cache profiles and cache tags for granular invalidation.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Runtime UI:** React 19 with React Compiler enabled
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 and shadcn/ui
- **UI primitives:** Radix UI
- **Icons:** Lucide, Tabler Icons, Hugeicons
- **Forms and validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Authentication:** better-auth with MySQL, OAuth providers, admin plugin, and email flows
- **Database:** MySQL through `mysql2/promise`
- **HTTP client:** Axios
- **Email:** Resend and React Email
- **Charts and reports:** Recharts, React PDF
- **Linting and formatting:** Biome
- **Package manager:** pnpm

## Project Structure

```text
src/
├── app/
│   ├── (home)/              # Public home page
│   ├── (institutional)/     # About, contact, privacy, terms, return, antispam
│   ├── (auth)/              # Sign in, forgot/reset password, logout
│   ├── api/auth/            # better-auth API route
│   ├── actions/             # Next.js Server Actions
│   └── dashboard/           # Protected application area
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Authentication UI
│   ├── dashboard/           # Dashboard UI
│   ├── header/              # Public/header components
│   └── seo/                 # SEO components
├── core/
│   ├── config/              # Server/client env validation
│   └── constants/           # Shared constants
├── database/
│   ├── dbConnection.ts      # MySQL DatabaseService singleton
│   └── schema.ts            # Auto-generated database schema
├── lib/
│   ├── auth/                # better-auth configuration and permissions
│   ├── axios/               # Server Axios client and BaseApiService
│   ├── seo/                 # Metadata and JSON-LD helpers
│   └── cache-config.ts      # Cache tags and cache profile names
├── services/
│   ├── api-main/            # External business API modules
│   ├── api-assets/          # Asset/image API integration
│   ├── api-cep/             # ViaCEP integration
│   └── db/                  # Local MySQL query services
└── types/                   # Shared TypeScript types
```

The application language and locale are **pt-BR**.

## Getting Started

### Prerequisites

- Node.js compatible with Next.js 16
- pnpm
- MySQL database
- Access to the required external APIs
- Resend account for transactional emails
- OAuth credentials for GitHub and Google, if those providers are enabled in the target environment

### Installation

```bash
pnpm install
```

Create a local environment file based on the variables documented below:

```bash
cp .env.example .env
```

If the project does not include an `.env.example` file in your checkout, create `.env` manually and provide the required values.

Start the development server:

```bash
pnpm dev
```

Open the app at:

```text
http://localhost:3000
```

> All application scripts load `.env` through `dotenv-cli`. Do not run `next dev`, `next build`, or `next start` directly.

## Environment Variables

Environment variables are validated at runtime with Zod.

Server-only variables are defined in `src/core/config/envs.server.ts` and guarded by `server-only`:

```env
PORT=
EXTERNAL_API_MAIN_URL=
EXTERNAL_API_ASSETS_URL=
SYSTEM_CLIENT_ID=
APP_ID=
STORE_ID=
ORGANIZATION_ID=
USER_ID=
USER_NAME=
USER_ROLE=
PERSON_ID=
TYPE_BUSINESS=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
API_KEY=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
EMAIL_SENDER_NAME=
EMAIL_SENDER_ADDRESS=
REVALIDATE_SECRET=
WEBHOOK_REVALIDATE_URL1=
WEBHOOK_REVALIDATE_URL2=
```

Client-exposed variables are defined in `src/core/config/envs.client.ts` and must use the `NEXT_PUBLIC_` prefix:

```env
NEXT_PUBLIC_BASE_URL_APP=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_SIDEBAR_TITLE=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DEVELOPER_NAME=
NEXT_PUBLIC_DEVELOPER_URL=
NEXT_PUBLIC_DISCOUNT_CASH_PAYMENT=
NEXT_PUBLIC_PAY_IN_UP_TO=
NEXT_PUBLIC_FREE_SHIPPING_OVER=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Environment files:

- `.env` - base configuration loaded by all package scripts.
- `.env.local` - local overrides, also read by the schema generator.
- `.env.production` - production overrides.

All `.env*` files are ignored by Git.

## Available Scripts

```bash
pnpm dev
```

Runs the Next.js development server with `.env` loaded.

```bash
pnpm build
```

Creates a production build and validates TypeScript through the Next.js build pipeline.

```bash
pnpm start
```

Starts the production server with `.env` loaded.

```bash
pnpm lint
```

Runs `biome check`.

```bash
pnpm format
```

Runs `biome format --write`.

There is currently no dedicated test runner or `typecheck` script. Use `pnpm build` to verify types.

## Database Schema

The project uses MySQL through a singleton `DatabaseService` in `src/database/dbConnection.ts`.

`src/database/schema.ts` is auto-generated by introspecting the configured MySQL database. Do not edit it manually.

Regenerate the schema with:

```bash
node scripts/generate-schema.mjs
```

The generator reads `.env` and `.env.local`, and requires the `DATABASE_*` variables to be configured.

## External Services

Main external API integrations live under `src/services/api-main/`. Each module follows the same structure:

```text
<module>/
├── index.ts
├── <module>-service-api.ts
├── <module>-cached-service.ts
├── types/
├── validation/
└── transformers/
```

The `*-service-api.ts` files perform raw API calls through `BaseApiService`. Cached service files expose functions intended for Server Components and cache-aware data loading.

Additional integrations:

- `src/services/api-assets/` for asset and gallery resources.
- `src/services/api-cep/` for Brazilian postal code lookup through ViaCEP.
- `src/services/db/` for local MySQL-backed application services.

## Authentication

Authentication is configured in `src/lib/auth/auth.ts` with better-auth.

Current capabilities include:

- Email and password authentication.
- Email verification.
- Password reset emails through Resend.
- GitHub and Google OAuth credentials.
- MySQL-backed sessions and users.
- Admin plugin with application roles.
- Session cookie caching and rate limiting.

The auth route handler is located at `src/app/api/auth/`.

## Caching

Next.js cache components are enabled in `next.config.ts`.

Cache profiles are defined in `next.config.ts`, and cache tags/profile names are centralized in `src/lib/cache-config.ts`. The project uses named cache profiles such as:

- `seconds`
- `minutes`
- `frequent`
- `quarter`
- `hours`
- `daily`

Cache tags cover products, categories, brands, suppliers, customers, orders, taxonomies, users, agenda entries, CRM entities, and other domain resources.

## Code Quality

Before opening a pull request or finishing a feature, run:

```bash
pnpm lint
pnpm build
```

Formatting can be applied with:

```bash
pnpm format
```

Biome is the source of truth for linting and formatting. The `src/components/ui/` folder follows relaxed rules for shadcn/ui-generated components through `biome.json` overrides.

## Development Notes

- Use the `@/*` path alias for imports from `src/*`.
- Keep API modules aligned with the existing `api-main/<module>/` structure.
- Do not edit `src/database/schema.ts` manually.
- Keep server-only code behind `import "server-only"` when it reads secrets, database connections, or server APIs.
- Prefer existing service, transformer, validation, and cached-service patterns before introducing new abstractions.
- Public-facing copy and application UI should remain aligned with the pt-BR audience.

## Git Flow

The repository uses git-flow conventions. Feature branches follow:

```text
feature/featr-NNN
```

The release helper script is:

```bash
scripts/git-flow-release.sh
```
