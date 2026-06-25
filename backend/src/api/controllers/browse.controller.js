const pool = require("../../db/pool");

// POST /browse/candidates  — full filter set from BrowseFilters
async function browseCandidates(req, res) {
  const { rows: empRows } = await pool.query(
    "SELECT id FROM employers WHERE user_id = $1",
    [req.user.sub]
  );
  if (!empRows[0]) {
    console.log(`[browse] candidates user=${req.user.sub} 403_no_employer_profile`);
    return res.status(403).json({ error: "Employer profile required to browse" });
  }

  const employerId = empRows[0].id;
  const body = req.body ?? {};
  const roles          = Array.isArray(body.roles)         ? body.roles         : [];
  const visaStatuses   = Array.isArray(body.visaStatuses)  ? body.visaStatuses  : [];
  const locations      = Array.isArray(body.locations)     ? body.locations     : [];
  const salaryMin      = Number(body.salaryMin ?? 0);
  const salaryMax      = body.salaryMax != null ? Number(body.salaryMax) : null;
  const availableNow   = Boolean(body.availableNow);
  const nationalitySearch = String(body.nationalitySearch ?? "").trim();
  const experienceYears = Array.isArray(body.experienceYears) ? body.experienceYears : [];
  const languages      = Array.isArray(body.languages)     ? body.languages     : [];
  const uaeExperience  = body.uaeExperience != null ? Boolean(body.uaeExperience) : null;
  const page           = Math.max(1, Number(body.page ?? 1));
  const limit          = Math.min(50, Math.max(1, Number(body.limit ?? 20)));
  const offset         = (page - 1) * limit;

  // Build parameterised WHERE clause
  const conditions = ["c.is_active = true"];
  const params = [employerId]; // $1 = employerId for the unlock JOIN
  let p = 2;

  function nextPh() { return `$${p++}`; }

  if (roles.length) {
    const ph = nextPh();
    params.push(roles);
    conditions.push(`(c.role = ANY(${ph}::text[]) OR c.additional_roles && ${ph}::text[])`);
  }

  if (visaStatuses.length) {
    const ph = nextPh();
    params.push(visaStatuses);
    conditions.push(`c.visa_status = ANY(${ph}::text[])`);
  }

  if (locations.length) {
    const clauses = [];
    for (const loc of locations) {
      if (loc.includes(" — ")) {
        clauses.push(`c.location = ${nextPh()}`);
        params.push(loc);
      } else {
        clauses.push(`(c.location = ${nextPh()} OR c.location ILIKE ${nextPh()})`);
        params.push(loc, `${loc} —%`);
      }
    }
    conditions.push(`(${clauses.join(" OR ")})`);
  }

  if (nationalitySearch) {
    conditions.push(`c.nationality ILIKE ${nextPh()}`);
    params.push(`%${nationalitySearch}%`);
  }

  if (salaryMin > 0) {
    conditions.push(`c.salary_expectation >= ${nextPh()}`);
    params.push(Math.round(salaryMin));
  }

  if (salaryMax != null && salaryMax < 25000) {
    conditions.push(`c.salary_expectation <= ${nextPh()}`);
    params.push(Math.round(salaryMax));
  }

  if (availableNow) {
    const today = new Date().toISOString().slice(0, 10);
    conditions.push(`(c.available_from IS NULL OR c.available_from <= ${nextPh()})`);
    params.push(today);
  }

  if (experienceYears.length) {
    const ph = nextPh();
    params.push(experienceYears.map(Number));
    conditions.push(`c.years_experience = ANY(${ph}::int[])`);
  }

  if (languages.length) {
    const ph = nextPh();
    params.push(languages);
    conditions.push(`c.languages && ${ph}::text[]`);
  }

  if (uaeExperience !== null) {
    conditions.push(`c.uae_experience = ${nextPh()}`);
    params.push(uaeExperience);
  }

  const where = conditions.join(" AND ");
  const unlockJoin = `LEFT JOIN unlocks u ON u.candidate_id = c.id AND u.employer_id = $1`;

  const selectSql = `
    SELECT
      c.id, c.name, c.photo_url, c.role, c.additional_roles,
      c.availability_status, c.visa_status, c.nationality,
      c.salary_expectation, c.available_from, c.location,
      c.is_active, c.created_at, c.last_active_at,
      c.years_experience, c.languages, c.uae_experience, c.previous_employer,
      (c.cv_url IS NOT NULL) AS has_cv,
      (u.id IS NOT NULL) AS is_unlocked,
      CASE WHEN u.id IS NOT NULL THEN c.current_salary ELSE NULL END AS current_salary,
      CASE WHEN u.id IS NOT NULL THEN c.phone          ELSE NULL END AS phone,
      CASE WHEN u.id IS NOT NULL THEN c.whatsapp       ELSE NULL END AS whatsapp,
      CASE WHEN u.id IS NOT NULL THEN c.cv_url         ELSE NULL END AS cv_url,
      CASE WHEN u.id IS NOT NULL THEN c.cv_file_name   ELSE NULL END AS cv_file_name
    FROM candidates c
    ${unlockJoin}
    WHERE ${where}
    ORDER BY c.last_active_at DESC NULLS LAST, c.created_at DESC
    LIMIT ${limit} OFFSET ${offset}`;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM candidates c
    ${unlockJoin}
    WHERE ${where}`;

  const [{ rows }, { rows: countRows }] = await Promise.all([
    pool.query(selectSql, params),
    pool.query(countSql, params),
  ]);

  return res.json({
    candidates: rows,
    total: parseInt(countRows[0].total),
    page,
    limit,
  });
}

// GET /browse/role-counts
async function getRoleCounts(req, res) {
  const t0 = Date.now();
  console.log(`[browse] role_counts user=${req.user.sub} start`);
  const { rows } = await pool.query(`
    SELECT r AS role, count(*) AS count
    FROM (
      SELECT role AS r FROM candidates WHERE is_active = true AND role IS NOT NULL AND role <> ''
      UNION ALL
      SELECT unnest(additional_roles) AS r FROM candidates WHERE is_active = true
    ) t
    WHERE r IS NOT NULL AND r <> ''
    GROUP BY r ORDER BY count DESC`);
  console.log(`[browse] role_counts user=${req.user.sub} done took=${Date.now() - t0}ms roles=${rows.length}`);
  return res.json({ roles: rows });
}

module.exports = { browseCandidates, getRoleCounts };
