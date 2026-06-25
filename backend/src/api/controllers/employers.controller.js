const pool = require("../../db/pool");

const EMPLOYER_FIELDS = `
  id, user_id, company_name, contact_name, phone, email, location,
  credits_balance, subscription_ends_at, subscription_tier,
  trade_license, logo_url, created_at
`;

// GET /employers/me
async function getMyEmployer(req, res) {
  console.log(`[employers] me user=${req.user.sub} start`);
  const { rows } = await pool.query(
    `SELECT ${EMPLOYER_FIELDS} FROM employers WHERE user_id = $1`,
    [req.user.sub]
  );
  if (!rows[0]) {
    console.log(`[employers] me user=${req.user.sub} not_found`);
    return res.json({ employer: null });
  }
  console.log(`[employers] me user=${req.user.sub} found id=${rows[0].id}`);
  return res.json({ employer: rows[0] });
}

// POST /employers  — create on onboarding completion
async function createEmployer(req, res) {
  const { company_name, contact_name, phone, email, location, trade_license } = req.body;
  if (!company_name || !contact_name || !phone || !email || !location) {
    return res.status(400).json({ error: "Missing required employer fields" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO employers (user_id, company_name, contact_name, phone, email, location, trade_license)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${EMPLOYER_FIELDS}`,
      [req.user.sub, company_name.trim(), contact_name, phone, email, location, trade_license ?? null]
    );
    return res.status(201).json({ employer: rows[0] });
  } catch (e) {
    if (e.code === "23505") {
      if (e.constraint === "employers_company_name_unique_idx") {
        return res.status(409).json({ error: "Company name already taken" });
      }
      return res.status(409).json({ error: "Employer profile already exists" });
    }
    throw e;
  }
}

// PUT /employers/me  — partial update
async function updateMyEmployer(req, res) {
  const allowed = [
    "company_name","contact_name","phone","email","location","trade_license","logo_url",
  ];
  const fields = Object.keys(req.body).filter((k) => allowed.includes(k));
  if (!fields.length) return res.status(400).json({ error: "No updatable fields provided" });

  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
  const values = fields.map((f) => req.body[f]);

  try {
    const { rows } = await pool.query(
      `UPDATE employers SET ${setClauses} WHERE user_id = $1 RETURNING ${EMPLOYER_FIELDS}`,
      [req.user.sub, ...values]
    );
    if (!rows[0]) return res.status(400).json({ error: "Employer profile not found" });
    return res.json({ employer: rows[0] });
  } catch (e) {
    if (e.code === "23505" && e.constraint === "employers_company_name_unique_idx") {
      return res.status(409).json({ error: "Company name already taken" });
    }
    throw e;
  }
}

// GET /employers/check-company-name?name=...
async function checkCompanyName(req, res) {
  const { name } = req.query;
  if (!name || !name.trim()) return res.status(400).json({ error: "name query param required" });

  const { rows } = await pool.query(
    `SELECT 1 FROM employers
     WHERE lower(trim(company_name)) = lower(trim($1)) AND user_id != $2`,
    [name, req.user.sub]
  );
  return res.json({ available: rows.length === 0 });
}

module.exports = { getMyEmployer, createEmployer, updateMyEmployer, checkCompanyName };
