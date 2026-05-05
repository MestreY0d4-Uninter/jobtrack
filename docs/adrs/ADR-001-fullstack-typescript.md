# ADR-001 — Usar stack full-stack TypeScript

Status: Aceita
Data: 2026-05-04

## Contexto

O projeto precisa demonstrar um sistema web completo, com interface, API, persistência, validação, testes e CI. JavaScript/TypeScript, React, Node.js, APIs REST, Git e SQL aparecem com frequência em vagas de desenvolvimento web.

Também é importante manter a base pequena o suficiente para ser entendida e rodada por outra pessoa.

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
- Duas linguagens aumentariam a carga de manutenção.
- O objetivo principal do projeto é mostrar uma stack web TypeScript coesa.

### Next.js full-stack

Vantagens:
- Deploy simples e ecossistema popular.

Desvantagens:
- Poderia esconder a separação entre API e front.
- O projeto quer deixar API REST, validação e testes de backend explícitos.

## Consequências

Positivas:
- Uma linguagem principal no front e no back.
- Tipagem compartilhando conceitos parecidos entre camadas.
- Boa base para testes e CI.

Negativas:
- Ecossistema JS/TS pode gerar excesso de configuração.
- É preciso controlar escopo e evitar dependências desnecessárias.

## Guardrails

- Não adicionar bibliotecas sem necessidade clara.
- Não implementar autenticação na versão inicial.
- Não aceitar código gerado por IA sem revisão, testes e validação.
- Priorizar regras, API e fluxo principal antes de UI sofisticada.
