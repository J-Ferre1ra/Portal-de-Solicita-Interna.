# Plano de execução baseado nos requisitos oficiais

Este plano usa como fonte de escopo o PDF da bit Soluções. O roadmap de apoio não é tratado como requisito quando sugere tecnologias, comportamentos ou telas que a empresa não pediu.

## Fase 1 — Fundação e dados

- Inicializar `backend/` com Node.js e Express e `frontend/` com React, Vite e Tailwind CSS.
- Criar as tabelas de usuários e solicitações, com chave estrangeira para o solicitante, data e status iniciais definidos pelo banco e validação dos valores aceitos.
- Guardar senha como hash, nunca em texto puro.
- Manter o esquema SQL como forma reproduzível de criar o SQLite local.

## Fase 2 — Acesso e sessão

- Implementar login com usuário e senha, sessão autenticada e logout.
- Proteger a API para que solicitações e indicadores só sejam acessíveis após autenticação.
- Documentar credenciais de demonstração para facilitar a avaliação. Um usuário seed é uma decisão de execução, não um requisito de negócio.

## Fase 3 — API das solicitações

- Implementar criação com solicitante autenticado, data automática e status inicial `Aberto`.
- Implementar listagem, detalhes, edição e exclusão; permitir edição e exclusão apenas enquanto a solicitação estiver `Aberto`.
- Implementar alteração de status entre `Aberto`, `Em Atendimento` e `Concluído`.
- Aplicar filtros oficiais no servidor: período, categoria, status e texto no título.
- Retornar erros e validações de forma consistente.

## Fase 4 — Interface e integração

- Criar tela de login e telas necessárias para dashboard e gerenciamento de solicitações.
- Mostrar os quatro indicadores pedidos: total, abertas, em atendimento e concluídas.
- Integrar formulários, listagem, detalhes, filtros e ações com a API.
- Tratar carregamento, lista vazia, sucesso e erros de API. Responsividade é um diferencial citado pela empresa, então entra após os fluxos obrigatórios estarem funcionando.

## Fase 5 — Entrega e avaliação

- Conferir cada requisito funcional e os critérios de avaliação do PDF oficial.
- Completar README com pré-requisitos, instalação, configuração, execução e acesso de demonstração.
- Escrever o Memorial Técnico de Desenvolvimento obrigatório, justificando tecnologias, arquitetura, autenticação e limitações.
- Incluir o esquema do banco e instruções para criá-lo; adicionar evidências visuais se houver tempo.

## Decisões de escopo

- A empresa não define papéis de usuário nem restringe a edição ao solicitante original; não será criada uma regra de autorização extra sem necessidade confirmada.
- Não serão adicionadas funcionalidades fora do enunciado, como notificações, anexos, histórico de status ou aprovações.
- Bibliotecas e mecanismos de autenticação serão escolhidos pela simplicidade e documentados no Memorial Técnico.
