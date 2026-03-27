import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the local agent environment file from the root
dotenv.config({ path: path.resolve(__dirname, '../../.env.agent') });

const tableName = process.argv[2];

if (!tableName) {
  console.error('❌ Usage: node inspect-table.js <table_name>');
  process.exit(1);
}

const connectionString = process.env.AGENT_DB_URL;

if (!connectionString) {
  console.error('❌ Missing AGENT_DB_URL in .env.agent');
  console.error('   Please add AGENT_DB_URL="postgresql://user:pass@host:6543/postgres" to .env.agent');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function inspectTable() {
  try {
    await client.connect();

    // 1. Get columns and types
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    // 2. Get constraints (Primary Keys, Foreign Keys, Check Constraints)
    const constraintsQuery = `
      SELECT 
        con.conname AS constraint_name,
        con.contype AS constraint_type,
        pg_get_constraintdef(con.oid) AS constraint_definition
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = connamespace
      WHERE nsp.nspname = 'public' AND rel.relname = $1;
    `;

    const [columnsRes, constraintsRes] = await Promise.all([
      client.query(columnsQuery, [tableName]),
      client.query(constraintsQuery, [tableName])
    ]);

    if (columnsRes.rows.length === 0) {
      console.log(`\n⚠️  Table "${tableName}" not found in public schema.`);
      return;
    }

    console.log(`\n📦 Schema for table: ${tableName}\n`);
    
    console.log('--- COLUMNS ---');
    console.table(columnsRes.rows.map(r => ({
      Column: r.column_name,
      Type: r.data_type,
      Nullable: r.is_nullable,
      Default: r.column_default || 'null'
    })));

    if (constraintsRes.rows.length > 0) {
      console.log('\n--- CONSTRAINTS ---');
      constraintsRes.rows.forEach(c => {
        const typeMap = { 'p': 'PRIMARY KEY', 'f': 'FOREIGN KEY', 'c': 'CHECK', 'u': 'UNIQUE' };
        console.log(`- [${typeMap[c.constraint_type] || c.constraint_type}] ${c.constraint_name}: ${c.constraint_definition}`);
      });
    }

    console.log('\n');

  } catch (err) {
    console.error('❌ Database error:', err.message);
  } finally {
    await client.end();
  }
}

inspectTable();
