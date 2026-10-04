import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          await loadNotifications();
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.getNotifications();
      if (res.notifications) {
        setNotifications(res.notifications);
        setUnreadNotifCount(res.notifications.filter(n => !n.is_read).length);
      }
    } catch (e) {
      // ignore silently
    }
  }

  async function login(email, password) {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    await loadNotifications();
    return res.user;
  }

  async function register(userData) {
    const res = await api.register(userData);
    setToken(res.token);
    setUser(res.user);
    await loadNotifications();
    return res.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadNotifCount(0);
  }

  async function updateProfile(profileData) {
    const res = await api.updateProfile(profileData);
    setUser(res.user);
    return res.user;
  }

  async function markAllNotificationsRead() {
    try {
      await api.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadNotifCount(0);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isTeacher: user?.role === 'teacher' || user?.role === 'admin',
        notifications,
        unreadNotifCount,
        login,
        register,
        logout,
        updateProfile,
        loadNotifications,
        markAllNotificationsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
