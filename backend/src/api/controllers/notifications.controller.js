const pool = require("../../db/pool");

// POST /notifications/token
async function registerToken(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "token required" });

  await pool.query(
    `INSERT INTO profiles (user_id, role, push_token)
     VALUES ($1, 'candidate', $2)
     ON CONFLICT (user_id) DO UPDATE SET push_token = $2`,
    [req.user.sub, token]
  );

  return res.json({ success: true });
}

// DELETE /notifications/token
async function removeToken(req, res) {
  await pool.query(
    "UPDATE profiles SET push_token = NULL WHERE user_id = $1",
    [req.user.sub]
  );
  return res.json({ success: true });
}

module.exports = { registerToken, removeToken };
