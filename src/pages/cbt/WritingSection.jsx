import React, { useState, useEffect } from 'react';
import { PenTool, CheckCircle2, Clock, AlertCircle, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';

export default function WritingSection({
  section,
  writingTask1Text = '',
  writingTask2Text = '',
  onWritingChange,
  isSubmitted = false
}) {
  const [activeTask, setActiveTask] = useState(1);
  const [lastSavedTime, setLastSavedTime] = useState(new Date().toLocaleTimeString());

  const writingTasks = section.writingTasks || [];
  const currentTaskData = writingTasks.find((t) => t.task_number === activeTask) || writingTasks[0];

  const currentText = activeTask === 1 ? writingTask1Text : writingTask2Text;

  // Word & Character count calculation
  const countWords = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(currentText);
  const charCount = (currentText || '').length;

  const minWords = currentTaskData?.min_words || (activeTask === 1 ? 150 : 250);
  const isMinimumReached = wordCount >= minWords;

  const handleTextChange = (e) => {
    const val = e.target.value;
    onWritingChange(activeTask, val);
    setLastSavedTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
      
      {/* Top Bar: Task 1 / Task 2 Switcher & Live Stats */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Task 1 / Task 2 Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTask(1)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTask === 1
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>Writing Task 1</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  countWords(writingTask1Text) >= 150
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {countWords(writingTask1Text)}w
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTask(2)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                activeTask === 2
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>Writing Task 2</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  countWords(writingTask2Text) >= 250
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {countWords(writingTask2Text)}w
              </span>
            </button>
          </div>

          <span className="text-xs text-slate-500 hidden md:inline">
            Suggested: {activeTask === 1 ? '20 mins' : '40 mins'}
          </span>
        </div>

        {/* Live Word Count & Save Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600">
              Words: <strong className={isMinimumReached ? 'text-emerald-600' : 'text-amber-600'}>{wordCount}</strong> / {minWords} min
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-400">
              Chars: {charCount}
            </span>
          </div>

          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-saved at {lastSavedTime}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Pane Editor Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANE: Task Prompt & Instructions */}
        <div className="w-full md:w-5/12 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-5 md:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-megamind-600 tracking-wide uppercase">
              {activeTask === 1 ? 'Academic Task 1 (Report)' : 'Academic Task 2 (Discursive Essay)'}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Min {minWords} words
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {currentTaskData?.title || `Writing Task ${activeTask}`}
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-slate-700 whitespace-pre-line leading-relaxed">
            {currentTaskData?.prompt}
          </div>

          {currentTaskData?.instructions && (
            <div className="text-xs text-slate-500 bg-blue-50/60 p-3 rounded-lg border border-blue-100 leading-relaxed">
              <strong className="text-blue-900 font-semibold block mb-0.5">Instructions:</strong>
              {currentTaskData.instructions}
            </div>
          )}

          {/* Sample Task 1 Chart Graphic if available */}
          {activeTask === 1 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                Electricity Generation Source by Country (2024)
              </div>

              {/* Responsive SVG Bar Chart Illustration */}
              <svg viewBox="0 0 400 160" className="w-full h-auto bg-white rounded border border-slate-200 p-2">
                <line x1="50" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="50" y1="20" x2="50" y2="130" stroke="#cbd5e1" strokeWidth="1" />
                
                {/* Norway */}
                <text x="90" y="145" fontSize="10" fill="#475569" textAnchor="middle">Norway</text>
                <rect x="70" y="30" width="40" height="100" fill="#10b981" rx="2" />
                <text x="90" y="25" fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">98%</text>

                {/* France */}
                <text x="210" y="145" fontSize="10" fill="#475569" textAnchor="middle">France</text>
                <rect x="180" y="62" width="25" height="68" fill="#3b82f6" rx="2" />
                <rect x="215" y="108" width="25" height="22" fill="#10b981" rx="2" />
                <text x="192" y="57" fontSize="9" fill="#3b82f6" fontWeight="bold" textAnchor="middle">68%</text>
                <text x="227" y="103" fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">22%</text>

                {/* Germany */}
                <text x="320" y="145" fontSize="10" fill="#475569" textAnchor="middle">Germany</text>
                <rect x="295" y="84" width="20" height="46" fill="#10b981" rx="2" />
                <rect x="320" y="102" width="20" height="28" fill="#f59e0b" rx="2" />
                <rect x="345" y="110" width="20" height="20" fill="#64748b" rx="2" />
                <text x="305" y="79" fontSize="8" fill="#10b981" fontWeight="bold" textAnchor="middle">46%</text>
              </svg>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Renewable</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Nuclear</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Gas</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-500" /> Coal</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Large Writing Editor */}
        <div className="w-full md:w-7/12 flex flex-col bg-slate-50 p-4 md:p-6 overflow-hidden">
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Writing Response Editor</span>
              <span>Spell-check disabled during examination</span>
            </div>

            <textarea
              value={currentText}
              onChange={handleTextChange}
              disabled={isSubmitted}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={`Begin typing your ${activeTask === 1 ? 'Task 1 summary' : 'Task 2 essay'} here...`}
              className="flex-1 w-full p-4 md:p-6 text-sm md:text-base text-slate-800 leading-relaxed font-mono focus:outline-none resize-none"
            />

            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Current: <strong className="text-slate-800 font-bold">{wordCount}</strong> words
              </span>
              <span className="text-slate-400 text-[11px]">
                Target: at least {minWords} words
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
