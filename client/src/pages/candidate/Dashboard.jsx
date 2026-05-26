import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import JobCard from '../../components/common/JobCard';
import Spinner from '../../components/common/Spinner';
import { Briefcase, BookmarkIcon, FileText, Zap, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', color: 'badge-gray', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'badge-warning', icon: AlertCircle },
  shortlisted: { label: 'Shortlisted', color: 'badge-primary', icon: CheckCircle },
  hired: { label: 'Hired', color: 'badge-success', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'badge-danger', icon: XCircle },
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiPowered, setAiPowered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, savedRes, recRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/users/saved-jobs'),
          api.get('/ai/recommendations'),
        ]);
        setApplications(appsRes.data.applications);
        setSavedJobs(savedRes.data.jobs);
        setRecommendations(recRes.data.jobs);
        setAiPowered(recRes.data.aiPowered);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'primary' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: BookmarkIcon, color: 'amber' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: CheckCircle, color: 'emerald' },
    { label: 'AI Matches', value: recommendations.length, icon: Zap, color: 'rose' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's an overview of your job search activity</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Profile incomplete warning */}
          {!user?.resume && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-amber-800 text-sm">Complete your profile to apply for jobs</p>
                <p className="text-amber-600 text-xs mt-0.5">Upload your resume to start applying</p>
              </div>
              <Link to="/profile" className="btn-primary text-sm py-2 bg-amber-600 hover:bg-amber-700">
                Complete Profile
              </Link>
            </div>
          )}

          {/* Applications */}
          {(activeTab === 'overview' || activeTab === 'applications') && (
            <div className="card mb-6">
              <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900">My Applications</h2>
                <span className="badge badge-gray">{applications.length}</span>
              </div>
              {applications.length === 0 ? (
                <div className="p-10 text-center text-zinc-400">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No applications yet. <Link to="/jobs" className="text-indigo-600">Browse jobs</Link></p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {applications.slice(0, activeTab === 'applications' ? 100 : 5).map((app) => {
                    const cfg = statusConfig[app.status] || statusConfig.pending;
                    return (
                      <div key={app._id} className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                          <span className="text-indigo-700 font-bold text-sm">{app.job?.company?.name?.[0] || '?'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 truncate">{app.job?.title}</p>
                          <p className="text-sm text-zinc-500">{app.job?.company?.name} · {app.job?.location}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                          <span className="text-xs text-zinc-400 hidden sm:block">
                            {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Saved Jobs */}
          {(activeTab === 'overview' || activeTab === 'saved') && savedJobs.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-zinc-900 mb-4">Saved Jobs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {savedJobs.slice(0, 4).map(job => <JobCard key={job._id} job={job} compact />)}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {(activeTab === 'overview' || activeTab === 'recommended') && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-semibold text-zinc-900">AI Recommendations</h2>
                {aiPowered ? (
                  <span className="badge badge-primary"><Zap className="h-3 w-3" />Gemini AI</span>
                ) : (
                  <span className="badge badge-gray">Skill-based</span>
                )}
              </div>
              {recommendations.length === 0 ? (
                <div className="card p-10 text-center text-zinc-400">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>Add skills to your profile to get personalized recommendations.</p>
                  <Link to="/profile" className="btn-primary mt-4">Update Profile</Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.map(job => <JobCard key={job._id} job={job} compact />)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
