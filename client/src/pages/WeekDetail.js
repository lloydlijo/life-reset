import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function WeekDetail() {
  const { weekNum } = useParams();
  const week = parseInt(weekNum);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEx, setOpenEx] = useState(null);

  useEffect(() => {
    setLoading(true);
    setOpenEx(null);
    axios.get(`/api/plan/weeks/${week}`).then(res => setData(res.data)).finally(() => setLoading(false));
  }, [week]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!data) return <div style={{ color: 'var(--muted)' }}>Week not found.</div>;

  const t = data.targets;

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: '800px' }}>
      {/* Back */}
      <Link to="/plan" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '13px', marginBottom: '28px', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >← Plan Overview</Link>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
          DAYS {data.days}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', letterSpacing: '2px', lineHeight: 1 }}>
            WEEK <span style={{ color: 'var(--accent)' }}>{data.week}</span> — {data.title}
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {week > 1 && <Link to={`/plan/week/${week - 1}`} style={{ padding: '10px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--muted)' }}>← W{week - 1}</Link>}
            {week < 9 && <Link to={`/plan/week/${week + 1}`} style={{ padding: '10px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--muted)' }}>W{week + 1} →</Link>}
          </div>
        </div>
        <p style={{ marginTop: '10px', color: 'var(--muted)', fontStyle: 'italic', fontSize: '15px' }}>
          "{data.tagline}"
        </p>
      </div>

      {/* Daily targets */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '14px' }}>
          DAILY TARGETS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            { icon: '🌙', label: 'Sleep', val: t.sleep, color: 'var(--sleep)' },
            { icon: '💧', label: 'Water', val: t.water, color: 'var(--water)' },
            { icon: '⚡', label: 'Exercise', val: t.exercise, color: 'var(--exercise)' },
            { icon: '🧠', label: 'Meditation', val: t.meditation, color: 'var(--meditation)' },
            { icon: '📵', label: 'Screen Time', val: t.screen, color: 'var(--screen)' },
            { icon: '❄️', label: 'Cold Shower', val: t.cold, color: 'var(--cold)' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '14px 16px',
              display: 'flex', gap: '12px', alignItems: 'center'
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '2px' }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: item.color, fontWeight: 500 }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout schedule */}
      {data.workout && (
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px' }}>
            WORKOUT SCHEDULE
          </h2>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span>💪 <strong style={{ color: 'var(--text)' }}>{data.workout.strengthDays}</strong> — Strength</span>
            <span>🏃 <strong style={{ color: 'var(--text)' }}>{data.workout.cardioDays}</strong> — {data.workout.cardioType}</span>
          </div>
          {data.workout.cardioNote && (
            <div style={{
              padding: '12px 16px', background: 'rgba(78,205,196,0.08)',
              border: '1px solid rgba(78,205,196,0.2)', borderRadius: '8px',
              fontSize: '13px', color: 'var(--water)', marginBottom: '16px'
            }}>
              🏃 {data.workout.cardioNote}
            </div>
          )}

          {/* Exercise list */}
          <div style={{ display: 'grid', gap: '8px' }}>
            {data.workout.exercises.map((ex, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenEx(openEx === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: openEx === i ? 'rgba(232,255,71,0.06)' : 'var(--bg2)',
                    border: `1px solid ${openEx === i ? 'rgba(232,255,71,0.3)' : 'var(--border)'}`,
                    borderRadius: '10px', padding: '14px 16px',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', gap: '12px', alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)',
                    flexShrink: 0
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: openEx === i ? 'var(--accent)' : 'var(--text)' }}>
                      {ex.name}
                    </div>
                    {ex.sets > 0 && (
                      <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {ex.sets} sets × {ex.reps}{ex.rest ? ` · rest ${ex.rest}` : ''}
                      </div>
                    )}
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '12px', flexShrink: 0, paddingTop: '2px' }}>
                    {openEx === i ? '▲' : '▼'}
                  </span>
                </button>

                {openEx === i && (
                  <div style={{
                    background: 'var(--bg2)',
                    border: '1px solid rgba(232,255,71,0.15)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '16px 20px 16px 54px'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1.5px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>HOW TO DO IT</div>
                      <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7 }}>{ex.how}</div>
                    </div>
                    {ex.why && (
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '1.5px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>WHY</div>
                        <div style={{ fontSize: '13px', color: 'var(--water)', lineHeight: 1.6 }}>{ex.why}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meditation */}
      {data.meditation && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '14px' }}>
            🧠 MEDITATION — {data.meditation.duration.toUpperCase()}
          </h2>
          <div style={{
            background: 'rgba(199,125,255,0.06)', border: '1px solid rgba(199,125,255,0.2)',
            borderRadius: '12px', padding: '20px 22px'
          }}>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.8, marginBottom: '10px' }}>{data.meditation.method}</p>
            <p style={{ fontSize: '12px', color: 'var(--meditation)', fontFamily: 'var(--font-mono)' }}>
              WHEN: {data.meditation.when}
            </p>
          </div>
        </div>
      )}

      {/* Cold shower */}
      {data.cold && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '14px' }}>
            ❄️ COLD SHOWER
          </h2>
          <div style={{
            background: 'rgba(116,192,252,0.06)', border: '1px solid rgba(116,192,252,0.2)',
            borderRadius: '12px', padding: '20px 22px'
          }}>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.8 }}>{data.cold}</p>
          </div>
        </div>
      )}

      {/* Tip */}
      {data.tip && (
        <div style={{
          background: 'rgba(232,255,71,0.04)', border: '1px solid rgba(232,255,71,0.15)',
          borderRadius: '12px', padding: '18px 22px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>PRO TIP</span>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.7 }}>{data.tip}</p>
        </div>
      )}

      {/* Log days for this week */}
      <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '14px' }}>
          LOG THESE DAYS
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Array.from({ length: week === 9 ? 10 : 7 }, (_, i) => {
            const day = (week - 1) * 7 + i + 1;
            if (day > 66) return null;
            return (
              <Link key={day} to={`/day/${day}`} style={{
                padding: '10px 16px',
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px', color: 'var(--muted)',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
              >Day {day}</Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
