const express = require('express');
const db = require('../db/database');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', requireAuth, (req, res, next) => {
  const query = `
    SELECT COUNT(*) AS total,
      SUM(CASE WHEN status = 'Aberto' THEN 1 ELSE 0 END) AS abertas,
      SUM(CASE WHEN status = 'Em Atendimento' THEN 1 ELSE 0 END) AS em_atendimento,
      SUM(CASE WHEN status = 'Concluído' THEN 1 ELSE 0 END) AS concluidas
    FROM requests`;

  db.get(query, (error, row) => {
    if (error) return next(error);
    res.json({ total: row.total, abertas: row.abertas || 0, emAtendimento: row.em_atendimento || 0, concluidas: row.concluidas || 0 });
  });
});

module.exports = router;
