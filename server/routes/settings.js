const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function getAllSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const out = {};
  rows.forEach((r) => (out[r.key] = r.value));
  return out;
}

/* ---------- Público ---------- */

router.get("/settings", (req, res) => {
  res.json(getAllSettings());
});

/* ---------- Admin ---------- */

router.get("/admin/settings", requireAuth, (req, res) => {
  res.json(getAllSettings());
});

router.put("/admin/settings", requireAuth, (req, res) => {
  const body = req.body || {};
  const stmt = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  for (const [key, value] of Object.entries(body)) {
    stmt.run(key, String(value ?? ""));
  }
  res.json({ ok: true, settings: getAllSettings() });
});

module.exports = router;
