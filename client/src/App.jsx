import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const [authPage, setAuthPage] = useState('login'); // login, register

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Restoring Session...</p>
      </div>
    );
  }

  // Route to dashboard if logged in
  if (user) {
    return <Dashboard />;
  }

  // Otherwise route to auth flow pages
  return authPage === 'login' ? (
    <Login onNavigate={setAuthPage} />
  ) : (
    <Register onNavigate={setAuthPage} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
