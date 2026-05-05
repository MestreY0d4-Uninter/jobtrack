# JobTrack — plano de implementação

## Objetivo

Construir um sistema full-stack para acompanhar candidaturas, com front-end React, API Fastify, PostgreSQL, Prisma, testes automatizados, CI e demo pública front-only.

## Arquitetura

```text
apps/web  -> React, TypeScript, Vite
apps/api  -> Fastify, TypeScript, Prisma
docs      -> requisitos, decisões técnicas e visão técnica
.github   -> CI e deploy da demo
```

O front consome `/api` em desenvolvimento. Em modo demo, o front usa um client em memória e não depende da API.

## Etapas

### 1. Base do repositório

- Estrutura de monorepo com workspaces npm.
- `.gitignore`, `.env.example`, README e licença.
- Documentos de requisitos e decisões técnicas.

### 2. Domínio e validação

- Tipos de candidatura, status e modalidade.
- Schemas Zod para criação e edição.
- Filtros puros por status, modalidade, stack e texto.
- Função pura para resumo do dashboard.
- Testes unitários para regras principais.

### 3. Persistência

- PostgreSQL via Docker Compose.
- Prisma schema e migration inicial.
- Seed com dados de exemplo.
- Repository de candidaturas.
- Testes de integração com banco real.

### 4. API

- Fastify com rota `GET /health`.
- Rotas CRUD de candidaturas.
- Rota `GET /dashboard/summary`.
- Testes de rota com `fastify.inject()`.
- Tratamento de erros de validação.

### 5. Front-end

- Layout principal com dashboard, filtros, formulário e lista.
- Client HTTP centralizado.
- Componentes testados com Testing Library.
- Fluxos de criação, edição, exclusão e filtros.

### 6. Demo front-only

- Client em memória ativado por `VITE_DEMO_MODE=true`.
- Dados de exemplo para demonstrar o fluxo sem backend.
- Build estático compatível com GitHub Pages.
- Screenshot versionado no README.

### 7. Publicação e validação

- CI com typecheck, testes, migrations, testes de integração e build.
- Demo estática em URL pública.
- README com instruções de setup, demo, API e validação.
- Revisão de segurança básica antes de cada publicação.

## Critérios de pronto

- `npm test` passa.
- `npm run test:integration` passa com PostgreSQL.
- `npm run typecheck` passa.
- `npm run build` passa.
- `npm audit --omit=dev --omit=optional` não aponta vulnerabilidade runtime.
- Demo pública abre sem backend.
- README permite reproduzir o projeto localmente.
