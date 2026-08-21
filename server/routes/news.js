const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(base, ignoreId) {
  let slug = slugify(base) || "noticia";
  let n = 2;
  while (true) {
    const row = ignoreId
      ? db.prepare("SELECT id FROM news WHERE slug = ? AND id != ?").get(slug, ignoreId)
      : db.prepare("SELECT id FROM news WHERE slug = ?").get(slug);
    if (!row) return slug;
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
}

/* ---------- Público ---------- */

router.get("/news", (req, res) => {
  const rows = db
    .prepare(
      "SELECT id, tag, title, summary, slug FROM news WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    )
    .all();
  res.json(rows);
});

router.get("/news/:slug", (req, res) => {
  const row = db
    .prepare("SELECT id, tag, title, summary, slug, body, updated_at FROM news WHERE slug = ? AND is_active = 1")
    .get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Notícia não encontrada." });
  res.json(row);
});

/* ---------- Admin ---------- */

router.get("/admin/news", requireAuth, (req, res) => {
  const rows = db.prepare("SELECT * FROM news ORDER BY sort_order ASC, id ASC").all();
  res.json(rows);
});

router.post("/admin/news", requireAuth, (req, res) => {
  const { tag, title, summary, body, is_active, sort_order } = req.body || {};
  if (!tag || !title || !summary) {
    return res.status(400).json({ error: "Categoria, título e resumo são obrigatórios." });
  }
  const slug = uniqueSlug(title);
  const ts = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO news (tag, title, summary, slug, body, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(tag, title, summary, slug, body || "", is_active ? 1 : 0, Number(sort_order) || 0, ts, ts);
  res.status(201).json({ id: Number(info.lastInsertRowid), slug });
});

router.put("/admin/news/:id", requireAuth, (req, res) => {
  const existing = db.prepare("SELECT * FROM news WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Notícia não encontrada." });

  const { tag, title, summary, body, is_active, sort_order } = req.body || {};
  if (!tag || !title || !summary) {
    return res.status(400).json({ error: "Categoria, título e resumo são obrigatórios." });
  }
  const slug = title !== existing.title ? uniqueSlug(title, existing.id) : existing.slug;
  const ts = new Date().toISOString();

  db.prepare(
    `UPDATE news SET tag = ?, title = ?, summary = ?, slug = ?, body = ?, is_active = ?, sort_order = ?, updated_at = ?
     WHERE id = ?`
  ).run(tag, title, summary, slug, body || "", is_active ? 1 : 0, Number(sort_order) || 0, ts, req.params.id);

  res.json({ ok: true, slug });
});

router.delete("/admin/news/:id", requireAuth, (req, res) => {
  const info = db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Notícia não encontrada." });
  res.json({ ok: true });
});

module.exports = router;
