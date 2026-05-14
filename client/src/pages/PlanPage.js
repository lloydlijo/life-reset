import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const WEEK_COLORS = [
  'var(--water)', 'var(--sleep)', 'var(--exercise)', 'var(--accent2)',
  'var(--accent)', 'var(--meditation)', 'var(--cold)', 'var(--accent2)', 'var(--accent)'
];

const RULES = [
  { n: '01', title: 'NEVER MISS TWICE', text: 'If you miss a day — fine. But NEVER miss two days in a row. One miss is an accident. Two is a new habit forming.' },
  { n: '02', title: 'SHOW UP BAD', text: 'Had no sleep? Do 5 minutes anyway. Tired? Walk instead of run. Doing something badly beats doing nothing perfectly.' },
  { n: '03', title: 'GUIDE NOT PRISON', text: 'If Week 3 feels too hard, repeat Week 2. If it feels too easy, look ahead. The goal is consistent progress — not perfection.' },
  { n: '04', title: 'TRACK EVERY DAY', text: 'Your streak is your accountability. Looking at a 14-day streak is a powerful reason not to break it. Use that psychology.' },
  { n: '05', title: 'PROTEIN EVERY MEAL', text: 'For muscle + fat loss: aim for 1 palm-sized serving per meal (eggs, chicken, fish, lentils, yogurt). Just add protein.' },
];

export default function PlanPage() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/plan/weeks').then(res => setWeeks(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '2px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          THE FULL PROGRAM
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '56px', letterSpacing: '3px', lineHeight: 1 }}>
          66-DAY <span style={{ color: 'var(--accent)' }}>PLAN</span>
        </h1>
        <p style={{ marginTop: '12px', color: 'var(--muted)', maxWidth: '560px', lineHeight: 1.7 }}>
          9 weeks. 6 habit areas. Every week builds on the last.
          Click any week to see the full workout, targets, and method.
        </p>
      </div>

      {/* 6 habits intro */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '16px' }}>
          THE 6 HABIT AREAS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {[
            { icon: '🌙', label: 'SLEEP', color: 'var(--sleep)', text: 'Foundation of everything. No sleep = no muscle, no fat loss, no focus.' },
            { icon: '💧', label: 'WATER', color: 'var(--water)', text: 'Most beginners are chronically dehydrated. Affects energy, hunger, and skin.' },
            { icon: '⚡', label: 'EXERCISE', color: 'var(--exercise)', text: 'Full bodyweight + dumbbell program. Builds strength, burns fat, improves stamina.' },
            { icon: '🧠', label: 'MIND', color: 'var(--meditation)', text: 'Daily meditation + focus practice. Builds mental clarity, reduces anxiety.' },
            { icon: '📵', label: 'SCREEN TIME', color: 'var(--screen)', text: 'Your biggest hidden enemy. Cutting it frees up time, improves sleep, reduces anxiety.' },
            { icon: '❄️', label: 'COLD SHOWER', color: 'var(--cold)', text: 'Trains mental toughness, reduces inflammation, wakes you up better than coffee.' },
          ].map(h => (
            <div key={h.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{h.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1.5px', color: h.color }}>
                  {h.label}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Week cards */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '16px' }}>
          WEEK BY WEEK
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {weeks.map((w, i) => (
            <Link key={w.week} to={`/plan/week/${w.week}`} style={{
              display: 'block',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '20px 22px',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = WEEK_COLORS[i]; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: WEEK_COLORS[i] }}>
                    WEEK {w.week} · DAYS {w.days}
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '1.5px', marginTop: '4px' }}>
                    {w.title}
                  </div>
                </div>
                <span style={{ fontSize: '20px', opacity: 0.6 }}>→</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>
                "{w.tagline}"
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  ['🌙', w.targets.sleep],
                  ['💧', w.targets.water],
                  ['⚡', w.targets.exercise],
                  ['❄️', w.targets.cold]
                ].map(([icon, val]) => (
                  <div key={icon} style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '4px' }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '16px' }}>
          THE 5 RULES
        </h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {RULES.map(r => (
            <div key={r.n} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '18px 22px',
              display: 'flex', gap: '20px', alignItems: 'flex-start'
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '28px',
                color: 'var(--border)', lineHeight: 1, flexShrink: 0, minWidth: '40px'
              }}>{r.n}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1.5px', marginBottom: '6px', color: 'var(--accent)' }}>
                  {r.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
