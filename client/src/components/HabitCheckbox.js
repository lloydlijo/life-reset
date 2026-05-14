const HABIT_CONFIG = {
  sleep:      { label: 'Sleep',       color: 'var(--sleep)',      icon: '🌙' },
  water:      { label: 'Water',       color: 'var(--water)',      icon: '💧' },
  exercise:   { label: 'Exercise',    color: 'var(--exercise)',   icon: '⚡' },
  meditation: { label: 'Meditation',  color: 'var(--meditation)', icon: '🧠' },
  screen:     { label: 'Screen Time', color: 'var(--screen)',     icon: '📵' },
  cold:       { label: 'Cold Shower', color: 'var(--cold)',       icon: '❄️' },
};

export { HABIT_CONFIG };

export default function HabitCheckbox({ habit, checked, onChange, target, disabled }) {
  const config = HABIT_CONFIG[habit];
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        background: checked ? `${config.color}12` : 'var(--bg3)',
        border: `1px solid ${checked ? config.color + '60' : 'var(--border)'}`,
        borderRadius: '12px',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s',
        width: '100%',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1
      }}
    >
      {/* Checkbox circle */}
      <div style={{
        width: '24px', height: '24px',
        borderRadius: '50%',
        border: `2px solid ${checked ? config.color : 'var(--border)'}`,
        background: checked ? config.color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s'
      }}>
        {checked && <span style={{ color: '#0a0a0a', fontSize: '12px', fontWeight: 700 }}>✓</span>}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 500, fontSize: '14px', color: checked ? config.color : 'var(--text)'
        }}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </div>
        {target && (
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{target}</div>
        )}
      </div>
    </button>
  );
}
