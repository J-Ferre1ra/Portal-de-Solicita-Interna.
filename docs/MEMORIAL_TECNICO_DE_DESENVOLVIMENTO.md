# Memorial Técnico de Desenvolvimento

## 1. Objetivo

O Portal de Solicitações Internas permite que uma pessoa autenticada registre uma demanda, acompanhe seu status e consulte solicitações. O projeto usa uma interface React, uma API Express e um banco SQLite local. Este memorial apresenta as decisões tomadas e um roteiro simples para entender o sistema.

## 2. Tecnologias utilizadas e justificativas

| Tecnologia | Por que foi escolhida | Benefício neste projeto e comparação simples | Efeito na manutenção e produtividade |
| --- | --- | --- | --- |
| JavaScript e Node.js | A mesma linguagem pode ser usada no frontend e backend. | Evita trocar de linguagem entre interface e API. Usar linguagens diferentes também seria possível, mas exigiria aprender e manter duas sintaxes. | Compartilhar a linguagem deixa o projeto de estudo mais direto. |
| React | O sistema tem formulários, listagens, indicadores e janelas de detalhes que mudam com as interações. | Componentes permitem separar as partes da interface e atualizá-las com estado. Uma página estática não atenderia esses fluxos. | A divisão em componentes ajuda a localizar cada tela e evita concentrar todo o JSX em `App.jsx`. |
| Vite | É o servidor de desenvolvimento e gerador do build do frontend. | Inicia a interface com pouca configuração e oferece proxy local para `/api`. | Reduz os passos para iniciar e compilar a interface. |
| Tailwind CSS | Estiliza os componentes com classes utilitárias. | Espaçamento, cores e responsividade ficam nos elementos, sem criar uma folha extensa para estas telas. | Mantém os estilos perto dos componentes e facilita ajustes visuais pequenos. |
| Express | O sistema precisa de rotas HTTP para autenticação, solicitações e dashboard. | Oferece rotas e middleware de forma direta. Sem framework, seria necessário tratar manualmente mais detalhes de URLs e requisições. | Cada grupo de rotas está em um arquivo próprio, facilitando encontrar os endpoints. |
| SQLite e `sqlite3` | O desafio precisa persistir dados e ser simples de executar localmente. | O banco é um arquivo; não é preciso configurar um servidor SQL separado. PostgreSQL é uma alternativa para aplicações com vários servidores, mas adicionaria configuração para esta entrega local. | O avaliador cria o banco com um comando e pode consultar o schema SQL junto ao código. |
| `express-session` | A aplicação precisa de login, sessão e logout. | Mantém a sessão no servidor e relaciona o navegador a ela por um cookie. | O fluxo de autenticação fica apoiado em middleware e nas rotas específicas de login/logout. |
| `bcryptjs` | A aplicação precisa conferir a senha de acesso. | Guarda no banco um hash, em vez do texto original da senha. | A comparação é feita pelas funções da biblioteca, sem implementar hash manualmente. |
| `fetch` (API do navegador) | O frontend precisa enviar chamadas ao backend. | Já está disponível no navegador e atende às requisições JSON do projeto. | Evita instalar uma biblioteca HTTP adicional. |
| npm e Git | npm administra pacotes e Git registra o código. | O lockfile ajuda a repetir a instalação das dependências; o histórico Git mostra as mudanças do projeto. | Os comandos conhecidos tornam a preparação do ambiente mais previsível. |

O projeto não utiliza Docker, serviços de nuvem, biblioteca externa de validação ou ferramenta de testes automatizados. As dependências foram mantidas próximas às necessidades do desafio.

## 3. Justificativa conceitual

### 3.1 Estrutura geral e organização do código

O repositório tem duas partes:

- `backend/` contém o servidor Express, a conexão e o schema SQLite, o middleware de autenticação e as rotas da API.
- `frontend/` contém a aplicação React, os componentes de interface, as opções de categoria/status e a função usada para chamar a API.

