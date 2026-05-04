# ADR-004 — Política de uso responsável de IA

Status: Aceita
Data: 2026-05-04

## Contexto

A pesquisa mostrou riscos específicos de código gerado por IA: APIs alucinadas, pacotes inexistentes, dependências suspeitas, segurança fraca, testes ruins, edge cases ausentes e excesso de confiança.

O projeto pode usar IA como apoio, mas precisa demonstrar responsabilidade técnica.

## Decisão

Usar IA somente como ferramenta auxiliar, com validação obrigatória antes de aceitar qualquer código ou decisão.

## Checklist obrigatório

Antes de aceitar código gerado ou alterado com IA:

1. Entender e conseguir explicar o código.
2. Verificar se resolve o requisito real.
3. Verificar APIs e dependências sugeridas.
4. Rodar testes/typecheck/build.
5. Revisar segurança básica: validação, secrets, SQL, erros e output não confiável.
6. Confirmar que testes não foram removidos/enfraquecidos.
7. Atualizar README/ADR se a decisão afetar uso ou arquitetura.

## Guardrails

- Não instalar pacote sugerido por IA sem verificar existência, manutenção e necessidade.
- Não usar `eval`, `exec`, shell command ou SQL cru gerado por IA.
- Não aceitar código que não tenha teste para comportamento principal.
- Não colocar dados reais de candidatura na demo pública.

## Consequências

Positivas:
- Transforma IA em diferencial de maturidade, não risco.
- Dá assunto bom para case study e entrevistas.

Negativas:
- Mais lento que aceitar sugestões diretamente.
- Exige revisão consciente a cada mudança relevante.
