const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

const dataDirectory = path.join(__dirname, '../../data');
const databasePath = path.join(dataDirectory, 'requests.sqlite');

fs.mkdirSync(dataDirectory, { recursive: true });

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Não foi possível abrir o banco SQLite:', error.message);
    process.exitCode = 1;
    return;
  }

  db.run('PRAGMA foreign_keys = ON');
});

module.exports = db;
