import express from 'express';
import db from '../db.js';
import { hashPassword, comparePassword, generateToken, authenticate } from '../auth.js';
import crypto from 'crypto';

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { fullName, email, phone, password, targetBand, testType, currentLevel, targetTestDate } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    // Check if email already registered
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, target_band, test_type, current_level, target_test_date, status)
      VALUES (?, ?, ?, ?, ?, 'student', ?, ?, ?, ?, 'active')
    `).run(
      userId,
      email.toLowerCase().trim(),
      passwordHash,
      fullName.trim(),
      phone || null,
      parseFloat(targetBand) || 7.5,
      testType || 'academic',
      currentLevel || 'intermediate',
      targetTestDate || null
    );

    const newUser = db.prepare('SELECT id, email, full_name, role, target_band, test_type, current_level, target_test_date, status FROM users WHERE id = ?').get(userId);
    const token = generateToken(newUser);

    // Welcome Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, 'info', '/test-library')
    `).run(
      'notif_' + crypto.randomBytes(5).toString('hex'),
      userId,
      'Welcome to MEGAMIND PLUS!',
      'Your account is ready. Explore the Test Library and start your realistic IELTS mock test experience.',
      '/test-library'
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Failed to create student account. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!comparePassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account is suspended. Please contact Megamind Plus support.' });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      targetBand: user.target_band,
      testType: user.test_type,
      currentLevel: user.current_level,
      targetTestDate: user.target_test_date,
      avatarUrl: user.avatar_url,
      status: user.status
    };

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, phone, role, target_band, test_type, current_level, target_test_date, avatar_url, status, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

// PUT /api/auth/profile
router.put('/profile', authenticate, (req, res) => {
  try {
    const { fullName, phone, targetBand, testType, currentLevel, targetTestDate } = req.body;

    db.prepare(`
      UPDATE users
      SET full_name = COALESCE(?, full_name),
          phone = COALESCE(?, phone),
          target_band = COALESCE(?, target_band),
          test_type = COALESCE(?, test_type),
          current_level = COALESCE(?, current_level),
          target_test_date = COALESCE(?, target_test_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      fullName || null,
      phone || null,
      targetBand ? parseFloat(targetBand) : null,
      testType || null,
      currentLevel || null,
      targetTestDate || null,
      req.user.id
    );

    const updated = db.prepare('SELECT id, email, full_name, phone, role, target_band, test_type, current_level, target_test_date, avatar_url, status FROM users WHERE id = ?').get(req.user.id);

    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!comparePassword(currentPassword, user.password_hash)) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashPassword(newPassword), req.user.id);

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// POST /api/auth/forgot-password (mock simulation)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  // Always return user-friendly success without disclosing email existence
  res.json({
    message: 'If an account exists with this email, a password reset link has been dispatched to your inbox.'
  });
});

// GET /api/auth/notifications
router.get('/notifications', authenticate, (req, res) => {
  const notifications = db.prepare(`
    SELECT id, title, message, type, link, is_read, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `).all(req.user.id);

  res.json({ notifications });
});

// PUT /api/auth/notifications/read-all
router.put('/notifications/read-all', authenticate, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ message: 'All notifications marked as read.' });
});

export default router;
