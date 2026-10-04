import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Modal from '../../components/common/Modal';
import { Users, Search, UserCheck, UserX, Key, CheckCircle2, History, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminStudentManager() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newPassword, setNewPassword] = useState('Student@2026');
  const [resetSuccessMsg, setResetSuccessMsg] = useState(null);

  useEffect(() => {
    loadStudents();
  }, [search, statusFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getStudents({ search, status: statusFilter });
      setStudents(res.students || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleToggleStatus = async (student) => {
    const nextStatus = student.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to set status to "${nextStatus}" for ${student.full_name}?`)) {
      return;
    }

    try {
      await api.updateStudentStatus(student.id, nextStatus);
      loadStudents();
    } catch (err) {
      alert(err.message || 'Failed to update student status.');
    }
  };

  const handleOpenReset = (student) => {
    setSelectedStudent(student);
    setNewPassword('Student@2026');
    setResetSuccessMsg(null);
    setResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await api.resetStudentPassword(selectedStudent.id, newPassword);
      setResetSuccessMsg(`Password successfully reset to: ${newPassword}`);
    } catch (err) {
      alert(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-megamind-400 uppercase tracking-wider">
            User Accounts
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Users className="w-6 h-6 text-megamind-400" />
            Student Management & Profiles
          </h1>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, email, phone..."
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-megamind-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:border-megamind-500 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/50">
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Target</th>
                <th className="p-4 font-bold">Stream</th>
                <th className="p-4 font-bold">Tests Completed</th>
                <th className="p-4 font-bold">Avg Band</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">
                      <div>{st.full_name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {st.email} • {st.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-megamind-400">Band {st.target_band || 7.5}</span>
                    </td>
                    <td className="p-4 capitalize font-semibold text-slate-300">{st.test_type}</td>
                    <td className="p-4 font-semibold text-slate-300">{st.tests_completed || 0}</td>
                    <td className="p-4 font-black text-white font-display">
                      {st.avg_band ? `Band ${st.avg_band}` : '—'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          st.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/results?studentId=${st.id}`}
                          title="View Completed Attempts"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <History className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenReset(st)}
                          title="Reset Password"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(st)}
                          title={st.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg ${
                            st.status === 'active'
                              ? 'bg-slate-800 hover:bg-red-950 text-red-400'
                              : 'bg-slate-800 hover:bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {st.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
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

      {/* Password Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={`Reset Password: ${selectedStudent?.full_name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          {resetSuccessMsg ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p>{resetSuccessMsg}</p>
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="mt-2 px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Temporary Password
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-megamind-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Reset
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>

    </div>
  );
}
