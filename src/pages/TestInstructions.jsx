import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  ShieldCheck,
  Headphones,
  Mic,
  Wifi,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TestInstructions() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [audioTestPlaying, setAudioTestPlaying] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const res = await api.getTestDetail(testId);
        setTestData(res.test);
        setLoading(false);
      } catch (err) {
        console.error('Error loading test detail:', err);
        setLoading(false);
      }
    }

    loadDetail();
  }, [testId]);

  const playTestAudio = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);

      setAudioTestPlaying(true);
      setTimeout(() => setAudioTestPlaying(false), 800);
    } catch (e) {
      console.warn('Web Audio test chime failed:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-600 font-semibold">Preparing examination instructions...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-megamind-500" />
          <h2 className="text-lg font-bold text-slate-900">Test Not Found</h2>
          <Link to="/test-library" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold">
            Back to Test Library
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Top Instructions Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card space-y-6">
          
          <div className="space-y-2 pb-6 border-b border-slate-100 text-center sm:text-left">
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider bg-megamind-50 px-3 py-1 rounded-full border border-megamind-200 inline-block">
              Before You Begin
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {testData.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
              Please review the examination parameters and test your audio output before launching the computer-based test interface.
            </p>
          </div>

          {/* Test Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Test Type</span>
              <span className="text-sm font-bold text-slate-900 capitalize mt-0.5 block">{testData.test_type}</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
              <span className="text-sm font-bold text-slate-900 capitalize mt-0.5 block">
                {testData.category === 'full' ? 'Full 4-Skill Mock' : `${testData.category} Only`}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sections</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {testData.category === 'full' ? 'L • R • W • S' : testData.category.toUpperCase()}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Duration</span>
              <span className="text-sm font-bold text-megamind-600 mt-0.5 block">
                {testData.duration_minutes ? `${testData.duration_minutes} Minutes` : '2h 45m'}
              </span>
            </div>
          </div>

          {/* Pre-Exam Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              System & Readiness Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Wifi className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Stable Internet Connection</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Answers auto-save periodically to the cloud database.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Uninterrupted Time</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ensure you can complete the examination in one sitting.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Headphones className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Audio Headphones</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Listening audio recordings will play once only.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <Mic className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Microphone Access</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Required for the Speaking test recording simulator.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sound Output Test Bar */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-950">Audio Headphone Sound Check</p>
                <p className="text-[11px] text-blue-800">Click the button to test your sound output level.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={playTestAudio}
              className="px-4 py-2 rounded-xl bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs shadow-xs transition-colors flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{audioTestPlaying ? 'Playing Chime...' : 'Play Test Sound'}</span>
            </button>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-megamind-600 rounded border-slate-300 focus:ring-megamind-500"
              />
              <span className="text-xs font-medium text-slate-800 leading-relaxed select-none">
                I understand the examination instructions and confirm that my audio device is working properly. I am ready to begin the test in exam mode.
              </span>
            </label>
          </div>

          {/* Launch Exam Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4">
            <Link
              to="/test-library"
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel & Return
            </Link>

            <button
              type="button"
              disabled={!acknowledged}
              onClick={() => navigate(`/exam/${testData.id}`)}
              className="px-8 py-3 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-40 active:scale-95"
            >
              <span>Begin Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
