# JobTrack

[Versão em português](README.pt-BR.md)

Full-stack system for organizing job applications, tracking status, tech stack, work mode, and next actions.

## Demo

Public demo: https://mestrey0d4-uninter.github.io/jobtrack/

![JobTrack dashboard preview](docs/assets/jobtrack-demo-overview.png)

The demo runs in the browser with sample data. For real persistence, run the API and PostgreSQL locally.

## What it does

- Create, edit, list, and delete applications.
- Track pipeline status: `interested`, `applied`, `interview`, `offer`, `rejected`, and `archived`.
- Filter by status, work mode, tech stack, and text search.
- Register a next action for follow-up.
- View a dashboard with totals by status, upcoming actions, and frequent stacks.
- Use a front-only demo mode for quick evaluation without a database.

## Stack

- React + TypeScript + Vite
- Node.js + TypeScript + Fastify
- PostgreSQL + Prisma
- Zod
- Vitest
- GitHub Actions

## Technical documentation

The supporting docs are currently written in Portuguese.

- [Product requirements](docs/product-requirements.md)
- [Implementation plan](docs/plans/implementation-plan.md)
- [Technical overview](docs/case-study.md)
- [ADR-001 — Full-stack TypeScript](docs/adrs/ADR-001-fullstack-typescript.md)
- [ADR-002 — PostgreSQL + Prisma](docs/adrs/ADR-002-postgresql-prisma.md)
- [ADR-003 — Testing strategy](docs/adrs/ADR-003-testing-strategy.md)
- [ADR-004 — Responsible AI usage](docs/adrs/ADR-004-ai-usage-policy.md)

## Security and privacy

The public demo uses sample data. Do not enter personal or sensitive information in a public environment.

Real secrets and connection strings must stay in `.env`, never in the repository. The project keeps `.env.example` with local development values only.

## Run the local demo

To view the front end with sample data, without the API, PostgreSQL, or a real `.env` file:

```bash
npm install
VITE_DEMO_MODE=true npm run dev -w apps/web
```

Then open `http://localhost:5173`.

To create a static demo build:

```bash
VITE_DEMO_MODE=true npm run build -w apps/web
cd apps/web/dist
python3 -m http.server 5173
```

## Run with API and database

```bash
npm install
test -f .env || cp .env.example .env
npm run db:up
npm run db:generate
npm run db:deploy -w apps/api
npm run db:seed -w apps/api
```

The API uses `DATABASE_URL` from `.env`. The local PostgreSQL container is exposed on `localhost:5433` to avoid conflicts with local installations on the default `5432` port.

In two terminals:

```bash
npm run dev -w apps/api
npm run dev -w apps/web
```

Open `http://localhost:5173`.

Vite proxies `/api` requests to `http://localhost:3333`. If the API runs somewhere else, adjust `VITE_API_BASE_URL` in `.env`.

## API

With the server running, the API exposes:

- `GET /health`
- `POST /applications`
- `GET /applications?status=&workMode=&stack=&search=`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /dashboard/summary?today=YYYY-MM-DD`

Create and update payloads are validated with Zod. `DELETE` removes an application; to hide one without deleting it, use `PATCH` and set `status` to `archived`.

## Validation

To run the full validation flow, create the local `.env` from the example and start PostgreSQL before the integration tests:

```bash
test -f .env || cp .env.example .env
npm run db:up
npm run db:generate
npm run db:deploy -w apps/api
npm run typecheck
npm test
npm run test:integration
npm run build
```

## Next steps

- Add CSV import/export.
- Improve saved filters and sorting.
- Evaluate authentication for private usage.
- Evaluate a Kanban view without complicating the main workflow.

## License

MIT. See [LICENSE](LICENSE).
