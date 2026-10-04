import express from 'express';
import db from '../db.js';
import { authenticate } from '../auth.js';
import { calculateBand, calculateOverallBand, isAnswerCorrect } from '../scoring.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/attempts/start - Start a new attempt or recover active attempt
router.post('/start', authenticate, (req, res) => {
  try {
    const { testId } = req.body;
    const studentId = req.user.id;

    if (!testId) {
      return res.status(400).json({ error: 'Test ID is required.' });
    }

    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    // Check for an existing in-progress attempt for this user & test
    const existingAttempt = db.prepare(`
      SELECT * FROM attempts
      WHERE student_id = ? AND test_id = ? AND status = 'in_progress'
      ORDER BY created_at DESC LIMIT 1
    `).get(studentId, testId);

    if (existingAttempt) {
      return res.json({
        message: 'Active examination session restored.',
        attempt: {
          id: existingAttempt.id,
          testId: existingAttempt.test_id,
          currentSection: existingAttempt.current_section,
          currentQuestion: existingAttempt.current_question,
          remainingSeconds: existingAttempt.remaining_seconds,
          answers: JSON.parse(existingAttempt.answers_json || '{}'),
          flags: JSON.parse(existingAttempt.flags_json || '[]'),
          writingTask1Text: existingAttempt.writing_task1_text || '',
          writingTask2Text: existingAttempt.writing_task2_text || '',
          tabSwitchesCount: existingAttempt.tab_switches_count || 0,
          status: existingAttempt.status,
          isRestored: true
        }
      });
    }

    // Determine initial section based on test category
    let initialSection = 'listening';
    if (test.category === 'reading') initialSection = 'reading';
    if (test.category === 'writing') initialSection = 'writing';
    if (test.category === 'speaking') initialSection = 'speaking';

    const durationSeconds = (test.duration_minutes || 165) * 60;
    const attemptId = 'att_' + crypto.randomBytes(6).toString('hex');

    db.prepare(`
      INSERT INTO attempts (
        id, student_id, test_id, current_section, current_question,
        remaining_seconds, status, answers_json, flags_json, tab_switches_count
      )
      VALUES (?, ?, ?, ?, 1, ?, 'in_progress', '{}', '[]', 0)
    `).run(attemptId, studentId, testId, initialSection, durationSeconds);

    res.status(201).json({
      message: 'Examination attempt initialized.',
      attempt: {
        id: attemptId,
        testId,
        currentSection: initialSection,
        currentQuestion: 1,
        remainingSeconds: durationSeconds,
        answers: {},
        flags: [],
        writingTask1Text: '',
        writingTask2Text: '',
        tabSwitchesCount: 0,
        status: 'in_progress',
        isRestored: false
      }
    });
  } catch (err) {
    console.error('Error starting attempt:', err);
    res.status(500).json({ error: 'Failed to initiate examination session.' });
  }
});

// POST /api/attempts/:id/save-progress - Heartbeat Auto-Save
router.post('/:id/save-progress', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const {
      currentSection,
      currentQuestion,
      remainingSeconds,
      answers,
      flags,
      writingTask1Text,
      writingTask2Text,
      tabSwitchesCount
    } = req.body;

    const attempt = db.prepare('SELECT id, student_id, status FROM attempts WHERE id = ?').get(id);

    if (!attempt || attempt.student_id !== req.user.id) {
      return res.status(404).json({ error: 'Attempt session not found.' });
    }

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ error: 'Cannot save progress on a completed or submitted attempt.' });
    }

    db.prepare(`
      UPDATE attempts
      SET current_section = COALESCE(?, current_section),
          current_question = COALESCE(?, current_question),
          remaining_seconds = COALESCE(?, remaining_seconds),
          answers_json = COALESCE(?, answers_json),
          flags_json = COALESCE(?, flags_json),
          writing_task1_text = COALESCE(?, writing_task1_text),
          writing_task2_text = COALESCE(?, writing_task2_text),
          tab_switches_count = COALESCE(?, tab_switches_count),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      currentSection || null,
      currentQuestion || null,
      remainingSeconds !== undefined ? remainingSeconds : null,
      answers ? JSON.stringify(answers) : null,
      flags ? JSON.stringify(flags) : null,
      writingTask1Text !== undefined ? writingTask1Text : null,
      writingTask2Text !== undefined ? writingTask2Text : null,
      tabSwitchesCount !== undefined ? tabSwitchesCount : null,
      id
    );

    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Auto-save error:', err);
    res.status(500).json({ error: 'Auto-save failed.' });
  }
});

// POST /api/attempts/:id/upload-speaking - Save speaking audio recording
router.post('/:id/upload-speaking', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const { partNumber, audioBase64 } = req.body;

    const attempt = db.prepare('SELECT id, student_id FROM attempts WHERE id = ?').get(id);
    if (!attempt || attempt.student_id !== req.user.id) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    const col = partNumber === 2 ? 'speaking_part2_audio' : (partNumber === 3 ? 'speaking_part3_audio' : 'speaking_part1_audio');

    db.prepare(`UPDATE attempts SET ${col} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(audioBase64, id);

    res.json({ success: true, message: `Speaking Part ${partNumber} audio uploaded successfully.` });
  } catch (err) {
    console.error('Upload speaking audio error:', err);
    res.status(500).json({ error: 'Failed to upload audio recording.' });
  }
});

