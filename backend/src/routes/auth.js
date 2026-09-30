const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }

  db.get('SELECT id, username, password_hash FROM users WHERE username = ?', [username.trim()], async (error, user) => {
    if (error) return next(error);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) return next(sessionError);
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({ user: { id: user.id, username: user.username } });
    });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Sessão encerrada.' });
  res.json({ user: { id: req.session.userId, username: req.session.username } });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('portal.sid', { httpOnly: true, sameSite: 'lax' });
    res.status(204).end();
  });
});

module.exports = router;
