const Database = require("better-sqlite3");
const db = new Database("./data.sqlite3");

db.exec(`
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  contato TEXT,
  status TEXT
);
`);

console.log("Banco criado com a tabela pedidos.");