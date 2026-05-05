# ADR-003 — Estratégia de testes

Status: Aceita
Data: 2026-05-04

## Contexto

O projeto deve demonstrar qualidade além do funcionamento visual. Testes automatizados e CI tornam o comportamento verificável e reduzem risco de regressão.

## Decisão

Adotar uma pirâmide simples:

1. Testes unitários para validação, filtros, status e transformações.
2. Testes de API para endpoints críticos com `fastify.inject()`.
3. Testes de integração do repository com PostgreSQL.
4. Testes de UI para o fluxo principal.
5. CI rodando typecheck, testes e build.

## Política TDD

- Para regra de negócio e API: escrever teste antes da implementação quando o comportamento ainda não estiver coberto.
- Verificar RED: teste falha pelo motivo esperado.
- Implementar mínimo para GREEN.
- Refatorar depois de verde.

## Fora do escopo inicial

- E2E com Playwright.
- Testes visuais.
- Cobertura forçada por porcentagem.

Esses itens podem entrar depois que o fluxo principal estiver estável.

## Consequências

Positivas:
- Projeto mais confiável.
- README pode mostrar comandos reais de validação.
- Facilita refatoração.

Negativas:
- Leva mais tempo que codar direto.
- Exige disciplina para não adaptar teste ao código.

## Comandos-alvo

- `npm test`
- `npm run test:integration`
- `npm run typecheck`
- `npm run build`
