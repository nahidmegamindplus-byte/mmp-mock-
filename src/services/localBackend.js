import { initialUsers, initialSettings, initialTests, initialTestPayloads } from './mockData.js';

const STORAGE_KEY = 'mmp_local_db_v1';

// IELTS standard band tables
const BAND_TABLES = {
  listening: {
    academic: [
      { min: 39, max: 40, band: 9.0 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8.0 },
      { min: 32, max: 34, band: 7.5 },
      { min: 30, max: 31, band: 7.0 },
      { min: 26, max: 29, band: 6.5 },
      { min: 23, max: 25, band: 6.0 },
      { min: 18, max: 22, band: 5.5 },
      { min: 16, max: 17, band: 5.0 },
      { min: 13, max: 15, band: 4.5 },
      { min: 10, max: 12, band: 4.0 },
      { min: 8, max: 9, band: 3.5 },
      { min: 6, max: 7, band: 3.0 },
      { min: 4, max: 5, band: 2.5 },
      { min: 0, max: 3, band: 2.0 }
    ],
    general: [
      { min: 39, max: 40, band: 9.0 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8.0 },
      { min: 32, max: 34, band: 7.5 },
      { min: 30, max: 31, band: 7.0 },
      { min: 26, max: 29, band: 6.5 },
      { min: 23, max: 25, band: 6.0 },
      { min: 18, max: 22, band: 5.5 },
      { min: 16, max: 17, band: 5.0 },
      { min: 13, max: 15, band: 4.5 },
      { min: 10, max: 12, band: 4.0 },
      { min: 8, max: 9, band: 3.5 },
      { min: 6, max: 7, band: 3.0 },
      { min: 4, max: 5, band: 2.5 },
      { min: 0, max: 3, band: 2.0 }
    ]
  },
  reading: {
    academic: [
      { min: 39, max: 40, band: 9.0 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8.0 },
      { min: 33, max: 34, band: 7.5 },
      { min: 30, max: 32, band: 7.0 },
      { min: 27, max: 29, band: 6.5 },
      { min: 23, max: 26, band: 6.0 },
      { min: 19, max: 22, band: 5.5 },
      { min: 15, max: 18, band: 5.0 },
      { min: 13, max: 14, band: 4.5 },
      { min: 10, max: 12, band: 4.0 },
      { min: 8, max: 9, band: 3.5 },
      { min: 6, max: 7, band: 3.0 },
      { min: 4, max: 5, band: 2.5 },
      { min: 0, max: 3, band: 2.0 }
    ],
    general: [
      { min: 40, max: 40, band: 9.0 },
      { min: 39, max: 39, band: 8.5 },
      { min: 37, max: 38, band: 8.0 },
      { min: 36, max: 36, band: 7.5 },
      { min: 34, max: 35, band: 7.0 },
      { min: 32, max: 33, band: 6.5 },
      { min: 30, max: 31, band: 6.0 },
      { min: 27, max: 29, band: 5.5 },
      { min: 23, max: 26, band: 5.0 },
      { min: 19, max: 22, band: 4.5 },
      { min: 15, max: 18, band: 4.0 },
      { min: 12, max: 14, band: 3.5 },
      { min: 9, max: 11, band: 3.0 },
      { min: 6, max: 8, band: 2.5 },
      { min: 0, max: 5, band: 2.0 }
    ]
  }
};

function calculateBandScore(rawScore, sectionType, testType = 'academic') {
  const normRaw = Math.max(0, Math.min(40, parseInt(rawScore, 10) || 0));
  const normSec = (sectionType || '').toLowerCase();
  const normType = (testType || 'academic').toLowerCase();

  const table = BAND_TABLES[normSec]?.[normType] || BAND_TABLES.listening.academic;
  for (const range of table) {
    if (normRaw >= range.min && normRaw <= range.max) {
      return range.band;
    }
  }
  return 2.0;
}

function calculateOverallBand(scores = []) {
  const validScores = scores.filter(s => typeof s === 'number' && !isNaN(s) && s > 0);
  if (validScores.length === 0) return 0;
  const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  const integerPart = Math.floor(avg);
  const frac = avg - integerPart;
  if (frac < 0.25) return integerPart;
  if (frac < 0.75) return integerPart + 0.5;
  return integerPart + 1.0;
}

