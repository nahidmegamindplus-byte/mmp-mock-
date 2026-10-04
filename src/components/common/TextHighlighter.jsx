import React from 'react';
import { Highlighter, Eraser } from 'lucide-react';

export default function TextHighlighter({ containerRef }) {
  const applyHighlight = (colorClass) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    // Ensure selection is inside the passage container
    if (containerRef?.current && !containerRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    const span = document.createElement('span');
    span.className = `${colorClass} transition-colors duration-150`;
    
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch (e) {
      // If range crosses multiple nodes, fallback to extractContents
      try {
        const extracted = range.extractContents();
        span.appendChild(extracted);
        range.insertNode(span);
        selection.removeAllRanges();
      } catch (err) {
        console.warn('Highlight range insertion fallback:', err);
      }
    }
  };

  const clearHighlights = () => {
    if (!containerRef?.current) return;
    const highlights = containerRef.current.querySelectorAll('.highlight-yellow, .highlight-green, .highlight-pink');
    highlights.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    });
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-xs text-xs">
      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
        <Highlighter className="w-3.5 h-3.5 text-megamind-500" />
        Highlight:
      </span>

      <button
        type="button"
        onClick={() => applyHighlight('highlight-yellow')}
        title="Highlight Yellow"
        className="w-5 h-5 rounded-full bg-yellow-300 hover:ring-2 hover:ring-yellow-400 border border-yellow-400/50 transition-all shadow-xs"
      />

      <button
        type="button"
        onClick={() => applyHighlight('highlight-green')}
        title="Highlight Green"
        className="w-5 h-5 rounded-full bg-emerald-300 hover:ring-2 hover:ring-emerald-400 border border-emerald-400/50 transition-all shadow-xs"
      />

      <button
        type="button"
        onClick={() => applyHighlight('highlight-pink')}
        title="Highlight Pink"
        className="w-5 h-5 rounded-full bg-pink-300 hover:ring-2 hover:ring-pink-400 border border-pink-400/50 transition-all shadow-xs"
      />

      <div className="h-3.5 w-px bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={clearHighlights}
        title="Clear all text highlights"
        className="text-[11px] font-medium text-slate-600 hover:text-red-600 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
      >
        <Eraser className="w-3 h-3 text-slate-400" />
        Clear
      </button>
    </div>
  );
}
