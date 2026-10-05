import db, { initDatabase } from './db.js';
import { supabase, isSupabaseConfigured } from './supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function clearAllData() {
  console.log('====================================================');
  console.log('       CLEARING ALL DEMO DATA & RESETTING DB        ');
  console.log('====================================================');

  // 1. Initialize DB structure
  initDatabase();

  // 2. Clear local SQLite database
  console.log('🗑️ Clearing local SQLite tables...');
  const tables = [
    'evaluations',
    'notifications',
    'attempts',
    'questions',
    'passages',
    'audio_files',
    'writing_tasks',
    'speaking_tasks',
    'test_sections',
    'scoring_rules',
    'tests',
    'users',
    'settings'
  ];

  for (const table of tables) {
    try {
      db.prepare(`DELETE FROM ${table}`).run();
      console.log(`✓ Cleared local table: ${table}`);
    } catch (err) {
      console.warn(`Could not clear local table ${table}:`, err.message);
    }
  }

  // 3. Clear Supabase tables if connected
  if (isSupabaseConfigured && supabase) {
    console.log('\n🗑️ Clearing Supabase cloud tables...');
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
          console.warn(`Note on Supabase [${table}]:`, error.message);
        } else {
          console.log(`✓ Cleared Supabase table: ${table}`);
        }
      } catch (err) {
        console.warn(`Error on Supabase table ${table}:`, err.message);
      }
    }
  }

  console.log('\n✅ ALL DEMO DATA HAS BEEN REMOVED SUCCESSFULLY!\n');
}

clearAllData();
