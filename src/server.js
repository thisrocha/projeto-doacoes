const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const db = new Database("./data.sqlite3");
require("./db");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const getPedido = id => db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id);

app.post("/api/pedidos", (req, res) => {
  const { nome, descricao, contato } = req.body;
  if (nome == null) return res.status(400).json({ error: "Nome é obrigatório" });

  const status = 'pendente';
  const stmt = db.prepare("INSERT INTO pedidos (nome, descricao, contato, status) VALUES (?, ?, ?, ?)");
  const result = stmt.run(nome, descricao || "", contato || "", status);
  res.json({ id: result.lastInsertRowid, nome, descricao, contato, status });
});


app.get("/api/pedidos", (req, res) => {
  const pedidos = db.prepare("SELECT * FROM pedidos ORDER BY id DESC").all();
  res.json(pedidos);
});


app.put("/api/pedidos/:id", (req, res) => {
  const { nome, descricao, contato } = req.body;
  const { id } = req.params;

  const exists = getPedido(id);
  if (!exists) return res.status(404).json({ error: "Pedido não encontrado" });

  const stmt = db.prepare("UPDATE pedidos SET nome=?, descricao=?, contato=? WHERE id=?");
  stmt.run(
    nome || exists.nome,
    descricao || exists.descricao,
    contato !== undefined ? contato : (exists.contato || ""),
    id
  );

  res.json(getPedido(id));
});


app.delete("/api/pedidos/:id", (req, res) => {
  const stmt = db.prepare("DELETE FROM pedidos WHERE id = ?");
  stmt.run(req.params.id);
  res.json({ success: true });
});


app.post('/api/pedidos/:id/atender', (req, res) => {
  const { id } = req.params;
  const exists = getPedido(id);
  if (!exists) return res.status(404).json({ error: 'Pedido não encontrado' });

  db.prepare("UPDATE pedidos SET status = ? WHERE id = ?").run('Atendido', id);
  res.json(getPedido(id));
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Servidor rodando: http://localhost:3000"));
