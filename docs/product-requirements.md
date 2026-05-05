# JobTrack ADS — requisitos do produto

## Objetivo

Construir uma aplicação full-stack pequena e real para acompanhar candidaturas de estágio/júnior em Desenvolvimento/TI, servindo ao mesmo tempo como ferramenta útil e prova pública de processo profissional no GitHub.

## Frase de posicionamento

JobTrack ADS é um tracker de candidaturas para estudantes de ADS que transforma a busca por estágio em um pipeline organizado, com status, filtros, próximas ações e métricas simples.

## Usuários

### Usuário primário

Estudante de ADS/TI procurando estágio ou vaga júnior, com várias candidaturas em andamento e necessidade de acompanhar status, links, requisitos, notas e próximos passos.

### Usuário secundário

Recrutador, tech lead ou usuário do GitHub avaliando o portfólio. Essa pessoa quer ver se o projeto:
- resolve um problema claro;
- tem README útil;
- roda com instruções claras;
- tem testes;
- tem decisões técnicas documentadas;
- evita complexidade artificial.

## Problema

A busca por estágio fica caótica quando existem muitas vagas, links, requisitos, datas e respostas. Planilhas ajudam, mas podem ficar bagunçadas e não mostram bem pipeline, follow-ups e métricas.

## Hipótese do MVP

Se a aplicação permitir registrar candidaturas, acompanhar status, filtrar oportunidades e visualizar próximas ações/métricas simples, ela já resolve o problema central sem precisar de login, IA, scraping ou integrações externas.

## Escopo MVP

### Incluído

1. Cadastro de candidatura/oportunidade.
2. Listagem de candidaturas.
3. Edição de candidatura.
4. Alteração de status.
5. Exclusão de candidatura.
6. Filtros por status, modalidade, stack e texto livre.
7. Campo de próxima ação/data de follow-up.
8. Dashboard simples com:
   - total por status;
   - próximas ações vencidas ou próximas;
   - stacks mais frequentes.
9. API REST documentada no README.
10. Testes automatizados para regras principais e endpoints críticos.
11. CI no GitHub Actions.
12. Dados seed fictícios para demo.
13. README com setup, testes, decisões, limitações e link de demo quando houver.

### Fora do MVP

- Login/autenticação.
- Multiusuário.
- Calendar integration.
- Email/Gmail sync.
- Scraping de vagas.
- IA para análise de vaga/currículo.
- Upload de currículo.
- Notificações reais por e-mail.
- App mobile.
- Drag-and-drop Kanban.
- Permissões/compartilhamento.

Esses itens ficam fora porque aumentam escopo, segurança e manutenção antes de provar o núcleo.

## Requisito de privacidade para demo

- A demo pública deve usar dados fictícios.
- O README deve avisar: não inserir dados pessoais ou sensíveis na demo pública.
- Variáveis de ambiente devem ficar fora do Git, com `.env.example`.
- Não armazenar e-mail de recrutador como campo obrigatório no MVP.
- Notas podem conter dados sensíveis; por isso a versão pública deve ser tratada como demonstração.

## Modelo de dados inicial

### JobApplication

Campos:
- `id`: UUID.
- `company`: texto obrigatório, 2–120 caracteres.
- `role`: texto obrigatório, 2–160 caracteres.
- `jobUrl`: URL opcional.
- `source`: texto opcional. Ex: LinkedIn, Indeed, Gupy, indicação, site da empresa.
- `location`: texto opcional. Ex: Curitiba, remoto Brasil.
- `workMode`: enum: `remote`, `hybrid`, `onsite`, `unknown`.
- `status`: enum: `interested`, `applied`, `interview`, `offer`, `rejected`, `archived`.
- `dateApplied`: data opcional.
- `nextActionDate`: data opcional.
- `stacks`: lista de strings. Ex: `['React', 'TypeScript', 'SQL']`.
- `notes`: texto opcional, limite inicial 2000 caracteres.
- `createdAt`: timestamp.
- `updatedAt`: timestamp.

### Status permitidos

- `interested`: vaga salva, ainda não aplicada.
- `applied`: candidatura enviada.
- `interview`: em entrevista, teste técnico ou conversa.
- `offer`: proposta recebida.
- `rejected`: encerrada sem avanço.
- `archived`: fechada/ignorada/sem interesse.

## API inicial

