const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // ative como true se o site rodar atrás de HTTPS
  maxAge: 1000 * 60 * 60 * 12, // 12 horas
};

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Informe usuário e senha." });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign({ sub: user.id, username: user.username }, process.env.SESSION_SECRET, {
    expiresIn: "12h",
  });
  res.cookie("admin_token", token, COOKIE_OPTIONS);
  res.json({ ok: true, username: user.username });
});

router.post("/logout", (req, res) => {
  res.clearCookie("admin_token");
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

router.post("/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Informe a senha atual e a nova senha." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "A nova senha deve ter pelo menos 6 caracteres." });
  }

  const user = db.prepare("SELECT * FROM admin_users WHERE id = ?").get(req.admin.sub);
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: "Senha atual incorreta." });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(newHash, user.id);
  res.json({ ok: true });
});

module.exports = router;
