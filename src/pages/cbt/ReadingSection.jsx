import React, { useState, useRef } from 'react';
import TextHighlighter from '../../components/common/TextHighlighter';
import { BookOpen, HelpCircle, CheckCircle, ArrowRight, ArrowLeft, Split } from 'lucide-react';

export default function ReadingSection({
  section,
  answers = {},
  flags = [],
  currentQuestion = 1,
  onAnswerChange,
  onSelectQuestion,
  fontSize = 100
}) {
  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('both'); // 'passage' | 'questions' | 'both'
  const passageRef = useRef(null);

  const passages = section.passages || [];
  const questions = section.questions || [];

  const currentPassage = passages[activePassageIndex] || passages[0];

  // Filter questions for the active passage
  const passageQuestions = questions.filter(
    (q) => (q.part_number || 1) === (activePassageIndex + 1) || q.passage_id === currentPassage?.id
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      
      {/* Top Passage Selector & Mobile Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0 flex items-center justify-between flex-wrap gap-2">
        {/* Passage Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {passages.map((p, idx) => {
            const isSelected = activePassageIndex === idx;
            const qCount = questions.filter(
              (q) => (q.part_number || 1) === idx + 1 || q.passage_id === p.id
            ).length;
            const answeredInPassage = questions.filter(
              (q) => ((q.part_number || 1) === idx + 1 || q.passage_id === p.id) && answers[q.id]
            ).length;

            return (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => setActivePassageIndex(idx)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>Passage {idx + 1}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-megamind-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {answeredInPassage}/{qCount || 13}
                </span>
              </button>
            );
          })}
        </div>

        {/* Text Highlighter Bar */}
        <div className="flex items-center gap-3">
          <TextHighlighter containerRef={passageRef} />

          {/* Mobile view toggle (only visible on small screens) */}
          <div className="flex md:hidden bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMobileTab('passage')}
              className={`px-2.5 py-1 rounded ${
                mobileTab === 'passage' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Passage
            </button>
            <button
              onClick={() => setMobileTab('questions')}
              className={`px-2.5 py-1 rounded ${
                mobileTab === 'questions' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Questions
            </button>
          </div>
        </div>
      </div>

      {/* Main CBT 2-Column Split Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Passage Content */}
        <div
          ref={passageRef}
          className={`flex-1 overflow-y-auto p-5 md:p-8 bg-white border-r border-slate-200 ${
            mobileTab === 'questions' ? 'hidden md:block' : 'block'
          }`}
          style={{ fontSize: `${fontSize}%` }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-megamind-600 uppercase tracking-wider">
                Reading Passage {activePassageIndex + 1}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {currentPassage?.title}
              </h2>
              {currentPassage?.subtitle && (
                <p className="text-xs text-slate-500 italic mt-1 leading-normal">
                  {currentPassage.subtitle}
                </p>
              )}
            </div>

            {/* Render formatted HTML passage */}
            <div
              className="passage-content leading-relaxed text-slate-800 space-y-4 select-text"
              dangerouslySetInnerHTML={{ __html: currentPassage?.content_html || '' }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Questions Workspace */}
        <div
          className={`flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 ${
            mobileTab === 'passage' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="max-w-xl mx-auto space-y-5 pb-16">
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Passage {activePassageIndex + 1} Questions
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Read Passage {activePassageIndex + 1} on the left and answer the questions below.
              </p>
            </div>

            {/* Question Cards */}
            <div className="space-y-4">
              {passageQuestions.map((q) => {
                const studentVal = answers[q.id] || '';
                const isCurrent = currentQuestion === q.question_number;

                return (
                  <div
                    key={q.id}
                    id={`question-${q.question_number}`}
                    className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all ${
                      isCurrent ? 'border-megamind-500 ring-2 ring-megamind-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                        {q.question_number}
                      </span>

                      <div className="flex-1 space-y-3">
                        {q.instructions && (
                          <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                            {q.instructions}
                          </p>
                        )}

                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                          {q.prompt}
                        </p>

                        {/* TRUE / FALSE / NOT GIVEN Buttons */}
                        {['true_false_not_given', 'yes_no_not_given'].includes(q.question_type) ? (
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            {(q.question_type === 'true_false_not_given'
                              ? ['TRUE', 'FALSE', 'NOT GIVEN']
                              : ['YES', 'NO', 'NOT GIVEN']
                            ).map((optVal) => {
                              const isSelected = String(studentVal).toUpperCase() === optVal;
                              return (
                                <button
                                  key={optVal}
                                  type="button"
                                  onClick={() => onAnswerChange(q.id, optVal)}
                                  className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition-all ${
                                    isSelected
                                      ? 'bg-megamind-500 border-megamind-600 text-white shadow-xs'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {optVal}
                                </button>
                              );
                            })}
                          </div>
                        ) : q.options && Array.isArray(q.options) && q.options.length > 0 ? (
                          /* Multiple Choice / Matching */
                          <div className="space-y-1.5 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = studentVal === opt;
                              const optionLetter = String.fromCharCode(65 + optIdx);

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => onAnswerChange(q.id, opt)}
                                  className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-medium flex items-center gap-3 transition-all ${
                                    isSelected
                                      ? 'bg-megamind-50 border-megamind-500 text-megamind-900 ring-1 ring-megamind-500 font-semibold'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold shrink-0 ${
                                      isSelected
                                        ? 'bg-megamind-500 text-white'
                                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                                    }`}
                                  >
                                    {optionLetter}
                                  </span>
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          /* Text Completion Input */
                          <div className="pt-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={studentVal}
                              onChange={(e) => onAnswerChange(q.id, e.target.value)}
                              placeholder="Type your answer here..."
                              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:ring-1 focus:ring-megamind-500 bg-white"
                            />
                            {studentVal && (
                              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 shrink-0">
                                <CheckCircle className="w-3.5 h-3.5" /> Saved
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Passage Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={activePassageIndex === 0}
                onClick={() => setActivePassageIndex((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Passage
              </button>

              <button
                type="button"
                disabled={activePassageIndex === passages.length - 1}
                onClick={() => setActivePassageIndex((p) => Math.min(passages.length - 1, p + 1))}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                Next Passage
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