- `GET /health`
- `GET /applications`
- `POST /applications`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /dashboard/summary`

A alteração de status usa `PATCH /applications/:id` com o campo `status`, evitando um endpoint separado só para status no MVP.

## Critérios de aceite globais

- O projeto instala com comando documentado.
- O projeto tem `.env.example` e não exige segredo real para rodar localmente.
- O backend valida inputs e retorna erros claros em JSON.
- O front-end não quebra quando a API retorna lista vazia.
- O CI roda build, typecheck e testes.
- O README explica problema, stack, setup, testes, demo, limitações e decisões.

## Histórias e critérios de aceite

### US-01 — Criar candidatura

Como estudante procurando estágio,
quero cadastrar uma oportunidade com empresa, cargo, status e detalhes básicos,
para não perder o controle das vagas que estou acompanhando.

Critérios:
- Given dados válidos com `company` e `role`, when envio o formulário, then a candidatura é criada e aparece na listagem.
- Given `company` vazio, when envio o formulário, then recebo erro de validação e nada é salvo.
- Given `role` vazio, when envio o formulário, then recebo erro de validação e nada é salvo.
- Given `jobUrl` inválida, when envio o formulário, then recebo erro de validação.
- Given nenhum status informado, when crio a candidatura, then o status padrão é `interested`.

### US-02 — Listar candidaturas

Como estudante,
quero ver todas as candidaturas em uma lista organizada,
para decidir onde agir primeiro.

Critérios:
- Given existem candidaturas cadastradas, when acesso a listagem, then vejo empresa, cargo, status, modalidade, stacks e próxima ação.
- Given não existem candidaturas, when acesso a listagem, then vejo estado vazio com orientação para cadastrar a primeira vaga.
- Given candidaturas com próximas ações, when acesso a listagem, then as datas vencidas ou próximas ficam visualmente destacadas.

### US-03 — Filtrar candidaturas

Como estudante,
quero filtrar por status, modalidade, stack e texto,
para encontrar rapidamente oportunidades relevantes.

Critérios:
- Given candidaturas com status diferentes, when filtro por `applied`, then só vejo candidaturas aplicadas.
- Given candidaturas remotas e presenciais, when filtro por `remote`, then só vejo candidaturas remotas.
- Given uma candidatura com stack `React`, when filtro por `React`, then ela aparece no resultado.
- Given busca textual por empresa ou cargo, when digito parte do texto, then resultados compatíveis aparecem.
- Given filtros sem resultado, when aplico o filtro, then vejo mensagem de nenhum resultado.

### US-04 — Atualizar status

Como estudante,
quero atualizar o status de uma candidatura,
para manter meu pipeline realista.

Critérios:
- Given uma candidatura `interested`, when atualizo para `applied`, then o novo status aparece na listagem e detalhe.
- Given status inválido, when envio atualização, then a API retorna erro 400.
- Given candidatura inexistente, when tento atualizar status, then a API retorna 404.
- Given status alterado, when busco o dashboard, then a contagem por status reflete a alteração.

### US-05 — Editar detalhes

Como estudante,
quero editar detalhes de uma candidatura,
para corrigir links, notas, stacks e próxima ação.

Critérios:
- Given uma candidatura existente, when edito `notes`, `stacks` ou `nextActionDate`, then os novos valores são salvos.
- Given edição com URL inválida, when envio, then a API rejeita com erro de validação.
- Given nota acima do limite, when envio, then a API rejeita com erro claro.

### US-06 — Excluir candidatura

Como estudante,
quero excluir uma candidatura,
para remover dados errados ou sensíveis.

Critérios:
- Given candidatura existente, when excluo, then ela some da listagem.
- Given candidatura inexistente, when tento excluir, then a API retorna 404.
- Given exclusão concluída, when busco dashboard, then a contagem total diminui.

### US-07 — Dashboard

Como estudante,
quero ver uma visão geral do pipeline,
para entender minha busca e priorizar ações.

Critérios:
- Given candidaturas com status variados, when acesso dashboard, then vejo total por status.
- Given candidaturas com `nextActionDate` vencida ou nos próximos 7 dias, when acesso dashboard, then elas aparecem em próximas ações.
- Given stacks cadastradas, when acesso dashboard, then vejo as stacks mais frequentes.
- Given zero candidaturas, when acesso dashboard, then vejo zeros e estado vazio sem erro.

### US-08 — Documentação e portfólio

Como visitante do GitHub,
quero entender e rodar o projeto rapidamente,
para avaliar a qualidade técnica.

Critérios:
- Given abro o README, then entendo em menos de 1 minuto o problema, stack e como rodar.
- Given sigo o setup local, then consigo iniciar API e front.
- Given rodo o comando de testes documentado, then os testes executam.
- Given vejo os ADRs, then entendo por que a stack foi escolhida.

## Métricas de sucesso do MVP

- O projeto roda localmente seguindo o README.
- CI verde no GitHub.
- Pelo menos 10 testes automatizados úteis no MVP.
- API cobre create/list/update/delete/dashboard.
- Front cobre fluxo principal sem depender de dados reais sensíveis.
- README e ADRs deixam claro o processo de engenharia.
