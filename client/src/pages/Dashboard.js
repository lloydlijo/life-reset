import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { HABIT_CONFIG } from '../components/HabitCheckbox';

const HABITS = ['sleep', 'water', 'exercise', 'meditation', 'screen', 'cold'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/progress'),
      axios.get('/api/progress/summary/stats'),
      axios.get('/api/plan/milestones')
    ]).then(([logsRes, statsRes, msRes]) => {
      setLogs(logsRes.data);
      setStats(statsRes.data);
      setMilestones(msRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  const currentDay = stats?.currentDay || 1;
  const clampedDay = Math.min(Math.max(currentDay, 1), 66);
  const week = Math.ceil(clampedDay / 7);
  const progress = Math.round((stats?.completedDays || 0) / 66 * 100);

  // Build day grid
  const dayMap = {};
  logs.forEach(l => { dayMap[l.day_number] = l; });

  const getNextMilestone = () => {
    return milestones.find(m => m.day >= clampedDay) || milestones[milestones.length - 1];
  };
  const nextMs = getNextMilestone();

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '2px', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
              WEEK {week} OF 9
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '56px', letterSpacing: '2px', lineHeight: 1, color: 'var(--text)' }}>
              DAY <span style={{ color: 'var(--accent)' }}>{clampedDay}</span>
            </h1>
          </div>
          <button
            onClick={() => navigate(`/day/${clampedDay}`)}
            style={{
              padding: '14px 28px',
              background: 'var(--accent)',
              color: '#0a0a0a',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >LOG TODAY →</button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {stats?.completedDays || 0} perfect days
            </span>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg3)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              borderRadius: '3px',
              transition: 'width 1s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {[
          { label: 'Current Streak', value: stats?.streak || 0, unit: 'days', color: 'var(--accent)' },
          { label: 'Total Logged', value: stats?.totalDays || 0, unit: 'days', color: 'var(--water)' },
          { label: 'Days Left', value: 66 - clampedDay + 1, unit: 'to go', color: 'var(--muted)' },
          { label: 'Week', value: week, unit: 'of 9', color: 'var(--meditation)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px 20px'
          }}>
            <div style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: s.color, letterSpacing: '1px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '2px' }}>{s.unit}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Next milestone */}
      {nextMs && (
        <div style={{
          background: 'rgba(232,255,71,0.04)',
          border: '1px solid rgba(232,255,71,0.15)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '40px',
          display: 'flex', gap: '16px', alignItems: 'flex-start'
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--accent)',
            lineHeight: 1, flexShrink: 0
          }}>D{nextMs.day}</div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '1.5px', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              NEXT MILESTONE
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>{nextMs.text}</div>
          </div>
        </div>
      )}

      {/* Habit stats */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', marginBottom: '16px', color: 'var(--muted)' }}>
          HABIT TOTALS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {HABITS.map(h => {
            const cfg = HABIT_CONFIG[h];
            const count = stats?.habitTotals?.[h] || 0;
            const pct = Math.round(count / 66 * 100);
            return (
              <div key={h} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px' }}>{cfg.icon} {cfg.label}</span>
                  <span style={{ fontSize: '12px', color: cfg.color, fontFamily: 'var(--font-mono)' }}>{count}/66</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg3)', borderRadius: '2px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: '2px', transition: 'width 1s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day grid */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--muted)' }}>
            66-DAY GRID
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            ● complete &nbsp; ◌ partial &nbsp; · upcoming
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(11, 1fr)',
          gap: '6px'
        }}>
          {Array.from({ length: 66 }, (_, i) => {
            const day = i + 1;
            const log = dayMap[day];
            const isPast = day < clampedDay;
            const isToday = day === clampedDay;
            const isFuture = day > clampedDay;

            let habitsChecked = 0;
            if (log) {
              HABITS.forEach(h => { if (log[`${h}_done`]) habitsChecked++; });
            }
            const isComplete = habitsChecked === 6;
            const isPartial = habitsChecked > 0 && habitsChecked < 6;

            const bg = isComplete ? 'var(--accent)' :
                       isPartial ? 'rgba(232,255,71,0.3)' :
                       isToday ? 'rgba(232,255,71,0.1)' : 'var(--bg3)';
            const border = isToday ? '1px solid var(--accent)' : '1px solid transparent';
            const textColor = isComplete ? '#0a0a0a' : isFuture ? 'var(--border)' : 'var(--muted)';

            return (
              <Link key={day} to={`/day/${day}`}
                title={`Day ${day}`}
                style={{
                  aspectRatio: '1',
                  background: bg,
                  border: border,
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: textColor,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontWeight: isToday ? 600 : 400
                }}
                onMouseEnter={e => { if (!isComplete) e.currentTarget.style.background = 'var(--bg2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = bg; }}
              >
                {day}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Week dividers legend */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          ['1–7', 'FOUNDATION'], ['8–14', 'SETTLING IN'], ['15–21', 'BUILDING'],
          ['22–28', 'TESTING'], ['29–35', 'STRENGTHENING'], ['36–42', 'MOMENTUM'],
          ['43–49', 'PUSH'], ['50–56', 'PEAK'], ['57–66', 'FINISH']
        ].map(([days, title], i) => (
          <Link key={i} to={`/plan/week/${i + 1}`} style={{
            padding: '6px 12px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            fontSize: '11px',
            color: 'var(--muted)',
            letterSpacing: '0.5px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            {days} · {title}
          </Link>
        ))}
      </div>
    </div>
  );
}
