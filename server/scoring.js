import db from './db.js';

// Default standard conversion tables
export const DEFAULT_BAND_TABLES = {
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

/**
 * Calculate Band Score from raw score using configured rules or defaults
 */
export function calculateBand(rawScore, sectionType, testType = 'academic', testId = null) {
  const normRaw = Math.max(0, Math.min(40, parseInt(rawScore, 10) || 0));
  const normSection = (sectionType || '').toLowerCase();
  const normTestType = (testType || 'academic').toLowerCase();

  try {
    // Check if test-specific or global custom rules exist in DB
    let customRules = [];
    if (testId) {
      customRules = db.prepare(`
        SELECT min_raw_score, max_raw_score, band_score
        FROM scoring_rules
        WHERE (test_id = ? OR test_id IS NULL)
          AND section_type = ?
          AND test_type = ?
        ORDER BY min_raw_score DESC
      `).all(testId, normSection, normTestType);
    } else {
      customRules = db.prepare(`
        SELECT min_raw_score, max_raw_score, band_score
        FROM scoring_rules
        WHERE test_id IS NULL
          AND section_type = ?
          AND test_type = ?
        ORDER BY min_raw_score DESC
      `).all(normSection, normTestType);
    }

    if (customRules.length > 0) {
      for (const rule of customRules) {
        if (normRaw >= rule.min_raw_score && normRaw <= rule.max_raw_score) {
          return rule.band_score;
        }
      }
    }
  } catch (err) {
    console.warn('[Scoring] Custom rule lookup fallback to defaults:', err.message);
  }

  // Fallback to standard conversion
  const table = DEFAULT_BAND_TABLES[normSection]?.[normTestType] || DEFAULT_BAND_TABLES.listening.academic;
  for (const range of table) {
    if (normRaw >= range.min && normRaw <= range.max) {
      return range.band;
    }
  }

  return 2.0;
}

/**
 * Standard IELTS Overall Band Score Rounding (e.g. 6.25 -> 6.5, 6.75 -> 7.0, 6.125 -> 6.0)
 */
export function calculateOverallBand(scores = [], roundingMode = 'standard') {
  const validScores = scores.filter(s => typeof s === 'number' && !isNaN(s) && s > 0);
  if (validScores.length === 0) return 0;

  const sum = validScores.reduce((acc, curr) => acc + curr, 0);
  const average = sum / validScores.length;

  if (roundingMode === 'exact') {
    return Math.round(average * 10) / 10;
  }

  const integerPart = Math.floor(average);
  const fraction = average - integerPart;

  if (fraction < 0.25) {
    return integerPart;
  } else if (fraction >= 0.25 && fraction < 0.75) {
    return integerPart + 0.5;
  } else {
    return integerPart + 1.0;
  }
}

/**
 * Compare student answer with acceptable answer variations
 */
export function isAnswerCorrect(studentAns, correctAnsJson) {
  if (studentAns === undefined || studentAns === null || studentAns === '') {
    return false;
  }

  let acceptable = [];
  try {
    if (typeof correctAnsJson === 'string') {
      acceptable = JSON.parse(correctAnsJson);
    } else if (Array.isArray(correctAnsJson)) {
      acceptable = correctAnsJson;
    } else {
      acceptable = [correctAnsJson];
    }
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
