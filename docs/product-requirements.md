# JobTrack — requisitos do produto

## Objetivo

Construir uma aplicação full-stack para acompanhar candidaturas de trabalho em um fluxo claro: registrar oportunidade, acompanhar status, planejar próxima ação e visualizar o andamento geral.

## Resumo

JobTrack é um tracker de candidaturas. Ele transforma uma busca espalhada em abas, links e anotações soltas em um pipeline organizado com filtros, follow-ups e métricas simples.

## Usuário principal

Pessoa em busca de oportunidades de trabalho que precisa acompanhar várias candidaturas ao mesmo tempo, com links, requisitos, status, notas e próximos passos.

## Usuário secundário

Pessoa avaliando o repositório tecnicamente. Essa pessoa quer verificar se o projeto tem escopo claro, código organizado, testes, documentação e instruções reproduzíveis.

## Problema

Candidaturas se perdem facilmente quando há muitas vagas, portais diferentes, datas, requisitos e respostas. Planilhas ajudam, mas não representam bem pipeline, follow-ups e visão geral do processo.

## Hipótese da versão inicial

Um sistema simples com CRUD, status, filtros, próxima ação e dashboard já resolve o problema principal sem exigir login, integrações externas ou automações frágeis.

## Escopo da versão inicial

### Funcionalidades

1. Criar candidatura.
2. Listar candidaturas.
3. Editar candidatura.
4. Excluir candidatura.
5. Arquivar candidatura por status.
6. Filtrar por status.
7. Filtrar por modalidade.
8. Filtrar por stack.
9. Buscar por empresa, vaga, localidade, fonte, notas e stack.
10. Registrar próxima ação.
11. Ver dashboard com total por status.
12. Ver próximas ações.
13. Ver stacks frequentes.
14. Carregar dados de exemplo para demonstração.
15. Rodar validações automatizadas em CI.

### Fora do escopo inicial

- Login e multiusuário.
- Scraping de vagas.
- Integração com e-mail ou calendário.
- IA dentro do produto.
- Drag-and-drop Kanban.
- Hospedagem de backend permanente.

## Regras de segurança e privacidade

- A demo pública deve usar apenas dados de exemplo.
- `.env` nunca deve ser versionado.
- `.env.example` deve conter apenas placeholders ou valores locais descartáveis.
- A API deve validar payloads de entrada com Zod.
- URLs de vaga devem aceitar apenas `http` e `https`.
- O sistema não deve exigir dados pessoais sensíveis.

## Modelo de candidatura

Campos principais:

- `id`
- `company`
- `role`
- `jobUrl`
- `source`
- `location`
- `workMode`
- `status`
- `dateApplied`
- `nextActionDate`
- `stacks`
- `notes`
- `createdAt`
- `updatedAt`

Status aceitos:

- `interested`
- `applied`
- `interview`
- `offer`
- `rejected`
- `archived`

Modalidades aceitas:

- `remote`
- `hybrid`
- `onsite`
- `unknown`

## API

A alteração de status usa `PATCH /applications/:id` com o campo `status`, evitando um endpoint separado só para essa operação.

Endpoints:

- `GET /health`
- `POST /applications`
- `GET /applications?status=&workMode=&stack=&search=`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /dashboard/summary?today=YYYY-MM-DD`

## Histórias de usuário

### US-01 — Criar candidatura

Como pessoa em busca de oportunidades,
quero cadastrar uma vaga com empresa, cargo, link, stack e status,
para não perder informações importantes.

Critérios de aceite:

- Empresa e vaga são obrigatórias.
- Stack pode receber múltiplos valores.
- URL, quando enviada, precisa ser HTTP ou HTTPS.
- A candidatura aparece na lista após salvar.

### US-02 — Filtrar candidaturas

Como pessoa em busca de oportunidades,
quero filtrar por status, modalidade, stack e texto,
para encontrar rapidamente o que preciso revisar.

Critérios de aceite:

- Filtro vazio mostra todos os registros.
- Busca textual considera empresa, vaga, localidade, fonte, notas e stack.
- Combinação de filtros deve funcionar em conjunto.

### US-03 — Acompanhar próximas ações

Como pessoa em busca de oportunidades,
quero registrar uma próxima ação,
para saber quando revisar ou responder uma candidatura.

Critérios de aceite:

- Data de próxima ação é opcional.
- Dashboard lista próximas ações ordenadas por data.

### US-04 — Dashboard

Como usuário,
quero ver um resumo do pipeline,
para entender rapidamente o andamento das candidaturas.

Critérios de aceite:

- Mostra total de candidaturas.
- Mostra contagem por status.
- Mostra próximas ações.
- Mostra stacks mais frequentes.

### US-05 — Documentação técnica

Como pessoa avaliando o projeto,
quero instruções claras de setup, teste e build,
para reproduzir o funcionamento sem depender do autor.

Critérios de aceite:

- README explica demo local, API, banco e validação.
- ADRs registram decisões técnicas relevantes.
- CI executa testes e build.

## Métricas de sucesso

- Setup local documentado e reproduzível.
- Testes unitários e de integração cobrindo o comportamento principal.
- Build do front e da API sem erro.
- CI verde no GitHub Actions.
- Demo pública acessível sem backend.
