import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password.trim()) { setError('Fill in both fields.'); return; }
    setLoading(true);
    try {
      if (mode === 'login') await login(username, password);
      else await register(username, password);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(232,255,71,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', left: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '52px',
            letterSpacing: '4px',
            color: 'var(--accent)',
            lineHeight: 1
          }}>LIFE RESET</div>
          <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '8px', letterSpacing: '2px' }}>
            66 DAYS · 6 HABITS · 1 DECISION
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          {/* Tab toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg3)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '28px'
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1,
                padding: '10px',
                borderRadius: '7px',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#0a0a0a' : 'var(--muted)',
                fontWeight: mode === m ? 600 : 400,
                fontSize: '13px',
                letterSpacing: '0.5px',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}>{m === 'login' ? 'Sign In' : 'Start Fresh'}</button>
            ))}
          </div>

          {mode === 'register' && (
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
              Create your account to begin Day 1. Your progress is saved and synced.
            </p>
          )}

          {/* Fields */}
          {[
            { label: 'USERNAME', val: username, set: setUsername, type: 'text', placeholder: 'your_name' },
            { label: 'PASSWORD', val: password, set: setPassword, type: 'password', placeholder: '••••••••' }
          ].map(({ label, val, set, type, placeholder }) => (
            <div key={label} style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '11px', color: 'var(--muted)',
                letterSpacing: '1.5px', marginBottom: '8px', fontFamily: 'var(--font-mono)'
              }}>{label}</label>
              <input
                type={type}
                value={val}
                onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder={placeholder}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,107,53,0.1)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: '8px',
              color: 'var(--accent2)',
              fontSize: '13px',
              marginBottom: '16px'
            }}>{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? 'var(--border)' : 'var(--accent)',
              color: '#0a0a0a',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
              transition: 'all 0.2s',
              marginTop: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading ? <><div className="spinner" style={{ borderTopColor: '#0a0a0a', width: 16, height: 16 }} /> Loading...</> :
              mode === 'login' ? 'ENTER →' : 'BEGIN DAY 1 →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '12px', marginTop: '24px', lineHeight: 1.8 }}>
          By Day 66 you will be unrecognizable<br />compared to Day 1. Trust the progression.
        </p>
      </div>
    </div>
  );
}
