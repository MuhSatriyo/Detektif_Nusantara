const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Terlalu banyak permintaan, coba lagi nanti.' }
});
app.use('/api/', limiter);

// ==========================================
// API: Users
// ==========================================

// Login or create user (simple login by name)
app.post('/api/users/login', async (req, res) => {
  try {
    const { name, class: userClass } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nama harus diisi.' });
    }

    const sanitizedName = name.trim();
    const sanitizedClass = userClass ? userClass.trim() : '';

    // Try to find existing user
    const [existing] = await db.query(
      'SELECT * FROM users WHERE name = ?',
      [sanitizedName]
    );

    if (existing.length > 0) {
      return res.json({
        message: 'Login berhasil!',
        user: existing[0],
        isNew: false
      });
    }

    // Create new user
    const [result] = await db.query(
      'INSERT INTO users (name, class) VALUES (?, ?)',
      [sanitizedName, sanitizedClass]
    );

    const newUser = {
      id: result.insertId,
      name: sanitizedName,
      class: sanitizedClass,
      total_missions: 0,
      total_stars: 0,
      total_score: 0
    };

    res.status(201).json({
      message: 'Akun berhasil dibuat! Selamat datang!',
      user: newUser,
      isNew: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// Get user profile with progress
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const user = users[0];

    // Get mission progress
    const [progress] = await db.query(
      'SELECT * FROM mission_progress WHERE user_id = ? ORDER BY mission_id',
      [userId]
    );

    res.json({
      user,
      progress: progress.map(p => ({
        mission_id: p.mission_id,
        score: p.score,
        stars: p.stars,
        completed_at: p.completed_at
      }))
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// Get leaderboard (top players)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT name, class, total_missions, total_stars, total_score FROM users ORDER BY total_score DESC LIMIT 20'
    );

    res.json({ leaderboard: users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ==========================================
// API: Mission Progress
// ==========================================

// Save or update mission progress
app.post('/api/progress', async (req, res) => {
  try {
    const { user_id, mission_id, score, stars } = req.body;

    if (!user_id || mission_id === undefined || score === undefined || stars === undefined) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [user_id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    // Upsert mission progress
    await db.query(
      `INSERT INTO mission_progress (user_id, mission_id, score, stars)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         score = VALUES(score),
         stars = GREATEST(stars, VALUES(stars))`,
      [user_id, mission_id, score, stars]
    );

    // Recalculate user totals
    const [progressRows] = await db.query(
      'SELECT * FROM mission_progress WHERE user_id = ?',
      [user_id]
    );

    const totalMissions = progressRows.length;
    const totalStars = progressRows.reduce((sum, p) => sum + p.stars, 0);
    const totalScore = progressRows.reduce((sum, p) => sum + p.score, 0);

    await db.query(
      'UPDATE users SET total_missions = ?, total_stars = ?, total_score = ? WHERE id = ?',
      [totalMissions, totalStars, totalScore, user_id]
    );

    const updatedUser = {
      id: user_id,
      total_missions: totalMissions,
      total_stars: totalStars,
      total_score: totalScore
    };

    res.json({
      message: 'Progress berhasil disimpan!',
      progress: { mission_id, score, stars },
      user: updatedUser
    });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// Get all mission progress for a user
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const [progress] = await db.query(
      'SELECT * FROM mission_progress WHERE user_id = ? ORDER BY mission_id',
      [userId]
    );

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ==========================================
// Serve frontend for any other routes
// ==========================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// ==========================================
// Start server
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Detektif Nusantara server running on port ${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
});
