import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, Eye, FileText, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminTestManager() {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [testType, setTestType] = useState('academic');
  const [category, setCategory] = useState('full');
  const [difficulty, setDifficulty] = useState('standard');
  const [durationMinutes, setDurationMinutes] = useState('165');
  const [status, setStatus] = useState('published');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminTests();
      setTests(res.tests || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTest(null);
    setTitle('');
    setTestType('academic');
    setCategory('full');
    setDifficulty('standard');
    setDurationMinutes('165');
    setStatus('published');
    setDescription('');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTest(t);
    setTitle(t.title);
    setTestType(t.test_type);
    setCategory(t.category);
    setDifficulty(t.difficulty);
    setDurationMinutes(String(t.duration_minutes || 165));
    setStatus(t.status);
    setDescription(t.description || '');
    setShowCreateModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingTest) {
        await api.updateAdminTest(editingTest.id, {
          title, testType, category, difficulty, durationMinutes, status, description
        });
      } else {
        await api.createAdminTest({
          title, testType, category, difficulty, durationMinutes, status, description
        });
      }
      setSaving(false);
      setShowCreateModal(false);
      loadTests();
    } catch (err) {
      alert(err.message || 'Failed to save test.');
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" and all associated questions?`)) {
      return;
    }
    try {
      await api.deleteAdminTest(id);
      loadTests();
    } catch (err) {
      alert(err.message || 'Failed to delete test.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            Test Repository
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
            Tests & Examination Management
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-megamind-500 hover:bg-megamind-600 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/50">
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Duration</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Completed Attempts</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading tests...
                  </td>
                </tr>
              ) : tests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No tests in database. Click "Create New Test" above.
                  </td>
                </tr>
              ) : (
                tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white max-w-xs">
                      <div>{t.title}</div>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{t.description}</span>
                    </td>
                    <td className="p-4 uppercase font-semibold text-slate-300">{t.test_type}</td>
                    <td className="p-4 uppercase font-semibold text-slate-300">{t.category}</td>
                    <td className="p-4 font-mono">{t.duration_minutes}m</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'published'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-400">
                      {t.completed_attempts || 0}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/questions?testId=${t.id}`}
                          title="Manage Questions"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <FileText className="w-3.5 h-3.5 text-megamind-400" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Test"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.title)}
                          title="Delete Test"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900 text-red-400"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingTest ? 'Edit Mock Test' : 'Create New IELTS Test'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Test Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. IELTS Academic Mock Test 04"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Stream</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              >
                <option value="academic">Academic</option>
                <option value="general">General Training</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'full') setDurationMinutes('165');
                  else if (e.target.value === 'listening') setDurationMinutes('30');
                  else if (e.target.value === 'reading' || e.target.value === 'writing') setDurationMinutes('60');
                  else if (e.target.value === 'speaking') setDurationMinutes('15');
                }}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              >
                <option value="full">Full 4-Skill Mock</option>
                <option value="listening">Listening Only</option>
                <option value="reading">Reading Only</option>
                <option value="writing">Writing Only</option>
                <option value="speaking">Speaking Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              >
                <option value="standard">Standard</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard (8.0+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none bg-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Test overview and topics covered..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Test'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
