const pool = require("../../db/pool");

// GET /profiles/me
async function getMyProfile(req, res) {
  const { rows } = await pool.query(
    "SELECT id, user_id, role, phone, push_token, created_at FROM profiles WHERE user_id = $1",
    [req.user.sub]
  );
  if (!rows[0]) {
    console.log(`[profiles] me user=${req.user.sub} not_found`);
    return res.json({ profile: null });
  }
  console.log(`[profiles] me user=${req.user.sub} role=${rows[0].role}`);
  return res.json({ profile: rows[0] });
}

// PUT /profiles/me  — upserts role (role cannot change once set)
async function upsertMyProfile(req, res) {
  const { role, phone, push_token } = req.body;
  if (role && !["candidate", "employer"].includes(role)) {
    return res.status(400).json({ error: "role must be 'candidate' or 'employer'" });
  }

  const { rows: existing } = await pool.query(
    "SELECT id, role FROM profiles WHERE user_id = $1",
    [req.user.sub]
  );

  if (existing[0] && role && existing[0].role !== role) {
    return res.status(409).json({ error: "Role cannot be changed after it is set" });
  }

  const { rows } = await pool.query(
    `INSERT INTO profiles (user_id, role, phone, push_token)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE
       SET phone      = COALESCE($3, profiles.phone),
           push_token = COALESCE($4, profiles.push_token)
     RETURNING id, user_id, role, phone, push_token, created_at`,
    [req.user.sub, role || existing[0]?.role, phone ?? null, push_token ?? null]
  );

  return res.json({ profile: rows[0] });
}

module.exports = { getMyProfile, upsertMyProfile };
