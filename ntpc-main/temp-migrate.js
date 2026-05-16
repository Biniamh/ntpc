const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const sql = "ALTER TABLE ey_events ADD COLUMN IF NOT EXISTS start_date TEXT NOT NULL DEFAULT ''; ALTER TABLE ey_events ADD COLUMN IF NOT EXISTS end_date TEXT NOT NULL DEFAULT ''; UPDATE ey_events SET start_date = date, end_date = date WHERE date IS NOT NULL; ALTER TABLE ey_events DROP COLUMN IF EXISTS date;";
pool.query(sql).then(res => { console.log('Migration applied:', res.command); return pool.end(); }).catch(err => { console.error(err); pool.end(); process.exit(1); });
