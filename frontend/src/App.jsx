import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import RequestForm from './components/RequestForm.jsx';
import RequestsPage from './components/RequestsPage.jsx';
import RequestDetails from './components/RequestDetails.jsx';
import { categories } from './constants/requestOptions.js';
import { api } from './services/api.js';

const emptyFilters = { from: '', to: '', category: '', status: '', search: '' };

function fetchRequests(filters) {
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value),
  );
  return api(`/requests?${query}`);
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
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
      return;
    }

    fetchRequests(filters).then(setRequests).catch(showError);
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
    const result = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
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
    refreshData();
  }

  async function changeStatus(id, status) {
    try {
      await api(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      showMessage('Status atualizado.');
      refreshData();
    } catch (reason) {
      showError(reason);
    }
  }

  async function deleteRequest(request) {
    if (!window.confirm(`Excluir a solicitação “${request.title}”?`)) return;

    try {
      await api(`/requests/${request.id}`, { method: 'DELETE' });
      showMessage('Solicitação excluída.');
      refreshData();
    } catch (reason) {
      showError(reason);
    }
  }

  function refreshData() {
    fetchRequests(filters).then(setRequests).catch(showError);
    api('/dashboard').then(setDashboard).catch(showError);
  }

  function startNewRequest() {
    setEditing({ id: null, title: '', description: '', category: categories[0] });
  }

  if (checkingSession) {
    return <main className="p-8 text-slate-600">Carregando sessão…</main>;
  }

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
            <button
              className={`rounded-lg px-3 py-2 text-sm font-medium ${page === 'dashboard' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-medium ${page === 'requests' ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setPage('requests')}
            >
              Solicitações
            </button>
            <span className="px-2 text-sm text-slate-600">{user.username}</span>
            <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50" onClick={logout}>
              Sair
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        {message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
        {page === 'dashboard' ? (
          <Dashboard data={dashboard} onNewRequest={startNewRequest} />
        ) : (
          <RequestsPage
            requests={requests}
            filters={filters}
            onFiltersChange={setFilters}
            onNewRequest={startNewRequest}
            onDetails={setDetails}
            onEdit={setEditing}
            onDelete={deleteRequest}
            onStatus={changeStatus}
          />
        )}
      </section>

      {editing && <RequestForm request={editing} onClose={() => setEditing(null)} onSave={saveRequest} />}
      {details && <RequestDetails request={details} onClose={() => setDetails(null)} />}
    </main>
  );
}

export default App;
