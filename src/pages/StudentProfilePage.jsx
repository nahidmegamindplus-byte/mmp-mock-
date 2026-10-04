import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { User, Target, Lock, CheckCircle2, AlertCircle, Save, ShieldCheck } from 'lucide-react';

export default function StudentProfilePage() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [targetBand, setTargetBand] = useState(user?.targetBand || user?.target_band || 7.5);
  const [testType, setTestType] = useState(user?.testType || user?.test_type || 'academic');
  const [currentLevel, setCurrentLevel] = useState(user?.currentLevel || user?.current_level || 'intermediate');
  const [targetTestDate, setTargetTestDate] = useState(user?.targetTestDate || user?.target_test_date || '');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileSuccess(null);
      setProfileError(null);

      await updateProfile({
        fullName,
        phone,
        targetBand: parseFloat(targetBand),
        testType,
        currentLevel,
        targetTestDate
      });

      setProfileSuccess('Profile updated successfully!');
      setSavingProfile(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordSuccess(null);
      setPasswordError(null);

      await api.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSavingPassword(false);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Title */}
        <div className="pb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-megamind-600 uppercase tracking-wider">
            Account Management
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
            <User className="w-6 h-6 text-megamind-500" />
            Student Profile & Target Settings
          </h1>
          <p className="text-xs text-slate-500">
            Manage your personal details, target band score, and test preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-center h-fit">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center text-xl font-bold ring-4 ring-megamind-100">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Target Band:</span>
                <span className="font-bold text-megamind-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {targetBand}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Test Stream:</span>
                <span className="font-bold text-slate-800 capitalize">
                  {testType}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">IELTS Level:</span>
                <span className="font-semibold text-slate-700 capitalize">
                  {currentLevel}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Registered on {new Date(user?.created_at || Date.now()).toLocaleDateString()}
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Settings Form */}
            <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Target className="w-4 h-4 text-megamind-500" />
                Target Score & Personal Details
              </h3>

              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Band Score</label>
                  <select
                    value={targetBand}
                    onChange={(e) => setTargetBand(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  >
                    {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IELTS Test Stream</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="general">General Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Level</label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="upper-intermediate">Upper Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam Date (Optional)</label>
                  <input
                    type="date"
                    value={targetTestDate}
                    onChange={(e) => setTargetTestDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-megamind-500 hover:bg-megamind-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock className="w-4 h-4 text-megamind-500" />
                Change Password
              </h3>

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:border-megamind-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
