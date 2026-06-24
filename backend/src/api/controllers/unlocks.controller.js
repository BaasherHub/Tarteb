const pool = require("../../db/pool");

// POST /unlocks  — unlock a candidate (free, idempotent)
async function unlockCandidate(req, res) {
  const { candidate_id } = req.body;
  if (!candidate_id) return res.status(400).json({ error: "candidate_id required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock employer row
    const { rows: empRows } = await client.query(
      "SELECT id FROM employers WHERE user_id = $1 FOR UPDATE",
      [req.user.sub]
    );
    if (!empRows[0]) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "Employer profile required" });
    }
    const employerId = empRows[0].id;

    // Idempotent — already unlocked
    const { rows: existingRows } = await client.query(
      "SELECT * FROM unlocks WHERE employer_id = $1 AND candidate_id = $2",
      [employerId, candidate_id]
    );
    if (existingRows[0]) {
      await client.query("COMMIT");
      return res.json({ unlock: existingRows[0] });
    }

    // Verify candidate exists
    const { rows: candRows } = await client.query(
      "SELECT id FROM candidates WHERE id = $1",
      [candidate_id]
    );
    if (!candRows[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Insert unlock
    const { rows: unlockRows } = await client.query(
      `INSERT INTO unlocks (employer_id, candidate_id, amount_paid)
       VALUES ($1, $2, 0)
       RETURNING *`,
      [employerId, candidate_id]
    );

    // Increment monthly counter
    const month = new Date();
    month.setDate(1);
    const monthStr = month.toISOString().slice(0, 10);
    await client.query(
      `INSERT INTO monthly_unlocks (employer_id, month, count) VALUES ($1, $2, 1)
       ON CONFLICT (employer_id, month) DO UPDATE SET count = monthly_unlocks.count + 1`,
      [employerId, monthStr]
    );

    await client.query("COMMIT");
    return res.status(201).json({ unlock: unlockRows[0] });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// GET /unlocks  — list my unlocked candidates (employer)
async function getMyUnlocks(req, res) {
  const { rows: empRows } = await pool.query(
    "SELECT id FROM employers WHERE user_id = $1",
    [req.user.sub]
  );
  if (!empRows[0]) return res.status(403).json({ error: "Employer profile required" });

  const { rows } = await pool.query(
    `SELECT
       u.id, u.candidate_id, u.unlocked_at,
       c.name, c.photo_url, c.role, c.phone, c.whatsapp,
       c.cv_url, c.cv_file_name, c.location, c.nationality,
       c.visa_status, c.availability_status
     FROM unlocks u
     JOIN candidates c ON c.id = u.candidate_id
     WHERE u.employer_id = $1
     ORDER BY u.unlocked_at DESC`,
    [empRows[0].id]
  );

  return res.json({ unlocks: rows });
}

module.exports = { unlockCandidate, getMyUnlocks };
