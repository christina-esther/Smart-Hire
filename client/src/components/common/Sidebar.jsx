import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard, BookmarkIcon, FileText, PlusCircle, Users, BarChart3, Settings } from 'lucide-react';

const candidateLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { to: '/dashboard?tab=applications', label: 'My Applications', icon: FileText },
  { to: '/dashboard?tab=saved', label: 'Saved Jobs', icon: BookmarkIcon },
  { to: '/dashboard?tab=recommended', label: 'AI Recommendations', icon: BarChart3 },
  { to: '/profile', label: 'My Profile', icon: User },
];

const recruiterLinks = [
  { to: '/recruiter', label: 'Overview', icon: LayoutDashboard },
  { to: '/recruiter/post-job', label: 'Post a Job', icon: PlusCircle },
  { to: '/profile', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin?tab=users', label: 'Users', icon: Users },
  { to: '/admin?tab=jobs', label: 'Jobs', icon: Briefcase },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'recruiter' ? recruiterLinks : user?.role === 'admin' ? adminLinks : candidateLinks;

  const roleColors = { candidate: 'bg-indigo-100 text-indigo-700', recruiter: 'bg-emerald-100 text-emerald-700', admin: 'bg-amber-100 text-amber-700' };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-zinc-200 flex flex-col min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-zinc-100">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-zinc-900">Smart<span className="text-indigo-600">Hire</span></span>
        </NavLink>
      </div>

      {/* User Info */}
      <div className="px-4 py-5 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-indigo-700 font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-zinc-900 text-sm truncate">{user?.name}</p>
            <span className={`badge text-xs ${roleColors[user?.role]}`}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.includes('?') ? false : true}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-100">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
