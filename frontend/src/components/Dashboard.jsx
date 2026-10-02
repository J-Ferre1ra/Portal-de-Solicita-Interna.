function Dashboard({ data, onNewRequest }) {
  const cards = [
    ['Total de solicitações', data?.total ?? '—'],
    ['Abertas', data?.abertas ?? '—'],
    ['Em atendimento', data?.emAtendimento ?? '—'],
    ['Concluídas', data?.concluidas ?? '—'],
  ];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800" onClick={onNewRequest}>
          Nova solicitação
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </article>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
