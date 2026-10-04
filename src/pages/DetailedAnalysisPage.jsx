import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flag,
  Filter,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  ChevronDown
} from 'lucide-react';

export default function DetailedAnalysisPage() {
  const { attemptId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unanswered' | 'flagged'
  const [activeSectionFilter, setActiveSectionFilter] = useState('all'); // 'all' | 'listening' | 'reading'

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        const res = await api.getAnalysis(attemptId);
        setAnalysisData(res);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err.message || 'Failed to retrieve detailed performance analysis.');
        setLoading(false);
      }
    }

    loadAnalysis();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Generating question-by-question analysis & recommendations...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-megamind-500" />
          <h2 className="text-lg font-bold text-slate-900">Analysis Not Available</h2>
          <p className="text-xs text-slate-600 max-w-md">{error}</p>
          <Link
            to="/history"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Back to Test History
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const questions = analysisData.questions || [];

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (activeSectionFilter !== 'all' && q.sectionType !== activeSectionFilter) {
      return false;
    }
    if (activeFilter === 'correct') return q.isCorrect;
    if (activeFilter === 'wrong') return !q.isCorrect && !q.isUnanswered;
    if (activeFilter === 'unanswered') return q.isUnanswered;
    if (activeFilter === 'flagged') return q.isFlagged;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Diagnostic Report
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              Detailed Question Analysis
            </h1>
            <p className="text-xs text-slate-500">
              {analysisData.testTitle} • Overall Band: <strong>{analysisData.overallBand.toFixed(1)}</strong>
            </p>
          </div>

          <Link
            to={`/results/${attemptId}`}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold shadow-xs"
          >
            Back to Result Summary
          </Link>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Demonstrated Strengths
            </h3>

            {analysisData.strengths && analysisData.strengths.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700">
                {analysisData.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{str.summary}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">Continue practicing to identify specific top strengths.</p>
            )}
          </div>

          {/* Areas to Improve */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Areas for Improvement
            </h3>

            {analysisData.weaknesses && analysisData.weaknesses.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-700">
                {analysisData.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    <XCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{weak.summary}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No significant low accuracy areas detected in this attempt!</p>
            )}
          </div>

        </div>

        {/* Recommended Practice Drills */}
        {analysisData.recommendations && analysisData.recommendations.length > 0 && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-card border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-megamind-400" />
              <h3 className="text-sm font-bold tracking-wide">Personalized Practice Plan</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {analysisData.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold text-megamind-400 uppercase tracking-wider">
                    {rec.skill} Drill
                  </span>
                  <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{rec.description}</p>
                  <Link
                    to="/test-library"
                    className="inline-flex items-center gap-1 text-xs text-megamind-300 hover:text-white font-semibold pt-1"
                  >
                    Start Skill Practice <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { key: 'all', label: `All (${questions.length})` },
              { key: 'correct', label: `Correct (${questions.filter((q) => q.isCorrect).length})` },
              { key: 'wrong', label: `Incorrect (${questions.filter((q) => !q.isCorrect && !q.isUnanswered).length})` },
              { key: 'unanswered', label: `Unanswered (${questions.filter((q) => q.isUnanswered).length})` }
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === f.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Section:</span>
            <select
              value={activeSectionFilter}
              onChange={(e) => setActiveSectionFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-megamind-500 focus:outline-none"
            >
              <option value="all">All Sections</option>
              <option value="listening">Listening Only</option>
              <option value="reading">Reading Only</option>
            </select>
          </div>

        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No questions found for the selected filter criteria.
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                  q.isCorrect
                    ? 'border-emerald-200'
                    : q.isUnanswered
                    ? 'border-slate-200 bg-slate-50/40'
                    : 'border-red-200'
                }`}
              >
                {/* Question Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        q.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.isUnanswered
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {q.questionNumber}
                    </span>

                    <span className="text-xs font-bold text-slate-700 capitalize">
                      {q.sectionType} • Part {q.partNumber}
                    </span>

                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                      {q.questionType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isFlagged && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold flex items-center gap-1">
                        <Flag className="w-3 h-3 text-amber-500" /> Flagged
                      </span>
                    )}

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                        q.isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : q.isUnanswered
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {q.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1 Mark)
                        </>
                      ) : q.isUnanswered ? (
                        <>
                          <HelpCircle className="w-3.5 h-3.5" /> Unanswered (0)
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="py-3 space-y-2">
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Student Answer vs Correct Answer Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                      <span className="text-slate-500 block font-medium">Your Answer:</span>
                      <strong className={q.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                        {q.studentAnswer || '(No answer provided)'}
                      </strong>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-xs space-y-1">
                      <span className="text-emerald-800 block font-medium">Acceptable Correct Answer(s):</span>
                      <strong className="text-emerald-900 font-bold">
                        {q.correctAnswers.join('  /  ')}
                      </strong>
                    </div>
                  </div>

                  {/* Explanation Note */}
                  {q.explanation && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-xs text-slate-700 mt-2">
                      <strong className="text-blue-900 font-semibold block mb-0.5">Explanation:</strong>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
