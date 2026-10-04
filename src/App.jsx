import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentDashboard from './pages/StudentDashboard';
import TestLibrary from './pages/TestLibrary';
import TestInstructions from './pages/TestInstructions';
import FullExamRunner from './pages/cbt/FullExamRunner';
import TestResultPage from './pages/TestResultPage';
import DetailedAnalysisPage from './pages/DetailedAnalysisPage';
import AttemptHistoryPage from './pages/AttemptHistoryPage';
import StudentProfilePage from './pages/StudentProfilePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTestManager from './pages/admin/AdminTestManager';
import AdminQuestionManager from './pages/admin/AdminQuestionManager';
import AdminEvaluationCenter from './pages/admin/AdminEvaluationCenter';
import AdminStudentManager from './pages/admin/AdminStudentManager';
import AdminResultManager from './pages/admin/AdminResultManager';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Teacher or Admin Guard
function AdminRoute({ children }) {
  const { isAuthenticated, isTeacher, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 rounded-full border-4 border-megamind-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isTeacher) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/test-library" element={<TestLibrary />} />

      {/* Protected Student Portal */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:testId/instructions"
        element={
          <ProtectedRoute>
            <TestInstructions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:testId"
        element={
          <ProtectedRoute>
            <FullExamRunner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:attemptId"
        element={
          <ProtectedRoute>
            <TestResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis/:attemptId"
        element={
          <ProtectedRoute>
            <DetailedAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AttemptHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Control Center */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tests" element={<AdminTestManager />} />
        <Route path="questions" element={<AdminQuestionManager />} />
        <Route path="evaluations" element={<AdminEvaluationCenter />} />
        <Route path="students" element={<AdminStudentManager />} />
        <Route path="results" element={<AdminResultManager />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
