import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mmp_ielts.db');
const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'student', -- student, teacher, admin
      target_band REAL DEFAULT 7.5,
      test_type TEXT DEFAULT 'academic', -- academic, general
      current_level TEXT DEFAULT 'intermediate',
      target_test_date TEXT,
      avatar_url TEXT,
      status TEXT DEFAULT 'active', -- active, suspended
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tests Table
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      test_type TEXT NOT NULL DEFAULT 'academic', -- academic, general
      category TEXT NOT NULL DEFAULT 'full', -- full, listening, reading, writing, speaking
      difficulty TEXT DEFAULT 'standard', -- standard, moderate, hard
      duration_minutes INTEGER DEFAULT 165,
      status TEXT DEFAULT 'published', -- published, draft
      description TEXT,
      sections_count INTEGER DEFAULT 4,
      total_questions INTEGER DEFAULT 40,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Test Sections Table
    CREATE TABLE IF NOT EXISTS test_sections (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      section_type TEXT NOT NULL, -- listening, reading, writing, speaking
      title TEXT NOT NULL,
      instructions TEXT,
      order_index INTEGER DEFAULT 0,
      duration_minutes INTEGER DEFAULT 30,
      total_questions INTEGER DEFAULT 40,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    -- Passages Table (for Reading & Comprehension)
    CREATE TABLE IF NOT EXISTS passages (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      content_html TEXT NOT NULL,
      passage_number INTEGER DEFAULT 1,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES test_sections(id) ON DELETE CASCADE
    );

    -- Audio Files Table (for Listening & Speaking Prompts)
    CREATE TABLE IF NOT EXISTS audio_files (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      title TEXT NOT NULL,
      file_url TEXT,
      audio_data TEXT, -- Base64/Data URI or static path
      duration_seconds INTEGER DEFAULT 360,
      part_number INTEGER DEFAULT 1,
      transcript TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES test_sections(id) ON DELETE CASCADE
    );

    -- Questions Table
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      passage_id TEXT,
      audio_id TEXT,
      part_number INTEGER DEFAULT 1,
      question_number INTEGER NOT NULL,
      question_type TEXT NOT NULL, -- multiple_choice, multiple_select, true_false_not_given, yes_no_not_given, matching, matching_headings, sentence_completion, summary_completion, table_completion, form_completion, note_completion, short_answer, diagram_label, map_label
      prompt TEXT NOT NULL,
      instructions TEXT,
      options_json TEXT, -- JSON array of options or items
      correct_answer_json TEXT NOT NULL, -- JSON array of acceptable answers
      explanation TEXT,
      marks INTEGER DEFAULT 1,
      difficulty TEXT DEFAULT 'medium',
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES test_sections(id) ON DELETE CASCADE,
      FOREIGN KEY (passage_id) REFERENCES passages(id) ON DELETE SET NULL,
      FOREIGN KEY (audio_id) REFERENCES audio_files(id) ON DELETE SET NULL
    );

    -- Writing Tasks Table
    CREATE TABLE IF NOT EXISTS writing_tasks (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      task_number INTEGER NOT NULL DEFAULT 1, -- 1 or 2
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      instructions TEXT,
      min_words INTEGER DEFAULT 150,
      suggested_time_minutes INTEGER DEFAULT 20,
      chart_image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES test_sections(id) ON DELETE CASCADE
    );

    -- Speaking Tasks Table
    CREATE TABLE IF NOT EXISTS speaking_tasks (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      part_number INTEGER NOT NULL DEFAULT 1, -- 1, 2, or 3
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      instructions TEXT,
      prep_time_seconds INTEGER DEFAULT 60,
      speak_time_seconds INTEGER DEFAULT 120,
      cue_card_points_json TEXT, -- array of points to cover for Part 2
      audio_prompt_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES test_sections(id) ON DELETE CASCADE
    );

    -- Band Conversion Scoring Rules Table
    CREATE TABLE IF NOT EXISTS scoring_rules (
      id TEXT PRIMARY KEY,
      test_id TEXT, -- NULL means default global table
      section_type TEXT NOT NULL, -- listening, reading
      test_type TEXT NOT NULL DEFAULT 'academic', -- academic, general
      min_raw_score INTEGER NOT NULL,
      max_raw_score INTEGER NOT NULL,
      band_score REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Attempts Table (Test Attempt Engine)
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      current_section TEXT DEFAULT 'listening', -- listening, reading, writing, speaking
      current_question INTEGER DEFAULT 1,
      start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      end_time DATETIME,
      remaining_seconds INTEGER DEFAULT 1800,
      status TEXT DEFAULT 'in_progress', -- in_progress, submitted, evaluating, completed, expired
      listening_raw INTEGER DEFAULT 0,
      listening_band REAL DEFAULT 0,
      reading_raw INTEGER DEFAULT 0,
      reading_band REAL DEFAULT 0,
      writing_band REAL DEFAULT NULL,
      speaking_band REAL DEFAULT NULL,
      overall_band REAL DEFAULT 0,
      evaluation_status TEXT DEFAULT 'auto_graded', -- auto_graded, pending_evaluation, evaluated
      answers_json TEXT DEFAULT '{}',
      flags_json TEXT DEFAULT '[]',
      writing_task1_text TEXT,
      writing_task2_text TEXT,
      speaking_part1_audio TEXT,
      speaking_part2_audio TEXT,
      speaking_part3_audio TEXT,
      tab_switches_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    -- Evaluations Table (Teacher/Admin Writing & Speaking Grading)
    CREATE TABLE IF NOT EXISTS evaluations (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL,
      section_type TEXT NOT NULL, -- writing, speaking
      evaluator_id TEXT NOT NULL,
      criterion_1_score REAL DEFAULT 0, -- Writing: Task Achievement / Speaking: Fluency & Coherence
      criterion_2_score REAL DEFAULT 0, -- Writing: Coherence & Cohesion / Speaking: Lexical Resource
      criterion_3_score REAL DEFAULT 0, -- Writing: Lexical Resource / Speaking: Grammatical Range
      criterion_4_score REAL DEFAULT 0, -- Writing: Grammatical Range / Speaking: Pronunciation
      final_band REAL NOT NULL,
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Notifications Table
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info', -- info, success, warning, result
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- System Settings Table
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for high performance
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_tests_type ON tests(test_type, category, status);
    CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section_id, question_number);
    CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
    CREATE INDEX IF NOT EXISTS idx_evaluations_attempt ON evaluations(attempt_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
  `);

  console.log('[Database] SQLite schema initialized with foreign keys & indexes successfully.');
}

export default db;
