import express from 'express';
import db from '../db.js';
import { authenticate, requireTeacherOrAdmin, requireAdmin, hashPassword } from '../auth.js';
import { calculateOverallBand } from '../scoring.js';
import crypto from 'crypto';

const router = express.Router();

// Middleware: all admin routes require teacher or admin access
router.use(authenticate, requireTeacherOrAdmin);

// =====================================
// 1. ADMIN DASHBOARD STATS
// =====================================
router.get('/dashboard-stats', (req, res) => {
  try {
    const totalStudents = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'student'`).get().count;
    const activeStudents = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'student' AND status = 'active'`).get().count;
    const totalTests = db.prepare(`SELECT COUNT(*) as count FROM tests`).get().count;
    const totalAttempts = db.prepare(`SELECT COUNT(*) as count FROM attempts WHERE status = 'completed'`).get().count;

    const testsToday = db.prepare(`
      SELECT COUNT(*) as count FROM attempts
      WHERE status = 'completed' AND DATE(created_at) = DATE('now')
    `).get().count;

    const pendingWriting = db.prepare(`
      SELECT COUNT(*) as count FROM attempts
      WHERE status = 'completed' AND evaluation_status = 'pending_evaluation' AND writing_band IS NOT NULL
    `).get().count;

    const pendingSpeaking = db.prepare(`
      SELECT COUNT(*) as count FROM attempts
      WHERE status = 'completed' AND evaluation_status = 'pending_evaluation' AND speaking_band IS NOT NULL
    `).get().count;

    const scoresRow = db.prepare(`
      SELECT AVG(overall_band) as avg_band, MAX(overall_band) as max_band
      FROM attempts
      WHERE status = 'completed' AND overall_band > 0
    `).get();

    // Band distribution
    const bandDistribution = db.prepare(`
      SELECT CAST(ROUND(overall_band) AS INTEGER) as band_group, COUNT(*) as count
      FROM attempts
      WHERE status = 'completed' AND overall_band > 0
      GROUP BY band_group
      ORDER BY band_group ASC
    `).all();

    // Recent attempts table
    const recentAttempts = db.prepare(`
      SELECT a.id, a.test_id, t.title as test_title, t.test_type, u.full_name as student_name,
             u.email as student_email, a.overall_band, a.listening_band, a.reading_band,
             a.writing_band, a.speaking_band, a.evaluation_status, a.created_at
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 8
    `).all();

    res.json({
      totalStudents,
      activeStudents,
      totalTests,
      totalAttempts,
      testsToday,
      averageBand: scoresRow.avg_band ? Math.round(scoresRow.avg_band * 10) / 10 : 6.5,
      highestBand: scoresRow.max_band || 8.5,
      pendingWriting,
      pendingSpeaking,
      bandDistribution,
      recentAttempts
    });
  } catch (err) {
    console.error('Error fetching admin dashboard stats:', err);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard stats.' });
  }
});

// =====================================
// 2. TEST MANAGEMENT
// =====================================
router.get('/tests', (req, res) => {
  try {
    const tests = db.prepare(`
      SELECT t.*,
             (SELECT COUNT(*) FROM test_sections s WHERE s.test_id = t.id) as actual_sections_count,
             (SELECT COUNT(*) FROM attempts a WHERE a.test_id = t.id AND a.status = 'completed') as completed_attempts
      FROM tests t
      ORDER BY t.created_at DESC
    `).all();

    res.json({ tests });
  } catch (err) {
    console.error('Error listing tests in admin:', err);
    res.status(500).json({ error: 'Failed to load tests.' });
  }
});