function isAnswerCorrect(studentAns, correctAnsJson) {
  if (studentAns === undefined || studentAns === null || studentAns === '') return false;
  let acceptable = [];
  try {
    if (typeof correctAnsJson === 'string') acceptable = JSON.parse(correctAnsJson);
    else if (Array.isArray(correctAnsJson)) acceptable = correctAnsJson;
    else acceptable = [correctAnsJson];
  } catch (e) {
    acceptable = [correctAnsJson];
  }
  const cleanStudent = String(studentAns).trim().toLowerCase().replace(/['"`]/g, '');
  return acceptable.some(item => {
    if (item === null || item === undefined) return false;
    const cleanCorrect = String(item).trim().toLowerCase().replace(/['"`]/g, '');
    return cleanStudent === cleanCorrect;
  });
}

function getInitialDb() {
  const defaultAttempts = [
    {
      id: 'att_demo_01',
      user_id: 'usr_student_01',
      test_id: 'test_acad_01',
      test_title: 'IELTS Academic Mock Test 01 - Full CBT Simulation',
      test_type: 'academic',
      status: 'evaluated',
      current_section: 'speaking',
      time_remaining_seconds: 0,
      listening_raw_score: 34,
      reading_raw_score: 32,
      listening_band: 7.5,
      reading_band: 7.0,
      writing_band: 6.5,
      speaking_band: 7.0,
      overall_band: 7.0,
      started_at: '2026-02-01T09:00:00.000Z',
      submitted_at: '2026-02-01T11:45:00.000Z',
      answers: {},
      evaluations: [
        {
          section_type: 'writing',
          evaluator_name: 'Dr. Sarah Jenkins',
          overall_band: 6.5,
          task_achievement_score: 7.0,
          coherence_cohesion_score: 6.5,
          lexical_resource_score: 6.5,
          grammar_accuracy_score: 6.0,
          examiner_feedback: 'Strong response to Task 1 with accurate data synthesis. Task 2 showed good argument balance but needs more cohesive linkers between body paragraphs.',
          criteria_breakdown_json: JSON.stringify({
            strengths: ['Clear Task 1 data overview', 'Natural academic vocabulary'],
            weaknesses: ['Punctuation and run-on sentences in Task 2 body paragraph 2'],
            recommendations: ['Focus on complex sentence structures and conditional forms']
          })
        },
        {
          section_type: 'speaking',
          evaluator_name: 'Dr. Sarah Jenkins',
          overall_band: 7.0,
          fluency_coherence_score: 7.0,
          lexical_resource_score: 7.0,
          grammar_accuracy_score: 7.0,
          pronunciation_score: 7.0,
          examiner_feedback: 'Fluent and spontaneous responses throughout Part 1 and Part 2. Good intonation and varied sentence structures.',
          criteria_breakdown_json: JSON.stringify({
            strengths: ['Spontaneous delivery and great cue card time management', 'Clear pronunciation and intonation'],
            weaknesses: ['Minor hesitation on abstract Part 3 questions'],
            recommendations: ['Practice structuring abstract opinions with the P.E.E.L method']
          })
        }
      ]
    }
  ];

  return {
    users: [...initialUsers],
    settings: { ...initialSettings },
    tests: [...initialTests],
    testPayloads: { ...initialTestPayloads },
    attempts: defaultAttempts,
    notifications: [
      {
        id: 'notif_01',
        user_id: 'usr_student_01',
        title: 'Evaluation Complete: IELTS Academic Mock Test 01',
        message: 'Your Writing & Speaking responses have been evaluated by Dr. Sarah Jenkins. Overall Band: 7.0',
        type: 'result',
        link_url: '/result/att_demo_01',
        is_read: false,
        created_at: '2026-02-02T10:00:00.000Z'
      }
    ]
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDb();
      saveDb(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure core users exist
    for (const u of initialUsers) {
      if (!parsed.users.some(x => x.email.toLowerCase() === u.email.toLowerCase())) {
        parsed.users.push(u);
      }
    }
    if (!parsed.testPayloads || !parsed.testPayloads.test_acad_01) {
      parsed.testPayloads = { ...initialTestPayloads, ...(parsed.testPayloads || {}) };
    }
    return parsed;
  } catch (e) {
    console.warn('[LocalBackend] LocalStorage read failed, resetting default state:', e);
    const initial = getInitialDb();
    saveDb(initial);
    return initial;
  }
}

function saveDb(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[LocalBackend] LocalStorage save failed:', e);
  }
}

function getCurrentUserFromToken(token) {
  if (!token) return null;
  const db = loadDb();
  const tokenPrefix = 'mmp_local_token_';
  if (token.startsWith(tokenPrefix)) {
    const userId = token.replace(tokenPrefix, '');
    return db.users.find(u => u.id === userId) || null;
  }
  // Try JWT decode if standard base64 payload
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return db.users.find(u => u.id === payload.id || u.email === payload.email) || null;
    }
  } catch (e) {}
  return db.users[0] || null;
}

// Router simulator
export async function handleLocalApi(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const token = localStorage.getItem('mmp_token');
  const currentUser = getCurrentUserFromToken(token);
  let body = {};
  if (options.body) {
    if (typeof options.body === 'string') {
      try { body = JSON.parse(options.body); } catch (e) { body = {}; }
    } else if (typeof options.body === 'object') {
      body = options.body;
    }
  }

  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  const db = loadDb();

  // Small latency simulation for natural UX
  await new Promise(r => setTimeout(r, 40));

  // 1. AUTH ROUTES
  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());
    if (!user || user.password !== (password || '').trim()) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }
    if (user.status === 'suspended') {
      const error = new Error('Account suspended. Contact administrator.');
      error.status = 403;
      throw error;
    }
    const localToken = `mmp_local_token_${user.id}`;
    const { password: _, ...userSafe } = user;
    return {
      message: 'Login successful (Offline/Vercel Engine)',
      token: localToken,
      user: userSafe
    };
  }

  if (path === '/auth/register' && method === 'POST') {
    const { email, password, full_name, phone, target_band, test_type, current_level, target_test_date } = body;
    if (!email || !password || !full_name) {
      const error = new Error('Email, password, and full name are required');
      error.status = 400;
      throw error;
    }
    if (db.users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      const error = new Error('An account with this email already exists');
      error.status = 400;
      throw error;
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      email: email.trim().toLowerCase(),
      password: password.trim(),
      full_name: full_name.trim(),
      phone: phone || '',
      role: 'student',
      target_band: parseFloat(target_band) || 7.0,
      test_type: test_type || 'academic',
      current_level: current_level || 'intermediate',
      target_test_date: target_test_date || '2026-12-31',
      status: 'active',
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDb(db);
    const localToken = `mmp_local_token_${newUser.id}`;
    const { password: _, ...userSafe } = newUser;
    return {
      message: 'Registration successful',
      token: localToken,
      user: userSafe
    };
  }

  if (path === '/auth/me') {
    if (!currentUser) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }
    const { password: _, ...userSafe } = currentUser;
    return { user: userSafe };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    if (!currentUser) throw new Error('Unauthorized');
    const uIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (uIndex !== -1) {
      db.users[uIndex] = { ...db.users[uIndex], ...body };
      saveDb(db);
      const { password: _, ...userSafe } = db.users[uIndex];
      return { message: 'Profile updated successfully', user: userSafe };
    }
    throw new Error('User not found');
  }

  if (path === '/auth/change-password' && method === 'POST') {
    if (!currentUser) throw new Error('Unauthorized');
    const { currentPassword, newPassword } = body;
    const uIndex = db.users.findIndex(u => u.id === currentUser.id);
    if (uIndex !== -1 && db.users[uIndex].password === currentPassword) {
      db.users[uIndex].password = newPassword;
      saveDb(db);
      return { message: 'Password changed successfully' };
    }
    const err = new Error('Incorrect current password');
    err.status = 400;
    throw err;
  }

  if (path === '/auth/forgot-password' && method === 'POST') {
    return { message: 'If an account exists with this email, password reset instructions have been generated.' };
  }

  if (path === '/auth/notifications') {
    const userNotifs = db.notifications.filter(n => !currentUser || n.user_id === currentUser.id);
    return { notifications: userNotifs };
  }

  if (path === '/auth/notifications/read-all' && method === 'PUT') {
    db.notifications.forEach(n => {
      if (!currentUser || n.user_id === currentUser.id) n.is_read = true;
    });
    saveDb(db);
    return { message: 'All marked as read' };
  }

  // 2. TESTS ROUTES
  if (path === '/tests') {
    let list = [...db.tests];
    const category = params.get('category');
    const test_type = params.get('test_type');
    const search = params.get('search');
    if (category) list = list.filter(t => t.category === category);
    if (test_type) list = list.filter(t => t.test_type === test_type);
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    return { tests: list };
  }

  const testDetailMatch = path.match(/^\/tests\/([^\/]+)$/);
  if (testDetailMatch && method === 'GET') {
    const testId = testDetailMatch[1];
    const test = db.tests.find(t => t.id === testId);
    if (!test) {
      const err = new Error('Test not found');
      err.status = 404;
      throw err;
    }
    const payload = db.testPayloads[testId] || initialTestPayloads.test_acad_01;
    return { test, sections: payload.sections || [] };
  }

  const examPayloadMatch = path.match(/^\/tests\/([^\/]+)\/exam-payload$/);
  if (examPayloadMatch) {
    const testId = examPayloadMatch[1];
    const payload = db.testPayloads[testId] || {
      test: db.tests.find(t => t.id === testId) || initialTests[0],
      sections: initialTestPayloads.test_acad_01.sections
    };
    return payload;
  }

  // 3. ATTEMPTS ROUTES
  if (path === '/attempts/start' && method === 'POST') {
    const { testId } = body;
    const test = db.tests.find(t => t.id === testId) || initialTests[0];
    const newAttempt = {
      id: `att_${Date.now()}`,
      user_id: currentUser ? currentUser.id : 'usr_student_01',
      test_id: test.id,
      test_title: test.title,
      test_type: test.test_type,
      status: 'in_progress',
      current_section: 'listening',
      time_remaining_seconds: (test.duration_minutes || 165) * 60,
      listening_raw_score: 0,
      reading_raw_score: 0,
      listening_band: 0,
      reading_band: 0,
      writing_band: 0,
      speaking_band: 0,
      overall_band: 0,
      started_at: new Date().toISOString(),
      submitted_at: null,
      answers: {},
      evaluations: []
    };
    db.attempts.unshift(newAttempt);
    saveDb(db);
    return { attempt: newAttempt };
  }

  const saveProgMatch = path.match(/^\/attempts\/([^\/]+)\/save-progress$/);
  if (saveProgMatch && method === 'POST') {
    const attId = saveProgMatch[1];
    const att = db.attempts.find(a => a.id === attId);
    if (att) {
      if (body.answers) att.answers = { ...att.answers, ...body.answers };
      if (body.currentSection) att.current_section = body.currentSection;
      if (body.timeRemainingSeconds !== undefined) att.time_remaining_seconds = body.timeRemainingSeconds;
      saveDb(db);
      return { success: true };
    }
    return { success: false };
  }

  const uploadSpeakMatch = path.match(/^\/attempts\/([^\/]+)\/upload-speaking$/);
  if (uploadSpeakMatch && method === 'POST') {
    return { success: true, message: 'Audio recorded' };
  }

  const submitMatch = path.match(/^\/attempts\/([^\/]+)\/submit$/);
  if (submitMatch && method === 'POST') {
    const attId = submitMatch[1];
    const att = db.attempts.find(a => a.id === attId);
    if (!att) throw new Error('Attempt not found');

    const finalAnswers = body.answers || att.answers || {};
    att.answers = finalAnswers;
    att.status = 'submitted';
    att.submitted_at = new Date().toISOString();

    // Grade Listening & Reading automatically against test questions
    const payload = db.testPayloads[att.test_id] || initialTestPayloads.test_acad_01;
    let lCorrect = 0;
    let rCorrect = 0;

    payload.sections?.forEach(sec => {
      if (sec.section_type === 'listening') {
        sec.questions?.forEach(q => {
          const sAns = finalAnswers[q.id];
          if (isAnswerCorrect(sAns, q.correct_answer_json)) lCorrect++;
        });
      }
      if (sec.section_type === 'reading') {
        sec.questions?.forEach(q => {
          const sAns = finalAnswers[q.id];
          if (isAnswerCorrect(sAns, q.correct_answer_json)) rCorrect++;
        });
      }
    });

    att.listening_raw_score = lCorrect;
    att.reading_raw_score = rCorrect;
    att.listening_band = calculateBandScore(lCorrect, 'listening', att.test_type);
    att.reading_band = calculateBandScore(rCorrect, 'reading', att.test_type);

    // Default provisional estimated writing/speaking bands for rich instant mock experience
    att.writing_band = 6.5;
    att.speaking_band = 7.0;
    att.overall_band = calculateOverallBand([att.listening_band, att.reading_band, att.writing_band, att.speaking_band]);

    // Create default teacher evaluation
    att.evaluations = [
      {
        section_type: 'writing',
        evaluator_name: 'Dr. Sarah Jenkins',
        overall_band: 6.5,
        task_achievement_score: 7.0,
        coherence_cohesion_score: 6.5,
        lexical_resource_score: 6.5,
        grammar_accuracy_score: 6.0,
        examiner_feedback: 'Well-structured response with clear arguments. Good Task 1 data comparisons.',
        criteria_breakdown_json: JSON.stringify({
          strengths: ['Clear Task 1 data overview', 'Natural academic vocabulary'],
          weaknesses: ['Minor punctuation lapses in Task 2 body'],
          recommendations: ['Practice complex sentence connectors']
        })
      },
      {
        section_type: 'speaking',
        evaluator_name: 'Dr. Sarah Jenkins',
        overall_band: 7.0,
        fluency_coherence_score: 7.0,
        lexical_resource_score: 7.0,
        grammar_accuracy_score: 7.0,
        pronunciation_score: 7.0,
        examiner_feedback: 'Confident and fluent delivery across all parts with natural intonation.',
        criteria_breakdown_json: JSON.stringify({
          strengths: ['Fluent delivery and excellent cue card pacing'],
          weaknesses: ['Minor pauses on abstract Part 3 questions'],
          recommendations: ['Expand Part 3 hypothetical examples']
        })
      }
    ];

    saveDb(db);
    return {
      message: 'Test submitted and evaluated successfully',
      attempt: att,
      result: att
    };
  }

  const resultMatch = path.match(/^\/attempts\/([^\/]+)\/result$/);
  if (resultMatch) {
    const attId = resultMatch[1];
    const att = db.attempts.find(a => a.id === attId) || db.attempts[0];
    return { result: att };
  }

  const analysisMatch = path.match(/^\/attempts\/([^\/]+)\/analysis$/);
  if (analysisMatch) {
    const attId = analysisMatch[1];
    const att = db.attempts.find(a => a.id === attId) || db.attempts[0];
    const payload = db.testPayloads[att.test_id] || initialTestPayloads.test_acad_01;

    const sectionsAnalysis = [];
    payload.sections?.forEach(sec => {
      if (sec.section_type === 'listening' || sec.section_type === 'reading') {
        const questionsList = (sec.questions || []).map(q => {
          const userAns = att.answers?.[q.id] || '';
          const correct = isAnswerCorrect(userAns, q.correct_answer_json);
          let correctFormatted = '';
          try {
            const parsed = JSON.parse(q.correct_answer_json);
            correctFormatted = Array.isArray(parsed) ? parsed[0] : parsed;
          } catch (e) {
            correctFormatted = q.correct_answer_json;
          }
          return {
            id: q.id,
            question_number: q.question_number,
            question_type: q.question_type,
            prompt: q.prompt,
            user_answer: userAns,
            correct_answer: correctFormatted,
            is_correct: correct,
            explanation: q.explanation || 'Refer to the passage/audio cues for context.'
          };
        });

        sectionsAnalysis.push({
          section_type: sec.section_type,
          title: sec.title,
          raw_score: sec.section_type === 'listening' ? att.listening_raw_score : att.reading_raw_score,
          band_score: sec.section_type === 'listening' ? att.listening_band : att.reading_band,
          total_questions: questionsList.length,
          questions: questionsList
        });
      }
    });

    return {
      attempt: att,
      sections: sectionsAnalysis,
      evaluations: att.evaluations || [],
      recommendations: [
        'Review Part 3 true/false/not given strategies to improve scanning efficiency.',
        'Practice note completion number and spelling drills for Listening Part 1.'
      ]
    };
  }

  if (path === '/attempts/history') {
    const history = db.attempts.filter(a => !currentUser || a.user_id === currentUser.id || currentUser.role === 'admin');
    return { history };
  }

  if (path === '/attempts/student-stats') {
    const myAttempts = db.attempts.filter(a => !currentUser || a.user_id === currentUser.id);
    const avgOverall = myAttempts.length ? (myAttempts.reduce((s, a) => s + (a.overall_band || 0), 0) / myAttempts.length).toFixed(1) : 0;
    const avgListen = myAttempts.length ? (myAttempts.reduce((s, a) => s + (a.listening_band || 0), 0) / myAttempts.length).toFixed(1) : 0;
    const avgRead = myAttempts.length ? (myAttempts.reduce((s, a) => s + (a.reading_band || 0), 0) / myAttempts.length).toFixed(1) : 0;
    const avgWrite = myAttempts.length ? (myAttempts.reduce((s, a) => s + (a.writing_band || 0), 0) / myAttempts.length).toFixed(1) : 0;
    const avgSpeak = myAttempts.length ? (myAttempts.reduce((s, a) => s + (a.speaking_band || 0), 0) / myAttempts.length).toFixed(1) : 0;
    return {
      stats: {
        total_attempts: myAttempts.length,
        avg_overall: parseFloat(avgOverall) || 7.0,
        avg_listening: parseFloat(avgListen) || 7.5,
        avg_reading: parseFloat(avgRead) || 7.0,
        avg_writing: parseFloat(avgWrite) || 6.5,
        avg_speaking: parseFloat(avgSpeak) || 7.0,
        highest_band: myAttempts.reduce((max, a) => Math.max(max, a.overall_band || 0), 0) || 7.5
      },
      recent_attempts: myAttempts.slice(0, 5)
    };
  }

  // 4. ADMIN ROUTES
  if (path === '/admin/dashboard-stats') {
    return {
      stats: {
        total_students: db.users.filter(u => u.role === 'student').length,
        total_tests: db.tests.length,
        total_attempts: db.attempts.length,
        pending_evaluations: 0,
        avg_overall_band: 7.1
      },
      recent_attempts: db.attempts.slice(0, 5)
    };
  }

  if (path === '/admin/tests') {
    if (method === 'POST') {
      const newTest = {
        id: `test_${Date.now()}`,
        title: body.title || 'New IELTS Test',
        test_type: body.test_type || 'academic',
        category: body.category || 'full',
        difficulty: body.difficulty || 'standard',
        duration_minutes: parseInt(body.duration_minutes) || 165,
        status: body.status || 'draft',
        description: body.description || '',
        sections_count: 4,
        total_questions: 40,
        created_at: new Date().toISOString()
      };
      db.tests.unshift(newTest);
      db.testPayloads[newTest.id] = { test: newTest, sections: initialTestPayloads.test_acad_01.sections };
      saveDb(db);
      return { message: 'Test created', test: newTest };
    }
    return { tests: db.tests };
  }

  if (path === '/admin/students') {
    const students = db.users.filter(u => u.role === 'student');
    return { students };
  }

  if (path === '/admin/settings') {
    if (method === 'PUT') {
      db.settings = { ...db.settings, ...(body.settings || {}) };
      saveDb(db);
      return { message: 'Settings saved', settings: db.settings };
    }
    return { settings: db.settings };
  }

  if (path === '/admin/evaluations/pending') {
    return { evaluations: [] };
  }

  if (path === '/admin/attempts') {
    return { attempts: db.attempts };
  }

  // Default fallback for unhandled routes
  return { success: true, message: 'Local operation completed' };
}
