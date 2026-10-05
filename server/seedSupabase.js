import { supabase, isSupabaseConfigured } from './supabase.js';
import db, { initDatabase } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function syncToSupabase() {
  console.log('====================================================');
  console.log('  MEGAMIND PLUS IELTS -> SUPABASE DATABASE SYNC     ');
  console.log('====================================================');

  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Error: Supabase credentials not found in environment!');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in .env');
    process.exit(1);
  }

  console.log('🚀 Connecting to Supabase and syncing data from SQLite...');

  // Ensure local DB is initialized
  initDatabase();

  const tables = [
    'settings',
    'users',
    'tests',
    'test_sections',
    'passages',
    'audio_files',
    'questions',
    'writing_tasks',
    'speaking_tasks',
    'scoring_rules',
    'attempts',
    'evaluations',
    'notifications'
  ];

  for (const table of tables) {
    try {
      const rows = db.prepare(`SELECT * FROM ${table}`).all();
      if (!rows || rows.length === 0) {
        console.log(`ℹ️ Table [${table}]: No records to sync.`);
        continue;
      }

      console.log(`⏳ Syncing ${rows.length} records to Supabase table: [${table}]...`);

      // Format JSON strings if any into JSON objects for JSONB columns in Postgres
      const formattedRows = rows.map(row => {
        const item = { ...row };
        // Parse JSON fields if they are stringified
        ['options_json', 'correct_answer_json', 'cue_card_points_json', 'answers_json', 'flags_json'].forEach(field => {
          if (item[field] && typeof item[field] === 'string') {
            try {
              item[field] = JSON.parse(item[field]);
            } catch (e) {
              // keep as is
            }
          }
        });
        return item;
      });

      // Batch upsert in chunks of 50
      const chunkSize = 50;
      for (let i = 0; i < formattedRows.length; i += chunkSize) {
        const chunk = formattedRows.slice(i, i + chunkSize);
        const { error } = await supabase.from(table).upsert(chunk);
        if (error) {
          console.warn(`⚠️ Warning while syncing chunk to [${table}]:`, error.message);
        }
      }

      console.log(`✅ Table [${table}]: Successfully synced ${rows.length} records.`);
    } catch (err) {
      console.error(`❌ Error syncing table [${table}]:`, err.message);
    }
  }

  console.log('\n🎉 ALL DATA HAS BEEN SYNCED TO SUPABASE SUCCESSFULLY!\n');
  process.exit(0);
}

syncToSupabase();
