# JobTrack ADS Implementation Plan

> For Hermes: use `subagent-driven-development` only when o repositório existir e o usuário autorizar implementação. Nesta etapa, este documento é plano; não criar código ainda.

Goal: construir o MVP do JobTrack ADS, uma aplicação full-stack para acompanhar candidaturas de estágio/júnior, com API, front-end, banco, testes, CI e documentação de portfólio.

Architecture: monorepo simples com front React/Vite em `apps/web`, API Fastify em `apps/api`, PostgreSQL via Prisma e documentação em `docs/`. O MVP evita login, IA, scraping e integrações externas para manter escopo pequeno e revisável.

Tech Stack: React, TypeScript, Vite, Node.js, Fastify, PostgreSQL, Prisma, Zod, Vitest, GitHub Actions.

---

## Assumptions

- Repositório futuro: `jobtrack-ads`.
- Package manager inicial: npm, por simplicidade e compatibilidade com docs do GitHub Actions.
- Node alvo: 20.19+ ou 22.12+, por compatibilidade com Vite atual.
- Dados reais não entram na demo pública.
- TDD é obrigatório para regras de negócio e endpoints.

## Estrutura alvo

```text
jobtrack-ads/
  README.md
  LICENSE
  .gitignore
  .env.example
  package.json
  docker-compose.yml
  docs/
    adrs/
      ADR-001-fullstack-typescript.md
      ADR-002-postgresql-prisma.md
      ADR-003-testing-strategy.md
      ADR-004-ai-usage-policy.md
    case-study.md
  .github/
    workflows/
      ci.yml
  apps/
    api/
      package.json
      tsconfig.json
      prisma/
        schema.prisma
        seed.ts
      src/
        app.ts
        server.ts
        env.ts
        modules/
          applications/
            application.schema.ts
            application.repository.ts
            application.service.ts
            application.routes.ts
            application.test.ts
          dashboard/
            dashboard.service.ts
            dashboard.routes.ts
            dashboard.test.ts
    web/
      package.json
      index.html
      src/
        main.tsx
        App.tsx
        api/
          client.ts
        features/
          applications/
            ApplicationForm.tsx
            ApplicationList.tsx
            applicationFilters.ts
            applicationFilters.test.ts
          dashboard/
            Dashboard.tsx
        styles.css
```

## Milestone 0 — Repositório e documentação base

### Task 0.1: Criar repositório local

Objective: iniciar o repo sem código de produto.

Files:
- Create: `jobtrack-ads/README.md`
- Create: `jobtrack-ads/.gitignore`
- Create: `jobtrack-ads/LICENSE`

Steps:
1. Criar diretório `jobtrack-ads`.
2. Rodar `git init`.
3. Adicionar README inicial com problema, objetivo e status.
4. Adicionar `.gitignore` para Node, env e build artifacts.
5. Commit: `docs: initialize jobtrack ads project`.

Verification:
- `git status` limpo após commit.
- README abre no GitHub com visão clara do projeto.

### Task 0.2: Adicionar ADRs iniciais

Objective: documentar decisões antes do código.

Files:
- Create: `docs/adrs/ADR-001-fullstack-typescript.md`
- Create: `docs/adrs/ADR-002-postgresql-prisma.md`
- Create: `docs/adrs/ADR-003-testing-strategy.md`
- Create: `docs/adrs/ADR-004-ai-usage-policy.md`

Steps:
1. Copiar ADRs desta pesquisa.
2. Linkar ADRs no README.
3. Commit: `docs: record initial architecture decisions`.

Verification:
- README contém links relativos para os ADRs.

## Milestone 1 — Setup técnico mínimo

### Task 1.1: Criar workspace npm

Objective: preparar monorepo.

Files:
- Create: `package.json`

Suggested root `package.json`:

```json
{
  "name": "jobtrack-ads",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "build": "npm run build --workspaces --if-present"
  }
}
```

Verification:
- `npm -v` funciona.
- `npm test` não falha por ausência de workspaces quando eles ainda não existirem; se falhar, criar workspaces antes.

### Task 1.2: Criar API Fastify mínima

Objective: criar backend testável com healthcheck.

Files:
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/server.ts`
- Test: `apps/api/src/app.test.ts`

TDD:
1. Escrever teste de `GET /health` esperando status 200 e `{ status: 'ok' }`.
2. Rodar: `npm test -w apps/api`.
3. Esperado RED: falha porque app/rota não existem.
4. Implementar `buildApp()` em `app.ts` com rota `/health`.
5. Rodar: `npm test -w apps/api`.
6. Esperado GREEN.

Implementation rule:
- `app.ts` cria e configura o Fastify.
- `server.ts` só inicia porta.
- Testes importam `buildApp()` e usam `app.inject()`.

Commit:
- `feat(api): add fastify healthcheck`

### Task 1.3: Criar front Vite React mínimo

Objective: criar front com página inicial simples.

Files:
- Create under: `apps/web/`

Steps:
1. Criar app com template React TypeScript.
2. Remover boilerplate visual excessivo.
3. Mostrar título “JobTrack ADS” e frase de valor.
4. Adicionar script `typecheck`, `build` e `test` se aplicável.

Verification:
- `npm run build -w apps/web` passa.

Commit:
- `feat(web): add initial react app`

### Task 1.4: Adicionar CI

Objective: validar build/test/typecheck no GitHub.

Files:
- Create: `.github/workflows/ci.yml`

Workflow mínimo:
- checkout
- setup-node 20.x
- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run build`

