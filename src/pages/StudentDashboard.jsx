import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getStudentStats();
        setStats(data?.stats ? {
          targetBand: user?.targetBand || user?.target_band || 7.5,
          averageBand: data.stats.avg_overall || 0,
          bestScore: data.stats.highest_band || 0,
          latestScore: data.recent_attempts?.[0]?.overall_band || 0,
          testsCompleted: data.stats.total_attempts || 0,
          skillBands: {
            listening: data.stats.avg_listening || 0,
            reading: data.stats.avg_reading || 0,
            writing: data.stats.avg_writing || 0,
            speaking: data.stats.avg_speaking || 0
          },
          recentAttempts: data.recent_attempts || [],
          trendData: (data.recent_attempts || []).map((att, idx) => ({
            attemptIndex: idx + 1,
            date: new Date(att.started_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            score: att.overall_band || 0
          })).reverse()
        } : data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  const studentName = user?.fullName || user?.full_name || 'Student';
  const targetBand = stats?.targetBand || user?.targetBand || user?.target_band || 7.5;
  const testsCompleted = stats?.testsCompleted || 0;
  const averageBand = testsCompleted > 0 ? (stats?.averageBand || 0) : 0;
  const bestScore = testsCompleted > 0 ? (stats?.bestScore || 0) : 0;
  const latestScore = testsCompleted > 0 ? (stats?.latestScore || 0) : 0;
  const skillBands = stats?.skillBands || { listening: 0, reading: 0, writing: 0, speaking: 0 };
  const recentAttempts = stats?.recentAttempts || [];
  const trendData = stats?.trendData || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-xl">
            <span className="bg-megamind-500/20 text-megamind-300 text-xs font-bold px-3 py-1 rounded-full border border-megamind-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Realistic IELTS CBT Environment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Welcome back, {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your preparation journey is on track for <strong>Band {targetBand.toFixed(1)}</strong>. Practice with timed CBT simulations, analyse your weaknesses, and elevate your performance.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <Link
              to="/test-library"
              className="px-5 py-3 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Take Full Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 w-64 h-64 bg-megamind-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 5 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Target Band
            </span>
            <div className="text-2xl font-black text-megamind-600 font-display mt-1">
              {targetBand.toFixed(1)}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Goal Score</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Average Band
            </span>
            <div className="text-2xl font-black text-slate-900 font-display mt-1">
              {testsCompleted > 0 ? averageBand.toFixed(1) : '—'}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {testsCompleted > 0 ? (averageBand >= targetBand ? 'Target Achieved' : `${(targetBand - averageBand).toFixed(1)} to target`) : 'No attempts yet'}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tests Completed
            </span>
            <div className="text-2xl font-black text-slate-900 font-display mt-1">
              {testsCompleted}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Attempts Recorded</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Best Score
            </span>
            <div className="text-2xl font-black text-emerald-600 font-display mt-1">
              {testsCompleted > 0 ? bestScore.toFixed(1) : '—'}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Highest Attempt</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Latest Test
            </span>
            <div className="text-2xl font-black text-slate-900 font-display mt-1">
              {testsCompleted > 0 ? latestScore.toFixed(1) : '—'}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Most Recent</span>
          </div>

        </div>

        {/* 4 Skill Cards Grid */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-megamind-500" />
              Skill Performance Overview
            </h2>
            <Link to="/test-library" className="text-xs text-megamind-600 hover:underline font-semibold">
              Practice by Skill →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Listening */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {testsCompleted > 0 && skillBands.listening > 0 ? skillBands.listening.toFixed(1) : '—'}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Listening</h3>
                <p className="text-[11px] text-slate-500">4 Parts • 40 Questions</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(skillBands.listening / 9.0) * 100}%` }}
                />
              </div>
            </div>

            {/* Reading */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {testsCompleted > 0 && skillBands.reading > 0 ? skillBands.reading.toFixed(1) : '—'}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Reading</h3>
                <p className="text-[11px] text-slate-500">3 Passages • 40 Questions</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${(skillBands.reading / 9.0) * 100}%` }}
                />
              </div>
            </div>

            {/* Writing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {testsCompleted > 0 && skillBands.writing > 0 ? skillBands.writing.toFixed(1) : '—'}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Writing</h3>
                <p className="text-[11px] text-slate-500">Task 1 & Task 2</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(skillBands.writing / 9.0) * 100}%` }}
                />
              </div>
            </div>

            {/* Speaking */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-purple-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  {testsCompleted > 0 && skillBands.speaking > 0 ? skillBands.speaking.toFixed(1) : '—'}
                </span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Speaking</h3>
                <p className="text-[11px] text-slate-500">Part 1, 2, 3 Simulation</p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${(skillBands.speaking / 9.0) * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Performance Progress & Trend Visualization */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-megamind-500" />
                Band Score Progression Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Track your previous scores against your Target Band {targetBand.toFixed(1)}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-megamind-500" /> Achieved Band
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-1 bg-slate-400 border-dashed" /> Target Line ({targetBand.toFixed(1)})
              </span>
            </div>
          </div>

          {/* SVG Progress Curve Chart */}
          <div className="w-full h-48 bg-slate-50 rounded-xl border border-slate-200 p-4 relative flex items-center justify-center">
            {/* Horizontal Grid lines for Band 5, 6, 7, 8, 9 */}
            {[5, 6, 7, 8, 9].map((band) => (
              <div
                key={band}
                className="absolute left-0 right-0 border-b border-slate-200/80 flex items-center px-2 pointer-events-none"
                style={{ bottom: `${((band - 4) / 5) * 100}%` }}
              >
                <span className="text-[10px] text-slate-400 font-mono">Band {band}.0</span>
              </div>
            ))}

            {/* Target Line */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-megamind-400/60 pointer-events-none z-10"
              style={{ bottom: `${((targetBand - 4) / 5) * 100}%` }}
            />

            {/* Bars / Points representing real attempts */}
            {trendData.length === 0 ? (
              <div className="text-center text-xs text-slate-400 z-20 py-8">
                No attempt data yet. Complete your first mock test to track your score trajectory!
              </div>
            ) : (
              <div className="flex items-end justify-around w-full h-full z-20 pt-6">
                {trendData.map((pt, idx) => {
                  const heightPercent = Math.max(10, Math.min(100, ((pt.score - 4) / 5) * 100));

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        Band {pt.score.toFixed(1)}
                      </div>
                      <div
                        className="w-10 sm:w-14 bg-gradient-to-t from-megamind-600 to-megamind-400 rounded-t-lg shadow-sm group-hover:brightness-110 transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-600">
                        {pt.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Continue Practice / Recently Attempted Tests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-megamind-500" />
              Continue Practice & Recent Attempts
            </h3>
            <Link to="/history" className="text-xs text-megamind-600 hover:underline font-semibold">
              View All History →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAttempts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent attempts. Explore the Test Library to take your first mock examination.
              </div>
            ) : (
              recentAttempts.map((att) => (
                <div key={att.id} className="py-3.5 flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-megamind-600 uppercase bg-megamind-50 px-2 py-0.5 rounded border border-megamind-100">
                        {att.test_type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{att.test_title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Attempted on {new Date(att.started_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Score
                      </span>
                      <span className="text-base font-black text-slate-900">
                        Band {att.overall_band ? att.overall_band.toFixed(1) : '—'}
                      </span>
                    </div>

                    <Link
                      to={`/results/${att.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <span>View Result</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
