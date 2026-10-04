import React, { useState, useEffect } from 'react';
import { Clock, Maximize2, Minimize2, ZoomIn, ZoomOut, Flag, AlertTriangle, Send, CheckCircle } from 'lucide-react';

export default function ExamModeHeader({
  sectionTitle = 'Listening Test',
  currentSection = 'listening',
  questionNumber = 1,
  totalQuestions = 40,
  remainingSeconds = 1800,
  onTimeExpired,
  onFinishSection,
  onToggleFlag,
  isFlagged = false,
  fontSize = 100,
  onFontSizeChange
}) {
  const [timeLeft, setTimeLeft] = useState(remainingSeconds);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setTimeLeft(remainingSeconds);
  }, [remainingSeconds]);

  // Countdown timer engine
  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeExpired) onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Warning thresholds
  const isTenMinWarning = timeLeft <= 600 && timeLeft > 300;
  const isFiveMinWarning = timeLeft <= 300 && timeLeft > 60;
  const isOneMinWarning = timeLeft <= 60;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-50 select-none shadow-md">
      
      {/* Brand & Section Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-megamind-500 text-white flex items-center justify-center font-bold text-xs">
            M+
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-tight text-white leading-none">
              MEGAMIND PLUS
            </h1>
            <span className="text-[10px] text-megamind-300 font-semibold tracking-wider uppercase">
              IELTS MOCK TEST
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2">
          <span className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-md capitalize">
            {sectionTitle}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Question: <strong className="text-white">{questionNumber}</strong> / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Center Countdown Timer */}
      <div className="flex items-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-black transition-all ${
            isOneMinWarning
              ? 'bg-red-600 text-white border-red-500 animate-pulse'
              : isFiveMinWarning
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
              : isTenMinWarning
              ? 'bg-amber-900/60 text-amber-200 border-amber-700'
              : 'bg-slate-800 text-slate-100 border-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 text-inherit shrink-0" />
          <span>{formatTime(timeLeft)}</span>
          {isOneMinWarning && (
            <span className="text-[10px] font-sans font-bold bg-white text-red-600 px-1 rounded ml-1">
              Final Minute
            </span>
          )}
        </div>
      </div>

      {/* Action Controls & Finish Section */}
      <div className="flex items-center gap-2">
        
        {/* Flag Button */}
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isFlagged
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag Question'}</span>
          </button>
        )}

        {/* Text Zoom */}
        {onFontSizeChange && (
          <div className="hidden md:flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-md p-0.5">
            <button
              onClick={() => onFontSizeChange(Math.max(90, fontSize - 5))}
              title="Decrease Font Size"
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">{fontSize}%</span>
            <button
              onClick={() => onFontSizeChange(Math.min(125, fontSize + 5))}
              title="Increase Font Size"
              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Fullscreen */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="hidden sm:flex p-1.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Submit / Finish Section Button */}
        {onFinishSection && (
          <button
            type="button"
            onClick={onFinishSection}
            className="px-3.5 py-1.5 rounded-lg bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish Section</span>
          </button>
        )}

      </div>
    </header>
  );
}
