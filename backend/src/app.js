const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const config = require("./config");

const authRoutes         = require("./api/routes/auth.routes");
const profilesRoutes     = require("./api/routes/profiles.routes");
const candidatesRoutes   = require("./api/routes/candidates.routes");
const employersRoutes    = require("./api/routes/employers.routes");
const browseRoutes       = require("./api/routes/browse.routes");
const unlocksRoutes      = require("./api/routes/unlocks.routes");
const notificationsRoutes = require("./api/routes/notifications.routes");
const storageRoutes      = require("./api/routes/storage.routes");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins.length ? config.corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
const v1 = "/api/v1";
app.use(`${v1}/auth`,          authRoutes);
app.use(`${v1}/profiles`,      profilesRoutes);
app.use(`${v1}/candidates`,    candidatesRoutes);
app.use(`${v1}/employers`,     employersRoutes);
app.use(`${v1}/browse`,        browseRoutes);
app.use(`${v1}/unlocks`,       unlocksRoutes);
app.use(`${v1}/notifications`, notificationsRoutes);
app.use(`${v1}/storage`,       storageRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message, err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
