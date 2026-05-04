# JobTrack ADS — README e case study templates

## README.md sugerido

```markdown
# JobTrack ADS

Tracker de candidaturas para estudantes de ADS/TI organizarem oportunidades de estágio/júnior por status, stack, modalidade e próximas ações.

## Demo

- Live demo: a preencher após deploy
- Aviso: a demo usa dados fictícios. Não insira dados pessoais ou sensíveis.

## Por que este projeto existe

Durante a busca por estágio, é fácil perder links, datas, requisitos e status das candidaturas. O JobTrack ADS organiza a busca como um pipeline simples e mostra métricas úteis sem depender de planilhas bagunçadas.

## Funcionalidades

- Criar, listar, editar e excluir candidaturas.
- Atualizar status: interested, applied, interview, offer, rejected, archived.
- Filtrar por status, modalidade, stack e texto.
- Acompanhar próxima ação/follow-up.
- Dashboard com contagem por status, próximas ações e stacks frequentes.
- Seed com dados fictícios para demonstração.

## Stack

- React + TypeScript + Vite
- Node.js + TypeScript + Fastify
- PostgreSQL + Prisma
- Zod
- Vitest
- GitHub Actions

## Como rodar localmente

### Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm
- Docker e Docker Compose

### Setup

```bash
cp .env.example .env
docker compose up -d db
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Testes

```bash
npm test
npm run typecheck
npm run build
```

## API

- GET /health
- GET /applications
- POST /applications
- GET /applications/:id
- PATCH /applications/:id
- PATCH /applications/:id/status
- DELETE /applications/:id
- GET /dashboard/summary

## Decisões técnicas

- [ADR-001 — Full-stack TypeScript](docs/adrs/ADR-001-fullstack-typescript.md)
- [ADR-002 — PostgreSQL + Prisma](docs/adrs/ADR-002-postgresql-prisma.md)
- [ADR-003 — Estratégia de testes](docs/adrs/ADR-003-testing-strategy.md)
- [ADR-004 — Uso responsável de IA](docs/adrs/ADR-004-ai-usage-policy.md)

## Segurança e privacidade

- A demo pública usa dados fictícios.
- Não coloque dados pessoais na demo.
- Secrets ficam em `.env`, não no repositório.
- Inputs são validados no backend.
- Dependências sugeridas por IA são verificadas antes de uso.

## Roadmap

- Kanban drag-and-drop.
- Autenticação para uso pessoal privado.
- Import/export CSV.
- Lembretes reais.
- Análise de vagas com IA validada.
```

## docs/case-study.md sugerido

```markdown
# JobTrack ADS — Case Study

## Contexto

Sou estudante de Análise e Desenvolvimento de Sistemas na Uninter, em Curitiba, buscando estágio em Desenvolvimento/TI. Durante a busca, precisei acompanhar várias oportunidades, requisitos, links, status e próximas ações.

## Problema

Planilhas ajudam, mas ficam bagunçadas quando há muitas vagas. Eu precisava de um fluxo simples para responder:

- Onde já apliquei?
- O que está pendente?
- Quais stacks aparecem mais?
- Quem precisa de follow-up?
- Quais oportunidades devo encerrar?

## Solução

Criei o JobTrack ADS, uma aplicação full-stack para organizar candidaturas em um pipeline simples com filtros, próximas ações e dashboard.

## Escopo do MVP

Incluído:
- CRUD de candidaturas.
- Status e filtros.
- Próxima ação/follow-up.
- Dashboard simples.
- Testes e CI.
- Dados fictícios para demo.

Fora do MVP:
- Login.
- IA.
- Scraping.
- Integração com e-mail/calendário.

## Decisões técnicas

- TypeScript no front e back para reduzir troca de contexto.
- Fastify para API testável via `fastify.inject()`.
- PostgreSQL + Prisma para demonstrar SQL/migrations.
- Vitest e CI para manter feedback rápido.

## Qualidade

- Testes para validação, filtros, endpoints e dashboard.
- README com setup e comandos.
- ADRs para decisões principais.
- Checklist de revisão para código gerado com IA.

## Limitações

- A demo pública usa dados fictícios.
- Sem autenticação no MVP.
- Sem notificações reais.

## Próximos passos

- Autenticação para uso pessoal privado.
- Import/export CSV.
- Kanban visual.
- Análise de vagas com IA, mantendo validação humana.
```
