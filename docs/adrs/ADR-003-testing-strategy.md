# ADR-003 — Estratégia de testes

Status: Aceita
Data: 2026-05-04

## Contexto

O projeto deve demonstrar qualidade, não só funcionamento visual. A pesquisa reforçou Test Pyramid, self-testing code e CI como sinais fortes de engenharia.

## Decisão

Adotar uma pirâmide simples:

1. Muitos testes unitários para validação, filtros, status e transformações.
2. Testes de API para endpoints críticos com `fastify.inject()`.
3. Poucos testes de UI no MVP; foco inicial em comportamento principal e build.
4. CI rodando typecheck, testes e build.

## Política TDD

- Para regra de negócio e API: escrever teste antes da implementação.
- Verificar RED: teste falha pelo motivo esperado.
- Implementar mínimo para GREEN.
- Refatorar depois de verde.

## Fora do MVP

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
- `npm run typecheck`
- `npm run build`
- `npm run lint` se lint for configurado no MVP.
