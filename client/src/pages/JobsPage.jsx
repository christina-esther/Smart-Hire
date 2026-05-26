import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import JobCard from '../components/common/JobCard';
import Spinner from '../components/common/Spinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const CATEGORIES = ['Engineering', 'Design', 'Data Science', 'DevOps', 'Marketing', 'Finance', 'Product', 'Sales'];
const EXPERIENCE = ['Fresher', '1-3 years', '3-5 years', '5+ years'];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    experience: searchParams.get('experience') || '',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (user?.role === 'candidate') {
      api.get('/users/saved-jobs').then(({ data }) => {
        setSavedJobs(data.jobs.map(j => j._id));
      }).catch(() => {});
    }
  }, [user]);

  const handleSave = async (jobId) => {
    if (!user) return toast.error('Sign in to save jobs');
    try {
      const { data } = await api.post(`/users/save-job/${jobId}`);
      setSavedJobs(prev => data.saved ? [...prev, jobId] : prev.filter(id => id !== jobId));
      toast.success(data.message);
    } catch {
      toast.error('Failed to save job');
    }
  };

  const applyFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', type: '', category: '', experience: '' });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      {/* Search Header */}
      <div className="bg-white border-b border-zinc-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-6">Find Your Next Role</h1>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                className="input pl-12"
                placeholder="Job title, skills, or company..."
                value={filters.search}
                onChange={(e) => { setFilters(prev => ({ ...prev, search: e.target.value })); setPage(1); }}
              />
            </div>
            <input
              type="text"
              className="input w-48"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => { setFilters(prev => ({ ...prev, location: e.target.value })); setPage(1); }}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary gap-2 ${hasFilters ? 'border-indigo-400 text-indigo-600' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {hasFilters && <span className="bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">!</span>}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost text-rose-500">
                <X className="h-4 w-4" /> Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Job Type</p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => (
                    <button key={t} onClick={() => applyFilter('type', t)}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${filters.type === t ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => applyFilter('category', c)}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${filters.category === c ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Experience</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE.map(e => (
                    <button key={e} onClick={() => applyFilter('experience', e)}
                      className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${filters.experience === e ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-500 text-sm">
            {loading ? 'Searching...' : `${total} jobs found`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-zinc-500 text-lg">No jobs match your criteria</p>
            <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                onSave={user?.role === 'candidate' ? handleSave : null}
                isSaved={savedJobs.includes(job._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-4 py-2 disabled:opacity-40">← Prev</button>
            <span className="flex items-center px-4 text-sm text-zinc-500">Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn-secondary px-4 py-2 disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
