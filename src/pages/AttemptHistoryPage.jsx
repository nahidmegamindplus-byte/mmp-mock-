import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  History,
  RotateCcw,
  BarChart2,
  FileCheck2,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function AttemptHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [filterTestType, setFilterTestType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await api.getHistory({
          testType: filterTestType,
          status: filterStatus
        });
        setAttempts(res.attempts || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setLoading(false);
      }
    }

    loadHistory();
  }, [filterTestType, filterStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Student Records
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <History className="w-6 h-6 text-megamind-500" />
              My Test Attempt History
            </h1>
            <p className="text-xs text-slate-500">
              Review your previous mock tests, track band progression, and retake tests.
            </p>
          </div>

          <Link
            to="/test-library"
            className="px-4 py-2 bg-megamind-500 hover:bg-megamind-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Take New Test
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            <select
              value={filterTestType}
              onChange={(e) => setFilterTestType(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-megamind-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="general">General Training</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-megamind-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Attempt Table / Cards */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading attempt records...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Mock Test Attempts Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't completed any IELTS mock tests under the selected filter yet.
            </p>
            <Link
              to="/test-library"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Start First Mock Test
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((att) => (
              <div
                key={att.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-megamind-600 bg-megamind-50 px-2 py-0.5 rounded border border-megamind-100 uppercase tracking-wide">
                      {att.test_type} • {att.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(att.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {att.test_title}
                  </h3>

                  {/* Skills Mini-scores */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span>L: <strong>{att.listening_band ? att.listening_band.toFixed(1) : '—'}</strong></span>
                    <span>R: <strong>{att.reading_band ? att.reading_band.toFixed(1) : '—'}</strong></span>
                    <span>W: <strong>{att.writing_band ? att.writing_band.toFixed(1) : '—'}</strong></span>
                    <span>S: <strong>{att.speaking_band ? att.speaking_band.toFixed(1) : '—'}</strong></span>
                  </div>
                </div>

                {/* Overall Band & Actions */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Overall Band
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-display">
                      {att.overall_band ? att.overall_band.toFixed(1) : '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/results/${att.id}`}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Result</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/analysis/${att.id}`}
                      title="View Question Analysis"
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <BarChart2 className="w-4 h-4 text-megamind-600" />
                    </Link>

                    <Link
                      to={`/exam/${att.test_id}/instructions`}
                      title="Retake This Test"
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
