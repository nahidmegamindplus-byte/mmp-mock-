import React, { useState } from 'react';
import AudioPlayer from '../../components/common/AudioPlayer';
import QuestionPalette from '../../components/common/QuestionPalette';
import { Headphones, CheckCircle, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ListeningSection({
  section,
  answers = {},
  flags = [],
  currentQuestion = 1,
  onAnswerChange,
  onSelectQuestion,
  onNext,
  onPrev
}) {
  const [activePart, setActivePart] = useState(1);

  const audioFiles = section.audioFiles || [];
  const questions = section.questions || [];

  // Group questions by Part Number (1, 2, 3, 4)
  const partQuestions = questions.filter((q) => (q.part_number || 1) === activePart);
  const currentAudio = audioFiles.find((a) => a.part_number === activePart) || audioFiles[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      
      {/* Audio Bar & Part Selector */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Part Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {[1, 2, 3, 4].map((partNum) => {
              const countInPart = questions.filter((q) => (q.part_number || 1) === partNum).length;
              const answeredInPart = questions.filter(
                (q) => (q.part_number || 1) === partNum && answers[q.id]
              ).length;

              return (
                <button
                  key={partNum}
                  type="button"
                  onClick={() => setActivePart(partNum)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activePart === partNum
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>Part {partNum}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activePart === partNum
                        ? 'bg-megamind-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {answeredInPart}/{countInPart || 10}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Listen to the audio and answer Questions {((activePart - 1) * 10) + 1}–{activePart * 10}
          </span>
        </div>

        {/* Playable Audio Track */}
        <AudioPlayer
          audioSrc={currentAudio?.audio_data || currentAudio?.file_url}
          transcript={currentAudio?.transcript}
          partTitle={`Part ${activePart}: ${currentAudio?.title || 'Listening Audio Track'}`}
          isExam={true}
        />
      </div>

      {/* Main Content Area: Questions & Palette */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Part Intro Header */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-megamind-500" />
              Part {activePart} Questions (
              {((activePart - 1) * 10) + 1}–{activePart * 10})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete the questions below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER or choose the best option.
            </p>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {partQuestions.map((q) => {
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

                      {/* Multiple Choice Options */}
                      {q.options && Array.isArray(q.options) && q.options.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = studentVal === opt;
                            const optionLetter = String.fromCharCode(65 + optIdx);

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => onAnswerChange(q.id, opt)}
                                className={`text-left px-3.5 py-2.5 rounded-lg border text-xs font-medium flex items-center gap-3 transition-all ${
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
                            placeholder="Type your answer..."
                            className="w-full sm:max-w-md px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:ring-1 focus:ring-megamind-500 bg-white"
                          />
                          {studentVal && (
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
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

          {/* Bottom Navigation between Parts */}
          <div className="flex items-center justify-between pt-4 pb-12">
            <button
              type="button"
              disabled={activePart === 1}
              onClick={() => setActivePart((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous Part
            </button>

            <button
              type="button"
              disabled={activePart === 4}
              onClick={() => setActivePart((p) => Math.min(4, p + 1))}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              Next Part
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
