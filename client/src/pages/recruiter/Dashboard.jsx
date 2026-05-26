import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';
import { Briefcase, Users, Eye, PlusCircle, Trash2, Edit, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending: 'badge-gray', reviewing: 'badge-warning', shortlisted: 'badge-primary', hired: 'badge-success', rejected: 'badge-danger',
};

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});

  useEffect(() => {
    api.get('/jobs/my-jobs')
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  const loadApplicants = async (jobId) => {
    if (expandedJob === jobId) return setExpandedJob(null);
    setExpandedJob(jobId);
    if (applicants[jobId]) return;
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants(prev => ({ ...prev, [jobId]: data.applications }));
    } catch {
      toast.error('Failed to load applicants');
    }
  };

  const updateStatus = async (appId, status, jobId) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplicants(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(a => a._id === appId ? { ...a, status } : a),
      }));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Delete this job? All applications will be removed.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    const next = currentStatus === 'active' ? 'closed' : 'active';
    try {
      await api.put(`/jobs/${jobId}`, { status: next });
      setJobs(jobs.map(j => j._id === jobId ? { ...j, status: next } : j));
      toast.success(`Job ${next}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const totalApplicants = jobs.reduce((s, j) => s + (j.applicantCount || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="page-subtitle">Manage your job postings and applicants</p>
        </div>
        <Link to="/recruiter/post-job" className="btn-primary">
          <PlusCircle className="h-4 w-4" />
          Post a Job
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Jobs" value={jobs.length} icon={Briefcase} color="primary" />
        <StatCard label="Active Jobs" value={activeJobs} icon={Eye} color="emerald" />
        <StatCard label="Total Applicants" value={totalApplicants} icon={Users} color="amber" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="card p-16 text-center">
          <Briefcase className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 text-lg mb-6">No jobs posted yet</p>
          <Link to="/recruiter/post-job" className="btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="card overflow-hidden">
              {/* Job Row */}
              <div className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-zinc-900">{job.title}</h3>
                    <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5">{job.location} · {job.type} · {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => loadApplicants(job._id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    {job.applicantCount || 0} applicants
                    {expandedJob === job._id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => toggleStatus(job._id, job.status)} className="btn-secondary text-sm py-1.5 px-3">
                    {job.status === 'active' ? 'Close' : 'Reopen'}
                  </button>
                  <Link to={`/recruiter/edit-job/${job._id}`} className="btn-secondary text-sm py-1.5 px-3">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button onClick={() => deleteJob(job._id)} className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Applicants Panel */}
              {expandedJob === job._id && (
                <div className="border-t border-zinc-100 animate-fade-in">
                  {!applicants[job._id] ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : applicants[job._id].length === 0 ? (
                    <div className="py-8 text-center text-zinc-400 text-sm">No applications yet</div>
                  ) : (
                    <div className="divide-y divide-zinc-100">
                      {applicants[job._id].map(app => (
                        <div key={app._id} className="px-5 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                          <div className="h-9 w-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-indigo-700 font-bold text-sm">{app.applicant?.name?.[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-900 text-sm">{app.applicant?.name}</p>
                            <p className="text-xs text-zinc-500">{app.applicant?.email} · {app.applicant?.location}</p>
                            {app.applicant?.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {app.applicant.skills.slice(0, 4).map(s => (
                                  <span key={s} className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded">{s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {app.applicant?.resume && (
                              <a
                                href={`/uploads/${app.applicant.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-ghost text-xs py-1 px-2"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Resume
                              </a>
                            )}
                            <select
                              value={app.status}
                              onChange={e => updateStatus(app._id, e.target.value, job._id)}
                              className="text-xs border border-zinc-200 rounded-xl px-2 py-1.5 bg-white text-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                              {['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
