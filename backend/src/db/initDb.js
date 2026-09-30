const fs = require('node:fs');
const path = require('node:path');
const db = require('./database');

const schemaPath = path.join(__dirname, 'schema.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (schemaError) => {
  if (schemaError) {
    console.error('Não foi possível criar as tabelas:', schemaError.message);
    process.exitCode = 1;
  } else {
    console.log('Banco SQLite inicializado com sucesso.');
  }

  db.close();
});