router.post('/tests', requireAdmin, (req, res) => {
  try {
    const { title, testType, category, difficulty, durationMinutes, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Test title is required.' });
    }

    const testId = 'test_' + crypto.randomBytes(6).toString('hex');

    db.prepare(`
      INSERT INTO tests (id, title, test_type, category, difficulty, duration_minutes, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      testId,
      title.trim(),
      testType || 'academic',
      category || 'full',
      difficulty || 'standard',
      parseInt(durationMinutes, 10) || 165,
      status || 'published',
      description || ''
    );

    // Automatically initialize standard sections if full test
    if (category === 'full') {
      db.prepare(`
        INSERT INTO test_sections (id, test_id, section_type, title, instructions, order_index, duration_minutes, total_questions)
        VALUES
          (?, ?, 'listening', 'Listening Test', 'Answer all 40 questions in 4 parts.', 1, 30, 40),
          (?, ?, 'reading', 'Reading Test', 'Answer all 40 questions across 3 passages.', 2, 60, 40),
          (?, ?, 'writing', 'Writing Test', 'Complete Task 1 and Task 2.', 3, 60, 2),
          (?, ?, 'speaking', 'Speaking Test', 'Complete Part 1, Part 2, and Part 3.', 4, 15, 3)
      `).run(
        'sec_' + crypto.randomBytes(4).toString('hex'), testId,
        'sec_' + crypto.randomBytes(4).toString('hex'), testId,
        'sec_' + crypto.randomBytes(4).toString('hex'), testId,
        'sec_' + crypto.randomBytes(4).toString('hex'), testId
      );
    } else {
      // Single skill section
      const dur = category === 'listening' ? 30 : (category === 'reading' || category === 'writing' ? 60 : 15);
      const qCount = category === 'writing' ? 2 : (category === 'speaking' ? 3 : 40);
      db.prepare(`
        INSERT INTO test_sections (id, test_id, section_type, title, instructions, order_index, duration_minutes, total_questions)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        'sec_' + crypto.randomBytes(4).toString('hex'),
        testId,
        category,
        `${category.toUpperCase()} Practice Test`,
        `Complete all items in this section.`,
        dur,
        qCount
      );
    }

    res.status(201).json({ message: 'Test created successfully', testId });
  } catch (err) {
    console.error('Error creating test:', err);
    res.status(500).json({ error: 'Failed to create test.' });
  }
});

