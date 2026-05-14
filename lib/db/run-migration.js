import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const migrationSql = fs.readFileSync(path.join(process.cwd(), 'migrations', '003_change_event_date_to_start_end.sql'), 'utf8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5433/ntpc_db'
});

async function runMigration() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to database');
    
    // Execute the migration
    await client.query(migrationSql);
    console.log('Migration executed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigration();