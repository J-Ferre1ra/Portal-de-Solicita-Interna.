const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  name: 'portal.sid',
  secret: process.env.SESSION_SECRET || 'portal-local-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 8 * 60 * 60 * 1000 },
}));

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(port, () => {
  console.log(`API iniciada na porta ${port}`);
});
