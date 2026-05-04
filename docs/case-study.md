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

- A demo pública deverá usar dados fictícios.
- Sem autenticação no MVP.
- Sem notificações reais.

## Próximos passos

- Autenticação para uso pessoal privado.
- Import/export CSV.
- Kanban visual.
- Análise de vagas com IA, mantendo validação humana.
