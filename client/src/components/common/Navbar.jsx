import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'recruiter' ? '/recruiter' : user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-lg">
              Smart<span className="text-indigo-600">Hire</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`btn-ghost text-sm ${location.pathname === '/jobs' ? 'text-indigo-600 bg-indigo-50' : ''}`}
            >
              Browse Jobs
            </Link>
            {user && (
              <Link to={dashboardLink} className="btn-ghost text-sm">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors">
                  <div className="h-7 w-7 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm text-zinc-500">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden btn-ghost" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-zinc-100 animate-fade-in">
            <Link to="/jobs" className="block btn-ghost" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            {user && <Link to={dashboardLink} className="block btn-ghost" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {user ? (
              <>
                <Link to="/profile" className="block btn-ghost" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block btn-ghost w-full text-left text-rose-500">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block btn-ghost" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="block btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
