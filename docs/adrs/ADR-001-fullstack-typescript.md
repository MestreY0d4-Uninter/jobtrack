# ADR-001 — Usar stack full-stack TypeScript

Status: Aceita
Data: 2026-05-04

## Contexto

O objetivo do primeiro projeto de portfólio é demonstrar fundamentos úteis para vagas de estágio/júnior em Desenvolvimento/TI. A pesquisa de vagas mostrou recorrência de JavaScript/TypeScript, React, Node.js, APIs REST, Git e SQL.

O projeto precisa ser pequeno, testável e fácil de rodar por outro dev/recrutador.

## Decisão

Usar uma stack full-stack TypeScript:

- Front-end: React + TypeScript + Vite.
- Back-end: Node.js + TypeScript + Fastify.
- Testes: Vitest e testes de API via `fastify.inject()`.
- CI: GitHub Actions para build, typecheck e testes.

## Alternativas consideradas

### React + TypeScript + Python/FastAPI

Vantagens:
- Python é forte para automação, dados e IA.
- FastAPI é simples para APIs.

Desvantagens:
- Duas linguagens no primeiro projeto aumentam carga cognitiva.
- Vagas coletadas citaram React/Node/TypeScript com frequência forte para web.

### Next.js full-stack

Vantagens:
- Deploy simples e ecossistema popular.

Desvantagens:
- Pode esconder a separação entre API e front para fins didáticos.
- O projeto quer mostrar API REST separada e testes de backend claramente.

## Consequências

Positivas:
- Uma linguagem principal no front e back.
- Stack alinhada a vagas observadas.
- Projeto fácil de explicar no README.
- Boa base para testes e CI.

Negativas:
- Ecossistema JS/TS pode gerar excesso de configuração.
- É preciso controlar escopo e evitar dependências desnecessárias.

## Guardrails

- Não adicionar bibliotecas sem justificar no README ou ADR.
- Não implementar autenticação no MVP.
- Não usar IA para gerar código sem passar pelo checklist de revisão IA.
- Priorizar testes para regras e API antes de UI sofisticada.