Verification:
- Workflow passa no primeiro push.

Commit:
- `ci: add node validation workflow`

## Milestone 2 — Domínio e validação

### Task 2.1: Definir schemas Zod de candidatura

Objective: validar entrada antes de tocar no banco.

Files:
- Create: `apps/api/src/modules/applications/application.schema.ts`
- Test: `apps/api/src/modules/applications/application.schema.test.ts`

TDD cases:
- aceita `company` e `role` válidos.
- aplica status padrão `interested` quando ausente.
- rejeita `company` vazio.
- rejeita `role` vazio.
- rejeita `jobUrl` inválida.
- rejeita `notes` acima de 2000 caracteres.

Run:
- `npm test -w apps/api -- application.schema.test.ts`

Commit:
- `feat(api): add application validation schema`

### Task 2.2: Criar função pura de filtros

Objective: testar comportamento de filtros sem banco/UI.

Files:
- Create: `apps/api/src/modules/applications/application.filters.ts`
- Test: `apps/api/src/modules/applications/application.filters.test.ts`

TDD cases:
- filtra por status.
- filtra por workMode.
- filtra por stack case-insensitive.
- filtra por texto em company/role.
- retorna lista vazia quando nada bate.

Commit:
- `feat(api): add application filtering rules`

## Milestone 3 — Banco e repositório

### Task 3.1: Adicionar PostgreSQL local e Prisma

Objective: preparar persistência com migrations.

Files:
- Create: `docker-compose.yml`
- Create: `.env.example`
- Create: `apps/api/prisma/schema.prisma`

Steps:
1. Adicionar PostgreSQL ao Docker Compose.
2. Documentar `DATABASE_URL` em `.env.example`.
3. Criar model `JobApplication` no Prisma.
4. Rodar migration local.

Verification:
- `docker compose up -d db`
- `npx prisma migrate dev -w apps/api` ou comando equivalente documentado.

Commit:
- `feat(api): add prisma postgres schema`

### Task 3.2: Criar repository de candidaturas

Objective: isolar acesso a dados.

Files:
- Create: `apps/api/src/modules/applications/application.repository.ts`
- Test: `apps/api/src/modules/applications/application.repository.test.ts`

Testing approach:
- Preferir teste de integração com banco de teste quando setup estiver pronto.
- Se ficar pesado no MVP, testar service com repository fake e cobrir Prisma indiretamente via endpoints.

Commit:
- `feat(api): add application repository`

## Milestone 4 — API de candidaturas

### Task 4.1: POST /applications

Objective: criar candidatura via API.

Files:
- Modify: `application.routes.ts`
- Test: `application.test.ts`

TDD cases:
- 201 com dados válidos.
- 400 com company vazio.
- 400 com URL inválida.

Run:
- `npm test -w apps/api -- application.test.ts`

Commit:
- `feat(api): create applications endpoint`

### Task 4.2: GET /applications

Objective: listar candidaturas com filtros.

TDD cases:
- retorna lista vazia.
- retorna itens criados.
- filtra por status.
- filtra por stack.
- filtra por texto.

Commit:
- `feat(api): list and filter applications`

### Task 4.3: GET /applications/:id

Objective: buscar detalhe.

TDD cases:
- 200 para id existente.
- 404 para id inexistente.

Commit:
- `feat(api): get application details`

### Task 4.4: PATCH /applications/:id

Objective: editar campos.

TDD cases:
- atualiza notes/stacks/nextActionDate.
- rejeita URL inválida.
- retorna 404 para id inexistente.

Commit:
- `feat(api): update application details`

### Task 4.5: PATCH /applications/:id/status

Objective: alterar status.

TDD cases:
- atualiza status válido.
- rejeita status inválido.
- dashboard reflete novo status.

Commit:
- `feat(api): update application status`

### Task 4.6: DELETE /applications/:id

Objective: permitir remoção de dados.

TDD cases:
- 204 para id existente.
- 404 para id inexistente.
- item removido não aparece na listagem.

Commit:
- `feat(api): delete applications`

## Milestone 5 — Dashboard API

### Task 5.1: Criar summary service

Objective: gerar métricas sem depender da UI.

Files:
- Create: `apps/api/src/modules/dashboard/dashboard.service.ts`
- Test: `apps/api/src/modules/dashboard/dashboard.service.test.ts`

