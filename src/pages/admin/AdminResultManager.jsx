import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { Award, Search, Filter, Edit, ExternalLink, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function AdminResultManager() {
  const [searchParams] = useSearchParams();
  const filterStudentId = searchParams.get('studentId') || '';

  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTestFilter, setSelectedTestFilter] = useState('all');
  const [minBandFilter, setMinBandFilter] = useState('');

  // Override Modal
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [ovListening, setOvListening] = useState(7.0);
  const [ovReading, setOvReading] = useState(7.0);
  const [ovWriting, setOvWriting] = useState(6.5);
  const [ovSpeaking, setOvSpeaking] = useState(6.5);
  const [ovOverall, setOvOverall] = useState(7.0);

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    loadAttempts();
  }, [selectedTestFilter, minBandFilter, filterStudentId]);

  const loadTests = async () => {
    try {
      const res = await api.getAdminTests();
      setTests(res.tests || []);
    } catch (e) {}
  };

  const loadAttempts = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAttempts({
        testId: selectedTestFilter,
        studentId: filterStudentId || undefined,
        minBand: minBandFilter || undefined
      });
      setAttempts(res.attempts || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleOpenOverride = (att) => {
    setSelectedAttempt(att);
    setOvListening(att.listening_band || 7.0);
    setOvReading(att.reading_band || 7.0);
    setOvWriting(att.writing_band || 6.5);
    setOvSpeaking(att.speaking_band || 6.5);
    setOvOverall(att.overall_band || 7.0);
    setOverrideModalOpen(true);
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    if (!selectedAttempt) return;
    try {
      await api.overrideScores(selectedAttempt.id, {
        listeningBand: ovListening,
        readingBand: ovReading,
        writingBand: ovWriting,
        speakingBand: ovSpeaking,
        overallBand: ovOverall
      });
      setOverrideModalOpen(false);
      loadAttempts();
    } catch (err) {
      alert(err.message || 'Failed to update scores.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            Score Archives
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Award className="w-6 h-6 text-megamind-400" />
            Results & Score Management
          </h1>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Filter Test:</span>
          <select
            value={selectedTestFilter}
            onChange={(e) => setSelectedTestFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-megamind-500 focus:outline-none"
          >
            <option value="all">All Tests</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">Min Overall Band:</span>
          <select
            value={minBandFilter}
            onChange={(e) => setMinBandFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-megamind-500 focus:outline-none"
          >
            <option value="">Any Band</option>
            <option value="6.0">Band 6.0+</option>
            <option value="6.5">Band 6.5+</option>
            <option value="7.0">Band 7.0+</option>
            <option value="7.5">Band 7.5+</option>
            <option value="8.0">Band 8.0+</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/50">
                <th className="p-4 font-bold">Student</th>
                <th className="p-4 font-bold">Test Name</th>
                <th className="p-4 font-bold">Overall</th>
                <th className="p-4 font-bold">L / R / W / S</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading results...
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No results found for the selected filter.
                  </td>
                </tr>
              ) : (
                attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">
                      <div>{att.student_name}</div>
                      <span className="text-[10px] text-slate-500 font-normal">{att.student_email}</span>
                    </td>
                    <td className="p-4 max-w-xs truncate font-medium text-slate-300">{att.test_title}</td>
                    <td className="p-4">
                      <span className="text-base font-black text-megamind-400 font-display">
                        {att.overall_band ? att.overall_band.toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">
                      {att.listening_band || '—'} / {att.reading_band || '—'} / {att.writing_band || '—'} / {att.speaking_band || '—'}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(att.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          att.evaluation_status === 'evaluated'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {att.evaluation_status === 'evaluated' ? 'Evaluated' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/results/${att.id}`}
                          title="View Result Summary"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenOverride(att)}
                          title="Override Scores"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5 text-megamind-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Modal */}
      <Modal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        title={`Adjust Scores: ${selectedAttempt?.student_name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveOverride} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listening Band</label>
              <input
                type="number"
                step="0.5"
                min="1.0"
                max="9.0"
                value={ovListening}
                onChange={(e) => setOvListening(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reading Band</label>
              <input
                type="number"
                step="0.5"
                min="1.0"
                max="9.0"
                value={ovReading}
                onChange={(e) => setOvReading(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Writing Band</label>
              <input
                type="number"
                step="0.5"
                min="1.0"
                max="9.0"
                value={ovWriting}
                onChange={(e) => setOvWriting(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Speaking Band</label>
              <input
                type="number"
                step="0.5"
                min="1.0"
                max="9.0"
                value={ovSpeaking}
                onChange={(e) => setOvSpeaking(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Overall Band Score</label>
            <input
              type="number"
              step="0.5"
              min="1.0"
              max="9.0"
              value={ovOverall}
              onChange={(e) => setOvOverall(parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none font-black text-megamind-600 font-display"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setOverrideModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs"
            >
              Save Overrides
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
