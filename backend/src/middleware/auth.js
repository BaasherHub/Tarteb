const { verifyToken, hashToken } = require("../utils/tokens");
const pool = require("../db/pool");

const lastUpdate = new Map();
const UPDATE_THROTTLE_MS = 2 * 60 * 1000;

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Authentication required" });

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (e) {
    const reason = e?.name === "TokenExpiredError" ? "expired_token" : "invalid_token";
    console.warn(`[auth] reject path=${req.path} reason=${reason}`);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const userId = decoded.sub;

  try {
    const tokenHash = hashToken(token);
    const { rows } = await pool.query(
      "SELECT is_revoked FROM sessions WHERE token_hash = $1 LIMIT 1",
      [tokenHash]
    );
    if (!rows[0]) {
      console.warn(`[auth] reject path=${req.path} user=${userId} reason=unknown_session`);
      return res.status(401).json({ error: "Session expired — please log in again" });
    }
    if (rows[0].is_revoked) {
      console.warn(`[auth] reject path=${req.path} user=${userId} reason=revoked`);
      return res.status(401).json({ error: "Session revoked — please log in again" });
    }
  } catch (e) {
    console.warn(`[auth] db_error user=${userId} path=${req.path} error=${e.message}`);
    return res.status(503).json({ error: "Service temporarily unavailable, please retry" });
  }

  req.user = decoded;

  // Throttled last_active_at update (fire-and-forget)
  const now = Date.now();
  if (now - (lastUpdate.get(userId) || 0) > UPDATE_THROTTLE_MS) {
    lastUpdate.set(userId, now);
    pool
      .query("UPDATE users SET last_active_at = NOW() WHERE id = $1", [userId])
      .catch(() => {});
  }

  return next();
}

module.exports = { requireAuth };
