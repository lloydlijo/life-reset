const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get all logs for a user
router.get('/', auth, (req, res) => {
  const logs = db.prepare('SELECT * FROM daily_logs WHERE user_id = ? ORDER BY day_number').all(req.user.id);
  res.json(logs);
});

// Get specific day
router.get('/:day', auth, (req, res) => {
  const day = parseInt(req.params.day);
  const log = db.prepare('SELECT * FROM daily_logs WHERE user_id = ? AND day_number = ?').get(req.user.id, day);
  res.json(log || null);
});

// Save / update a day's log
router.post('/:day', auth, (req, res) => {
  const day = parseInt(req.params.day);
  if (day < 1 || day > 66) return res.status(400).json({ error: 'Day must be 1-66' });

  const { sleep_done, water_done, exercise_done, meditation_done, screen_done, cold_shower_done, notes } = req.body;
  const today = new Date().toISOString().split('T')[0];

  const existing = db.prepare('SELECT id FROM daily_logs WHERE user_id = ? AND day_number = ?').get(req.user.id, day);

  if (existing) {
    db.prepare(`
      UPDATE daily_logs SET sleep_done=?, water_done=?, exercise_done=?, meditation_done=?, screen_done=?, cold_shower_done=?, notes=?
      WHERE user_id=? AND day_number=?
    `).run(
      sleep_done ? 1 : 0, water_done ? 1 : 0, exercise_done ? 1 : 0,
      meditation_done ? 1 : 0, screen_done ? 1 : 0, cold_shower_done ? 1 : 0,
      notes || '', req.user.id, day
    );
  } else {
    db.prepare(`
      INSERT INTO daily_logs (user_id, day_number, log_date, sleep_done, water_done, exercise_done, meditation_done, screen_done, cold_shower_done, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id, day, today,
      sleep_done ? 1 : 0, water_done ? 1 : 0, exercise_done ? 1 : 0,
      meditation_done ? 1 : 0, screen_done ? 1 : 0, cold_shower_done ? 1 : 0,
      notes || ''
    );
  }

  const updated = db.prepare('SELECT * FROM daily_logs WHERE user_id = ? AND day_number = ?').get(req.user.id, day);
  res.json(updated);
});

// Get stats summary
router.get('/summary/stats', auth, (req, res) => {
  const logs = db.prepare('SELECT * FROM daily_logs WHERE user_id = ?').all(req.user.id);
  const totalDays = logs.length;
  const completedDays = logs.filter(l =>
    l.sleep_done && l.water_done && l.exercise_done && l.meditation_done && l.screen_done && l.cold_shower_done
  ).length;

  const habitTotals = {
    sleep: logs.filter(l => l.sleep_done).length,
    water: logs.filter(l => l.water_done).length,
    exercise: logs.filter(l => l.exercise_done).length,
    meditation: logs.filter(l => l.meditation_done).length,
    screen: logs.filter(l => l.screen_done).length,
    cold_shower: logs.filter(l => l.cold_shower_done).length,
  };

  // Calculate current streak
  let streak = 0;
  const dayMap = {};
  logs.forEach(l => { dayMap[l.day_number] = l; });
  const maxDay = logs.length > 0 ? Math.max(...logs.map(l => l.day_number)) : 0;
  for (let d = maxDay; d >= 1; d--) {
    const l = dayMap[d];
    if (l && (l.sleep_done || l.water_done || l.exercise_done || l.meditation_done || l.screen_done || l.cold_shower_done)) {
      streak++;
    } else break;
  }

  res.json({ totalDays, completedDays, habitTotals, streak, currentDay: maxDay + 1 });
});

module.exports = router;
