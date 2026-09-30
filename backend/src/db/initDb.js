const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const db = require('./database');

const schemaPath = path.join(__dirname, 'schema.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (schemaError) => {
  if (schemaError) {
    console.error('Não foi possível criar as tabelas:', schemaError.message);
    process.exitCode = 1;
  } else {
    bcrypt.hash('Admin123!', 10).then((passwordHash) => {
      db.run('INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)', ['admin', passwordHash], (seedError) => {
        if (seedError) {
          console.error('Não foi possível preparar o usuário de demonstração:', seedError.message);
          process.exitCode = 1;
        } else {
          console.log('Banco SQLite e usuário de demonstração inicializados.');
        }
        db.close();
      });
    }).catch((error) => {
      console.error('Não foi possível gerar a senha do usuário de demonstração:', error.message);
      process.exitCode = 1;
      db.close();
    });
    return;
  }

  db.close();
});
