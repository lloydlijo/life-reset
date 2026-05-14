import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import HabitCheckbox from '../components/HabitCheckbox';

const HABITS = ['sleep', 'water', 'exercise', 'meditation', 'screen', 'cold'];

const WEEK_TARGETS = [
  { sleep:'7 hours, in bed by 11pm', water:'6 glasses (1.5L)', exercise:'15 minutes', meditation:'5 minutes', screen:'3 hours max', cold:'15 seconds' },
  { sleep:'7 hours, same routine', water:'7 glasses (1.75L)', exercise:'20 minutes', meditation:'7 minutes', screen:'2.5 hours max', cold:'20 seconds' },
  { sleep:'7.5 hours, in bed by 10:45pm', water:'8 glasses (2L)', exercise:'25 minutes', meditation:'10 minutes', screen:'2 hours max', cold:'30 seconds' },
  { sleep:'7.5 hours, in bed by 10:30pm', water:'8 glasses (2L)', exercise:'30 minutes', meditation:'10 minutes', screen:'1.5 hours max', cold:'45 seconds' },
  { sleep:'8 hours, in bed by 10:30pm', water:'9 glasses (2.25L)', exercise:'35 minutes', meditation:'12 minutes', screen:'1.5 hours max', cold:'60 seconds' },
  { sleep:'8 hours, in bed by 10:15pm', water:'9 glasses', exercise:'40 minutes', meditation:'12 minutes', screen:'1 hour max', cold:'90 seconds' },
  { sleep:'8 hours — protect this', water:'10 glasses (2.5L)', exercise:'45 minutes', meditation:'15 minutes', screen:'1 hour max', cold:'2 minutes' },
  { sleep:'8 hours — non-negotiable', water:'10 glasses', exercise:'45–50 minutes', meditation:'15 minutes', screen:'45 min max', cold:'2 min 30 sec' },
  { sleep:'8 hours', water:'10 glasses', exercise:'40 minutes (taper)', meditation:'15 minutes', screen:'45 min max', cold:'3 minutes full cold' },
];

const HABIT_KEYS = { sleep: 'sleep_done', water: 'water_done', exercise: 'exercise_done', meditation: 'meditation_done', screen: 'screen_done', cold: 'cold_shower_done' };

export default function DayLog() {
  const { dayNum } = useParams();
  const day = parseInt(dayNum);
  const navigate = useNavigate();
  const week = Math.ceil(day / 7);
  const targets = WEEK_TARGETS[Math.min(week - 1, 8)];

  const [checks, setChecks] = useState({ sleep: false, water: false, exercise: false, meditation: false, screen: false, cold: false });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [weekData, setWeekData] = useState(null);
  const [loadingWeek, setLoadingWeek] = useState(false);

  useEffect(() => {
    if (day < 1 || day > 66 || isNaN(day)) { navigate('/'); return; }
    // Load existing log
    axios.get(`/api/progress/${day}`).then(res => {
      if (res.data) {
        const d = res.data;
        setChecks({
          sleep: !!d.sleep_done, water: !!d.water_done, exercise: !!d.exercise_done,
          meditation: !!d.meditation_done, screen: !!d.screen_done, cold: !!d.cold_shower_done
        });
        setNotes(d.notes || '');
      }
    });
    // Load week plan
    setLoadingWeek(true);
    axios.get(`/api/plan/weeks/${week}`).then(res => setWeekData(res.data)).catch(() => {}).finally(() => setLoadingWeek(false));
  }, [day, week, navigate]);

  const completedCount = Object.values(checks).filter(Boolean).length;

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`/api/progress/${day}`, {
        sleep_done: checks.sleep, water_done: checks.water, exercise_done: checks.exercise,
        meditation_done: checks.meditation, screen_done: checks.screen, cold_shower_done: checks.cold,
        notes
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const isFullDay = completedCount === 6;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: '800px' }}>
      {/* Back */}
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '13px', marginBottom: '28px', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >← Dashboard</Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
          WEEK {week} · {weekData?.title || ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '52px', letterSpacing: '2px', lineHeight: 1 }}>
            DAY <span style={{ color: 'var(--accent)' }}>{day}</span>
          </h1>
          <div style={{
            padding: '8px 16px',
            background: isFullDay ? 'rgba(232,255,71,0.1)' : 'var(--bg2)',
            border: `1px solid ${isFullDay ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '20px',
            fontSize: '13px',
            color: isFullDay ? 'var(--accent)' : 'var(--muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            {completedCount}/6 {isFullDay ? '✓ COMPLETE' : 'habits'}
          </div>
        </div>
        {weekData?.tagline && (
          <p style={{ marginTop: '10px', color: 'var(--muted)', fontSize: '14px', fontStyle: 'italic' }}>
            "{weekData.tagline}"
          </p>
        )}
      </div>

      {/* Habit checklist */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '12px' }}>
          TODAY'S HABITS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {HABITS.map(h => (
            <HabitCheckbox
              key={h}
              habit={h}
              checked={checks[h]}
              onChange={val => setChecks(prev => ({ ...prev, [h]: val }))}
              target={targets[h]}
            />
          ))}
        </div>
      </div>

      {/* Full day banner */}
      {isFullDay && (
        <div style={{
          padding: '20px 24px',
          background: 'rgba(232,255,71,0.08)',
          border: '1px solid rgba(232,255,71,0.3)',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--accent)', letterSpacing: '2px' }}>
            PERFECT DAY
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
            All 6 habits completed. This is how change happens.
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', letterSpacing: '1.5px', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
          NOTES (optional)
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How did today go? Any wins, struggles, reflections..."
          rows={3}
          style={{
            width: '100%', padding: '12px 14px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            fontSize: '14px',
            resize: 'vertical',
            lineHeight: 1.6
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '48px' }}>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '14px 32px',
          background: saved ? 'rgba(232,255,71,0.15)' : 'var(--accent)',
          color: saved ? 'var(--accent)' : '#0a0a0a',
          border: saved ? '1px solid var(--accent)' : '1px solid transparent',
          borderRadius: '10px',
          fontWeight: 700, fontSize: '14px', letterSpacing: '1px',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {saving ? <><div className="spinner" style={{ borderTopColor: '#0a0a0a', width: 16, height: 16 }} /> Saving...</> :
           saved ? '✓ SAVED' : 'SAVE DAY'}
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {day > 1 && <Link to={`/day/${day - 1}`} style={{ padding: '12px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', transition: 'all 0.2s' }}>← Day {day - 1}</Link>}
          {day < 66 && <Link to={`/day/${day + 1}`} style={{ padding: '12px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--muted)', transition: 'all 0.2s' }}>Day {day + 1} →</Link>}
        </div>
      </div>

      {/* Week workout preview */}
      {weekData && !loadingWeek && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--muted)' }}>
              WEEK {week} WORKOUT
            </h2>
            <Link to={`/plan/week/${week}`} style={{
              fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
              padding: '6px 12px', border: '1px solid rgba(232,255,71,0.3)', borderRadius: '6px'
            }}>Full Plan →</Link>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {weekData.workout?.exercises?.slice(0, 4).map((ex, i) => (
              <div key={i} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '14px 16px',
                display: 'flex', gap: '12px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)',
                  flexShrink: 0
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{ex.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    {ex.sets > 0 ? `${ex.sets} sets × ${ex.reps}` : ex.reps}
                    {ex.rest ? ` · rest ${ex.rest}` : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.5 }}>{ex.how}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
