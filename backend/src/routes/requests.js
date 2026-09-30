const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
const categories = ['TI', 'RH', 'Compras', 'Financeiro', 'Infraestrutura'];
const statuses = ['Aberto', 'Em Atendimento', 'Concluído'];
router.use(requireAuth);

router.get('/', (req, res, next) => {
  const { from, to, category, status, search } = req.query;
  const conditions = [];
  const values = [];

  if (from) { conditions.push('date(r.created_at) >= date(?)'); values.push(from); }
  if (to) { conditions.push('date(r.created_at) <= date(?)'); values.push(to); }
  if (category) { conditions.push('r.category = ?'); values.push(category); }
  if (status) { conditions.push('r.status = ?'); values.push(status); }
  if (search) { conditions.push('r.title LIKE ?'); values.push(`%${search}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT r.id, r.title, r.description, r.category, r.created_at, r.status,
      r.requester_id, u.username AS requester
    FROM requests r JOIN users u ON u.id = r.requester_id
    ${where} ORDER BY r.created_at DESC, r.id DESC`;
  db.all(query, values, (error, rows) => {
    if (error) return next(error);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  db.get(`SELECT r.id, r.title, r.description, r.category, r.created_at, r.status,
      r.requester_id, u.username AS requester
    FROM requests r JOIN users u ON u.id = r.requester_id WHERE r.id = ?`, [req.params.id], (error, row) => {
    if (error) return next(error);
    if (!row) return res.status(404).json({ error: 'Solicitação não encontrada.' });
    res.json(row);
  });
});

router.post('/', (req, res, next) => {
  const { title, description, category } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof description !== 'string' || !description.trim() || !categories.includes(category)) {
    return res.status(400).json({ error: 'Informe título, descrição e uma categoria válida.' });
  }

  db.run(`INSERT INTO requests (title, description, category, requester_id)
    VALUES (?, ?, ?, ?)`, [title.trim(), description.trim(), category, req.session.userId], function (error) {
    if (error) return next(error);
    res.status(201).json({ id: this.lastID, message: 'Solicitação criada.' });
  });
});

router.put('/:id', (req, res, next) => {
  const { title, description, category } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof description !== 'string' || !description.trim() || !categories.includes(category)) {
    return res.status(400).json({ error: 'Informe título, descrição e uma categoria válida.' });
  }

  db.run(`UPDATE requests SET title = ?, description = ?, category = ?
    WHERE id = ? AND status = 'Aberto'`, [title.trim(), description.trim(), category, req.params.id], function (error) {
    if (error) return next(error);
    if (!this.changes) return db.get('SELECT status FROM requests WHERE id = ?', [req.params.id], (lookupError, row) => {
      if (lookupError) return next(lookupError);
      if (!row) return res.status(404).json({ error: 'Solicitação não encontrada.' });
      res.status(409).json({ error: 'Somente solicitações abertas podem ser editadas.' });
    });
    res.json({ message: 'Solicitação atualizada.' });
  });
});

router.patch('/:id/status', (req, res, next) => {
  const { status } = req.body;
  if (!statuses.includes(status)) return res.status(400).json({ error: 'Status inválido.' });
  db.run('UPDATE requests SET status = ? WHERE id = ?', [status, req.params.id], function (error) {
    if (error) return next(error);
    if (!this.changes) return res.status(404).json({ error: 'Solicitação não encontrada.' });
    res.json({ message: 'Status atualizado.' });
  });
});

router.delete('/:id', (req, res, next) => {
  db.run("DELETE FROM requests WHERE id = ? AND status = 'Aberto'", [req.params.id], function (error) {
    if (error) return next(error);
    if (!this.changes) return db.get('SELECT status FROM requests WHERE id = ?', [req.params.id], (lookupError, row) => {
      if (lookupError) return next(lookupError);
      if (!row) return res.status(404).json({ error: 'Solicitação não encontrada.' });
      res.status(409).json({ error: 'Somente solicitações abertas podem ser excluídas.' });
    });
    res.status(204).end();
  });
});

module.exports = router;