// POST /api/attempts/:id/submit - Final submission & Scoring Engine
router.post('/:id/submit', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const { answers, writingTask1Text, writingTask2Text } = req.body;

    const attempt = db.prepare(`
      SELECT a.*, t.test_type, t.category
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.id = ?
    `).get(id);

    if (!attempt || attempt.student_id !== req.user.id) {
      return res.status(404).json({ error: 'Attempt session not found.' });
    }

    const finalAnswers = answers || JSON.parse(attempt.answers_json || '{}');
    const finalW1 = writingTask1Text !== undefined ? writingTask1Text : (attempt.writing_task1_text || '');
    const finalW2 = writingTask2Text !== undefined ? writingTask2Text : (attempt.writing_task2_text || '');

    // Fetch all test questions with correct answer keys for scoring
    const questions = db.prepare(`
      SELECT q.id, q.section_id, q.question_number, q.question_type, q.correct_answer_json,
             s.section_type
      FROM questions q
      JOIN test_sections s ON q.section_id = s.id
      WHERE s.test_id = ?
    `).all(attempt.test_id);

    let listeningRaw = 0;
    let listeningTotal = 0;
    let readingRaw = 0;
    let readingTotal = 0;

    questions.forEach(q => {
      const studentAns = finalAnswers[q.id];
      const isCorrect = isAnswerCorrect(studentAns, q.correct_answer_json);

      if (q.section_type === 'listening') {
        listeningTotal++;
        if (isCorrect) listeningRaw++;
      } else if (q.section_type === 'reading') {
        readingTotal++;
        if (isCorrect) readingRaw++;
      }
    });

    // Band calculations
    const listeningBand = listeningTotal > 0 ? calculateBand(listeningRaw, 'listening', attempt.test_type, attempt.test_id) : null;
    const readingBand = readingTotal > 0 ? calculateBand(readingRaw, 'reading', attempt.test_type, attempt.test_id) : null;

    // Check if test has writing or speaking sections
    const hasWriting = db.prepare(`SELECT 1 FROM test_sections WHERE test_id = ? AND section_type = 'writing'`).get(attempt.test_id);
    const hasSpeaking = db.prepare(`SELECT 1 FROM test_sections WHERE test_id = ? AND section_type = 'speaking'`).get(attempt.test_id);

    let evaluationStatus = 'auto_graded';
    let writingBand = null;
    let speakingBand = null;

    if (hasWriting || hasSpeaking) {
      evaluationStatus = 'pending_evaluation';
      // Provisional/default automated preview band estimate based on objective accuracy for initial dashboard display
      // (Explicitly noted as pending teacher review)
      if (hasWriting && (finalW1.trim() || finalW2.trim())) {
        // Provisional estimate based on length and structure
        const w1Len = finalW1.trim().split(/\s+/).filter(Boolean).length;
        const w2Len = finalW2.trim().split(/\s+/).filter(Boolean).length;
        if (w1Len >= 140 && w2Len >= 230) {
          writingBand = 6.5; // pending evaluation placeholder
        } else if (w1Len >= 100 || w2Len >= 150) {
          writingBand = 5.5;
        } else {
          writingBand = 5.0;
        }
      }
      if (hasSpeaking) {
        speakingBand = 6.5; // pending evaluation placeholder
      }
    }

    // Overall Band calculation
    const overallScores = [listeningBand, readingBand, writingBand, speakingBand].filter(s => s !== null);
    const overallBand = calculateOverallBand(overallScores);

    // Save final results in transaction
    const updateAttempt = db.transaction(() => {
      db.prepare(`
        UPDATE attempts
        SET status = 'completed',
            end_time = CURRENT_TIMESTAMP,
            remaining_seconds = 0,
            answers_json = ?,
            writing_task1_text = ?,
            writing_task2_text = ?,
            listening_raw = ?,
            listening_band = ?,
            reading_raw = ?,
            reading_band = ?,
            writing_band = ?,
            speaking_band = ?,
            overall_band = ?,
            evaluation_status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        JSON.stringify(finalAnswers),
        finalW1,
        finalW2,
        listeningRaw,
        listeningBand,
        readingRaw,
        readingBand,
        writingBand,
        speakingBand,
        overallBand,
        evaluationStatus,
        id
      );

      // Add Notification
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, 'result', ?)
      `).run(
        'notif_' + crypto.randomBytes(5).toString('hex'),
        req.user.id,
        'Mock Test Submitted Successfully',
        `Your test results are ready. Overall Band: ${overallBand}. Click to view detailed analysis.`,
        `/results/${id}`
      );
    });

    updateAttempt();

    res.json({
      message: 'Test submitted and evaluated successfully.',
      result: {
        attemptId: id,
        overallBand,
        listeningBand,
        listeningRaw,
        readingBand,
        readingRaw,
        writingBand,
        speakingBand,
        evaluationStatus
      }
    });
  } catch (err) {
    console.error('Error submitting test:', err);
    res.status(500).json({ error: 'Failed to process test submission.' });
  }
});

