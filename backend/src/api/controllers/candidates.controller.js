const pool = require("../../db/pool");

const CANDIDATE_FIELDS = `
  id, user_id, name, photo_url, role, additional_roles, visa_status,
  nationality, salary_expectation, current_salary, available_from,
  location, phone, whatsapp, is_active, availability_status,
  years_experience, languages, uae_experience, previous_employer,
  cv_url, cv_file_name, last_active_at, profile_view_count, created_at
`;

// GET /candidates/me
async function getMyCandidate(req, res) {
  const { rows } = await pool.query(
    `SELECT ${CANDIDATE_FIELDS},
       (SELECT COUNT(*) FROM unlocks WHERE candidate_id = candidates.id)::int AS unlock_count
     FROM candidates WHERE user_id = $1`,
    [req.user.sub]
  );
  if (!rows[0]) return res.json({ candidate: null });
  return res.json({ candidate: rows[0] });
}

// POST /candidates  — create on onboarding completion
async function createCandidate(req, res) {
  const {
    name, photo_url, role, visa_status, nationality, salary_expectation,
    current_salary, available_from, location, phone, whatsapp,
    years_experience, languages, uae_experience, previous_employer,
    additional_roles, is_active,
  } = req.body;

  if (!name || !role || !visa_status || !nationality || salary_expectation == null || !location) {
    return res.status(400).json({ error: "Missing required candidate fields" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO candidates
         (user_id, name, photo_url, role, additional_roles, visa_status, nationality,
          salary_expectation, current_salary, available_from, location,
          phone, whatsapp, years_experience, languages, uae_experience,
          previous_employer, is_active, last_active_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18, now())
       RETURNING ${CANDIDATE_FIELDS}`,
      [
        req.user.sub, name, photo_url ?? null, role, additional_roles ?? [],
        visa_status, nationality, salary_expectation, current_salary ?? null,
        available_from ?? null, location, phone ?? null, whatsapp ?? null,
        years_experience ?? 0, languages ?? [], uae_experience ?? false,
        previous_employer ?? null, is_active ?? true,
      ]
    );
    return res.status(201).json({ candidate: rows[0] });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Candidate profile already exists" });
    throw e;
  }
}

// PUT /candidates/me  — partial update
async function updateMyCandidate(req, res) {
  const allowed = [
    "name","role","additional_roles","visa_status","nationality",
    "salary_expectation","current_salary","available_from","location",
    "phone","whatsapp","is_active","availability_status","years_experience",
    "languages","uae_experience","previous_employer","photo_url",
    "cv_url","cv_file_name",
  ];

  const fields = Object.keys(req.body).filter((k) => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ error: "No updatable fields provided" });

  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  const values = fields.map((f) => req.body[f]);

  const { rows } = await pool.query(
    `UPDATE candidates SET ${setClauses}, last_active_at = now()
     WHERE user_id = $1
     RETURNING ${CANDIDATE_FIELDS}`,
    [req.user.sub, ...values]
  );

  if (!rows[0]) return res.status(400).json({ error: "Candidate profile not found" });
  return res.json({ candidate: rows[0] });
}

// GET /candidates/:id  — employer use after unlock
async function getCandidateById(req, res) {
  const { id } = req.params;

  // Verify caller is an employer
  const { rows: empRows } = await pool.query(
    "SELECT id FROM employers WHERE user_id = $1",
    [req.user.sub]
  );
  if (!empRows[0]) return res.status(403).json({ error: "Employer profile required" });

  const isUnlocked = await pool.query(
    `SELECT 1 FROM unlocks WHERE employer_id = $1 AND candidate_id = $2`,
    [empRows[0].id, id]
  );
  const unlocked = isUnlocked.rows.length > 0;

  const { rows } = await pool.query(
    `SELECT
       id, name, photo_url, role, additional_roles, visa_status, nationality,
       availability_status, salary_expectation,
       ${unlocked ? "current_salary," : "null AS current_salary,"}
       available_from, location, is_active, created_at, last_active_at,
       years_experience, languages, uae_experience, previous_employer,
       (cv_url IS NOT NULL) AS has_cv,
       ${unlocked ? "phone, whatsapp, cv_url, cv_file_name," : "null AS phone, null AS whatsapp, null AS cv_url, null AS cv_file_name,"}
       $2 AS is_unlocked,
       profile_view_count
     FROM candidates WHERE id = $1`,
    [id, unlocked]
  );

  if (!rows[0]) return res.status(404).json({ error: "Candidate not found" });

  // Increment view count (fire-and-forget)
  if (unlocked) {
    pool
      .query("UPDATE candidates SET profile_view_count = profile_view_count + 1 WHERE id = $1", [id])
      .catch(() => {});
  }

  return res.json({ candidate: rows[0] });
}

module.exports = { getMyCandidate, createCandidate, updateMyCandidate, getCandidateById };
