# Portal de Solicitações Internas

Aplicação full stack para que colaboradores autenticados registrem solicitações internas e acompanhem seu andamento. O projeto foi desenvolvido para a etapa técnica de Desenvolvedor(a) de Sistemas Júnior da bit Soluções.

## O que o sistema faz

- Autentica o usuário e mantém uma sessão até o logout ou o encerramento da API.
- Cria solicitações com título, descrição e categoria.
- Lista e mostra detalhes das solicitações.
- Permite editar e excluir solicitações enquanto estão abertas.
- Permite alterar o status entre **Aberto**, **Em Atendimento** e **Concluído**.
- Filtra a lista por período, categoria, status e texto do título.
- Mostra no dashboard o total de solicitações e a quantidade em cada status; também permite iniciar uma solicitação nessa tela.

## Tecnologias

- JavaScript com Node.js
- React, Vite e Tailwind CSS
- Express
- SQLite por meio do pacote `sqlite3`
- `express-session` para sessões e `bcryptjs` para hash de senha

## Pré-requisitos

- Windows, macOS ou Linux
- Node.js `^20.19.0` ou `>=22.12.0` e npm (requisito do Vite usado pelo frontend)
- Não é necessário instalar ou iniciar um servidor SQLite separado. O banco é um arquivo local criado pelo próprio projeto.

## Instalação e execução local

Clone o repositório e abra dois terminais na pasta criada:

```powershell
git clone https://github.com/J-Ferre1ra/Portal-de-Solicita-Interna..git portal-solicitacoes-internas
cd portal-solicitacoes-internas
```

Os comandos abaixo usam PowerShell no Windows. Em macOS/Linux, os comandos `cd` e `npm` são os mesmos; defina o segredo no terminal com `export SESSION_SECRET='troque-por-um-segredo-local'`.

### 1. Preparar o banco e iniciar o backend

No primeiro terminal:

```powershell
cd backend
npm ci
npm run db:init
$env:SESSION_SECRET = 'troque-por-um-segredo-local'
npm run dev
```

`npm run db:init` executa o esquema SQL em `backend/src/db/schema.sql`, cria o arquivo `backend/data/requests.sqlite` se necessário e prepara o usuário de demonstração. O banco fica dentro de `backend/data/` e não é versionado. O backend inicia na porta `3000`.

O segredo definido em `SESSION_SECRET` é usado para assinar o cookie da sessão. No PowerShell, a variável vale para o terminal atual; mantenha esse terminal aberto enquanto usar a aplicação.

### 2. Iniciar o frontend

No segundo terminal, começando novamente na pasta raiz do repositório:

```powershell
cd frontend
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente [http://localhost:5173](http://localhost:5173). Durante o desenvolvimento, o Vite encaminha chamadas `/api` ao backend na porta `3000`.

### 3. Acessar o sistema

Use a conta criada pelo seed local:

- **Usuário:** `admin`
- **Senha:** `Admin123!`

Depois do login, use o menu **Dashboard** para ver os indicadores ou abrir **Solicitações** para filtrar, consultar, editar, excluir e atualizar registros.

## Build do frontend

Para gerar os arquivos estáticos do frontend:

```powershell
cd frontend
npm ci
npm run build
```

O resultado fica em `frontend/dist/`. O repositório não configura hospedagem em nuvem: a execução documentada para avaliação é local, com o Vite servindo o frontend e o Express servindo a API.

## Estrutura do projeto

```text
backend/
  src/
    db/          conexão, inicialização e schema SQLite
    middleware/  autenticação das rotas
    routes/      login, solicitações e dashboard
frontend/
  src/
    components/  telas e componentes da interface
    constants/   categorias e status
    services/    comunicação HTTP com a API
docs/
  MEMORIAL_TECNICO_DE_DESENVOLVIMENTO.md
  dicionario-de-dados.md
```

O [Memorial Técnico de Desenvolvimento](docs/MEMORIAL_TECNICO_DE_DESENVOLVIMENTO.md) explica as escolhas de implementação e como percorrer as funcionalidades. O [dicionário de dados](docs/dicionario-de-dados.md) descreve as tabelas e campos. O script SQL executável está em `backend/src/db/schema.sql`.
