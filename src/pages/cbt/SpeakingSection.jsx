import React, { useState } from 'react';
import AudioRecorder from '../../components/common/AudioRecorder';
import { Mic, CheckCircle, Sparkles, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SpeakingSection({
  section,
  onAudioUpload,
  isSubmitted = false
}) {
  const [activePart, setActivePart] = useState(1);

  const speakingTasks = section.speakingTasks || [];
  const currentTask = speakingTasks.find((t) => t.part_number === activePart) || speakingTasks[0];

  const cueCardPoints = currentTask?.cue_card_points || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 pb-16 w-full">
        
        {/* Part Tabs */}
        <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl shadow-xs flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {[1, 2, 3].map((partNum) => (
              <button
                key={partNum}
                type="button"
                onClick={() => setActivePart(partNum)}
                className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                  activePart === partNum
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Speaking Part {partNum}</span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {activePart === 1 && 'Part 1: Introduction & Everyday Topics (4–5 mins)'}
            {activePart === 2 && 'Part 2: Individual Long Turn Cue Card (3–4 mins)'}
            {activePart === 3 && 'Part 3: Two-Way Abstract Discussion (4–5 mins)'}
          </span>
        </div>

        {/* Part Prompt Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-megamind-600 tracking-wide uppercase">
              Speaking Task Part {activePart}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Evaluator: Pending Submission
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {currentTask?.title || `Speaking Part ${activePart}`}
          </h2>

          <div className="text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
            {currentTask?.prompt}
          </div>

          {/* Cue Card Points for Part 2 */}
          {activePart === 2 && cueCardPoints.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Cue Card Topics to Cover:
              </h4>
              <ul className="list-disc list-inside text-xs text-amber-950 space-y-1">
                {cueCardPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Part 1 / Part 3 Question Points */}
          {(activePart === 1 || activePart === 3) && cueCardPoints.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Examiner Questions:
              </h4>
              <div className="space-y-2">
                {cueCardPoints.map((qText, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{qText}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Web Audio Recorder Component */}
        <AudioRecorder
          partNumber={activePart}
          prepTimeSeconds={activePart === 2 ? (currentTask?.prep_time_seconds || 60) : 0}
          speakTimeSeconds={currentTask?.speak_time_seconds || 120}
          onAudioRecorded={(base64) => onAudioUpload && onAudioUpload(activePart, base64)}
          isSubmitted={isSubmitted}
        />

        {/* Navigation buttons between parts */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={activePart === 1}
            onClick={() => setActivePart((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Speaking Part
          </button>

          <button
            type="button"
            disabled={activePart === 3}
            onClick={() => setActivePart((p) => Math.min(3, p + 1))}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            Next Speaking Part
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