No frontend, `App.jsx` mantém o estado compartilhado e coordena login, navegação, carregamento e ações sobre solicitações. Os componentes de tela ficam em `frontend/src/components/`: `Login`, `Dashboard`, `RequestsPage`, `RequestForm`, `RequestDetails` e `Modal`. Categorias e status estão em `frontend/src/constants/requestOptions.js`; as chamadas JSON estão em `frontend/src/services/api.js`.

No backend, as rotas ficam em `backend/src/routes/`. O middleware `requireAuth` é aplicado às rotas que exigem uma sessão. A conexão SQLite fica em `backend/src/db/database.js`, e o schema executável fica em `backend/src/db/schema.sql`.

Não foi adotado um padrão de projeto formal. A organização usa funções, componentes React, props e módulos ES/CommonJS, mecanismos básicos da stack. A separação em frontend, API, rotas e acesso ao banco é adequada ao tamanho deste projeto.

### 3.2 Organização das camadas

O navegador apresenta a interface e envia requisições JSON ao Express. O backend verifica autenticação, aplica as regras das solicitações e consulta o SQLite. O banco persiste usuários e solicitações. No desenvolvimento local, o Vite encaminha o prefixo `/api` para o backend, então o frontend pode usar caminhos relativos.

### 3.3 Estratégia de modelagem de dados

O banco possui duas tabelas:

- `users` guarda o nome de usuário e o hash da senha.
- `requests` guarda título, descrição, categoria, data de criação, status e identificador do solicitante.

`requests.requester_id` referencia `users.id`. O banco define a data de criação e o status inicial `Aberto`. Restrições SQL limitam as categorias e os estados aceitos. O [dicionário de dados](dicionario-de-dados.md) descreve cada campo, e o script de criação está em `backend/src/db/schema.sql`.

### 3.4 Estratégia de autenticação

O usuário envia nome e senha pelo formulário de login. A API procura o usuário e compara a senha recebida com o hash bcrypt. Quando as credenciais são aceitas, `express-session` cria uma sessão e o navegador recebe um cookie `HttpOnly`. O logout encerra a sessão. O middleware `requireAuth` protege os endpoints de solicitações e dashboard.

### 3.5 Comunicação entre frontend e backend

O frontend usa a função `api()` de `frontend/src/services/api.js`, baseada no `fetch` nativo. As requisições e respostas usam JSON sob o caminho `/api`. Durante o desenvolvimento, o Vite encaminha essas chamadas ao Express na porta `3000`.

Os endpoints estão agrupados por recurso: `/api/auth` trata login e sessão, `/api/requests` trata solicitações e `/api/dashboard` fornece os indicadores. A interface exibe mensagens de sucesso e erro retornadas durante as ações.

## 4. Como executar e percorrer a aplicação

O [README](../README.md) contém os pré-requisitos, a configuração, as instruções de instalação do banco/backend/frontend, os comandos para execução local e as credenciais de demonstração. Depois de iniciar os dois servidores e entrar no sistema, siga este roteiro:

1. **Login:** entre com usuário `admin` e senha `Admin123!`.
2. **Dashboard:** confira o total e a contagem por status. Use **Nova solicitação** para abrir o formulário diretamente desta tela.
3. **Criar:** informe título, descrição e categoria; salvar cria a solicitação com status inicial `Aberto`.
4. **Listar e filtrar:** abra **Solicitações** e use período, categoria, status e texto do título.
5. **Detalhes:** selecione **Detalhes** em uma linha para consultar as informações completas.
6. **Editar:** em uma solicitação aberta, selecione **Editar**, altere os campos e salve.
7. **Alterar status:** escolha um estado no campo de status da linha. Os indicadores do dashboard são atualizados.
8. **Excluir:** em uma solicitação aberta, selecione **Excluir** e confirme a ação.
9. **Logout:** selecione **Sair** para encerrar a sessão.

## 5. Análise crítica

O sistema foi mantido dentro do fluxo pedido pelo desafio. Há algumas decisões simples que delimitam o uso atual:

