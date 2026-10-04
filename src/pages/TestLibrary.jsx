import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  Clock,
  Award,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function TestLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialTestType = searchParams.get('testType') || 'academic';

  const [testType, setTestType] = useState(initialTestType);
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const res = await api.getTests({
          testType,
          category,
          difficulty,
          search: searchQuery
        });
        setTests(res.tests || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setLoading(false);
      }
    }

    loadTests();
  }, [testType, category, difficulty, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Examination Repository
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              IELTS Mock Test Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select full mock tests or individual skill practice modules to simulate real computer-based examination conditions.
            </p>
          </div>

          {/* Academic vs General Training Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
            <button
              type="button"
              onClick={() => setTestType('academic')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                testType === 'academic'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Academic Stream
            </button>
            <button
              type="button"
              onClick={() => setTestType('general')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                testType === 'general'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              General Training
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {[
                { key: 'all', label: 'All Modules' },
                { key: 'full', label: 'Full 4-Skill Mock' },
                { key: 'listening', label: 'Listening' },
                { key: 'reading', label: 'Reading' },
                { key: 'writing', label: 'Writing' },
                { key: 'speaking', label: 'Speaking' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    category === c.key
                      ? 'bg-megamind-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Input & Difficulty */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search test topics..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                />
              </div>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:border-megamind-500 focus:outline-none shrink-0"
              >
                <option value="all">Difficulty: All</option>
                <option value="standard">Standard</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Challenging (8.0+)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Test Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading practice examinations...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Tests Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No practice tests match your current filter selection. Try selecting "All Modules" or resetting search.
            </p>
            <button
              onClick={() => {
                setCategory('all');
                setSearchQuery('');
                setDifficulty('all');
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              const isFullMock = test.category === 'full';
              const durationFormatted = isFullMock
                ? '2h 45m'
                : test.category === 'listening'
                ? '30 mins'
                : test.category === 'reading' || test.category === 'writing'
                ? '60 mins'
                : '15 mins';

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-megamind-600 bg-megamind-50 px-2 py-0.5 rounded border border-megamind-100 uppercase tracking-wide">
                          {test.test_type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wide">
                          {test.category === 'full' ? '4 Skills' : test.category}
                        </span>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 capitalize">
                        {test.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-megamind-600 transition-colors leading-snug">
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {test.description || 'Full computer-based IELTS examination simulation with timed sections, automatic scoring, and detailed analysis.'}
                    </p>

                    {/* Skill Icons for Full Mock */}
                    {isFullMock && (
                      <div className="flex items-center gap-2 pt-1 text-slate-400">
                        <span title="Listening" className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-blue-600"><Headphones className="w-3.5 h-3.5" /></span>
                        <span title="Reading" className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-emerald-600"><BookOpen className="w-3.5 h-3.5" /></span>
                        <span title="Writing" className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-amber-600"><PenTool className="w-3.5 h-3.5" /></span>
                        <span title="Speaking" className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-purple-600"><Mic className="w-3.5 h-3.5" /></span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Meta & Start Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{durationFormatted}</span>
                    </div>

                    <Link
                      to={`/exam/${test.id}/instructions`}
                      className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-megamind-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Start Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
