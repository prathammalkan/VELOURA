const { Client } = require('pg');
const fs = require('fs');

async function migrate() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Veloura@DiyaJain123@db.zyjqhivvmiowuzefvqpx.supabase.co:5432/postgres'
  });
  
  await client.connect();
  const sql = fs.readFileSync('supabase/rpc_migration.sql', 'utf8');
  await client.query(sql);
  await client.end();
}
migrate();
