import express from 'express';
import db from '../db.js';
import { authenticate } from '../auth.js';

const router = express.Router();

// GET /api/tests - List published tests with search and filters
router.get('/', (req, res) => {
  try {
    const { testType, category, difficulty, search } = req.query;

    let sql = `
      SELECT t.id, t.title, t.test_type, t.category, t.difficulty, t.duration_minutes,
             t.description, t.sections_count, t.total_questions, t.status, t.created_at,
             (SELECT COUNT(*) FROM attempts a WHERE a.test_id = t.id AND a.status = 'completed') as attempts_count
      FROM tests t
      WHERE t.status = 'published'
    `;
    const params = [];

    if (testType && testType !== 'all') {
      sql += ' AND t.test_type = ?';
      params.push(testType.toLowerCase());
    }

    if (category && category !== 'all') {
      sql += ' AND t.category = ?';
      params.push(category.toLowerCase());
    }

    if (difficulty && difficulty !== 'all') {
      sql += ' AND t.difficulty = ?';
      params.push(difficulty.toLowerCase());
    }

    if (search && search.trim()) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    sql += ' ORDER BY t.created_at DESC';

    const tests = db.prepare(sql).all(...params);
    res.json({ tests });
  } catch (err) {
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Failed to retrieve test library.' });
  }
});

// GET /api/tests/:id - Test metadata & instructions
router.get('/:id', (req, res) => {
  try {
    const test = db.prepare(`
      SELECT id, title, test_type, category, difficulty, duration_minutes,
             description, sections_count, total_questions, status
      FROM tests
      WHERE id = ?
    `).get(req.params.id);

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const sections = db.prepare(`
      SELECT id, section_type, title, instructions, order_index, duration_minutes, total_questions
      FROM test_sections
      WHERE test_id = ?
      ORDER BY order_index ASC
    `).all(test.id);

    res.json({ test, sections });
  } catch (err) {
    console.error('Error fetching test detail:', err);
    res.status(500).json({ error: 'Failed to load test details.' });
  }
});

// GET /api/tests/:id/exam-payload - Full test content for examination (CLEANED: answers stripped for integrity)
router.get('/:id/exam-payload', authenticate, (req, res) => {
  try {
    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const sections = db.prepare(`
      SELECT id, section_type, title, instructions, order_index, duration_minutes, total_questions
      FROM test_sections
      WHERE test_id = ?
      ORDER BY order_index ASC
    `).all(test.id);

    const fullSections = sections.map(sec => {
      // Passages
      const passages = db.prepare(`
        SELECT id, title, subtitle, content_html, passage_number, order_index
        FROM passages
        WHERE section_id = ?
        ORDER BY passage_number ASC
      `).all(sec.id);

      // Audio files
      const audioFiles = db.prepare(`
        SELECT id, title, file_url, audio_data, duration_seconds, part_number, transcript
        FROM audio_files
        WHERE section_id = ?
        ORDER BY part_number ASC
      `).all(sec.id);

      // Questions - IMPORTANT: Omit correct_answer_json and explanation for test integrity!
      const questions = db.prepare(`
        SELECT id, section_id, passage_id, audio_id, part_number, question_number,
               question_type, prompt, instructions, options_json, marks, difficulty, order_index
        FROM questions
        WHERE section_id = ?
        ORDER BY question_number ASC
      `).all(sec.id).map(q => ({
        ...q,
        options: q.options_json ? JSON.parse(q.options_json) : null,
        options_json: undefined
      }));

      // Writing tasks
      const writingTasks = db.prepare(`
        SELECT id, task_number, title, prompt, instructions, min_words, suggested_time_minutes, chart_image_url
        FROM writing_tasks
        WHERE section_id = ?
        ORDER BY task_number ASC
      `).all(sec.id);

      // Speaking tasks
      const speakingTasks = db.prepare(`
        SELECT id, part_number, title, prompt, instructions, prep_time_seconds, speak_time_seconds, cue_card_points_json, audio_prompt_url
        FROM speaking_tasks
        WHERE section_id = ?
        ORDER BY part_number ASC
      `).all(sec.id).map(spk => ({
        ...spk,
        cue_card_points: spk.cue_card_points_json ? JSON.parse(spk.cue_card_points_json) : []
      }));

      return {
        ...sec,
        passages,
        audioFiles,
        questions,
        writingTasks,
        speakingTasks
      };
    });

    res.json({
      test: {
        id: test.id,
        title: test.title,
        testType: test.test_type,
        category: test.category,
        difficulty: test.difficulty,
        durationMinutes: test.duration_minutes
      },
      sections: fullSections
    });
  } catch (err) {
    console.error('Error fetching exam payload:', err);
    res.status(500).json({ error: 'Failed to prepare examination package.' });
  }
});

export default router;
