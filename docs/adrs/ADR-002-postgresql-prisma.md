# ADR-002 — Usar PostgreSQL com Prisma

Status: Aceita
Data: 2026-05-04

## Contexto

O projeto precisa demonstrar modelagem de dados, migrations e integração entre backend e banco. O domínio tem dados relacionais simples: candidaturas, status, datas, stacks e notas.

## Decisão

Usar PostgreSQL como banco e Prisma como ORM/migration tool.

## Alternativas consideradas

### SQLite

Vantagens:
- Setup local simples.
- Bom para protótipo.

Desvantagens:
- Menos adequado para demonstrar PostgreSQL.
- Diferenças de tipo e arrays podem atrapalhar uma migração posterior.

### SQL puro com node-postgres

Vantagens:
- Mostra SQL explicitamente.
- Menos camada de abstração.

Desvantagens:
- Mais código repetitivo para a primeira versão.
- Mais chance de inconsistência entre validação, queries e migrations.

## Consequências

Positivas:
- Migrations documentam a evolução do schema.
- Prisma acelera CRUD e reduz repetição.
- PostgreSQL é uma escolha reconhecida para aplicações web.

Negativas:
- Exige banco local ou container.
- Prisma adiciona uma ferramenta ao projeto.

## Guardrails

- Manter o schema pequeno.
- Não usar recursos avançados do PostgreSQL sem necessidade.
- Documentar setup com Docker Compose.
- Criar seed com dados de exemplo.
