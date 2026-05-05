# JobTrack — visão técnica

## Problema

Candidaturas ficam espalhadas entre portais, links, anotações e mensagens. Depois de algumas semanas, é difícil lembrar onde aplicar follow-up, quais stacks aparecem com mais frequência e em que etapa cada vaga está.

## Solução

JobTrack organiza candidaturas em um pipeline simples. O usuário registra empresa, vaga, stack, modalidade, status, link e próxima ação. O dashboard resume o volume por status, destaca próximos passos e mostra stacks recorrentes.

## Escopo da versão inicial

Incluído:

- CRUD de candidaturas.
- Filtros por status, modalidade, stack e texto.
- Próxima ação/follow-up.
- Dashboard com resumo do pipeline.
- API REST com validação de payload.
- PostgreSQL com Prisma e migrations.
- Demo front-only com dados de exemplo.
- Testes automatizados e CI.

Fora do escopo:

- Login.
- Multiusuário.
- Scraping.
- Integração com e-mail ou calendário.
- Backend hospedado permanentemente.

## Decisões técnicas

### React + TypeScript + Vite

O front usa React com TypeScript para manter componentes tipados e simples de testar. Vite foi escolhido pela velocidade no desenvolvimento local e pelo build estático usado na demo pública.

### Fastify + TypeScript

A API usa Fastify por ser leve, direta e fácil de testar com `fastify.inject()`. As rotas ficam separadas das regras puras de domínio.

### PostgreSQL + Prisma

PostgreSQL cobre bem o domínio relacional do produto. Prisma documenta o schema, controla migrations e reduz código repetitivo no repository.

### Zod

Os payloads de criação e edição são validados no backend. Isso evita confiar no front e mantém as regras de entrada em um ponto claro.

### Testes

A suíte combina:

- testes unitários para validação, filtros e dashboard;
- testes de rota com `fastify.inject()`;
- testes de integração do repository com PostgreSQL;
- testes de componentes React para o fluxo principal.

## Segurança e privacidade

A demo pública usa dados de exemplo. O projeto não versiona `.env`, não exige dados sensíveis e valida URLs de vaga para aceitar apenas HTTP/HTTPS.

## Validação

Comandos usados para validar a base:

```bash
npm run db:generate
npm run typecheck
npm test
npm run test:integration
npm run build
npm audit --omit=dev --omit=optional
```

O CI do GitHub Actions roda typecheck, testes, migrations, testes de integração e build.

## Limitações conhecidas

- A demo front-only mantém alterações apenas em memória.
- A versão completa requer PostgreSQL local via Docker Compose.
- Não há autenticação nesta fase.
- O dashboard é intencionalmente simples para manter o fluxo principal claro.

## Próximas melhorias

- Importação/exportação CSV.
- Ordenação e filtros salvos.
- Autenticação para uso privado.
- Visualização Kanban se ela melhorar o fluxo sem complicar a experiência.