router.put('/tests/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { title, testType, category, difficulty, durationMinutes, description, status } = req.body;

    db.prepare(`
      UPDATE tests
      SET title = COALESCE(?, title),
          test_type = COALESCE(?, test_type),
          category = COALESCE(?, category),
          difficulty = COALESCE(?, difficulty),
          duration_minutes = COALESCE(?, duration_minutes),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title ? title.trim() : null,
      testType || null,
      category || null,
      difficulty || null,
      durationMinutes ? parseInt(durationMinutes, 10) : null,
      description !== undefined ? description : null,
      status || null,
      id
    );

    res.json({ message: 'Test updated successfully.' });
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(500).json({ error: 'Failed to update test.' });
  }
});

router.delete('/tests/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM tests WHERE id = ?').run(id);
    res.json({ message: 'Test deleted successfully.' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ error: 'Failed to delete test.' });
  }
});

// =====================================
// 3. QUESTION & PASSAGE BUILDER
// =====================================
router.get('/tests/:testId/sections', (req, res) => {
  try {
    const { testId } = req.params;
    const sections = db.prepare(`
      SELECT * FROM test_sections WHERE test_id = ? ORDER BY order_index ASC
    `).all(testId);

    const fullSections = sections.map(s => {
      const passages = db.prepare('SELECT * FROM passages WHERE section_id = ? ORDER BY order_index ASC').all(s.id);
      const audioFiles = db.prepare('SELECT * FROM audio_files WHERE section_id = ? ORDER BY part_number ASC').all(s.id);
      const questions = db.prepare('SELECT * FROM questions WHERE section_id = ? ORDER BY question_number ASC').all(s.id);
      const writingTasks = db.prepare('SELECT * FROM writing_tasks WHERE section_id = ? ORDER BY task_number ASC').all(s.id);
      const speakingTasks = db.prepare('SELECT * FROM speaking_tasks WHERE section_id = ? ORDER BY part_number ASC').all(s.id);

      return {
        ...s,
        passages,
        audioFiles,
        questions,
        writingTasks,
        speakingTasks
      };
    });

    res.json({ sections: fullSections });
  } catch (err) {
    console.error('Error getting test sections:', err);
    res.status(500).json({ error: 'Failed to load test sections.' });
  }
});

// Create/Update Question
router.post('/questions', requireAdmin, (req, res) => {
  try {
    const {
      id, sectionId, passageId, audioId, partNumber, questionNumber,
      questionType, prompt, instructions, options, correctAnswers,
      explanation, marks, difficulty
    } = req.body;

    if (!sectionId || !prompt || !correctAnswers) {
      return res.status(400).json({ error: 'Section ID, prompt, and correct answers are required.' });
    }

    const qId = id || ('q_' + crypto.randomBytes(6).toString('hex'));
    const optionsJson = options ? JSON.stringify(options) : null;
    const correctJson = Array.isArray(correctAnswers) ? JSON.stringify(correctAnswers) : JSON.stringify([correctAnswers]);

    if (id) {
      // Update
      db.prepare(`
        UPDATE questions
        SET passage_id = ?, audio_id = ?, part_number = ?, question_number = ?,
            question_type = ?, prompt = ?, instructions = ?, options_json = ?,
            correct_answer_json = ?, explanation = ?, marks = ?, difficulty = ?
        WHERE id = ?
      `).run(
        passageId || null, audioId || null, parseInt(partNumber, 10) || 1, parseInt(questionNumber, 10) || 1,
        questionType || 'multiple_choice', prompt, instructions || null, optionsJson,
        correctJson, explanation || null, parseInt(marks, 10) || 1, difficulty || 'medium',
        qId
      );
    } else {
      // Insert
      db.prepare(`
        INSERT INTO questions (
          id, section_id, passage_id, audio_id, part_number, question_number,
          question_type, prompt, instructions, options_json, correct_answer_json,
          explanation, marks, difficulty, order_index
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        qId, sectionId, passageId || null, audioId || null, parseInt(partNumber, 10) || 1, parseInt(questionNumber, 10) || 1,
        questionType || 'multiple_choice', prompt, instructions || null, optionsJson,
        correctJson, explanation || null, parseInt(marks, 10) || 1, difficulty || 'medium', parseInt(questionNumber, 10) || 1
      );
    }

    res.json({ message: 'Question saved successfully.', questionId: qId });
  } catch (err) {
    console.error('Error saving question:', err);
    res.status(500).json({ error: 'Failed to save question.' });
  }
});

// Delete Question
router.delete('/questions/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question.' });
  }
});

