import { useState } from 'react';
import { useAuth } from '../store/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!displayName.trim()) {
          setError('Display name is required');
          return;
        }
        const ok = await register(username.trim(), password, displayName.trim());
        if (!ok) setError('Username already taken');
      } else {
        const ok = await login(username.trim(), password);
        if (!ok) setError('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-civic-950 to-slate-900 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-civic-600 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Shadow Legislature</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-md">
          A direct democracy platform where citizens review, discuss, and vote on real legislation.
          By your own standards, be the measure.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your public name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-civic-600 hover:text-civic-700 font-medium w-full text-center"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        {/* Test Users */}
        <div className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Test Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            {['alice', 'bob', 'carol', 'dave', 'eve'].map(name => (
              <button
                key={name}
                onClick={() => { setUsername(name); setPassword('demo123'); setIsRegister(false); }}
                className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm text-white font-medium">{name}</span>
                <span className="text-xs text-slate-500 block">demo123</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
