import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { FileText, Plus, Trash2, Edit, Save, BookOpen, Headphones, PenTool, CheckCircle2, HelpCircle } from 'lucide-react';

export default function AdminQuestionManager() {
  const [searchParams] = useSearchParams();
  const initialTestId = searchParams.get('testId') || 'test_acad_01';

  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(initialTestId);
  const [sectionsData, setSectionsData] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Question Form State
  const [qNumber, setQNumber] = useState(1);
  const [qType, setQType] = useState('multiple_choice');
  const [qPrompt, setQPrompt] = useState('');
  const [qInstructions, setQInstructions] = useState('');
  const [qOptionsText, setQOptionsText] = useState('');
  const [qCorrectText, setQCorrectText] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qPart, setQPart] = useState(1);
  const [qPassageId, setQPassageId] = useState('');

  // Passage Form State
  const [passageTitle, setPassageTitle] = useState('');
  const [passageSubtitle, setPassageSubtitle] = useState('');
  const [passageHtml, setPassageHtml] = useState('');
  const [passageNumber, setPassageNumber] = useState(1);

  useEffect(() => {
    async function init() {
      try {
        const testsRes = await api.getAdminTests();
        setTests(testsRes.tests || []);
        if (testsRes.tests?.length > 0 && !selectedTestId) {
          setSelectedTestId(testsRes.tests[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedTestId) {
      loadSections(selectedTestId);
    }
  }, [selectedTestId]);

  const loadSections = async (tId) => {
    try {
      setLoading(true);
      const res = await api.getAdminTestSections(tId);
      setSectionsData(res.sections || []);
      if (res.sections?.length > 0) {
        setActiveSectionId(res.sections[0].id);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const activeSection = sectionsData.find((s) => s.id === activeSectionId) || sectionsData[0];

  const handleOpenNewQuestion = () => {
    setEditingQuestion(null);
    const existingCount = activeSection?.questions?.length || 0;
    setQNumber(existingCount + 1);
    setQType('multiple_choice');
    setQPrompt('');
    setQInstructions('');
    setQOptionsText('Option A\nOption B\nOption C\nOption D');
    setQCorrectText('Option A');
    setQExplanation('');
    setQPart(1);
    setQPassageId(activeSection?.passages?.[0]?.id || '');
    setShowQuestionModal(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQNumber(q.question_number);
    setQType(q.question_type);
    setQPrompt(q.prompt);
    setQInstructions(q.instructions || '');

    let opts = [];
    try {
      opts = q.options_json ? JSON.parse(q.options_json) : [];
    } catch (e) {}
    setQOptionsText(opts.join('\n'));

    let corr = [];
    try {
      corr = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : [];
    } catch (e) {
      corr = [q.correct_answer_json];
    }
    setQCorrectText(corr.join('\n'));

    setQExplanation(q.explanation || '');
    setQPart(q.part_number || 1);
    setQPassageId(q.passage_id || '');
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const optionsArray = qOptionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const correctArray = qCorrectText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.saveQuestion({
        id: editingQuestion?.id,
        sectionId: activeSectionId,
        passageId: qPassageId || null,
        partNumber: qPart,
        questionNumber: qNumber,
        questionType: qType,
        prompt: qPrompt,
        instructions: qInstructions,
        options: optionsArray.length > 0 ? optionsArray : null,
        correctAnswers: correctArray,
        explanation: qExplanation
      });

      setShowQuestionModal(false);
      loadSections(selectedTestId);
    } catch (err) {
      alert(err.message || 'Failed to save question.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question permanently?')) return;
    try {
      await api.deleteQuestion(id);
      loadSections(selectedTestId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSavePassage = async (e) => {
    e.preventDefault();
    try {
      await api.savePassage({
        sectionId: activeSectionId,
        title: passageTitle,
        subtitle: passageSubtitle,
        contentHtml: passageHtml,
        passageNumber
      });
      setShowPassageModal(false);
      loadSections(selectedTestId);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Test Selector & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            Content Editor
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Questions & Passages Builder
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full md:w-72 bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-megamind-500 focus:outline-none"
          >
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        {sectionsData.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSectionId(sec.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
              activeSectionId === sec.id
                ? 'bg-megamind-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {sec.title} ({sec.questions?.length || 0} Questions)
          </button>
        ))}
      </div>

      {/* Section Workspace */}
      {activeSection && (
        <div className="space-y-6">
          
          {/* If Reading section: Show Passages list & Add Passage button */}
          {activeSection.section_type === 'reading' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-megamind-400" />
                  Reading Passages ({activeSection.passages?.length || 0})
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setPassageTitle('');
                    setPassageSubtitle('');
                    setPassageHtml('<p><strong>Paragraph A</strong><br>Enter passage text here...</p>');
                    setPassageNumber((activeSection.passages?.length || 0) + 1);
                    setShowPassageModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Passage
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeSection.passages?.map((p, idx) => (
                  <div key={p.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-megamind-400 uppercase">Passage {idx + 1}</span>
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{p.subtitle || 'Academic reading text'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions List & Builder */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Questions List ({activeSection.questions?.length || 0})
                </h3>
                <p className="text-xs text-slate-400">
                  Manage prompts, options, answer keys, and diagnostic explanations.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewQuestion}
                className="px-4 py-2 bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 w-12 font-bold">#</th>
                    <th className="pb-3 w-28 font-bold">Type</th>
                    <th className="pb-3 font-bold">Prompt</th>
                    <th className="pb-3 w-40 font-bold">Correct Key(s)</th>
                    <th className="pb-3 w-20 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  {activeSection.questions?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No questions in this section yet. Click "Add Question" above.
                      </td>
                    </tr>
                  ) : (
                    activeSection.questions?.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-900/40">
                        <td className="py-3 font-bold text-white">{q.question_number}</td>
                        <td className="py-3 capitalize text-slate-400 text-[11px]">
                          {q.question_type.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 text-white font-medium max-w-md truncate">
                          {q.prompt}
                        </td>
                        <td className="py-3 text-emerald-400 font-mono text-[11px] truncate">
                          {q.correct_answer_json}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditQuestion(q)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-red-900 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={editingQuestion ? `Edit Question #${qNumber}` : `Add New Question #${qNumber}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Number</label>
              <input
                type="number"
                required
                value={qNumber}
                onChange={(e) => setQNumber(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Part / Passage</label>
              <input
                type="number"
                required
                value={qPart}
                onChange={(e) => setQPart(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
              <select
                value={qType}
                onChange={(e) => setQType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false_not_given">True / False / Not Given</option>
                <option value="yes_no_not_given">Yes / No / Not Given</option>
                <option value="matching">Matching</option>
                <option value="matching_headings">Matching Headings</option>
                <option value="sentence_completion">Sentence Completion</option>
                <option value="summary_completion">Summary Completion</option>
                <option value="form_completion">Form Completion</option>
                <option value="note_completion">Note Completion</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt *</label>
            <textarea
              rows={2}
              required
              value={qPrompt}
              onChange={(e) => setQPrompt(e.target.value)}
              placeholder="e.g. Preferred accommodation type: [1]"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions (Optional)
            </label>
            <input
              type="text"
              value={qInstructions}
              onChange={(e) => setQInstructions(e.target.value)}
              placeholder="e.g. Write NO MORE THAN TWO WORDS for each answer."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          {/* Options (One per line) */}
          {['multiple_choice', 'matching', 'matching_headings'].includes(qType) && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Options (One option per line)
              </label>
              <textarea
                rows={3}
                value={qOptionsText}
                onChange={(e) => setQOptionsText(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
              />
            </div>
          )}

          {/* Correct Answers (One acceptable variation per line) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Acceptable Correct Answer(s) * (One per line for variations)
            </label>
            <textarea
              rows={2}
              required
              value={qCorrectText}
              onChange={(e) => setQCorrectText(e.target.value)}
              placeholder="studio&#10;studio apartment"
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Diagnostic Explanation
            </label>
            <textarea
              rows={2}
              value={qExplanation}
              onChange={(e) => setQExplanation(e.target.value)}
              placeholder="Why this answer is correct..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowQuestionModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs"
            >
              Save Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Passage Modal */}
      <Modal
        isOpen={showPassageModal}
        onClose={() => setShowPassageModal(false)}
        title={`Add Reading Passage #${passageNumber}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSavePassage} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passage Title *</label>
            <input
              type="text"
              required
              value={passageTitle}
              onChange={(e) => setPassageTitle(e.target.value)}
              placeholder="e.g. Deep-Sea Hydrothermal Vents"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle (Optional)</label>
            <input
              type="text"
              value={passageSubtitle}
              onChange={(e) => setPassageSubtitle(e.target.value)}
              placeholder="e.g. Biological adaptations in extreme abyssal biomes"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">HTML Passage Content *</label>
            <textarea
              rows={8}
              required
              value={passageHtml}
              onChange={(e) => setPassageHtml(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPassageModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs"
            >
              Save Passage
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
