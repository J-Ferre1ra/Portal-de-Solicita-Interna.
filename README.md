# Portal de Solicitações Internas

Aplicação full stack para registrar e acompanhar solicitações internas, conforme os requisitos oficiais da etapa técnica.

## Stack

- Frontend: React com Vite e Tailwind CSS
- Backend: Node.js com Express
- Banco: SQLite

## Estrutura

- `frontend/`: interface React
- `backend/`: API e inicialização do banco
- `backend/src/db/schema.sql`: definição reproduzível das tabelas `users` e `requests`
- `docs/plano-de-execucao-oficial.md`: plano baseado nos requisitos da empresa

## Preparação local

Requer Node.js e npm.

```powershell
cd backend
npm install
npm run db:init
npm run dev
```

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

O comando de inicialização cria `backend/data/requests.sqlite` a partir do script SQL. A API e as telas serão implementadas nas próximas etapas.
