# ADR-002 — Usar PostgreSQL com Prisma

Status: Aceita
Data: 2026-05-04

## Contexto

O projeto precisa demonstrar SQL/modelagem de dados, migrations e integração backend-banco. As vagas coletadas citam SQL/banco de dados como base recorrente.

O domínio tem dados relacionais simples: candidaturas, status, datas, stacks e notas.

## Decisão

Usar PostgreSQL como banco e Prisma como ORM/migration tool.

## Alternativas consideradas

### SQLite

Vantagens:
- Setup local simples.
- Bom para protótipo.

Desvantagens:
- Menos alinhado à meta de demonstrar PostgreSQL.
- Diferenças de tipo/arrays podem atrapalhar migração para deploy.

### SQL puro com node-postgres

Vantagens:
- Mostra SQL explicitamente.
- Menos camada de abstração.

Desvantagens:
- Mais boilerplate para MVP.
- Mais chance de inconsistência em validação/migrations.

## Consequências

Positivas:
- Migrations documentam evolução do schema.
- Prisma acelera CRUD e reduz boilerplate.
- PostgreSQL é reconhecido em vagas.

Negativas:
- Exige banco local ou container.
- Prisma adiciona ferramenta ao projeto.

## Guardrails

- Manter schema pequeno no MVP.
- Não usar features avançadas do PostgreSQL sem necessidade.
- Documentar setup com Docker Compose para PostgreSQL.
- Criar seed fictício para demo.
