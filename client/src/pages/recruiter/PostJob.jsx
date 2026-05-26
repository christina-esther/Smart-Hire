import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { Plus, X, Save, Briefcase } from 'lucide-react';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const CATEGORIES = ['Engineering', 'Design', 'Data Science', 'DevOps', 'Marketing', 'Finance', 'Product', 'Sales'];
const EXPERIENCE = ['Fresher', '1-3 years', '3-5 years', '5+ years'];

const defaultForm = {
  title: '', description: '', location: '', type: 'Full-time',
  experience: 'Fresher', category: 'Engineering',
  'salary.min': '', 'salary.max': '',
  'company.name': '', 'company.website': '', 'company.description': '',
  status: 'active',
};

export default function PostJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [skills, setSkills] = useState([]);
  const [requirements, setRequirements] = useState(['']);
  const [responsibilities, setResponsibilities] = useState(['']);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/jobs/${id}`).then(({ data }) => {
      const j = data.job;
      setForm({
        title: j.title, description: j.description, location: j.location,
        type: j.type, experience: j.experience, category: j.category,
        'salary.min': j.salary?.min || '', 'salary.max': j.salary?.max || '',
        'company.name': j.company?.name || '', 'company.website': j.company?.website || '',
        'company.description': j.company?.description || '', status: j.status,
      });
      setSkills(j.skills || []);
      setRequirements(j.requirements?.length ? j.requirements : ['']);
      setResponsibilities(j.responsibilities?.length ? j.responsibilities : ['']);
    }).catch(() => toast.error('Failed to load job')).finally(() => setFetching(false));
  }, [id, isEditing]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };

  const updateList = (list, setList, idx, val) => {
    const copy = [...list]; copy[idx] = val; setList(copy);
  };

  const addListItem = (list, setList) => setList([...list, '']);
  const removeListItem = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form['company.name'] || !form.location) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    const payload = {
      title: form.title, description: form.description, location: form.location,
      type: form.type, experience: form.experience, category: form.category,
      status: form.status,
      salary: { min: Number(form['salary.min']) || 0, max: Number(form['salary.max']) || 0 },
      company: { name: form['company.name'], website: form['company.website'], description: form['company.description'] },
      skills,
      requirements: requirements.filter(Boolean),
      responsibilities: responsibilities.filter(Boolean),
    };
    try {
      if (isEditing) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job updated successfully!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted successfully!');
      }
      navigate('/recruiter');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          {isEditing ? 'Edit Job' : 'Post a New Job'}
        </h1>
        <p className="page-subtitle">Fill in the details below to {isEditing ? 'update your' : 'publish a new'} job listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-zinc-900 mb-5">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Job Title *</label>
              <input className="input" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div>
              <label className="label">Location *</label>
              <input className="input" placeholder="e.g. San Francisco, CA or Remote" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
            <div>
              <label className="label">Job Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Experience Required</label>
              <select className="input" value={form.experience} onChange={e => set('experience', e.target.value)}>
                {EXPERIENCE.map(ex => <option key={ex}>{ex}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Min Salary (USD/year)</label>
              <input type="number" className="input" placeholder="e.g. 80000" value={form['salary.min']} onChange={e => set('salary.min', e.target.value)} />
            </div>
            <div>
              <label className="label">Max Salary (USD/year)</label>
              <input type="number" className="input" placeholder="e.g. 120000" value={form['salary.max']} onChange={e => set('salary.max', e.target.value)} />
            </div>
            {isEditing && (
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h2 className="font-semibold text-zinc-900 mb-5">Job Description *</h2>
          <textarea
            className="input h-40 resize-none"
            placeholder="Describe the role, team, and what success looks like..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            required
          />
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="font-semibold text-zinc-900 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm border border-indigo-100">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter(sk => sk !== s))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Add skill (press Enter)" value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" onClick={addSkill} className="btn-secondary px-4"><Plus className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Requirements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Requirements</h2>
            <button type="button" onClick={() => addListItem(requirements, setRequirements)} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" placeholder={`Requirement ${i + 1}`} value={req}
                  onChange={e => updateList(requirements, setRequirements, i, e.target.value)} />
                {requirements.length > 1 && (
                  <button type="button" onClick={() => removeListItem(requirements, setRequirements, i)}
                    className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900">Responsibilities</h2>
            <button type="button" onClick={() => addListItem(responsibilities, setResponsibilities)} className="btn-ghost text-sm">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {responsibilities.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" placeholder={`Responsibility ${i + 1}`} value={r}
                  onChange={e => updateList(responsibilities, setResponsibilities, i, e.target.value)} />
                {responsibilities.length > 1 && (
                  <button type="button" onClick={() => removeListItem(responsibilities, setResponsibilities, i)}
                    className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="card p-6">
          <h2 className="font-semibold text-zinc-900 mb-5">Company Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name *</label>
              <input className="input" placeholder="e.g. TechCorp Inc." value={form['company.name']} onChange={e => set('company.name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Company Website</label>
              <input type="url" className="input" placeholder="https://company.com" value={form['company.website']} onChange={e => set('company.website', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Company Description</label>
              <textarea className="input h-24 resize-none" placeholder="Brief description of your company..." value={form['company.description']} onChange={e => set('company.description', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pb-6">
          <button type="button" onClick={() => navigate('/recruiter')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Saving...' : isEditing ? 'Update Job' : 'Publish Job'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
