# ADR-004 — Política de uso responsável de IA

Status: Aceita
Data: 2026-05-04

## Contexto

Código gerado por IA pode trazer APIs inexistentes, pacotes desnecessários, dependências suspeitas, falhas de segurança, testes fracos, edge cases ausentes e excesso de confiança.

O projeto pode usar IA como apoio, mas qualquer código ou decisão precisa passar por validação técnica antes de entrar no repositório.

## Decisão

Usar IA somente como ferramenta auxiliar, com revisão obrigatória antes de aceitar código, dependências ou decisões arquiteturais.

## Checklist obrigatório

Antes de aceitar código gerado ou alterado com IA:

1. Entender e conseguir explicar o código.
2. Verificar se resolve o requisito real.
3. Verificar APIs e dependências sugeridas.
4. Rodar testes, typecheck e build.
5. Revisar segurança básica: validação, secrets, SQL, erros e output não confiável.
6. Confirmar que testes não foram removidos ou enfraquecidos.
7. Atualizar README ou ADR se a decisão afetar uso ou arquitetura.

## Guardrails

- Não instalar pacote sugerido por IA sem verificar existência, manutenção e necessidade.
- Não usar `eval`, `exec`, shell command ou SQL cru gerado por IA.
- Não aceitar código sem teste para o comportamento principal.
- Não colocar dados reais de candidatura na demo pública.

## Consequências

Positivas:
- IA acelera pesquisa e revisão sem substituir validação.
- O projeto mantém rastreabilidade técnica.

Negativas:
- Mais lento que aceitar sugestões diretamente.
- Exige revisão consciente a cada mudança relevante.
