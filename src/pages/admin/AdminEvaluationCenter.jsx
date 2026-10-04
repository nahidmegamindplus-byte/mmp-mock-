import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import {
  UserCheck,
  PenTool,
  Mic,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Send,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AdminEvaluationCenter() {
  const [loading, setLoading] = useState(true);
  const [pendingList, setPendingList] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);

  // Rubric Scores State
  // Writing
  const [wCriterion1, setWCriterion1] = useState(6.5); // Task Achievement
  const [wCriterion2, setWCriterion2] = useState(6.5); // Coherence & Cohesion
  const [wCriterion3, setWCriterion3] = useState(6.5); // Lexical Resource
  const [wCriterion4, setWCriterion4] = useState(6.5); // Grammatical Range
  const [wFeedback, setWFeedback] = useState('');

  // Speaking
  const [sCriterion1, setSCriterion1] = useState(6.5); // Fluency & Coherence
  const [sCriterion2, setSCriterion2] = useState(6.5); // Lexical Resource
  const [sCriterion3, setSCriterion3] = useState(6.5); // Grammatical Range
  const [sCriterion4, setSCriterion4] = useState(6.5); // Pronunciation
  const [sFeedback, setSFeedback] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      const res = await api.getPendingEvaluations();
      setPendingList(res.pendingList || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleOpenEvaluation = (att) => {
    setSelectedAttempt(att);
    // Preset default band to current estimate or 6.5
    const initW = att.writing_band || 6.5;
    setWCriterion1(initW);
    setWCriterion2(initW);
    setWCriterion3(initW);
    setWCriterion4(initW);
    setWFeedback('Good task response and paragraph structure. Continue refining complex grammatical range and lexical precision.');

    const initS = att.speaking_band || 6.5;
    setSCriterion1(initS);
    setSCriterion2(initS);
    setSCriterion3(initS);
    setSCriterion4(initS);
    setSFeedback('Clear pronunciation and consistent fluency throughout all three speaking parts.');

    setEvalModalOpen(true);
  };

  const calculateWritingBand = () => {
    const avg = (wCriterion1 + wCriterion2 + wCriterion3 + wCriterion4) / 4;
    return Math.round(avg * 2) / 2; // round to nearest half band
  };

  const calculateSpeakingBand = () => {
    const avg = (sCriterion1 + sCriterion2 + sCriterion3 + sCriterion4) / 4;
    return Math.round(avg * 2) / 2; // round to nearest half band
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!selectedAttempt) return;

    try {
      setSubmitting(true);
      const wBand = calculateWritingBand();
      const sBand = calculateSpeakingBand();

      await api.submitEvaluation({
        attemptId: selectedAttempt.attempt_id,
        writingEvaluation: {
          c1: wCriterion1,
          c2: wCriterion2,
          c3: wCriterion3,
          c4: wCriterion4,
          band: wBand,
          feedback: wFeedback
        },
        speakingEvaluation: {
          c1: sCriterion1,
          c2: sCriterion2,
          c3: sCriterion3,
          c4: sCriterion4,
          band: sBand,
          feedback: sFeedback
        }
      });

      setSubmitting(false);
      setEvalModalOpen(false);
      loadPending();
    } catch (err) {
      alert(err.message || 'Failed to submit evaluations.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            Examiner Grading Center
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-megamind-400" />
            Writing & Speaking Evaluation Queue
          </h1>
          <p className="text-xs text-slate-400">
            Review student essay submissions and speaking recordings against standard IELTS 4-criteria rubrics.
          </p>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/50">
                <th className="p-4 font-bold">Student</th>
                <th className="p-4 font-bold">Test Name</th>
                <th className="p-4 font-bold">Submission Date</th>
                <th className="p-4 font-bold">L / R Bands</th>
                <th className="p-4 font-bold">Submitted Tasks</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading pending evaluation queue...
                  </td>
                </tr>
              ) : pendingList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    All submissions have been evaluated! No pending submissions in the queue.
                  </td>
                </tr>
              ) : (
                pendingList.map((item) => (
                  <tr key={item.attempt_id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">
                      <div>{item.student_name}</div>
                      <span className="text-[10px] text-slate-500">{item.student_email}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-300 max-w-xs truncate">{item.test_title}</td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-[11px]">
                      L: {item.listening_band || '—'} • R: {item.reading_band || '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          Writing (Task 1 & 2)
                        </span>
                        <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          Speaking
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEvaluation(item)}
                        className="px-4 py-2 bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Evaluate Submission
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Rubrics Modal */}
      <Modal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        title={`IELTS Rubric Evaluation: ${selectedAttempt?.student_name}`}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmitEvaluation} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
          
          {/* 1. WRITING EVALUATION SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-megamind-500" />
                Writing Assessment & Rubric Scoring
              </h3>
              <span className="text-xs font-black text-megamind-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-display">
                Calculated Band: {calculateWritingBand().toFixed(1)}
              </span>
            </div>

            {/* Student Essay Viewer */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Writing Task 1 Response ({selectedAttempt?.writing_task1_text ? selectedAttempt.writing_task1_text.trim().split(/\s+/).filter(Boolean).length : 0} words)
                </span>
                <p className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {selectedAttempt?.writing_task1_text || '(No Task 1 response submitted)'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  Writing Task 2 Response ({selectedAttempt?.writing_task2_text ? selectedAttempt.writing_task2_text.trim().split(/\s+/).filter(Boolean).length : 0} words)
                </span>
                <p className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selectedAttempt?.writing_task2_text || '(No Task 2 response submitted)'}
                </p>
              </div>
            </div>

            {/* 4 Writing Criteria Rubrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Task Achievement</label>
                <select
                  value={wCriterion1}
                  onChange={(e) => setWCriterion1(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Coherence & Cohesion</label>
                <select
                  value={wCriterion2}
                  onChange={(e) => setWCriterion2(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Lexical Resource</label>
                <select
                  value={wCriterion3}
                  onChange={(e) => setWCriterion3(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Grammatical Range</label>
                <select
                  value={wCriterion4}
                  onChange={(e) => setWCriterion4(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Writing Examiner Feedback</label>
              <textarea
                rows={2}
                value={wFeedback}
                onChange={(e) => setWFeedback(e.target.value)}
                placeholder="Specific qualitative feedback on strengths and improvement areas..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* 2. SPEAKING EVALUATION SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-megamind-500" />
                Speaking Assessment & Rubric Scoring
              </h3>
              <span className="text-xs font-black text-megamind-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-display">
                Calculated Band: {calculateSpeakingBand().toFixed(1)}
              </span>
            </div>

            {/* Audio Responses */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((part) => (
                <div key={part} className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Part {part} Recording</span>
                  <div className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Review
                  </div>
                </div>
              ))}
            </div>

            {/* 4 Speaking Criteria Rubrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Fluency & Coherence</label>
                <select
                  value={sCriterion1}
                  onChange={(e) => setSCriterion1(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Lexical Resource</label>
                <select
                  value={sCriterion2}
                  onChange={(e) => setSCriterion2(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Grammatical Range</label>
                <select
                  value={sCriterion3}
                  onChange={(e) => setSCriterion3(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pronunciation</label>
                <select
                  value={sCriterion4}
                  onChange={(e) => setSCriterion4(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none"
                >
                  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Speaking Examiner Feedback</label>
              <textarea
                rows={2}
                value={sFeedback}
                onChange={(e) => setSFeedback(e.target.value)}
                placeholder="Specific qualitative feedback on pronunciation, intonation, and fluency..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setEvalModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Publishing Results...' : 'Publish Official Band Scores'}</span>
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
