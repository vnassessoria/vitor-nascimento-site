const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/* ---------- Público ---------- */

router.get("/services", (req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all();
  res.json(rows);
});

/* ---------- Admin ---------- */

router.get("/admin/services", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all();
  res.json(rows);
});

router.post("/admin/services", requireAuth, (req, res) => {
  const { icon_key, title, description, sort_order } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }
  const info = db
    .prepare("INSERT INTO services (icon_key, title, description, sort_order) VALUES (?, ?, ?, ?)")
    .run(icon_key || "building", title, description, Number(sort_order) || 0);
  res.status(201).json({ id: Number(info.lastInsertRowid) });
});

router.put("/admin/services/:id", requireAuth, (req, res) => {
  const { icon_key, title, description, sort_order } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ error: "Título e descrição são obrigatórios." });
  }
  const info = db
    .prepare("UPDATE services SET icon_key = ?, title = ?, description = ?, sort_order = ? WHERE id = ?")
    .run(icon_key || "building", title, description, Number(sort_order) || 0, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Serviço não encontrado." });
  res.json({ ok: true });
});

router.delete("/admin/services/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Serviço não encontrado." });
  res.json({ ok: true });
});

module.exports = router;
