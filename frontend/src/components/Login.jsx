import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({ username, password });
    } catch (reason) {
      setError(reason.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Portal interno</p>
        <h1 className="mt-2 text-2xl font-bold">Entrar</h1>
        <p className="mb-6 mt-1 text-sm text-slate-600">Use seu usuário e senha para continuar.</p>
        {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="mb-4 block text-sm font-medium">
          Usuário
          <input required autoComplete="username" className="mt-1 w-full rounded-lg border px-3 py-2" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="mb-6 block text-sm font-medium">
          Senha
          <input required type="password" autoComplete="current-password" className="mt-1 w-full rounded-lg border px-3 py-2" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button disabled={loading} className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

export default Login;
