# CreatorDeck

A two-sided marketplace connecting **creators** with **brands** for sponsorships, UGC deals, and paid collaborations.

## Quickstart

```bash
# 1. Install
pnpm install

# 2. Copy env
cp .env.example .env.local

# 3. Start Postgres + Redis (docker-compose example below, or use cloud)
# docker run -d --name pg -p 5432:5432 -e POSTGRES_PASSWORD=creatordeck -e POSTGRES_USER=creatordeck -e POSTGRES_DB=creatordeck postgres:16
# docker run -d --name redis -p 6379:6379 redis:7

# 4. Migrate + seed taxonomy
pnpm db:migrate
pnpm db:seed

# 5. Run all apps in dev
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Structure

```
creatordeck/
├── apps/
│   ├── web/        # Next.js 14 (App Router) — brand & creator UI
│   └── api/        # Express — REST API
├── packages/
│   ├── types/      # Shared TS types
│   ├── taxonomy/   # Niche tree as code + DB seeder
│   └── config/     # Shared eslint/tsconfig/tailwind
└── infra/
    └── migrations/ # Numbered SQL migrations (raw psql)
```

See `docs/` (in the spec repo) for full schema, API, and UI specs.
