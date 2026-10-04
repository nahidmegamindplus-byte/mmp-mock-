import { initialUsers, initialSettings, initialTests, initialTestPayloads } from './mockData.js';

const STORAGE_KEY = 'mmp_local_db_v2';

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
  return {
    users: [...initialUsers],
    settings: { ...initialSettings },
    tests: [...initialTests],
    testPayloads: { ...initialTestPayloads },
    attempts: [],
    notifications: []
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
      message: 'Login successful',
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
      user_id: currentUser ? currentUser.id : 'usr_guest',
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
    att.writing_band = 6.5;
    att.speaking_band = 6.5;
    att.overall_band = calculateOverallBand([att.listening_band, att.reading_band, att.writing_band, att.speaking_band]);

    att.evaluations = [
      {
        section_type: 'writing',
        evaluator_name: 'IELTS Senior Evaluator',
        overall_band: 6.5,
        task_achievement_score: 6.5,
        coherence_cohesion_score: 6.5,
        lexical_resource_score: 6.5,
        grammar_accuracy_score: 6.5,
        examiner_feedback: 'Structured response with appropriate arguments. Continue refining cohesive transition phrases.',
        criteria_breakdown_json: JSON.stringify({
          strengths: ['Relevant responses to all parts', 'Clear paragraphs'],
          weaknesses: ['Minor sentence punctuation inconsistencies'],
          recommendations: ['Practice complex sentence connectors']
        })
      },
      {
        section_type: 'speaking',
        evaluator_name: 'IELTS Senior Evaluator',
        overall_band: 6.5,
        fluency_coherence_score: 6.5,
        lexical_resource_score: 6.5,
        grammar_accuracy_score: 6.5,
        pronunciation_score: 6.5,
        examiner_feedback: 'Fluent and understandable delivery throughout all parts.',
        criteria_breakdown_json: JSON.stringify({
          strengths: ['Clear spoken delivery'],
          weaknesses: ['Slight hesitation during Part 3 discussion'],
          recommendations: ['Expand arguments with detailed real-life illustrations']
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
    if (!att) throw new Error('Attempt not found');
    return { result: att };
  }

  const analysisMatch = path.match(/^\/attempts\/([^\/]+)\/analysis$/);
  if (analysisMatch) {
    const attId = analysisMatch[1];
    const att = db.attempts.find(a => a.id === attId);
    if (!att) throw new Error('Attempt not found');
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
        'Review True/False/Not Given strategies to improve scanning efficiency.',
        'Practice note completion spelling and numerical accuracy drills.'
      ]
    };
  }

  if (path === '/attempts/history') {
    const history = db.attempts.filter(a => !currentUser || a.user_id === currentUser.id || currentUser.role === 'admin');
    return { history };
  }

  if (path === '/attempts/student-stats') {
    const myAttempts = db.attempts.filter(a => !currentUser || a.user_id === currentUser.id);
    const hasAttempts = myAttempts.length > 0;
    const avgOverall = hasAttempts ? (myAttempts.reduce((s, a) => s + (a.overall_band || 0), 0) / myAttempts.length).toFixed(1) : '0.0';
    const avgListen = hasAttempts ? (myAttempts.reduce((s, a) => s + (a.listening_band || 0), 0) / myAttempts.length).toFixed(1) : '0.0';
    const avgRead = hasAttempts ? (myAttempts.reduce((s, a) => s + (a.reading_band || 0), 0) / myAttempts.length).toFixed(1) : '0.0';
    const avgWrite = hasAttempts ? (myAttempts.reduce((s, a) => s + (a.writing_band || 0), 0) / myAttempts.length).toFixed(1) : '0.0';
    const avgSpeak = hasAttempts ? (myAttempts.reduce((s, a) => s + (a.speaking_band || 0), 0) / myAttempts.length).toFixed(1) : '0.0';
    const highest = hasAttempts ? myAttempts.reduce((max, a) => Math.max(max, a.overall_band || 0), 0) : 0;
    return {
      stats: {
        total_attempts: myAttempts.length,
        avg_overall: parseFloat(avgOverall),
        avg_listening: parseFloat(avgListen),
        avg_reading: parseFloat(avgRead),
        avg_writing: parseFloat(avgWrite),
        avg_speaking: parseFloat(avgSpeak),
        highest_band: highest
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
        avg_overall_band: db.attempts.length > 0 ? (db.attempts.reduce((s, a) => s + (a.overall_band || 0), 0) / db.attempts.length).toFixed(1) : 0
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

  return { success: true, message: 'Operation completed' };
}
