const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/* ---------- Público ---------- */

router.post("/messages", (req, res) => {
  const { nome, email, telefone, mensagem } = req.body || {};
  if (!nome || !mensagem) {
    return res.status(400).json({ error: "Nome e mensagem são obrigatórios." });
  }
  const ts = new Date().toISOString();
  db.prepare(
    "INSERT INTO messages (nome, email, telefone, mensagem, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)"
  ).run(nome, email || "", telefone || "", mensagem, ts);
  res.status(201).json({ ok: true });
});

/* ---------- Admin ---------- */

router.get("/admin/messages", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
  res.json(rows);
});

router.put("/admin/messages/:id/read", requireAuth, (req, res) => {
  const info = db.prepare("UPDATE messages SET is_read = 1 WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Mensagem não encontrada." });
  res.json({ ok: true });
});

router.delete("/admin/messages/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Mensagem não encontrada." });
  res.json({ ok: true });
});

module.exports = router;
