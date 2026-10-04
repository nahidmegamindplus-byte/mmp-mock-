import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  Sparkles,
  Award,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Play,
  Layers,
  Laptop,
  Check,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is the MEGAMIND PLUS IELTS Mock Test Platform?',
      a: 'MEGAMIND PLUS IELTS MOCK TEST is a specialized computer-based practice platform engineered to simulate authentic IELTS testing conditions. It provides timed Listening, Reading, Writing, and Speaking modules with automatic band conversion, text highlighters, question palettes, and deep performance analysis.'
    },
    {
      q: 'Is this an official IELTS test authorized by the British Council?',
      a: 'No. This is an independent practice simulation platform developed by Megamind Plus. It is not affiliated with or endorsed by the British Council, IDP Education, or Cambridge Assessment English. It is built strictly for student practice, skill diagnostics, and preparation.'
    },
    {
      q: 'What is the difference between Academic and General Training?',
      a: 'The Academic stream is tailored for university admissions and professional licensure, featuring complex academic texts and data report writing in Task 1. The General Training stream is designed for immigration and workplace purposes, featuring everyday community texts and letter writing in Task 1.'
    },
    {
      q: 'How long does a full mock test take?',
      a: 'A complete 4-skill mock test takes approximately 2 hours and 45 minutes: Listening (~30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (~15 minutes). You can also practice individual skills in isolated 15–60 minute sessions.'
    },
    {
      q: 'How is my IELTS Band Score calculated?',
      a: 'Listening and Reading raw scores (out of 40) are automatically mapped to official IELTS Band Scores (1.0–9.0) using standard conversion curves. The overall band score is calculated using standard IELTS rounding rules (where decimal averages ending in .25 or .75 round up to the nearest half or whole band).'
    },
    {
      q: 'How are Writing and Speaking sections evaluated?',
      a: 'Upon test submission, Writing responses (Task 1 & Task 2) and Speaking audio recordings are submitted to the Evaluator Queue. Expert IELTS teachers score each task according to the official 4-criteria rubrics (Task Achievement/Fluency, Coherence & Cohesion, Lexical Resource, and Grammatical Range/Pronunciation) and provide qualitative feedback notes.'
    },
    {
      q: 'Can I retake tests and review my previous attempts?',
      a: 'Yes. All completed attempts, answer selections, score breakdowns, and evaluator notes are permanently saved to your Student Dashboard. You can retake any mock test anytime to measure your score progress.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 space-y-16 sm:space-y-24">
        
        {/* ==================================================== */}
        {/* 1. HERO SECTION */}
        {/* ==================================================== */}
        <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-megamind-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Realistic Computer-Based IELTS Practice
              </span>
              <span className="text-[10px] bg-megamind-50 text-megamind-600 font-bold px-1.5 py-0.5 rounded">
                portal.megamindplus.com
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.15]">
                MEGAMIND PLUS <br className="hidden sm:inline" />
                <span className="text-megamind-500">IELTS MOCK TEST</span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
                “Practice. Analyse. Improve.”
              </p>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Practice with realistic IELTS-style Listening, Reading, Writing and Speaking tests, track your performance and understand exactly where you need to improve.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Mock Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/test-library"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Explore Tests</span>
              </Link>
            </div>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <Laptop className="w-4 h-4 text-megamind-500 shrink-0" />
                <span>Realistic CBT Experience</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-megamind-500 shrink-0" />
                <span>IELTS-style Questions</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <BarChart2 className="w-4 h-4 text-megamind-500 shrink-0" />
                <span>Instant Performance Analysis</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <TrendingUp className="w-4 h-4 text-megamind-500 shrink-0" />
                <span>Progress Tracking</span>
              </div>
            </div>

          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-megamind-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
        </section>

        {/* ==================================================== */}
        {/* 2. CBT INTERFACE SIMULATION SHOWCASE */}
        {/* ==================================================== */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Exam Mode Interface
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Feels Just Like the Real Examination
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clean, distraction-free computer-based test layout featuring authentic timers, passage split screen, highlighters, and live auto-saving.
            </p>
          </div>

          {/* Realistic CBT Mock Window */}
          <div className="bg-slate-900 rounded-2xl shadow-elevated border border-slate-800 overflow-hidden text-left">
            
            {/* Top Exam Mode Simulation Header */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MEGAMIND PLUS IELTS MOCK TEST</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded ml-2">
                  Academic Reading (Passage 1)
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-amber-300">
                <Clock className="w-4 h-4" />
                <span>58:42 Remaining</span>
              </div>
            </div>

            {/* Split Screen Simulator Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-100 min-h-[300px] text-xs text-slate-800">
              
              {/* Left Passage Pane */}
              <div className="p-6 bg-white border-r border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-megamind-600 uppercase">Passage 1</span>
                  <div className="flex gap-1 text-[10px]">
                    <span className="bg-yellow-200 text-slate-800 px-1.5 py-0.5 rounded">Highlighter Active</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-900">The Evolutionary History of Urban Apiculture</h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Urban beekeeping has transformed from an eccentric rooftop hobby into a cornerstone of contemporary metropolitan biodiversity strategy. Over the past two decades, major global cities including London, Paris, Melbourne, and Tokyo have witnessed an unprecedented resurgence in managed honeybee (<span className="bg-yellow-200 font-semibold px-1 rounded">Apis mellifera</span>) populations...
                </p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Ecological surveys reveal surprising advantages inherent to city environments with diverse botanical gardens and balconies...
                </p>
              </div>

              {/* Right Question Pane */}
              <div className="p-6 bg-slate-50 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Answer Saved</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Which paragraph discusses the unexpected botanical diversity of city environments compared to rural monocultures?
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 rounded border border-slate-200 bg-white font-medium text-[11px]">A) Paragraph A</div>
                    <div className="p-2 rounded border border-megamind-500 bg-megamind-50 text-megamind-900 font-bold text-[11px]">B) Paragraph B (Selected)</div>
                    <div className="p-2 rounded border border-slate-200 bg-white font-medium text-[11px]">C) Paragraph C</div>
                    <div className="p-2 rounded border border-slate-200 bg-white font-medium text-[11px]">D) Paragraph D</div>
                  </div>
                </div>

                {/* Bottom Navigation Mini Palette */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">Question Palette:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        className={`w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                          num === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                    <span className="text-slate-400 text-xs px-1">... 40</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3. FOUR SKILLS BREAKDOWN */}
        {/* ==================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Comprehensive Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Master All Four IELTS Components
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Complete simulations for Academic & General Training modules with official timing and question patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Listening */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card hover:border-blue-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Listening</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                4 Parts, 40 Questions. Practice note completion, form filling, multiple choice, and map labelling with authentic audio playback.
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> 30-minute exam timer</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Realistic accent audios</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Instant raw-to-band conversion</li>
              </ul>
            </div>

            {/* Reading */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card hover:border-emerald-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Reading</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                3 Passages, 40 Questions. Academic and General Training texts with interactive split-view and color highlighters.
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> True/False/Not Given & Yes/No</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Matching Headings & Information</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Summary & sentence completions</li>
              </ul>
            </div>

            {/* Writing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card hover:border-amber-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Writing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Task 1 (150 words) and Task 2 (250 words) with real-time word counting, char counting, and auto-save every 3 seconds.
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Task 1 & 2 tab switching</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Auto-save safeguards</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Teacher 4-criteria rubric review</li>
              </ul>
            </div>

            {/* Speaking */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-card hover:border-purple-300 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Speaking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full 3-part interactive Speaking simulation with 1-minute cue card preparation timer and voice response recording.
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> 1-min prep & 2-min speaking timer</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Voice recording & playback</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-500" /> Evaluator qualitative feedback</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ==================================================== */}
        {/* 4. HOW IT WORKS */}
        {/* ==================================================== */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
                Step-by-Step Methodology
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How Megamind Plus Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Four simple steps to elevate your IELTS preparation and build true examination confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3 relative">
                <span className="w-8 h-8 rounded-lg bg-megamind-500 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-white">Select Mock Test</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Choose a Full 4-Skill Mock or drill a specific skill (Listening, Reading, Writing, Speaking).
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3 relative">
                <span className="w-8 h-8 rounded-lg bg-megamind-500 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-white">Take Timed CBT Exam</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Experience realistic computer-based test interface with strict timers and instant auto-save.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3 relative">
                <span className="w-8 h-8 rounded-lg bg-megamind-500 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-white">Instant Objective Score</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Receive instant Listening & Reading IELTS Band calculation and accuracy statistics.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3 relative">
                <span className="w-8 h-8 rounded-lg bg-megamind-500 text-white font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold text-white">Detailed Analysis & Review</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inspect question explanations, identify weak question types, and receive teacher evaluation notes.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ==================================================== */}
        {/* 5. FAQ SECTION */}
        {/* ==================================================== */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
              Transparency & FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding mock testing, band score calculations, and platform operation.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================== */}
        {/* 6. CALL TO ACTION BANNER */}
        {/* ==================================================== */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-gradient-to-br from-megamind-600 to-megamind-800 text-white rounded-3xl p-8 sm:p-12 shadow-elevated text-center space-y-6 relative overflow-hidden">
            
            <div className="space-y-3 max-w-2xl mx-auto relative z-10">
              <span className="bg-white/20 text-white text-xs font-bold px-3.5 py-1 rounded-full inline-block backdrop-blur-xs">
                Ready to Test Your IELTS Level?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                Start Your Computer-Based IELTS Mock Test Now
              </h2>
              <p className="text-xs sm:text-sm text-megamind-100 leading-relaxed">
                Join thousands of test-takers who practice with MEGAMIND PLUS to achieve their target band scores.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-megamind-600 hover:bg-slate-100 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-megamind-500" />
                <span>Create Free Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
