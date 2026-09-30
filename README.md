# Portal de Solicitações Internas

Aplicação full stack para registrar e acompanhar solicitações internas, seguindo os requisitos oficiais da etapa técnica.

## Tecnologias

- Frontend: React, Vite e Tailwind CSS
- Backend: Node.js e Express
- Banco de dados: SQLite

## Pré-requisitos

- Node.js 20.19 ou superior e npm

## Instalação e execução

Na raiz do projeto, abra dois terminais.

No primeiro terminal, prepare o banco e inicie a API:

```powershell
cd backend
npm install
npm run db:init
$env:SESSION_SECRET = 'troque-por-um-segredo-local'
npm run dev
```

No segundo terminal, inicie a interface:

```powershell
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`). O Vite encaminha as chamadas `/api` para o Express na porta 3000.

## Acesso de demonstração

- Usuário: `admin`
- Senha: `Admin123!`

O comando `npm run db:init` cria as tabelas e esse usuário inicial, armazenando a senha como hash. Para reiniciar os dados, pare a API, remova `backend/data/requests.sqlite` e rode `npm run db:init` novamente.

## Rotas principais

- `POST /api/auth/login`, `GET /api/auth/me` e `POST /api/auth/logout`
- `GET /api/requests` com filtros `from`, `to`, `category`, `status` e `search`
- `GET`, `POST`, `PUT`, `PATCH` e `DELETE /api/requests`
- `GET /api/dashboard`

O banco local é criado a partir de `backend/src/db/schema.sql`. O arquivo SQLite gerado não é versionado. Consulte `docs/dicionario-de-dados.md` para a descrição dos campos, `docs/MEMORIAL_TECNICO_DE_DESENVOLVIMENTO.md` para as decisões técnicas e `docs/plano-de-execucao-oficial.md` para o plano baseado no PDF oficial.

## Observação de execução

A sessão é mantida em memória para simplificar a demonstração local; reiniciar a API encerra as sessões ativas. Em produção seria necessário configurar armazenamento persistente para as sessões e segredo seguro em variável de ambiente.