- **Sessão em memória:** a configuração atual usa o armazenamento padrão de sessão do Express. Reiniciar a API encerra as sessões ativas. Uma etapa futura para uso contínuo seria armazenar as sessões de forma persistente.
- **Usuário de demonstração:** `npm run db:init` prepara a conta local `admin`. O projeto não possui cadastro de usuários, pois o fluxo apresentado no desafio começa pelo login.
- **Execução local:** o README explica como iniciar a interface e a API localmente. Não há provedor de hospedagem em nuvem configurado nesta entrega.
- **Testes automatizados:** o repositório não possui uma suíte automatizada. Uma melhoria possível seria adicionar testes dos fluxos de login e solicitações.

O enunciado não detalha se existem tipos de usuário diferentes nem quem pode editar uma solicitação aberta. Para manter a regra simples, a implementação permite que qualquer pessoa autenticada gerencie solicitações abertas. Em uma versão corporativa, eu confirmaria essa regra com a equipe antes de adicionar permissões. Também configuraria armazenamento persistente para sessões e credenciais próprias para cada ambiente.

Esses pontos são possibilidades de evolução, não funcionalidades necessárias para demonstrar o fluxo atual. Para um ambiente corporativo, armazenamento de sessão e hospedagem seriam definidos com a equipe responsável antes de ampliar o sistema.

## 6. Evidências da aplicação

O desafio considera prints ou vídeo como evidências opcionais. Para que cada captura seja compreensível sem explicação ao vivo, use legendas como estas:<br><br>


<img width="1732" height="732" alt="image" src="https://github.com/user-attachments/assets/47bbadbe-c928-4e1e-936a-fa8e2657eaf6" />
- Login: Informe o usuário e a senha de demonstração para acessar o portal.
<br><br>

<img width="1817" height="747" alt="image" src="https://github.com/user-attachments/assets/36d7a52a-d319-4b1a-81de-1f4b03558302" />
- Dashboard: Confira os totais por status e use “Nova solicitação” para abrir o formulário nesta tela.
<br><br>

<img width="742" height="565" alt="image" src="https://github.com/user-attachments/assets/37622eac-45e1-436b-ac9b-5399763db700" />
<br>
- Nova solicitação: Preencha título, descrição e categoria, depois selecione “Salvar”.
<br><br>

<img width="1622" height="707" alt="image" src="https://github.com/user-attachments/assets/1a21f2a7-2a5c-440e-aeed-ea1a382f33d4" />
<br>
- Solicitações: Combine período, categoria, status e título para filtrar a lista.
<br><br>

<img width="896" height="617" alt="image" src="https://github.com/user-attachments/assets/3c585a6e-3b0d-4718-9ca7-7cccd78e5a75" />
<br>
- Detalhes: Abra uma solicitação para conferir os dados completos.
<br><br>

<img width="790" height="616" alt="image" src="https://github.com/user-attachments/assets/15ce54b9-756f-41bd-a549-8062d812a38f" />
<br>
- Editar: Altere uma solicitação enquanto ela estiver com status “Aberto”.
<br><br>

<img width="1562" height="222" alt="image" src="https://github.com/user-attachments/assets/4f97649d-cfce-45aa-b263-27c1044b1923" />
<img width="1631" height="462" alt="image" src="https://github.com/user-attachments/assets/fb27e0ec-1787-4d22-af5f-767796a5f7ae" />
- Status: Atualize a situação para “Em Atendimento” ou “Concluído” e confira o dashboard.
<br><br>

<img width="1590" height="465" alt="image" src="https://github.com/user-attachments/assets/ddb36b93-a1a1-4fa0-bcc4-328f567f1bca" />
- Excluir: Confirme a exclusão de uma solicitação que ainda está aberta.
<br><br>

<img width="1652" height="87" alt="image" src="https://github.com/user-attachments/assets/239f0d24-8c42-4dca-a861-d438f04127a7" />
- Sair: Encerre a sessão pelo botão no menu superior.
