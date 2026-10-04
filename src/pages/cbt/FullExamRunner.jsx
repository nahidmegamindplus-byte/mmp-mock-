import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import ExamModeHeader from '../../components/common/ExamModeHeader';
import QuestionPalette from '../../components/common/QuestionPalette';
import AntiCheatGuard from '../../components/common/AntiCheatGuard';
import Modal from '../../components/common/Modal';
import ListeningSection from './ListeningSection';
import ReadingSection from './ReadingSection';
import WritingSection from './WritingSection';
import SpeakingSection from './SpeakingSection';
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Sparkles, Send, LayoutList, ChevronUp } from 'lucide-react';

export default function FullExamRunner() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState(null);
  const [attemptId, setAttemptId] = useState(null);

  // Examination State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState([]);
  const [writingTask1Text, setWritingTask1Text] = useState('');
  const [writingTask2Text, setWritingTask2Text] = useState('');
  const [tabSwitchesCount, setTabSwitchesCount] = useState(0);
  const [fontSize, setFontSize] = useState(100);

  // Modals & Drawers
  const [showSectionSubmitModal, setShowSectionSubmitModal] = useState(false);
  const [showFinalSubmitModal, setShowFinalSubmitModal] = useState(false);
  const [showPaletteDrawer, setShowPaletteDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const autoSaveTimerRef = useRef(null);

  // Load Exam Payload and Initialize/Restore Attempt
  useEffect(() => {
    async function initExam() {
      try {
        setLoading(true);
        // 1. Fetch clean exam questions payload
        const payload = await api.getExamPayload(testId);
        setExamData(payload);

        // 2. Start or restore attempt session
        const attemptRes = await api.startAttempt(testId);
        const att = attemptRes.attempt;
        setAttemptId(att.id);

        // If restored from previous session, restore state
        if (att.isRestored) {
          setAnswers(att.answers || {});
          setFlags(att.flags || []);
          setWritingTask1Text(att.writingTask1Text || '');
          setWritingTask2Text(att.writingTask2Text || '');
          setTabSwitchesCount(att.tabSwitchesCount || 0);

          // Find section index based on current_section
          const secIdx = payload.sections.findIndex(
            (s) => s.section_type.toLowerCase() === att.currentSection.toLowerCase()
          );
          if (secIdx >= 0) setCurrentSectionIndex(secIdx);
          if (att.currentQuestion) setCurrentQuestion(att.currentQuestion);

          showToast('Previous session restored successfully.');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing exam:', err);
        setError(err.message || 'Failed to initialize examination session.');
        setLoading(false);
      }
    }

    initExam();
  }, [testId]);

  // Periodic Auto-save Heartbeat (every 5 seconds)
  useEffect(() => {
    if (!attemptId || !examData) return;

    autoSaveTimerRef.current = setInterval(async () => {
      try {
        const currentSec = examData.sections[currentSectionIndex]?.section_type || 'listening';
        await api.saveProgress(attemptId, {
          currentSection: currentSec,
          currentQuestion,
          answers,
          flags,
          writingTask1Text,
          writingTask2Text,
          tabSwitchesCount
        });
      } catch (e) {
        console.warn('Auto-save network heartbeat glitch:', e.message);
      }
    }, 5000);

    return () => clearInterval(autoSaveTimerRef.current);
  }, [attemptId, examData, currentSectionIndex, currentQuestion, answers, flags, writingTask1Text, writingTask2Text, tabSwitchesCount]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleToggleFlag = () => {
    const activeSec = examData?.sections[currentSectionIndex];
    const activeQ = activeSec?.questions?.[currentQuestion - 1]?.id || currentQuestion;
    setFlags((prev) => {
      if (prev.includes(activeQ)) {
        return prev.filter((id) => id !== activeQ);
      } else {
        return [...prev, activeQ];
      }
    });
  };

  const handleWritingChange = (taskNumber, text) => {
    if (taskNumber === 1) {
      setWritingTask1Text(text);
    } else {
      setWritingTask2Text(text);
    }
  };

  const handleSpeakingAudioUpload = async (partNumber, base64) => {
    if (!attemptId) return;
    try {
      await api.uploadSpeaking(attemptId, { partNumber, audioBase64: base64 });
      showToast(`Speaking Part ${partNumber} audio uploaded.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Section Advancement
  const handleSectionTimeExpired = () => {
    showToast('Section time expired. Advancing to the next section.');
    handleAdvanceSection();
  };

  const handleAdvanceSection = () => {
    if (!examData) return;
    setShowSectionSubmitModal(false);

    if (currentSectionIndex < examData.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestion(1);
      window.scrollTo(0, 0);
    } else {
      // Last section reached -> Final submit
      handleFinalSubmit();
    }
  };

  // Final Test Submission & Grading
  const handleFinalSubmit = async () => {
    if (!attemptId) return;
    try {
      setIsSubmitting(true);
      setShowFinalSubmitModal(false);

      const res = await api.submitAttempt(attemptId, {
        answers,
        writingTask1Text,
        writingTask2Text
      });

      showToast('Examination submitted successfully!');
      setTimeout(() => {
        navigate(`/results/${attemptId}`);
      }, 1000);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed. Your answers have been preserved locally. Please retry.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
        <h2 className="text-base font-bold tracking-wide">
          Loading MEGAMIND PLUS Examination Environment...
        </h2>
        <p className="text-xs text-slate-400">Synchronizing questions and initializing secure session.</p>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-megamind-500" />
        <h2 className="text-lg font-bold text-slate-900">Unable to Launch Exam</h2>
        <p className="text-xs text-slate-600 max-w-md">{error}</p>
        <button
          onClick={() => navigate('/test-library')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Return to Test Library
        </button>
      </div>
    );
  }

  const currentSection = examData.sections[currentSectionIndex];
  const sectionType = (currentSection?.section_type || 'listening').toLowerCase();
  const totalQuestions = currentSection?.total_questions || currentSection?.questions?.length || 40;
  const isLastSection = currentSectionIndex === examData.sections.length - 1;

  const currentQId = currentSection?.questions?.[currentQuestion - 1]?.id || currentQuestion;
  const isCurrentFlagged = flags.includes(currentQId);

  return (
    <div className="exam-fullscreen-container font-sans">
      
      {/* Anti-Cheating tab detector */}
      <AntiCheatGuard
        isActive={true}
        onTabSwitch={(count) => setTabSwitchesCount(count)}
      />

      {/* CBT Top Examination Header */}
      <ExamModeHeader
        sectionTitle={`${currentSection.title} (${currentSectionIndex + 1}/${examData.sections.length})`}
        currentSection={sectionType}
        questionNumber={currentQuestion}
        totalQuestions={totalQuestions}
        remainingSeconds={(currentSection.duration_minutes || 30) * 60}
        onTimeExpired={handleSectionTimeExpired}
        onFinishSection={() => {
          if (isLastSection) {
            setShowFinalSubmitModal(true);
          } else {
            setShowSectionSubmitModal(true);
          }
        }}
        onToggleFlag={sectionType === 'listening' || sectionType === 'reading' ? handleToggleFlag : null}
        isFlagged={isCurrentFlagged}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {/* Main Section Dynamic Router */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {sectionType === 'listening' && (
          <ListeningSection
            section={currentSection}
            answers={answers}
            flags={flags}
            currentQuestion={currentQuestion}
            onAnswerChange={handleAnswerChange}
            onSelectQuestion={(qNum) => setCurrentQuestion(qNum)}
          />
        )}

        {sectionType === 'reading' && (
          <ReadingSection
            section={currentSection}
            answers={answers}
            flags={flags}
            currentQuestion={currentQuestion}
            onAnswerChange={handleAnswerChange}
            onSelectQuestion={(qNum) => setCurrentQuestion(qNum)}
            fontSize={fontSize}
          />
        )}

        {sectionType === 'writing' && (
          <WritingSection
            section={currentSection}
            writingTask1Text={writingTask1Text}
            writingTask2Text={writingTask2Text}
            onWritingChange={handleWritingChange}
          />
        )}

        {sectionType === 'speaking' && (
          <SpeakingSection
            section={currentSection}
            onAudioUpload={handleSpeakingAudioUpload}
          />
        )}

        {/* Floating Question Palette Bottom Drawer for Listening & Reading */}
        {(sectionType === 'listening' || sectionType === 'reading') && (
          <div className="fixed bottom-3 right-4 z-40">
            <button
              type="button"
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="px-3.5 py-2 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-elevated border border-slate-700 text-xs font-bold flex items-center gap-2 backdrop-blur-xs transition-transform active:scale-95"
            >
              <LayoutList className="w-4 h-4 text-megamind-400" />
              <span>Questions Palette</span>
              <span className="bg-megamind-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {currentQuestion}/{totalQuestions}
              </span>
            </button>

            {/* Expandable Palette Dropup */}
            {showPaletteDrawer && (
              <div className="absolute bottom-12 right-0 w-80 sm:w-96 shadow-2xl animate-in slide-in-from-bottom-2 z-50">
                <QuestionPalette
                  totalQuestions={totalQuestions}
                  currentQuestion={currentQuestion}
                  answers={answers}
                  flags={flags}
                  questionIds={currentSection.questions || []}
                  onSelectQuestion={(qNum) => {
                    setCurrentQuestion(qNum);
                    setShowPaletteDrawer(false);
                    const el = document.getElementById(`question-${qNum}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-elevated border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Finish Section Confirmation Modal */}
      <Modal
        isOpen={showSectionSubmitModal}
        onClose={() => setShowSectionSubmitModal(false)}
        title={`Finish ${currentSection.title}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to finish the <strong>{currentSection.title}</strong>? Once submitted, you cannot return to edit answers in this section.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
            <p>• Next Section: <strong>{examData.sections[currentSectionIndex + 1]?.title || 'Final Submission'}</strong></p>
            <p>• Answers automatically synchronized.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSectionSubmitModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Continue Section
            </button>
            <button
              type="button"
              onClick={handleAdvanceSection}
              className="px-4 py-2 rounded-lg bg-megamind-500 hover:bg-megamind-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Submit & Proceed
            </button>
          </div>
        </div>
      </Modal>

      {/* Final Examination Submission Modal */}
      <Modal
        isOpen={showFinalSubmitModal}
        onClose={() => !isSubmitting && setShowFinalSubmitModal(false)}
        title="Submit Complete Mock Test"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            You have reached the end of the <strong>{examData.test.title}</strong>. Submitting will finalize your test attempt and calculate your objective band scores.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 space-y-1">
            <p className="font-semibold text-emerald-900">Ready for instant analysis:</p>
            <p>• Listening & Reading band scores generated immediately.</p>
            <p>• Writing & Speaking tasks sent to evaluator queue.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowFinalSubmitModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Review Test
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-lg bg-megamind-500 hover:bg-megamind-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Calculating Band Scores...' : 'Submit Examination'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
