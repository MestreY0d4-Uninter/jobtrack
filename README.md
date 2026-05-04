# JobTrack ADS

Tracker de candidaturas para estudantes de ADS/TI organizarem oportunidades de estágio/júnior por status, stack, modalidade e próximas ações.

Status: Milestones 0–3 concluídos. A base técnica, validação de domínio, filtros, dashboard, PostgreSQL/Prisma, migration inicial, seed fictício e repository de candidaturas já estão implementados e testados. O MVP ainda não tem rotas CRUD nem fluxo completo no front.

## Por que este projeto existe

Durante a busca por estágio, é fácil perder links, datas, requisitos e status das candidaturas. O JobTrack ADS organiza a busca como um pipeline simples e mostra métricas úteis sem depender de planilhas bagunçadas.

## MVP planejado

- Criar, listar, editar e excluir candidaturas.
- Atualizar status: `interested`, `applied`, `interview`, `offer`, `rejected`, `archived`.
- Filtrar por status, modalidade, stack e texto.
- Acompanhar próxima ação/follow-up.
- Dashboard com contagem por status, próximas ações e stacks frequentes.
- Seed com dados fictícios para demonstração.

## Estado atual

Implementado até agora:
- API Fastify com `GET /health`.
- Schemas Zod para entrada de candidaturas.
- Tipos de domínio para status, modalidade e candidatura.
- Filtros puros por status, modalidade, stack e texto.
- Regras puras de dashboard para contagem por status, próximas ações e stacks frequentes.
- PostgreSQL local via Docker Compose.
- Prisma 7 com driver adapter PostgreSQL, schema, migration inicial e seed fictício.
- Repository de candidaturas com testes de integração.
- Front React/Vite inicial com landing do projeto.
- CI com typecheck, testes unitários, migrations, testes de integração e build.

Ainda falta para fechar o MVP:
- Rotas REST CRUD de candidaturas.
- Rotas de dashboard.
- Integração do front com a API.
- Demo pública com dados fictícios.

## Stack planejada

- React + TypeScript + Vite
- Node.js + TypeScript + Fastify
- PostgreSQL + Prisma
- Zod
- Vitest
- GitHub Actions

## Documentação

- [Requisitos do produto](docs/product-requirements.md)
- [Plano de implementação](docs/plans/jobtrack-ads-implementation-plan.md)
- [Case study](docs/case-study.md)
- [ADR-001 — Full-stack TypeScript](docs/adrs/ADR-001-fullstack-typescript.md)
- [ADR-002 — PostgreSQL + Prisma](docs/adrs/ADR-002-postgresql-prisma.md)
- [ADR-003 — Estratégia de testes](docs/adrs/ADR-003-testing-strategy.md)
- [ADR-004 — Uso responsável de IA](docs/adrs/ADR-004-ai-usage-policy.md)

## Segurança e privacidade

A futura demo pública deve usar dados fictícios. Não insira dados pessoais ou sensíveis em ambiente público.

Secrets devem ficar em `.env`, nunca no repositório. O projeto manterá `.env.example` quando houver variáveis de ambiente.

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:generate
npm run db:deploy -w apps/api
npm run db:seed -w apps/api
```

A API usa `DATABASE_URL` definida no `.env`. O banco local expõe PostgreSQL em `localhost:5433` para evitar conflito com instalações locais na porta padrão `5432`.

## Como validar a base atual

```bash
npm run db:generate
npm run db:deploy -w apps/api
npm run typecheck
npm test
npm run test:integration
npm run build
```