TDD cases:
- conta total por status.
- lista próximas ações vencidas ou nos próximos 7 dias.
- calcula stacks mais frequentes.
- retorna zeros/listas vazias sem candidaturas.

Commit:
- `feat(api): add dashboard summary service`

### Task 5.2: GET /dashboard/summary

Objective: expor métricas via API.

TDD cases:
- 200 com summary vazio.
- 200 com counts e próximas ações após seed/criações.

Commit:
- `feat(api): expose dashboard summary endpoint`

## Milestone 6 — Front-end MVP

### Task 6.1: Criar API client

Objective: centralizar chamadas HTTP.

Files:
- Create: `apps/web/src/api/client.ts`

Verification:
- Build passa.
- Erros da API são tratados em formato previsível.

Commit:
- `feat(web): add api client`

### Task 6.2: Listagem de candidaturas

Objective: renderizar pipeline básico.

Files:
- Create: `apps/web/src/features/applications/ApplicationList.tsx`
- Test: component/unit test se setup estiver pronto.

Acceptance:
- Mostra estado vazio.
- Mostra company, role, status, workMode, stacks e nextActionDate.

Commit:
- `feat(web): list applications`

### Task 6.3: Formulário de candidatura

Objective: criar candidatura pela UI.

Files:
- Create: `apps/web/src/features/applications/ApplicationForm.tsx`

Acceptance:
- Campos obrigatórios têm feedback.
- Submit cria item e atualiza listagem.
- Erro da API aparece ao usuário.

Commit:
- `feat(web): create applications from form`

### Task 6.4: Filtros na UI

Objective: aplicar filtros visíveis.

Files:
- Create/Modify: `applicationFilters.ts`
- Test: `applicationFilters.test.ts`

TDD cases:
- filtro por status.
- filtro por workMode.
- filtro por stack.
- busca texto.

Commit:
- `feat(web): filter applications`

### Task 6.5: Dashboard UI

Objective: exibir summary.

Files:
- Create: `apps/web/src/features/dashboard/Dashboard.tsx`

Acceptance:
- Mostra counts por status.
- Mostra próximas ações.
- Mostra stacks frequentes.
- Não quebra com dados vazios.

Commit:
- `feat(web): show dashboard summary`

## Milestone 7 — Seed, documentação e polish

### Task 7.1: Seed fictício

Objective: facilitar demo e screenshots sem dados reais.

Files:
- Create: `apps/api/prisma/seed.ts`

Acceptance:
- Seed cria candidaturas fictícias com diferentes statuses/stacks.
- README documenta comando.

Commit:
- `chore(api): add demo seed data`

### Task 7.2: README completo

Objective: transformar repo em portfólio legível.

README must include:
- Problema.
- Demo.
- Screenshot/GIF.
- Stack.
- Funcionalidades.
- Setup local.
- Testes.
- API endpoints.
- ADRs.
- Segurança/privacidade.
- Uso responsável de IA.
- Roadmap.

Commit:
- `docs: expand project readme`

### Task 7.3: Case study

Objective: criar narrativa para recrutadores.

Files:
- Create: `docs/case-study.md`

Sections:
- Contexto.
- Problema.
- Escopo MVP.
- Decisões técnicas.
- Testes/validação.
- Limitações.
- Próximos passos.

Commit:
- `docs: add project case study`

### Task 7.4: Revisão final IA/segurança

Objective: aplicar checklist antes de publicar.

Checklist:
- Nenhum secret no repo.
- `.env.example` presente.
- Dados seed fictícios.
- Dependências verificadas.
- Testes passam.
- CI verde.
- README não promete feature ausente.
- ADRs refletem implementação real.

Commands:
- `npm test`
- `npm run typecheck`
- `npm run build`
- `git status --short`

Commit:
- `docs: document validation results` se houver seção de validação.

## Definition of Done do MVP

- API implementa CRUD + dashboard.
- Front implementa listagem, criação, edição/status pelo menos básica, filtros e dashboard.
- Banco usa migration versionada.
- CI verde.
- README permite rodar localmente.
- Demo usa dados fictícios.
- Pelo menos 10 testes úteis.
- ADRs existem e estão linkados.
- Projeto está pronto para ser fixado no GitHub profile.

## Riscos e mitigação

- Risco: escopo crescer para auth, IA e scraping.
  - Mitigação: manter fora do MVP.
- Risco: UI consumir tempo demais.
  - Mitigação: design simples, foco em fluxo funcional.
- Risco: banco local atrapalhar onboarding.
  - Mitigação: Docker Compose + seed + README claro.
- Risco: demo pública receber dados reais.
  - Mitigação: banner/README avisando que demo é pública/fictícia.
- Risco: aceitar código de IA sem revisão.
  - Mitigação: ADR-004 e checklist em todo PR.
