# Memorial Técnico de Desenvolvimento

## Objetivo

O Portal de Solicitações Internas permite que colaboradores autenticados criem e acompanhem demandas, consultem seus detalhes e filtrem a listagem. A solução atende aos requisitos funcionais do PDF oficial da bit Soluções.

## Tecnologias utilizadas e justificativas

| Tecnologia | Uso e motivo da escolha |
| --- | --- |
| JavaScript e Node.js | Usados no backend e no frontend. Uma linguagem comum nas duas partes reduz o número de conceitos diferentes necessários para manter o projeto. |
| React | Organiza a interface em componentes pequenos e reutilizáveis, como login, filtros, formulário e dashboard. Foi escolhido para construir a interface solicitada sem introduzir uma arquitetura complexa. |
| Vite | Inicia o ambiente de desenvolvimento e gera a compilação do frontend com configuração reduzida. O proxy local também encaminha `/api` ao Express. |
| Tailwind CSS | Aplica estilos utilitários diretamente nos componentes, mantendo o CSS simples e as telas consistentes. |
| Express | Fornece rotas HTTP e middleware para JSON, sessão e autenticação, com pouca configuração. |
| SQLite e `sqlite3` | Guardam os dados em um arquivo local, sem exigir um servidor de banco separado. Isso facilita a execução pelo avaliador; PostgreSQL seria mais adequado para vários servidores ou maior carga. |
| `bcryptjs` | Gera e compara hashes de senha. Assim, o banco não precisa armazenar senhas em texto puro. |
| `express-session` | Mantém a identidade autenticada numa sessão de servidor associada a um cookie `HttpOnly`. A sessão pode ser invalidada no logout; esse fluxo se ajusta diretamente aos requisitos de login, controle de sessão e logout. |
| npm e Git | npm instala e registra as dependências; Git mantém o histórico incremental do projeto. |

## Arquitetura e organização

O projeto tem duas partes locais:

- `frontend/`: React apresenta as telas e usa `fetch` para consumir a API.
- `backend/`: Express valida dados, aplica regras de negócio e consulta o SQLite.

O navegador acessa o frontend Vite. O proxy encaminha chamadas em `/api` para o Express, então a aplicação não precisa de uma biblioteca HTTP adicional nem de configuração de CORS para desenvolvimento local. As rotas ficam separadas por responsabilidade em `backend/src/routes/`; `requireAuth` bloqueia as rotas de dados quando não há sessão ativa.

## Modelo de dados

O banco contém duas tabelas principais. `users` guarda o usuário de login e o hash da senha. `requests` guarda título, descrição, categoria, data, status e `requester_id`, que referencia o usuário que abriu a solicitação.

O SQL define `Aberto` e a data de criação como valores automáticos. Restrições `CHECK` aceitam apenas os status e categorias previstos. A API também valida os campos para devolver mensagens compreensíveis antes de o SQLite rejeitar valores inválidos. O dicionário completo está em `docs/dicionario-de-dados.md`.

## Autenticação e regras de negócio

O login consulta o nome de usuário e compara a senha fornecida ao hash bcrypt. Se as credenciais forem válidas, uma sessão é criada e identificada por cookie `HttpOnly`. O logout destrói a sessão e limpa o cookie. A sessão tem validade de oito horas e todas as rotas de solicitações e dashboard exigem autenticação.

Ao criar uma solicitação, o backend usa o usuário da sessão, deixando a data e o status inicial a cargo do banco. Edição e exclusão só são permitidas quando o status é `Aberto`. A alteração de status aceita `Aberto`, `Em Atendimento` e `Concluído`. A listagem pode ser filtrada por datas, categoria, status e texto do título. O dashboard conta total, abertas, em atendimento e concluídas.

O enunciado não define papéis diferentes nem limita edição ao solicitante original. Portanto, não foi adicionada essa regra de autorização. Todos os usuários autenticados podem acessar e gerenciar as solicitações, e o sistema registra quem abriu cada uma.

## Comunicação e validação

O frontend envia e recebe JSON por rotas REST sob `/api`. Erros de validação retornam HTTP 400; sessão ausente retorna 401; registro inexistente retorna 404; tentativa de editar ou excluir uma solicitação que não está aberta retorna 409. Os parâmetros SQL usam placeholders para não concatenar entradas do usuário em comandos.

## Limitações e melhorias possíveis

- As sessões usam o armazenamento em memória padrão do Express. É adequado à demonstração em uma instância local, mas reiniciar o servidor encerra as sessões e múltiplas instâncias exigiriam um armazenamento compartilhado.
- O segredo de sessão precisa ser definido no ambiente em uso; o valor padrão do código serve apenas para desenvolvimento local. Em produção, deve ser secreto e o cookie deve ser servido por HTTPS.
- O usuário `admin` de demonstração é criado por `npm run db:init` com a senha mostrada no README. O seed é para avaliação local; antes de uso real, as credenciais devem ser substituídas.
- O projeto não inclui cadastro de usuários, papéis de acesso, paginação ou regras de transição entre status porque o enunciado não exige esses fluxos.
- Para uso corporativo, recomenda-se armazenamento persistente de sessão, política operacional para criação e troca de credenciais, HTTPS, backup do SQLite e uma estratégia de migração se o volume de acessos crescer.
