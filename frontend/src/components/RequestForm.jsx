import { useState } from 'react';
import { categories } from '../constants/requestOptions.js';
import Modal from './Modal.jsx';

function RequestForm({ request, onClose, onSave }) {
  const [title, setTitle] = useState(request.title || '');
  const [description, setDescription] = useState(request.description || '');
  const [category, setCategory] = useState(request.category || categories[0]);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await onSave({ title, description, category });
    } catch (reason) {
      setError(reason.message);
    }
  }

  return (
    <Modal title={request.id ? 'Editar solicitação' : 'Nova solicitação'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="block text-sm font-medium">Título<input required maxLength="160" className="mt-1 w-full rounded-lg border px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="block text-sm font-medium">Descrição<textarea required rows="4" className="mt-1 w-full rounded-lg border px-3 py-2" value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="block text-sm font-medium">Categoria<select className="mt-1 w-full rounded-lg border px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-lg border px-4 py-2" onClick={onClose}>Cancelar</button>
          <button className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}

export default RequestForm;
