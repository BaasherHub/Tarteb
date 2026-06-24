const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const sslEnabled =
  process.env.NODE_ENV === "production" || process.env.DB_SSL === "true";

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});
