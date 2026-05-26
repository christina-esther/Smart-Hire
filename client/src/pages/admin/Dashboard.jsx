import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';
import { Users, Briefcase, FileText, TrendingUp, ShieldCheck, ShieldOff, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => {
        setStats(data.stats);
        setRecentJobs(data.recentJobs);
        setRecentApps(data.recentApplications);
      })
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab !== 'users') return;
    setUsersLoading(true);
    api.get('/users', { params: { page, limit: 15, search, role: roleFilter } })
      .then(({ data }) => { setUsers(data.users); setUserTotal(data.total); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setUsersLoading(false));
  }, [activeTab, page, search, roleFilter]);

  const toggleUser = async (userId, current) => {
    try {
      const { data } = await api.patch(`/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const roleColors = { candidate: 'badge-primary', recruiter: 'badge-success', admin: 'badge-warning' };

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform-wide overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} color="primary" trend={`+${stats?.newUsers || 0} this month`} />
        <StatCard label="Total Jobs" value={stats?.totalJobs || 0} icon={Briefcase} color="emerald" trend={`+${stats?.newJobs || 0} this month`} />
        <StatCard label="Applications" value={stats?.totalApplications || 0} icon={FileText} color="amber" />
        <StatCard label="Active Jobs" value={stats?.activeJobs || 0} icon={TrendingUp} color="rose" />
      </div>

      {/* Sub-stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Candidates / Recruiters</p>
            <p className="font-bold text-zinc-900 text-lg">{stats?.candidates} <span className="text-zinc-300 font-normal">/</span> {stats?.recruiters}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Active / Total Jobs</p>
            <p className="font-bold text-zinc-900 text-lg">{stats?.activeJobs} <span className="text-zinc-300 font-normal">/</span> {stats?.totalJobs}</p>
          </div>
        </div>
      </div>

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center gap-3 flex-wrap">
            <h2 className="font-semibold text-zinc-900 flex-1">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                className="input pl-9 text-sm py-2 w-48"
                placeholder="Search users..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="input text-sm py-2 w-36" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
              <option value="">All Roles</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {usersLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : (
            <>
              <div className="divide-y divide-zinc-100">
                {users.map(u => (
                  <div key={u._id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-indigo-700 font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-900 text-sm truncate">{u.name}</p>
                        <span className={`badge text-xs ${roleColors[u.role]}`}>{u.role}</span>
                        {!u.isActive && <span className="badge badge-danger text-xs">Inactive</span>}
                      </div>
                      <p className="text-xs text-zinc-500">{u.email} · Joined {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</p>
                    </div>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleUser(u._id, u.isActive)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-600 hover:bg-accent-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? <><ShieldOff className="h-3.5 w-3.5" /> Deactivate</> : <><ShieldCheck className="h-3.5 w-3.5" /> Activate</>}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500">
                <span>{userTotal} total users</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost py-1 px-3 text-sm disabled:opacity-40">← Prev</button>
                  <button disabled={users.length < 15} onClick={() => setPage(p => p + 1)} className="btn-ghost py-1 px-3 text-sm disabled:opacity-40">Next →</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="card">
            <div className="px-6 py-5 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-900">Recent Jobs</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentJobs.map(job => (
                <div key={job._id} className="px-6 py-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-900 text-sm">{job.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{job.company?.name} · {job.location}</p>
                    </div>
                    <span className={`badge shrink-0 ${job.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{job.status}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })} by {job.postedBy?.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div className="px-6 py-5 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-900">Recent Applications</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentApps.map(app => (
                <div key={app._id} className="px-6 py-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-900 text-sm">{app.applicant?.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Applied to: {app.job?.title}</p>
                    </div>
                    <span className={`badge shrink-0 ${
                      app.status === 'shortlisted' ? 'badge-primary' :
                      app.status === 'hired' ? 'badge-success' :
                      app.status === 'rejected' ? 'badge-danger' : 'badge-gray'
                    }`}>{app.status}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5">{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
