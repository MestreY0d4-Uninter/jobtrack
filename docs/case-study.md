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

Criei o JobTrack ADS, uma aplicação full-stack para organizar candidaturas em um pipeline simples com filtros, próximas ações e dashboard. Além do fluxo integrado à API, o projeto tem uma demo estática com dados fictícios para facilitar avaliação rápida por recrutadores e visitantes do GitHub.

## Escopo do MVP

Incluído:
- CRUD de candidaturas.
- Status e filtros.
- Próxima ação/follow-up.
- Dashboard simples.
- Testes e CI.
- Dados fictícios para demo.
- Modo demo front-only sem backend/PostgreSQL.
- Screenshot validado para README e apresentação.

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
- Client demo em memória selecionado por `VITE_DEMO_MODE=true`, mantendo o client real como padrão e evitando dependência de banco para avaliação visual.

## Qualidade

- Testes para validação, filtros, repository, endpoints REST, dashboard, client demo e componentes principais do front.
- README com setup, comandos e modo demo estático.
- ADRs para decisões principais.
- Screenshot versionado em `docs/assets/`.
- Checklist de revisão para código gerado com IA.

## Limitações

- A demo pública deve continuar usando apenas dados fictícios.
- Sem autenticação no MVP.
- Sem notificações reais.
- A demo estática roda no navegador e não persiste dados após recarregar a página.

## Progresso atual

- Milestones 0–6 concluídos no repositório local.
- Base técnica criada com monorepo npm, API Fastify, front React/Vite e CI.
- Domínio inicial coberto por testes: schema Zod de candidatura, filtros puros e regras de dashboard.
- Persistência configurada com PostgreSQL local, Prisma 7, migration inicial e seed fictício.
- Repository de candidaturas coberto por teste de integração com banco real.
- Rotas REST de candidaturas implementadas: criar, listar/filtrar, detalhar, editar e excluir.
- Rota `GET /dashboard/summary` implementada usando as regras puras de dashboard.
- Front-end MVP integrado à API com dashboard, filtros, listagem, criação, edição e exclusão.
- Modo demo front-only implementado com dados fictícios em memória.
- Screenshot de apresentação versionado em `docs/assets/jobtrack-ads-demo-overview.png`.
- Próximo bloco técnico: validação final, publicação da demo em URL estável e revisão antes de fixar no GitHub.

## Próximos passos

- Publicar a demo estática em uma URL estável.
- Revisão final de README/case study antes de fixar no GitHub.
- Import/export CSV.
- Autenticação para uso pessoal privado após o MVP.
- Kanban visual.
- Análise de vagas com IA, mantendo validação humana.
