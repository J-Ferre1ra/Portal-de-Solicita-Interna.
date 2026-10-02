import { categories, statuses } from '../constants/requestOptions.js';

function RequestsPage({ requests, filters, onFiltersChange, onNewRequest, onDetails, onEdit, onDelete, onStatus }) {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Todas as solicitações</h2>
          <p className="text-sm text-slate-600">Consulte, filtre e atualize as demandas internas.</p>
        </div>
        <button className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800" onClick={onNewRequest}>
          Nova solicitação
        </button>
      </div>
      <Filters filters={filters} onChange={onFiltersChange} />
      <div className="mt-5 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>{['Código', 'Título', 'Categoria', 'Solicitante', 'Abertura', 'Status', 'Ações'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} onDetails={onDetails} onEdit={onEdit} onDelete={onDelete} onStatus={onStatus} />
            ))}
            {requests.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-500">Nenhuma solicitação encontrada.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Filters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

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
      <td className="px-4 py-3">{request.id}</td>
      <td className="max-w-56 truncate px-4 py-3 font-medium">{request.title}</td>
      <td className="px-4 py-3">{request.category}</td>
      <td className="px-4 py-3">{request.requester}</td>
      <td className="px-4 py-3">{date}</td>
      <td className="px-4 py-3">
        <select aria-label={`Status da solicitação ${request.id}`} className="rounded-md border px-2 py-1" value={request.status} onChange={(event) => onStatus(request.id, event.target.value)}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button className="text-blue-700 hover:underline" onClick={() => onDetails(request)}>Detalhes</button>
          {request.status === 'Aberto' && <><button className="text-slate-700 hover:underline" onClick={() => onEdit(request)}>Editar</button><button className="text-red-700 hover:underline" onClick={() => onDelete(request)}>Excluir</button></>}
        </div>
      </td>
    </tr>
  );
}

export default RequestsPage;
