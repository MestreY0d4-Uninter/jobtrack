# JobTrack ADS — research addendum

Data: 2026-05-04
Escopo: solidificar o plano do primeiro projeto de portfólio com fontes adicionais sobre job trackers, critérios de aceite, README e segurança de repositório.

## Fontes adicionais usadas no Loop 7

1. ApplyWave — Job Application Tracker
   https://applywave.app/features/job-tracker
   - Um job tracker útil organiza a busca como pipeline visual.
   - Features recorrentes: estágios Saved/Applied/Interview/Offer/Rejected, follow-up reminders, analytics, notes, contacts e calendar integration.
   - Insight para o MVP: não precisa copiar tudo; o núcleo é registrar oportunidades, status, próximas ações e métricas simples.

2. JobShinobi — Job Application Tracker Template Columns to Include
   https://www.jobshinobi.com/blog/job-application-tracker-template-columns-to-include
   - Trata busca por emprego como problema de pipeline.
   - Campos essenciais citados: company, role, job URL, source, location, work mode, date applied, status, next action date e notes.
   - Regra “decision-first”: cada campo deve ajudar uma decisão prática, como onde aplicar, quem acompanhar, o que preparar e quando encerrar.

3. Scrum Alliance — Acceptance Criteria
   https://resources.scrumalliance.org/Article/need-know-acceptance-criteria
   - Critérios de aceite são condições pass/fail para aceitar uma história ou incremento.
   - Devem ser claros, concisos, verificáveis e focados no resultado, não na implementação.
   - Formato Given/When/Then é adequado para comportamento testável.

4. GitHub Docs — About README files
   https://docs.github.com/github/creating-cloning-and-archiving-repositories/about-readmes
   - README deve explicar o que o projeto faz, por que é útil, como começar, onde buscar ajuda e quem mantém/contribui.
   - É geralmente o primeiro item visto por visitantes do repositório.

5. GitHub Docs — Best practices for repositories
   https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories
   - Repositórios devem ter README.
   - GitHub recomenda recursos de segurança em repositórios públicos: Dependabot alerts, secret scanning, push protection e code scanning.

## Decisões reforçadas pela pesquisa

- O MVP deve ser pequeno, mas útil: registrar candidatura, status, próxima ação e visão geral do pipeline.
- O projeto deve ter uma história clara para recrutadores: “organizei minha busca por estágio e construí uma ferramenta real para isso”.
- Campos demais viram ruído. Para o MVP, incluir só campos que apoiam decisões: aplicar, acompanhar, preparar, medir e encerrar.
- Dados de busca por emprego são sensíveis. A demo pública deve usar dados fictícios e avisar para não inserir dados pessoais.
- Critérios de aceite precisam ser testáveis e guiar TDD.
