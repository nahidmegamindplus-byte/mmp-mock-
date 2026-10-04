import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
  BarChart2,
  FileCheck,
  UserCheck,
  Sparkles,
  BookOpen,
  Headphones,
  PenTool,
  Mic
} from 'lucide-react';

export default function TestResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    async function loadResult() {
      try {
        setLoading(true);
        const res = await api.getResult(attemptId);
        setResultData(res.attempt);
        setLoading(false);

        // Trigger celebratory confetti for good band scores
        if ((res.attempt.overallBand || 0) >= 6.5) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError(err.message || 'Failed to load test results.');
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Generating official band score analytics...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <XCircle className="w-12 h-12 text-megamind-500" />
          <h2 className="text-lg font-bold text-slate-900">Result Not Found</h2>
          <p className="text-xs text-slate-600 max-w-md">{error}</p>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Return to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const targetBand = resultData.targetBand || 7.5;
  const overallBand = resultData.overallBand || 6.5;
  const targetGap = Math.round((overallBand - targetBand) * 10) / 10;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Top Banner Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-megamind-50 rounded-full -mr-16 -mt-16 pointer-events-none" />

          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider bg-megamind-50 px-2.5 py-1 rounded-full border border-megamind-200">
              Mock Test Result
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resultData.testTitle}
            </h1>
            <p className="text-xs text-slate-500 capitalize">
              Student: <strong>{resultData.studentName}</strong> • {resultData.testType} • Completed on{' '}
              {new Date(resultData.endTime || resultData.startTime).toLocaleDateString()}
            </p>
          </div>

          {/* Overall Band Badge */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 text-center shadow-elevated min-w-[200px] border border-slate-800 z-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Overall Band Score
            </span>
            <div className="text-5xl font-black text-megamind-400 font-display mt-1">
              {overallBand.toFixed(1)}
            </div>
            <span className="text-[11px] font-medium text-slate-300 mt-1 block">
              Scale 1.0 – 9.0 (IELTS Standard)
            </span>
          </div>
        </div>

        {/* 4 Skill Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Listening Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-600">Listening</p>
            <div className="text-2xl font-extrabold text-slate-900">
              {resultData.listeningBand ? resultData.listeningBand.toFixed(1) : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">
              Raw: {resultData.listeningRaw || 0}/40
            </span>
          </div>

          {/* Reading Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-600">Reading</p>
            <div className="text-2xl font-extrabold text-slate-900">
              {resultData.readingBand ? resultData.readingBand.toFixed(1) : '—'}
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">
              Raw: {resultData.readingRaw || 0}/40
            </span>
          </div>

          {/* Writing Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-600">Writing</p>
            <div className="text-2xl font-extrabold text-slate-900">
              {resultData.writingBand ? resultData.writingBand.toFixed(1) : '—'}
            </div>
            <span className="text-[10px] text-slate-500 block font-medium">
              {resultData.evaluationStatus === 'evaluated' ? 'Evaluated' : 'Pending Review'}
            </span>
          </div>

          {/* Speaking Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-600">Speaking</p>
            <div className="text-2xl font-extrabold text-slate-900">
              {resultData.speakingBand ? resultData.speakingBand.toFixed(1) : '—'}
            </div>
            <span className="text-[10px] text-slate-500 block font-medium">
              {resultData.evaluationStatus === 'evaluated' ? 'Evaluated' : 'Pending Review'}
            </span>
          </div>

        </div>

        {/* Target Gap & Accuracy Diagnostics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Target Score Gap */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-megamind-500" />
                Target Band Benchmark
              </h3>
              <span className="text-xs font-bold text-slate-800">Target {targetBand.toFixed(1)}</span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Achieved Score:</span>
                <strong className="text-slate-900 font-bold">{overallBand.toFixed(1)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Gap to Target:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-xs ${
                    targetGap >= 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {targetGap >= 0 ? `+${targetGap.toFixed(1)} (Achieved!)` : `${targetGap.toFixed(1)} to target`}
                </span>
              </div>
            </div>
          </div>

          {/* Objective Question Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-megamind-500" />
              Objective Question Breakdown (Listening & Reading)
            </h3>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-center">
                <p className="text-xs text-emerald-800 font-medium">Correct</p>
                <p className="text-xl font-black text-emerald-700 mt-0.5">{resultData.correctCount || 0}</p>
              </div>

              <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-xs text-red-800 font-medium">Incorrect</p>
                <p className="text-xl font-black text-red-700 mt-0.5">{resultData.wrongCount || 0}</p>
              </div>

              <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 font-medium">Unanswered</p>
                <p className="text-xl font-black text-slate-700 mt-0.5">{resultData.unansweredCount || 0}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Teacher Evaluation & Feedback (if available) */}
        {resultData.evaluations && resultData.evaluations.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-megamind-500" />
              Teacher & Evaluator Feedback
            </h3>

            <div className="space-y-4">
              {resultData.evaluations.map((evalItem) => (
                <div key={evalItem.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-megamind-600 uppercase tracking-wide">
                      {evalItem.section_type} Evaluation • Band {evalItem.final_band.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Evaluator: <strong>{evalItem.evaluator_name}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                    "{evalItem.feedback}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            to={`/analysis/${attemptId}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-megamind-400" />
            <span>View Detailed Question Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={`/exam/${resultData.testId}/instructions`}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Test
            </Link>

            <Link
              to="/dashboard"
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              My Dashboard
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
