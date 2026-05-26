import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Spinner from '../components/common/Spinner';
import { MapPin, Clock, DollarSign, Briefcase, ExternalLink, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));

    if (user?.role === 'candidate') {
      api.get('/applications/my')
        .then(({ data }) => {
          setApplied(data.applications.some(a => a.job?._id === id));
        }).catch(() => {});
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    if (!user.resume) return toast.error('Please upload your resume before applying');
    setApplying(true);
    try {
      await api.post(`/applications/apply/${id}`, { coverLetter });
      setApplied(true);
      setShowApply(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center"><p>Job not found.</p></div>;

  const formatSalary = () => {
    if (!job.salary?.min) return 'Not disclosed';
    return `$${(job.salary.min / 1000).toFixed(0)}k – $${(job.salary.max / 1000).toFixed(0)}k / year`;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/jobs" className="btn-ghost text-sm mb-6 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card p-8">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-indigo-700 font-bold text-2xl">{job.company?.name?.[0]}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900">{job.title}</h1>
                  <p className="text-zinc-500 mt-1">{job.company?.name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge badge-primary">{job.type}</span>
                    <span className="badge badge-gray"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="badge badge-gray">{job.experience}</span>
                    <span className="badge badge-gray"><DollarSign className="h-3 w-3" />{formatSalary()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                {user?.role === 'candidate' && (
                  applied ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle className="h-5 w-5" />
                      Application Submitted
                    </div>
                  ) : (
                    <button onClick={() => setShowApply(!showApply)} className="btn-primary">
                      <Send className="h-4 w-4" />
                      Apply Now
                    </button>
                  )
                )}
                {!user && (
                  <Link to="/login" className="btn-primary">
                    <Send className="h-4 w-4" /> Sign in to Apply
                  </Link>
                )}
                {job.company?.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer" className="btn-secondary">
                    <ExternalLink className="h-4 w-4" />
                    Company Site
                  </a>
                )}
              </div>

              {showApply && (
                <div className="mt-6 pt-6 border-t border-zinc-100 animate-fade-in">
                  <label className="label">Cover Letter (optional)</label>
                  <textarea
                    className="input h-32 resize-none"
                    placeholder="Tell the recruiter why you're a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <div className="flex gap-3 mt-3">
                    <button onClick={handleApply} disabled={applying} className="btn-primary">
                      {applying ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Application'}
                    </button>
                    <button onClick={() => setShowApply(false)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-8">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Job Description</h2>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{job.description}</p>

              {job.requirements?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-zinc-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-600 text-sm">
                        <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.responsibilities?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-zinc-900 mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-zinc-600 text-sm">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="card p-8">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Category', value: job.category, icon: Briefcase },
                  { label: 'Job Type', value: job.type, icon: Clock },
                  { label: 'Experience', value: job.experience, icon: Briefcase },
                  { label: 'Location', value: job.location, icon: MapPin },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">{label}</p>
                      <p className="text-sm font-medium text-zinc-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-zinc-900 mb-2">About {job.company?.name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{job.company?.description || 'No description available.'}</p>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className="btn-ghost text-sm mt-3 px-0">
                  Visit website →
                </a>
              )}
            </div>

            <p className="text-xs text-zinc-400 text-center">
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
