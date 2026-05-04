# JobTrack ADS

Tracker de candidaturas para estudantes de ADS/TI organizarem oportunidades de estágio/júnior por status, stack, modalidade e próximas ações.

Status: base inicial em construção. O MVP ainda não está pronto.

## Por que este projeto existe

Durante a busca por estágio, é fácil perder links, datas, requisitos e status das candidaturas. O JobTrack ADS organiza a busca como um pipeline simples e mostra métricas úteis sem depender de planilhas bagunçadas.

## MVP planejado

- Criar, listar, editar e excluir candidaturas.
- Atualizar status: `interested`, `applied`, `interview`, `offer`, `rejected`, `archived`.
- Filtrar por status, modalidade, stack e texto.
- Acompanhar próxima ação/follow-up.
- Dashboard com contagem por status, próximas ações e stacks frequentes.
- Seed com dados fictícios para demonstração.

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

## Como validar a base atual

```bash
npm test
npm run typecheck
npm run build
```

Esses comandos serão ativados durante o setup técnico do Milestone 1.
