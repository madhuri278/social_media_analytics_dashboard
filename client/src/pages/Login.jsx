import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login, error, setError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Clear errors on page load
    setError(null);
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      // Handled by context state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-indigo-600 text-white p-3 rounded-2xl mb-3 shadow-md shadow-indigo-200 dark:shadow-none">
            <BarChart3 size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Log in to manage social profiles & view growth analytics
          </p>
        </div>

        {/* Error notification alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-450 rounded-xl flex items-start gap-2.5 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm border-t border-slate-100 dark:border-slate-850 pt-5">
          <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
