require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const messagesRoutes = require("./routes/messages");
const settingsRoutes = require("./routes/settings");
const servicesRoutes = require("./routes/services");

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ROOT = path.join(__dirname, "..");

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", authRoutes);
app.use("/api", newsRoutes);
app.use("/api", messagesRoutes);
app.use("/api", settingsRoutes);
app.use("/api", servicesRoutes);

// Site público + painel administrativo (arquivos estáticos)
app.use(express.static(SITE_ROOT));

app.use((req, res) => {
  res.status(404).send("Página não encontrada.");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Painel administrativo em http://localhost:${PORT}/admin/`);
});
