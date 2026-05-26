import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Briefcase, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);
      const routes = { candidate: '/dashboard', recruiter: '/recruiter', admin: '/admin' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Candidate', email: 'alex@example.com' },
    { label: 'Recruiter', email: 'recruiter@techcorp.io' },
    { label: 'Admin', email: 'admin@smarthire.io' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900">Smart<span className="text-indigo-600">Hire</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
          <p className="text-zinc-500 mt-1">Sign in to your account to continue</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-100">
            <p className="text-xs text-zinc-400 mb-3 text-center">Quick demo access (password: password123)</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(({ label, email }) => (
                <button
                  key={label}
                  onClick={() => setForm({ email, password: 'password123' })}
                  className="py-2 text-xs bg-zinc-50 hover:bg-indigo-50 hover:text-indigo-700 text-zinc-600 rounded-xl border border-zinc-200 transition-colors font-medium"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
