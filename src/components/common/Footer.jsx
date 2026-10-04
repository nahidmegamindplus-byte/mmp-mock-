import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Headphones, BookOpen, Clock, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-megamind-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Realistic Exam Timing</p>
              <p className="text-[11px] text-slate-400">Exact CBT timers & auto-submission</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-megamind-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">4-Skill Coverage</p>
              <p className="text-[11px] text-slate-400">Listening, Reading, Writing, Speaking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-megamind-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">IELTS Band Conversion</p>
              <p className="text-[11px] text-slate-400">Official standard 9.0 scale rules</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-megamind-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Instant Analytics</p>
              <p className="text-[11px] text-slate-400">Deep question-level diagnostics</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-10">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-megamind-500 flex items-center justify-center text-white font-bold text-base">
                M+
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                MEGAMIND PLUS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              MEGAMIND PLUS IELTS MOCK TEST provides realistic computer-based IELTS practice simulations. Practice under realistic exam conditions, analyse mistakes, and elevate your band score.
            </p>
            <p className="text-xs font-medium text-megamind-400 italic">
              “Practice Like the Real Test. Perform With Confidence.”
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Mock Tests</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/test-library?category=full" className="hover:text-white transition-colors">Full Academic Mock</Link></li>
              <li><Link to="/test-library?category=full&testType=general" className="hover:text-white transition-colors">General Training Mock</Link></li>
              <li><Link to="/test-library?category=listening" className="hover:text-white transition-colors">Listening Practice</Link></li>
              <li><Link to="/test-library?category=reading" className="hover:text-white transition-colors">Reading Split-View</Link></li>
              <li><Link to="/test-library?category=writing" className="hover:text-white transition-colors">Writing Task 1 & 2</Link></li>
              <li><Link to="/test-library?category=speaking" className="hover:text-white transition-colors">Speaking Simulator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Student Portal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Attempt History</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Target Score Planner</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support & Admin</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><span className="text-slate-500">portal.megamindplus.com</span></li>
              <li><span className="text-slate-500">support@megamindplus.com</span></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer and Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} MEGAMIND PLUS. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl text-[10px] text-slate-400 leading-normal">
            <strong>Disclaimer:</strong> Megamind Plus IELTS Mock Test is an independent educational practice platform designed for IELTS preparation. IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. This platform is not officially affiliated with or endorsed by the British Council, IDP, or Cambridge Assessment English.
          </p>
        </div>

      </div>
    </footer>
  );
}
