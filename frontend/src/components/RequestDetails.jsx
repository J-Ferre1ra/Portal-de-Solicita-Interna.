import Modal from './Modal.jsx';

function RequestDetails({ request, onClose }) {
  return (
    <Modal title={`Solicitação #${request.id}`} onClose={onClose}>
      <dl className="space-y-3 text-sm">
        <div><dt className="font-semibold">Título</dt><dd>{request.title}</dd></div>
        <div><dt className="font-semibold">Descrição</dt><dd className="whitespace-pre-wrap">{request.description}</dd></div>
        <div><dt className="font-semibold">Categoria</dt><dd>{request.category}</dd></div>
        <div><dt className="font-semibold">Solicitante</dt><dd>{request.requester}</dd></div>
        <div><dt className="font-semibold">Status</dt><dd>{request.status}</dd></div>
        <div><dt className="font-semibold">Abertura</dt><dd>{new Date(`${request.created_at.replace(' ', 'T')}Z`).toLocaleString('pt-BR')}</dd></div>
      </dl>
    </Modal>
  );
}

export default RequestDetails;
