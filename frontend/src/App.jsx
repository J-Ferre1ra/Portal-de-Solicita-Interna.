import { useEffect, useState } from 'react';

const categories = ['TI', 'RH', 'Compras', 'Financeiro', 'Infraestrutura'];
const statuses = ['Aberto', 'Em Atendimento', 'Concluído'];

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (response.status === 204) return null;
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a operação.');
  return body;
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', category: '', status: '', search: '' });
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (page === 'dashboard') {
      api('/dashboard').then(setDashboard).catch(showError);
    } else {
      const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
      api(`/requests?${query}`).then(setRequests).catch(showError);
    }
  }, [user, page, filters]);

  function showError(reason) {
    setError(reason.message);
    setMessage('');
  }

  function showMessage(text) {
    setMessage(text);
    setError('');
  }

  async function login(credentials) {
    const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    setUser(result.user);
    setPage('dashboard');
    showMessage('Sessão iniciada.');
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
    setDashboard(null);
    setRequests([]);
  }

  async function saveRequest(form) {
    const editingRequest = editing?.id ? editing : null;
    await api(editingRequest ? `/requests/${editingRequest.id}` : '/requests', {
      method: editingRequest ? 'PUT' : 'POST',
      body: JSON.stringify(form),
    });
    setEditing(null);
    showMessage(editingRequest ? 'Solicitação atualizada.' : 'Solicitação criada.');
    refreshRequests();
  }

  function refreshRequests() {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    api(`/requests?${query}`).then(setRequests).catch(showError);
    api('/dashboard').then(setDashboard).catch(showError);
  }

  async function changeStatus(id, status) {
    try {
      await api(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      showMessage('Status atualizado.');
      refreshRequests();
    } catch (reason) {
      showError(reason);
    }
  }

  async function deleteRequest(request) {
    if (!window.confirm(`Excluir a solicitação “${request.title}”?`)) return;
    try {
      await api(`/requests/${request.id}`, { method: 'DELETE' });
      showMessage('Solicitação excluída.');
      refreshRequests();
    } catch (reason) {
      showError(reason);
    }
  }

  if (checkingSession) return <main className="p-8 text-slate-600">Carregando sessão…</main>;
  if (!user) return <Login onLogin={login} />;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Portal interno</p>
            <h1 className="text-xl font-bold">Solicitações</h1>
          </div>
          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <NavButton active={page === 'dashboard'} onClick={() => setPage('dashboard')}>Dashboard</NavButton>
            <NavButton active={page === 'requests'} onClick={() => setPage('requests')}>Solicitações</NavButton>
            <span className="px-2 text-sm text-slate-600">{user.username}</span>
            <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50" onClick={logout}>Sair</button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
        {page === 'dashboard' ? (
          <Dashboard data={dashboard} />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl font-bold">Todas as solicitações</h2><p className="text-sm text-slate-600">Consulte, filtre e atualize as demandas internas.</p></div>
              <button className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800" onClick={() => setEditing({ id: null, title: '', description: '', category: categories[0] })}>Nova solicitação</button>
            </div>
            <Filters filters={filters} onChange={setFilters} />
            <div className="mt-5 overflow-x-auto rounded-xl bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600"><tr>{['Código', 'Título', 'Categoria', 'Solicitante', 'Abertura', 'Status', 'Ações'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => <RequestRow key={request.id} request={request} onDetails={setDetails} onEdit={setEditing} onDelete={deleteRequest} onStatus={changeStatus} />)}
                  {requests.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">Nenhuma solicitação encontrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {editing && <RequestForm request={editing} onClose={() => setEditing(null)} onSave={saveRequest} />}
      {details && <Details request={details} onClose={() => setDetails(null)} />}
    </main>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try { await onLogin({ username, password }); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Portal interno</p>
        <h1 className="mt-2 text-2xl font-bold">Entrar</h1>
        <p className="mt-1 mb-6 text-sm text-slate-600">Use seu usuário e senha para continuar.</p>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="mb-4 block text-sm font-medium">Usuário<input required autoComplete="username" className="mt-1 w-full rounded-lg border px-3 py-2" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
        <label className="mb-6 block text-sm font-medium">Senha<input required type="password" autoComplete="current-password" className="mt-1 w-full rounded-lg border px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{loading ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </main>
  );
}

function Dashboard({ data }) {
  const cards = [
    ['Total de solicitações', data?.total ?? '—'],
    ['Abertas', data?.abertas ?? '—'],
    ['Em atendimento', data?.emAtendimento ?? '—'],
    ['Concluídas', data?.concluidas ?? '—'],
  ];
  return <><h2 className="mb-5 text-2xl font-bold">Dashboard</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <article key={label} className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></article>)}</div></>;
}

function NavButton({ active, onClick, children }) {
  return <button onClick={onClick} className={`rounded-lg px-3 py-2 text-sm font-medium ${active ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-100'}`}>{children}</button>;
}

function Filters({ filters, onChange }) {
  function update(key, value) { onChange({ ...filters, [key]: value }); }
  const inputClass = 'rounded-lg border bg-white px-3 py-2 text-sm';
  return (
    <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      <label className="text-xs font-medium text-slate-600">De<input aria-label="Data inicial" type="date" className={`${inputClass} mt-1 block w-full`} value={filters.from} onChange={(event) => update('from', event.target.value)} /></label>
      <label className="text-xs font-medium text-slate-600">Até<input aria-label="Data final" type="date" className={`${inputClass} mt-1 block w-full`} value={filters.to} onChange={(event) => update('to', event.target.value)} /></label>
      <label className="text-xs font-medium text-slate-600">Categoria<select className={`${inputClass} mt-1 block w-full`} value={filters.category} onChange={(event) => update('category', event.target.value)}><option value="">Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label className="text-xs font-medium text-slate-600">Status<select className={`${inputClass} mt-1 block w-full`} value={filters.status} onChange={(event) => update('status', event.target.value)}><option value="">Todos</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label className="text-xs font-medium text-slate-600">Título<input className={`${inputClass} mt-1 block w-full`} placeholder="Pesquisar" value={filters.search} onChange={(event) => update('search', event.target.value)} /></label>
    </div>
  );
}

function RequestRow({ request, onDetails, onEdit, onDelete, onStatus }) {
  const date = new Date(`${request.created_at.replace(' ', 'T')}Z`).toLocaleDateString('pt-BR');
  return (
    <tr>
      <td className="px-4 py-3">{request.id}</td><td className="max-w-56 truncate px-4 py-3 font-medium">{request.title}</td>
      <td className="px-4 py-3">{request.category}</td><td className="px-4 py-3">{request.requester}</td><td className="px-4 py-3">{date}</td>
      <td className="px-4 py-3"><select aria-label={`Status da solicitação ${request.id}`} className="rounded-md border px-2 py-1" value={request.status} onChange={(event) => onStatus(request.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
      <td className="px-4 py-3"><div className="flex gap-2"><button className="text-blue-700 hover:underline" onClick={() => onDetails(request)}>Detalhes</button>{request.status === 'Aberto' && <><button className="text-slate-700 hover:underline" onClick={() => onEdit(request)}>Editar</button><button className="text-red-700 hover:underline" onClick={() => onDelete(request)}>Excluir</button></>}</div></td>
    </tr>
  );
}

function RequestForm({ request, onClose, onSave }) {
  const [title, setTitle] = useState(request.title || '');
  const [description, setDescription] = useState(request.description || '');
  const [category, setCategory] = useState(request.category || categories[0]);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    try { await onSave({ title, description, category }); }
    catch (reason) { setError(reason.message); }
  }
  return (
    <Modal title={request.id ? 'Editar solicitação' : 'Nova solicitação'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="block text-sm font-medium">Título<input required maxLength="160" className="mt-1 w-full rounded-lg border px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="block text-sm font-medium">Descrição<textarea required rows="4" className="mt-1 w-full rounded-lg border px-3 py-2" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="block text-sm font-medium">Categoria<select className="mt-1 w-full rounded-lg border px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="flex justify-end gap-2"><button type="button" className="rounded-lg border px-4 py-2" onClick={onClose}>Cancelar</button><button className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white">Salvar</button></div>
      </form>
    </Modal>
  );
}

function Details({ request, onClose }) {
  return <Modal title={`Solicitação #${request.id}`} onClose={onClose}><dl className="space-y-3 text-sm"><div><dt className="font-semibold">Título</dt><dd>{request.title}</dd></div><div><dt className="font-semibold">Descrição</dt><dd className="whitespace-pre-wrap">{request.description}</dd></div><div><dt className="font-semibold">Categoria</dt><dd>{request.category}</dd></div><div><dt className="font-semibold">Solicitante</dt><dd>{request.requester}</dd></div><div><dt className="font-semibold">Status</dt><dd>{request.status}</dd></div><div><dt className="font-semibold">Abertura</dt><dd>{new Date(`${request.created_at.replace(' ', 'T')}Z`).toLocaleString('pt-BR')}</dd></div></dl></Modal>;
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button aria-label="Fechar" className="rounded px-2 py-1 text-xl text-slate-500 hover:bg-slate-100" onClick={onClose}>×</button></div>{children}</section></div>;
}

export default App;