// GET /api/attempts/:id/result - Fetch Result summary
router.get('/:id/result', authenticate, (req, res) => {
  try {
    const { id } = req.params;

    const attempt = db.prepare(`
      SELECT a.*, t.title as test_title, t.test_type, t.category, u.full_name, u.target_band
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      WHERE a.id = ?
    `).get(id);

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Ensure only student or admin/teacher can view
    if (attempt.student_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Fetch evaluations if any
    const evaluations = db.prepare(`
      SELECT e.*, u.full_name as evaluator_name
      FROM evaluations e
      JOIN users u ON e.evaluator_id = u.id
      WHERE e.attempt_id = ?
    `).all(id);

    // Calculate accuracy and counts
    const answers = JSON.parse(attempt.answers_json || '{}');
    const questions = db.prepare(`
      SELECT q.id, q.section_id, s.section_type, q.correct_answer_json
      FROM questions q
      JOIN test_sections s ON q.section_id = s.id
      WHERE s.test_id = ?
    `).all(attempt.test_id);

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach(q => {
      const studentAns = answers[q.id];
      if (studentAns === undefined || studentAns === null || studentAns === '') {
        unansweredCount++;
      } else if (isAnswerCorrect(studentAns, q.correct_answer_json)) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    res.json({
      attempt: {
        id: attempt.id,
        testId: attempt.test_id,
        testTitle: attempt.test_title,
        testType: attempt.test_type,
        category: attempt.category,
        studentName: attempt.full_name,
        targetBand: attempt.target_band,
        overallBand: attempt.overall_band,
        listeningBand: attempt.listening_band,
        listeningRaw: attempt.listening_raw,
        readingBand: attempt.reading_band,
        readingRaw: attempt.reading_raw,
        writingBand: attempt.writing_band,
        speakingBand: attempt.speaking_band,
        evaluationStatus: attempt.evaluation_status,
        startTime: attempt.start_time,
        endTime: attempt.end_time,
        tabSwitchesCount: attempt.tab_switches_count,
        correctCount,
        wrongCount,
        unansweredCount,
        totalQuestions,
        accuracy,
        evaluations
      }
    });
  } catch (err) {
    console.error('Error fetching result:', err);
    res.status(500).json({ error: 'Failed to retrieve test result.' });
  }
});

// GET /api/attempts/:id/analysis - Deep question-by-question breakdown, strengths & weaknesses
router.get('/:id/analysis', authenticate, (req, res) => {
  try {
    const { id } = req.params;

    const attempt = db.prepare(`
      SELECT a.*, t.title as test_title, t.test_type, t.category, u.full_name, u.target_band
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      WHERE a.id = ?
    `).get(id);

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    if (attempt.student_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const studentAnswers = JSON.parse(attempt.answers_json || '{}');
    const flaggedQuestions = JSON.parse(attempt.flags_json || '[]');

    // Fetch all questions with answers, passage titles, explanations
    const rawQuestions = db.prepare(`
      SELECT q.id, q.section_id, q.passage_id, q.part_number, q.question_number,
             q.question_type, q.prompt, q.instructions, q.options_json,
             q.correct_answer_json, q.explanation, q.marks, q.difficulty,
             s.section_type, s.title as section_title,
             p.title as passage_title
      FROM questions q
      JOIN test_sections s ON q.section_id = s.id
      LEFT JOIN passages p ON q.passage_id = p.id
      WHERE s.test_id = ?
      ORDER BY s.order_index ASC, q.question_number ASC
    `).all(attempt.test_id);

    const questionAnalysis = rawQuestions.map(q => {
      const studentAns = studentAnswers[q.id];
      const isFlagged = flaggedQuestions.includes(q.id);
      const isUnanswered = studentAns === undefined || studentAns === null || studentAns === '';
      const isCorrect = !isUnanswered && isAnswerCorrect(studentAns, q.correct_answer_json);

      let acceptableAnswers = [];
      try {
        acceptableAnswers = JSON.parse(q.correct_answer_json);
      } catch (e) {
        acceptableAnswers = [q.correct_answer_json];
      }

      return {
        id: q.id,
        sectionType: q.section_type,
        sectionTitle: q.section_title,
        passageTitle: q.passage_title,
        partNumber: q.part_number,
        questionNumber: q.question_number,
        questionType: q.question_type,
        prompt: q.prompt,
        instructions: q.instructions,
        options: q.options_json ? JSON.parse(q.options_json) : null,
        studentAnswer: studentAns || null,
        correctAnswers: acceptableAnswers,
        isCorrect,
        isUnanswered,
        isFlagged,
        explanation: q.explanation,
        difficulty: q.difficulty
      };
    });

    // Grouping by Question Type for Strengths & Weaknesses
    const typeStats = {};
    questionAnalysis.forEach(q => {
      if (!typeStats[q.questionType]) {
        typeStats[q.questionType] = { total: 0, correct: 0, name: q.questionType.replace(/_/g, ' ') };
      }
      typeStats[q.questionType].total++;
      if (q.isCorrect) typeStats[q.questionType].correct++;
    });

    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    Object.keys(typeStats).forEach(type => {
      const stat = typeStats[type];
      const rate = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
      if (rate >= 80) {
        strengths.push({
          type: stat.name,
          accuracy: Math.round(rate),
          summary: `Strong mastery in ${stat.name} (${stat.correct}/${stat.total} correct)`
        });
      } else if (rate < 60) {
        weaknesses.push({
          type: stat.name,
          accuracy: Math.round(rate),
          summary: `Needs targeted drills in ${stat.name} (${stat.correct}/${stat.total} correct)`
        });
        recommendations.push({
          skill: qTypeToSkill(type),
          title: `Practice ${stat.name} Modules`,
          description: `Focus on keyword scanning, identifying synonyms, and understanding qualifying adverbs.`
        });
      }
    });

    // Fallback recommendation if student did well across all
    if (recommendations.length === 0) {
      recommendations.push({
        skill: 'Full Mock',
        title: 'Advance to Timed Hard Mocks',
        description: 'Excellent accuracy! Continue practicing under strict exam timing to solidify your Band 8.0+ performance.'
      });
    }

    res.json({
      attemptId: id,
      testTitle: attempt.test_title,
      overallBand: attempt.overall_band,
      targetBand: attempt.target_band,
      difference: Math.round((attempt.overall_band - attempt.target_band) * 10) / 10,
      skills: {
        listening: attempt.listening_band,
        reading: attempt.reading_band,
        writing: attempt.writing_band,
        speaking: attempt.speaking_band
      },
      questions: questionAnalysis,
      strengths,
      weaknesses,
      recommendations
    });
  } catch (err) {
    console.error('Error fetching analysis:', err);
    res.status(500).json({ error: 'Failed to generate performance analysis.' });
  }
});

function qTypeToSkill(qType) {
  if (['matching_headings', 'true_false_not_given', 'yes_no_not_given'].includes(qType)) return 'Reading';
  if (['form_completion', 'note_completion', 'map_label'].includes(qType)) return 'Listening';
  return 'General';
}

// GET /api/attempts/history - Student's attempt history
router.get('/history', authenticate, (req, res) => {
  try {
    const { status, testType, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let sql = `
      SELECT a.id, a.test_id, t.title as test_title, t.test_type, t.category,
             a.status, a.overall_band, a.listening_band, a.reading_band,
             a.writing_band, a.speaking_band, a.evaluation_status,
             a.created_at, a.end_time
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.student_id = ?
    `;
    const params = [req.user.id];

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (testType && testType !== 'all') {
      sql += ' AND t.test_type = ?';
      params.push(testType);
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const attempts = db.prepare(sql).all(...params);

    const totalCount = db.prepare(`
      SELECT COUNT(*) as count
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.student_id = ?
    `).get(req.user.id).count;

    res.json({
      attempts,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(totalCount / parseInt(limit, 10))
      }
    });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to retrieve test history.' });
  }
});

// GET /api/attempts/student-stats - Student Dashboard statistics & trendline
router.get('/student-stats', authenticate, (req, res) => {
  try {
    const studentId = req.user.id;

    const completedAttempts = db.prepare(`
      SELECT a.id, a.overall_band, a.listening_band, a.reading_band,
             a.writing_band, a.speaking_band, a.created_at, t.title as test_title
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.student_id = ? AND a.status = 'completed'
      ORDER BY a.created_at ASC
    `).all(studentId);

    const totalTests = completedAttempts.length;

    let averageBand = 0;
    let bestScore = 0;
    let latestScore = 0;

    let avgListening = 0;
    let avgReading = 0;
    let avgWriting = 0;
    let avgSpeaking = 0;

    if (totalTests > 0) {
      const overallSum = completedAttempts.reduce((acc, curr) => acc + (curr.overall_band || 0), 0);
      averageBand = Math.round((overallSum / totalTests) * 10) / 10;
      bestScore = Math.max(...completedAttempts.map(c => c.overall_band || 0));
      latestScore = completedAttempts[completedAttempts.length - 1].overall_band || 0;

      const validL = completedAttempts.filter(c => c.listening_band > 0);
      avgListening = validL.length > 0 ? Math.round((validL.reduce((a, c) => a + c.listening_band, 0) / validL.length) * 10) / 10 : 7.0;

      const validR = completedAttempts.filter(c => c.reading_band > 0);
      avgReading = validR.length > 0 ? Math.round((validR.reduce((a, c) => a + c.reading_band, 0) / validR.length) * 10) / 10 : 6.5;

      const validW = completedAttempts.filter(c => c.writing_band > 0);
      avgWriting = validW.length > 0 ? Math.round((validW.reduce((a, c) => a + c.writing_band, 0) / validW.length) * 10) / 10 : 6.0;

      const validS = completedAttempts.filter(c => c.speaking_band > 0);
      avgSpeaking = validS.length > 0 ? Math.round((validS.reduce((a, c) => a + c.speaking_band, 0) / validS.length) * 10) / 10 : 6.5;
    }

    // Trendline data
    const trendData = completedAttempts.map((att, idx) => ({
      attemptIndex: idx + 1,
      date: att.created_at.split(' ')[0],
      testTitle: att.test_title,
      score: att.overall_band,
      listening: att.listening_band,
      reading: att.reading_band,
      writing: att.writing_band,
      speaking: att.speaking_band,
      target: req.user.target_band || 7.5
    }));

    // Recent attempts for dashboard
    const recentAttempts = db.prepare(`
      SELECT a.id, a.test_id, t.title as test_title, t.test_type, t.category,
             a.status, a.overall_band, a.created_at
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.student_id = ?
      ORDER BY a.created_at DESC
      LIMIT 5
    `).all(studentId);

    res.json({
      targetBand: req.user.target_band || 7.5,
      averageBand: averageBand || 6.5,
      bestScore: bestScore || 7.0,
      latestScore: latestScore || 6.5,
      testsCompleted: totalTests,
      skillBands: {
        listening: avgListening || 7.0,
        reading: avgReading || 6.5,
        writing: avgWriting || 6.0,
        speaking: avgSpeaking || 6.5
      },
      trendData,
      recentAttempts
    });
  } catch (err) {
    console.error('Error fetching student stats:', err);
    res.status(500).json({ error: 'Failed to retrieve student dashboard metrics.' });
  }
});

export default router;
