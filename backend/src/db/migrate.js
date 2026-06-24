const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function migrate() {
  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename text PRIMARY KEY,
      run_at   timestamptz NOT NULL DEFAULT now()
    )
  `);

  for (const file of files) {
    const { rows } = await pool.query(
      "SELECT 1 FROM _migrations WHERE filename = $1",
      [file]
    );
    if (rows.length > 0) {
      console.log(`[migrate] skip ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    await pool.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
    console.log(`[migrate] applied ${file}`);
  }

  console.log("[migrate] done");
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[migrate] error", e.message);
    process.exit(1);
  });
