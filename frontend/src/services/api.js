export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (response.status === 204) return null;

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || 'Não foi possível concluir a operação.');
  }

  return body;
}
