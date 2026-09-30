# Dicionário de dados

O banco é SQLite e o esquema executável está em `backend/src/db/schema.sql`.

## `users` — usuários autenticados

| Campo | Tipo | Regras | Descrição |
| --- | --- | --- | --- |
| `id` | INTEGER | Chave primária, autoincremento | Identificador do usuário. |
| `username` | TEXT | Obrigatório, único | Nome usado no login. |
| `password_hash` | TEXT | Obrigatório | Hash bcrypt da senha; nunca armazena a senha original. |

## `requests` — solicitações internas

| Campo | Tipo | Regras | Descrição |
| --- | --- | --- | --- |
| `id` | INTEGER | Chave primária, autoincremento | Código exibido na listagem. |
| `title` | TEXT | Obrigatório, não pode ser vazio | Título usado também na pesquisa textual. |
| `description` | TEXT | Obrigatório | Descrição da demanda. |
| `category` | TEXT | Obrigatório; TI, RH, Compras, Financeiro ou Infraestrutura | Categoria indicada na solicitação. |
| `created_at` | TEXT | Obrigatório, padrão `CURRENT_TIMESTAMP` | Data e hora de abertura geradas pelo banco. |
| `status` | TEXT | Obrigatório; padrão `Aberto`; valores: Aberto, Em Atendimento ou Concluído | Situação atual. |
| `requester_id` | INTEGER | Obrigatório; chave estrangeira para `users.id` | Usuário autenticado que criou a solicitação. |

## Índices

- `idx_requests_status`: facilita filtros por status.
- `idx_requests_category`: facilita filtros por categoria.
- `idx_requests_created_at`: facilita consultas por período.
