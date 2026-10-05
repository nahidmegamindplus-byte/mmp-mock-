-- ============================================================================
-- MEGAMIND PLUS IELTS CBT PLATFORM - SUPABASE POSTGRESQL SCHEMA & INITIAL DATA
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- 'student', 'teacher', 'admin'
  target_band NUMERIC DEFAULT 7.5,
  test_type TEXT DEFAULT 'academic', -- 'academic', 'general'
  current_level TEXT DEFAULT 'intermediate',
  target_test_date TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'suspended'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TESTS TABLE
CREATE TABLE IF NOT EXISTS tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  test_type TEXT NOT NULL DEFAULT 'academic', -- 'academic', 'general'
  category TEXT NOT NULL DEFAULT 'full', -- 'full', 'listening', 'reading', 'writing', 'speaking'
  difficulty TEXT DEFAULT 'standard', -- 'standard', 'moderate', 'hard'
  duration_minutes INTEGER DEFAULT 165,
  status TEXT DEFAULT 'published', -- 'published', 'draft'
  description TEXT,
  sections_count INTEGER DEFAULT 4,
  total_questions INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEST SECTIONS TABLE
CREATE TABLE IF NOT EXISTS test_sections (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'listening', 'reading', 'writing', 'speaking'
  title TEXT NOT NULL,
  instructions TEXT,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 30,
  total_questions INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PASSAGES TABLE (Reading Section)
CREATE TABLE IF NOT EXISTS passages (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content_html TEXT NOT NULL,
  passage_number INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AUDIO FILES TABLE (Listening Section & Speaking Prompts)
CREATE TABLE IF NOT EXISTS audio_files (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  audio_data TEXT,
  duration_seconds INTEGER DEFAULT 360,
  part_number INTEGER DEFAULT 1,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUESTIONS TABLE (Listening & Reading)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
  passage_id TEXT REFERENCES passages(id) ON DELETE SET NULL,
  audio_id TEXT REFERENCES audio_files(id) ON DELETE SET NULL,
  part_number INTEGER DEFAULT 1,
  question_number INTEGER NOT NULL,
  question_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  instructions TEXT,
  options_json JSONB,
  correct_answer_json JSONB NOT NULL,
  explanation TEXT,
  marks INTEGER DEFAULT 1,
  difficulty TEXT DEFAULT 'medium',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WRITING TASKS TABLE
CREATE TABLE IF NOT EXISTS writing_tasks (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  instructions TEXT,
  min_words INTEGER DEFAULT 150,
  suggested_time_minutes INTEGER DEFAULT 20,
  chart_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SPEAKING TASKS TABLE
CREATE TABLE IF NOT EXISTS speaking_tasks (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES test_sections(id) ON DELETE CASCADE,
  part_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  instructions TEXT,
  prep_time_seconds INTEGER DEFAULT 60,
  speak_time_seconds INTEGER DEFAULT 120,
  cue_card_points_json JSONB,
  audio_prompt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SCORING RULES TABLE
CREATE TABLE IF NOT EXISTS scoring_rules (
  id TEXT PRIMARY KEY,
  test_id TEXT,
  section_type TEXT NOT NULL,
  test_type TEXT NOT NULL DEFAULT 'academic',
  min_raw_score INTEGER NOT NULL,
  max_raw_score INTEGER NOT NULL,
  band_score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ATTEMPTS TABLE (Mock Test Submissions & States)
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  current_section TEXT DEFAULT 'listening',
  current_question INTEGER DEFAULT 1,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  remaining_seconds INTEGER DEFAULT 1800,
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'evaluating', 'completed', 'expired'
  listening_raw INTEGER DEFAULT 0,
  listening_band NUMERIC DEFAULT 0,
  reading_raw INTEGER DEFAULT 0,
  reading_band NUMERIC DEFAULT 0,
  writing_band NUMERIC,
  speaking_band NUMERIC,
  overall_band NUMERIC DEFAULT 0,
  evaluation_status TEXT DEFAULT 'auto_graded', -- 'auto_graded', 'pending_evaluation', 'evaluated'
  answers_json JSONB DEFAULT '{}'::jsonb,
  flags_json JSONB DEFAULT '[]'::jsonb,
  writing_task1_text TEXT,
  writing_task2_text TEXT,
  speaking_part1_audio TEXT,
  speaking_part2_audio TEXT,
  speaking_part3_audio TEXT,
  tab_switches_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EVALUATIONS TABLE (Writing & Speaking Grading)
CREATE TABLE IF NOT EXISTS evaluations (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  evaluator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  criterion_1_score NUMERIC DEFAULT 0,
  criterion_2_score NUMERIC DEFAULT 0,
  criterion_3_score NUMERIC DEFAULT 0,
  criterion_4_score NUMERIC DEFAULT 0,
  final_band NUMERIC NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INDEXES FOR HIGH QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tests_type ON tests(test_type, category, status);
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section_id, question_number);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON attempts(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_attempt ON evaluations(attempt_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to test catalog, sections, questions & rules
CREATE POLICY "Public read tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Public read test_sections" ON test_sections FOR SELECT USING (true);
CREATE POLICY "Public read passages" ON passages FOR SELECT USING (true);
CREATE POLICY "Public read audio_files" ON audio_files FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read writing_tasks" ON writing_tasks FOR SELECT USING (true);
CREATE POLICY "Public read speaking_tasks" ON speaking_tasks FOR SELECT USING (true);
CREATE POLICY "Public read scoring_rules" ON scoring_rules FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Allow all operations with Service Role / Anon for platform operations
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access to attempts" ON attempts FOR ALL USING (true);
CREATE POLICY "Allow all access to evaluations" ON evaluations FOR ALL USING (true);
CREATE POLICY "Allow all access to notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow admin manage tests" ON tests FOR ALL USING (true);
CREATE POLICY "Allow admin manage test_sections" ON test_sections FOR ALL USING (true);
CREATE POLICY "Allow admin manage passages" ON passages FOR ALL USING (true);
CREATE POLICY "Allow admin manage audio_files" ON audio_files FOR ALL USING (true);
CREATE POLICY "Allow admin manage questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow admin manage writing_tasks" ON writing_tasks FOR ALL USING (true);
CREATE POLICY "Allow admin manage speaking_tasks" ON speaking_tasks FOR ALL USING (true);
CREATE POLICY "Allow admin manage scoring_rules" ON scoring_rules FOR ALL USING (true);
CREATE POLICY "Allow admin manage settings" ON settings FOR ALL USING (true);

-- 17. INITIAL DEFAULT SYSTEM SETTINGS
INSERT INTO settings (key, value, description)
VALUES 
  ('brand_name', 'MEGAMIND PLUS', 'Main Brand Name'),
  ('sub_brand', 'IELTS MOCK TEST', 'Sub-brand for IELTS testing portal'),
  ('tagline', 'Practice Like the Real Test. Perform With Confidence.', 'Platform Tagline'),
  ('primary_color', '#C7202D', 'Megamind Primary Brand Red'),
  ('rounding_mode', 'standard', 'IELTS rounding mode: standard (0.25/0.75 rule) or exact'),
  ('registration_enabled', 'true', 'Allow public student registrations'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('contact_email', 'support@megamindplus.com', 'Support contact email'),
  ('contact_phone', '+880 1700-000000', 'Contact Phone number')
ON CONFLICT (key) DO NOTHING;

