const pool = require("../../db/pool");

// GET /browse/candidates
// Query params: role, location, visa_status, page (default 1), limit (default 20)
async function browseCandidates(req, res) {
  // Only employers can browse
  const { rows: empRows } = await pool.query(
    "SELECT id FROM employers WHERE user_id = $1",
    [req.user.sub]
  );
  if (!empRows[0]) return res.status(403).json({ error: "Employer profile required to browse" });

  const employerId = empRows[0].id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  const conditions = ["(c.is_active = true OR u.candidate_id IS NOT NULL)"];
  const params = [employerId];
  let p = 2;

  if (req.query.role) {
    conditions.push(`(c.role = $${p} OR $${p} = ANY(c.additional_roles))`);
    params.push(req.query.role);
    p++;
  }
  if (req.query.location) {
    conditions.push(`c.location ILIKE $${p}`);
    params.push(`%${req.query.location}%`);
    p++;
  }
  if (req.query.visa_status) {
    conditions.push(`c.visa_status = $${p}`);
    params.push(req.query.visa_status);
    p++;
  }

  const where = conditions.join(" AND ");

  const { rows } = await pool.query(
    `SELECT
       c.id, c.name, c.photo_url, c.role, c.additional_roles,
       c.availability_status, c.visa_status, c.nationality,
       (u.candidate_id IS NOT NULL)                                          AS is_unlocked,
       CASE WHEN u.candidate_id IS NOT NULL THEN c.current_salary ELSE NULL END AS current_salary,
       c.salary_expectation, c.available_from, c.location,
       c.is_active, c.created_at, c.last_active_at,
       c.years_experience, c.languages, c.uae_experience, c.previous_employer,
       (c.cv_url IS NOT NULL)                                                AS has_cv,
       CASE WHEN u.candidate_id IS NOT NULL THEN c.phone     ELSE NULL END  AS phone,
       CASE WHEN u.candidate_id IS NOT NULL THEN c.whatsapp  ELSE NULL END  AS whatsapp,
       CASE WHEN u.candidate_id IS NOT NULL THEN c.cv_url    ELSE NULL END  AS cv_url,
       CASE WHEN u.candidate_id IS NOT NULL THEN c.cv_file_name ELSE NULL END AS cv_file_name
     FROM candidates c
     LEFT JOIN (
       SELECT ul.candidate_id
       FROM unlocks ul
       WHERE ul.employer_id = $1
     ) u ON u.candidate_id = c.id
     WHERE ${where}
     ORDER BY c.last_active_at DESC NULLS LAST, c.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  // Total count for pagination
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) AS total
     FROM candidates c
     LEFT JOIN (
       SELECT ul.candidate_id FROM unlocks ul WHERE ul.employer_id = $1
     ) u ON u.candidate_id = c.id
     WHERE ${where}`,
    params
  );

  return res.json({
    candidates: rows,
    total: parseInt(countRows[0].total),
    page,
    limit,
  });
}

// GET /browse/role-counts
async function getRoleCounts(req, res) {
  const { rows } = await pool.query(
    `SELECT r AS role, count(*) AS count
     FROM (
       SELECT role AS r FROM candidates WHERE is_active = true AND role IS NOT NULL AND role <> ''
       UNION ALL
       SELECT unnest(additional_roles) AS r FROM candidates WHERE is_active = true
     ) t
     WHERE r IS NOT NULL AND r <> ''
     GROUP BY r
     ORDER BY count DESC`
  );
  return res.json({ roles: rows });
}

module.exports = { browseCandidates, getRoleCounts };
