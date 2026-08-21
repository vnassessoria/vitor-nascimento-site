const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: "Não autenticado." });

  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

module.exports = requireAuth;
