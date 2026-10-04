import React, { useEffect, useState } from 'react';
import { AlertOctagon, ShieldAlert, Check } from 'lucide-react';
import Modal from './Modal';

export default function AntiCheatGuard({ isActive = true, onTabSwitch }) {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Prevent accidental reload or leaving exam
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have an active IELTS examination in progress. Are you sure you want to leave? Your answers have been automatically saved.';
      return e.returnValue;
    };

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => {
          const next = prev + 1;
          if (onTabSwitch) onTabSwitch(next);
          return next;
        });
        setShowWarningModal(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, onTabSwitch]);

  if (!isActive) return null;

  return (
    <Modal
      isOpen={showWarningModal}
      onClose={() => setShowWarningModal(false)}
      title="Test Integrity Notice"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Window Focus Lost (Incident #{warningCount})
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            You navigated away from the IELTS test screen. To ensure a realistic examination experience, please keep the test window in active fullscreen focus.
          </p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 border border-slate-200">
          All your selections and responses are securely synchronized to the database.
        </div>

        <button
          type="button"
          onClick={() => setShowWarningModal(false)}
          className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          I Understand, Return to Test
        </button>
      </div>
    </Modal>
  );
}
