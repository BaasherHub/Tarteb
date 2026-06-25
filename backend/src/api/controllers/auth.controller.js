const twilio = require("twilio");
const pool = require("../../db/pool");
const config = require("../../config");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  hashToken,
} = require("../../utils/tokens");

const twilioClient = config.twilioAccountSid && config.twilioAuthToken
  ? twilio(config.twilioAccountSid, config.twilioAuthToken)
  : null;

function refreshExpiresAt() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}

function issueTokens(userId, phone) {
  const payload = { sub: userId, phone };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
}

async function storeSession(userId, accessToken, refreshToken) {
  await pool.query(
    `INSERT INTO sessions (user_id, token_hash, refresh_token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [userId, hashToken(accessToken), hashToken(refreshToken), refreshExpiresAt()]
  );
}

// POST /auth/send-otp
async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!phone || !/^\+971[0-9]{8,9}$/.test(phone)) {
    return res.status(400).json({ error: "Valid UAE phone number required (+971...)" });
  }

  console.log(`[auth] send_otp phone=${phone.slice(0, 6)}***`);
  if (config.skipOtpVerification) {
    return res.json({ success: true, status: "bypass" });
  }

  if (!twilioClient) {
    return res.status(503).json({ error: "OTP service not configured" });
  }

  try {
    await twilioClient.verify.v2
      .services(config.twilioVerifySid)
      .verifications.create({ to: phone, channel: "sms" });
    return res.json({ success: true });
  } catch (e) {
    console.error("[auth] send_otp_error", e.message);
    return res.status(502).json({ error: e.message || "Failed to send OTP" });
  }
}

// POST /auth/verify-otp
async function verifyOtp(req, res) {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "phone and code are required" });
  }

  if (!config.skipOtpVerification) {
    if (!twilioClient) {
      return res.status(503).json({ error: "OTP service not configured" });
    }
    try {
      const check = await twilioClient.verify.v2
        .services(config.twilioVerifySid)
        .verificationChecks.create({ to: phone, code: String(code).trim() });
      if (check.status !== "approved") {
        return res.status(400).json({ error: "Invalid OTP code" });
      }
    } catch (e) {
      console.error("[auth] verify_otp_error", e.message);
      return res.status(400).json({ error: "Invalid OTP code" });
    }
  }

  // Find or create user
  const { rows } = await pool.query(
    `INSERT INTO users (phone) VALUES ($1)
     ON CONFLICT (phone) DO UPDATE SET last_active_at = now()
     RETURNING id, phone, created_at`,
    [phone]
  );
  const user = rows[0];

  const { accessToken, refreshToken } = issueTokens(user.id, user.phone);
  await storeSession(user.id, accessToken, refreshToken);

  console.log(`[auth] verify_otp_ok user_id=${user.id}`);
  return res.json({ access_token: accessToken, refresh_token: refreshToken, user });
}

// POST /auth/refresh
async function refresh(req, res) {
  const { refresh_token: refreshToken } = req.body;
  console.log('[auth] refresh attempt');
  if (!refreshToken) return res.status(400).json({ error: "refresh_token required" });

  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch {
    console.log('[auth] refresh_fail reason=invalid_token');
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }

  const rHash = hashToken(refreshToken);
  const { rows } = await pool.query(
    "SELECT id, user_id, is_revoked FROM sessions WHERE refresh_token_hash = $1 LIMIT 1",
    [rHash]
  );
  if (!rows[0] || rows[0].is_revoked) {
    console.log(`[auth] refresh_fail reason=${rows[0] ? 'revoked' : 'not_found'}`);
    return res.status(401).json({ error: "Refresh token revoked or not found" });
  }

  // Rotate: revoke old session, issue new tokens
  await pool.query("UPDATE sessions SET is_revoked = true WHERE id = $1", [rows[0].id]);

  const { rows: userRows } = await pool.query(
    "SELECT id, phone FROM users WHERE id = $1",
    [decoded.sub]
  );
  if (!userRows[0]) return res.status(401).json({ error: "User not found" });

  const { accessToken: newAccess, refreshToken: newRefresh } = issueTokens(
    userRows[0].id,
    userRows[0].phone
  );
  await storeSession(userRows[0].id, newAccess, newRefresh);

  console.log(`[auth] refresh_ok user_id=${userRows[0].id}`);
  return res.json({ access_token: newAccess, refresh_token: newRefresh });
}

// POST /auth/logout
async function logout(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token) {
    await pool
      .query("UPDATE sessions SET is_revoked = true WHERE token_hash = $1", [hashToken(token)])
      .catch(() => {});
  }
  return res.json({ success: true });
}

// GET /auth/me
async function me(req, res) {
  const { rows } = await pool.query(
    "SELECT id, phone, created_at FROM users WHERE id = $1",
    [req.user.sub]
  );
  if (!rows[0]) return res.status(404).json({ error: "User not found" });
  return res.json({ user: rows[0] });
}

module.exports = { sendOtp, verifyOtp, refresh, logout, me };