// Save Passage
router.post('/passages', requireAdmin, (req, res) => {
  try {
    const { id, sectionId, title, subtitle, contentHtml, passageNumber } = req.body;
    const pId = id || ('pas_' + crypto.randomBytes(6).toString('hex'));

    if (id) {
      db.prepare(`
        UPDATE passages
        SET title = ?, subtitle = ?, content_html = ?, passage_number = ?
        WHERE id = ?
      `).run(title, subtitle || null, contentHtml, parseInt(passageNumber, 10) || 1, pId);
    } else {
      db.prepare(`
        INSERT INTO passages (id, section_id, title, subtitle, content_html, passage_number, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(pId, sectionId, title, subtitle || null, contentHtml, parseInt(passageNumber, 10) || 1, parseInt(passageNumber, 10) || 1);
    }

    res.json({ message: 'Passage saved successfully.', passageId: pId });
  } catch (err) {
    console.error('Error saving passage:', err);
    res.status(500).json({ error: 'Failed to save passage.' });
  }
});

// =====================================
// 4. STUDENT MANAGEMENT
// =====================================
router.get('/students', (req, res) => {
  try {
    const { search, status } = req.query;

    let sql = `
      SELECT u.id, u.email, u.full_name, u.phone, u.role, u.target_band,
             u.test_type, u.current_level, u.target_test_date, u.status, u.created_at,
             (SELECT COUNT(*) FROM attempts a WHERE a.student_id = u.id AND a.status = 'completed') as tests_completed,
             (SELECT AVG(a.overall_band) FROM attempts a WHERE a.student_id = u.id AND a.status = 'completed') as avg_band
      FROM users u
      WHERE u.role = 'student'
    `;
    const params = [];

    if (search && search.trim()) {
      sql += ' AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (status && status !== 'all') {
      sql += ' AND u.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY u.created_at DESC';

    const students = db.prepare(sql).all(...params).map(s => ({
      ...s,
      avg_band: s.avg_band ? Math.round(s.avg_band * 10) / 10 : null
    }));

    res.json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to retrieve students list.' });
  }
});

router.put('/students/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'suspended'

    db.prepare('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    res.json({ message: `Student account status updated to ${status}.` });
  } catch (err) {
    console.error('Error updating student status:', err);
    res.status(500).json({ error: 'Failed to update student status.' });
  }
});

router.post('/students/:id/reset-password', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const pass = newPassword || 'Student@2026';

    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashPassword(pass), id);

    res.json({ message: `Password reset successfully to: ${pass}` });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// =====================================
// 5. EVALUATION CENTER (Writing & Speaking)
// =====================================
router.get('/evaluations/pending', (req, res) => {
  try {
    const pendingList = db.prepare(`
      SELECT a.id as attempt_id, a.student_id, a.test_id, t.title as test_title,
             u.full_name as student_name, u.email as student_email,
             a.writing_task1_text, a.writing_task2_text,
             a.speaking_part1_audio, a.speaking_part2_audio, a.speaking_part3_audio,
             a.listening_band, a.reading_band, a.writing_band, a.speaking_band,
             a.overall_band, a.evaluation_status, a.created_at
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      WHERE a.status = 'completed' AND a.evaluation_status = 'pending_evaluation'
      ORDER BY a.created_at ASC
    `).all();

    res.json({ pendingList });
  } catch (err) {
    console.error('Error fetching pending evaluations:', err);
    res.status(500).json({ error: 'Failed to retrieve pending submissions.' });
  }
});

router.post('/evaluations/submit', (req, res) => {
  try {
    const {
      attemptId,
      writingEvaluation, // { c1, c2, c3, c4, band, feedback }
      speakingEvaluation // { c1, c2, c3, c4, band, feedback }
    } = req.body;

    const attempt = db.prepare('SELECT * FROM attempts WHERE id = ?').get(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    const evaluatorId = req.user.id;

    const updateTx = db.transaction(() => {
      let finalWritingBand = attempt.writing_band;
      let finalSpeakingBand = attempt.speaking_band;

      if (writingEvaluation) {
        finalWritingBand = parseFloat(writingEvaluation.band);
        const evalId = 'eval_' + crypto.randomBytes(5).toString('hex');
        db.prepare(`
          INSERT INTO evaluations (id, attempt_id, section_type, evaluator_id, criterion_1_score, criterion_2_score, criterion_3_score, criterion_4_score, final_band, feedback)
          VALUES (?, ?, 'writing', ?, ?, ?, ?, ?, ?, ?)
        `).run(
          evalId, attemptId, evaluatorId,
          parseFloat(writingEvaluation.c1) || finalWritingBand,
          parseFloat(writingEvaluation.c2) || finalWritingBand,
          parseFloat(writingEvaluation.c3) || finalWritingBand,
          parseFloat(writingEvaluation.c4) || finalWritingBand,
          finalWritingBand,
          writingEvaluation.feedback || ''
        );
      }

      if (speakingEvaluation) {
        finalSpeakingBand = parseFloat(speakingEvaluation.band);
        const evalId = 'eval_' + crypto.randomBytes(5).toString('hex');
        db.prepare(`
          INSERT INTO evaluations (id, attempt_id, section_type, evaluator_id, criterion_1_score, criterion_2_score, criterion_3_score, criterion_4_score, final_band, feedback)
          VALUES (?, ?, 'speaking', ?, ?, ?, ?, ?, ?, ?)
        `).run(
          evalId, attemptId, evaluatorId,
          parseFloat(speakingEvaluation.c1) || finalSpeakingBand,
          parseFloat(speakingEvaluation.c2) || finalSpeakingBand,
          parseFloat(speakingEvaluation.c3) || finalSpeakingBand,
          parseFloat(speakingEvaluation.c4) || finalSpeakingBand,
          finalSpeakingBand,
          speakingEvaluation.feedback || ''
        );
      }

      // Recompute overall band
      const scores = [attempt.listening_band, attempt.reading_band, finalWritingBand, finalSpeakingBand].filter(s => s !== null && s > 0);
      const newOverall = calculateOverallBand(scores);

      db.prepare(`
        UPDATE attempts
        SET writing_band = ?,
            speaking_band = ?,
            overall_band = ?,
            evaluation_status = 'evaluated',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(finalWritingBand, finalSpeakingBand, newOverall, attemptId);

      // Notify student
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, 'Evaluator Feedback Published', ?, 'result', ?)
      `).run(
        'notif_' + crypto.randomBytes(5).toString('hex'),
        attempt.student_id,
        `Your Writing and Speaking evaluations have been published! Final Overall Score: Band ${newOverall}.`,
        `/results/${attemptId}`
      );
    });

    updateTx();

    res.json({ message: 'Evaluations saved and overall band updated successfully.' });
  } catch (err) {
    console.error('Error submitting evaluation:', err);
    res.status(500).json({ error: 'Failed to record evaluation scores.' });
  }
});

// =====================================
// 6. RESULT MANAGEMENT
// =====================================
router.get('/attempts', (req, res) => {
  try {
    const { testId, studentId, minBand, status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let sql = `
      SELECT a.id, a.test_id, t.title as test_title, t.test_type,
             a.student_id, u.full_name as student_name, u.email as student_email,
             a.overall_band, a.listening_band, a.reading_band, a.writing_band, a.speaking_band,
             a.evaluation_status, a.status, a.created_at
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (testId && testId !== 'all') {
      sql += ' AND a.test_id = ?';
      params.push(testId);
    }
    if (studentId) {
      sql += ' AND a.student_id = ?';
      params.push(studentId);
    }
    if (minBand) {
      sql += ' AND a.overall_band >= ?';
      params.push(parseFloat(minBand));
    }
    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const attempts = db.prepare(sql).all(...params);

    res.json({ attempts });
  } catch (err) {
    console.error('Error fetching admin results:', err);
    res.status(500).json({ error: 'Failed to load test attempts.' });
  }
});

// Override attempt band scores
router.put('/attempts/:id/override-scores', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { listeningBand, readingBand, writingBand, speakingBand, overallBand } = req.body;

    db.prepare(`
      UPDATE attempts
      SET listening_band = COALESCE(?, listening_band),
          reading_band = COALESCE(?, reading_band),
          writing_band = COALESCE(?, writing_band),
          speaking_band = COALESCE(?, speaking_band),
          overall_band = COALESCE(?, overall_band),
          evaluation_status = 'evaluated',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      listeningBand ? parseFloat(listeningBand) : null,
      readingBand ? parseFloat(readingBand) : null,
      writingBand ? parseFloat(writingBand) : null,
      speakingBand ? parseFloat(speakingBand) : null,
      overallBand ? parseFloat(overallBand) : null,
      id
    );

    res.json({ message: 'Scores updated successfully.' });
  } catch (err) {
    console.error('Error overriding scores:', err);
    res.status(500).json({ error: 'Failed to update scores.' });
  }
});

// =====================================
// 7. SYSTEM SETTINGS & SCORING RULES
// =====================================
router.get('/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings').all();
  const settingsObj = {};
  settings.forEach(s => {
    settingsObj[s.key] = s.value;
  });
  res.json({ settings: settingsObj });
});

router.put('/settings', requireAdmin, (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Invalid settings payload.' });
    }

    const updateSetting = db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    Object.entries(settings).forEach(([k, v]) => {
      updateSetting.run(k, String(v));
    });

    res.json({ message: 'Settings saved successfully.' });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Failed to save settings.' });
  }
});

export default router;
