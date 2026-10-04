import React from 'react';
import { Flag, CheckCircle2, HelpCircle } from 'lucide-react';

export default function QuestionPalette({
  totalQuestions = 40,
  currentQuestion = 1,
  answers = {},
  flags = [],
  questionIds = [], // Array of question IDs or objects
  onSelectQuestion,
  className = ''
}) {
  const isAnswered = (qNum, qId) => {
    const val = answers[qId] ?? answers[qNum];
    return val !== undefined && val !== null && String(val).trim() !== '';
  };

  const isFlagged = (qNum, qId) => {
    return flags.includes(qId) || flags.includes(qNum);
  };

  // Compute counts
  let answeredCount = 0;
  let flaggedCount = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    const qId = questionIds[i - 1]?.id || i;
    if (isAnswered(i, qId)) answeredCount++;
    if (isFlagged(i, qId)) flaggedCount++;
  }

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs ${className}`}>
      
      {/* Header & Legend */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Question Palette ({totalQuestions})
        </h4>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Answered ({answeredCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            Unanswered ({unansweredCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Flagged ({flaggedCount})
          </span>
        </div>
      </div>

      {/* Question Number Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 pt-3">
        {Array.from({ length: totalQuestions }, (_, idx) => {
          const qNum = idx + 1;
          const qId = questionIds[idx]?.id || qNum;
          const answered = isAnswered(qNum, qId);
          const flagged = isFlagged(qNum, qId);
          const isCurrent = currentQuestion === qNum;

          let btnStyles = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';

          if (answered) {
            btnStyles = 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 font-semibold';
          }
          if (flagged) {
            btnStyles = 'bg-amber-100 text-amber-900 border-amber-400 ring-1 ring-amber-400 font-semibold';
          }
          if (answered && flagged) {
            btnStyles = 'bg-emerald-700 text-white ring-2 ring-amber-400 font-bold';
          }
          if (isCurrent) {
            btnStyles += ' ring-2 ring-megamind-500 ring-offset-1 z-10 shadow-sm';
          }

          return (
            <button
              key={qNum}
              type="button"
              onClick={() => onSelectQuestion && onSelectQuestion(qNum)}
              className={`relative h-9 rounded-lg text-xs flex flex-col items-center justify-center border transition-all active:scale-95 ${btnStyles}`}
              aria-label={`Question ${qNum}: ${answered ? 'Answered' : 'Unanswered'}${flagged ? ', Flagged for review' : ''}`}
            >
              <span>{qNum}</span>
              {flagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
