import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  UserCheck,
  Users,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/tests', label: 'Tests Management', icon: BookOpen },
    { path: '/admin/questions', label: 'Questions & Passages', icon: FileText },
    { path: '/admin/evaluations', label: 'Evaluation Queue', icon: UserCheck },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/results', label: 'Results & Scores', icon: Award },
    { path: '/admin/settings', label: 'System Settings', icon: Settings }
  ];

  const isCurrentActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-megamind-500 text-white font-black text-lg flex items-center justify-center shadow-sm">
              M+
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                MEGAMIND PLUS
              </span>
              <span className="text-[10px] text-megamind-400 font-bold uppercase tracking-wider">
                Admin Control Center
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-megamind-500 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-megamind-600 text-white font-bold text-xs flex items-center justify-center">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-megamind-400 capitalize">{user?.role} Access</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              to="/dashboard"
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Student View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-900">
        
        {/* Mobile Top Header */}
        <div className="md:hidden bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-megamind-500 text-white font-bold text-xs flex items-center justify-center">
              M+
            </div>
            <span className="font-bold text-xs text-white">Admin Control</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-semibold">
            <Link to="/admin" className="px-2 py-1 bg-slate-800 rounded text-slate-300">Dashboard</Link>
            <Link to="/admin/tests" className="px-2 py-1 bg-slate-800 rounded text-slate-300">Tests</Link>
            <Link to="/admin/evaluations" className="px-2 py-1 bg-slate-800 rounded text-slate-300">Evaluations</Link>
            <Link to="/dashboard" className="px-2 py-1 bg-megamind-500 text-white rounded">Portal</Link>
          </div>
        </div>

        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
