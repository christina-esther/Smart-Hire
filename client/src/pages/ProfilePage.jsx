import { useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';
import { Upload, Plus, X, Save, FileText, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    experience: user?.experience || 0,
    education: user?.education || '',
  });

  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { ...form, skills });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    setUploading(true);
    try {
      const { data } = await api.post('/users/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ resume: data.user.resume, resumeOriginalName: data.user.resumeOriginalName });
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Keep your profile up to date to get better job matches</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar & Resume */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="h-20 w-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-indigo-700 font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <p className="font-semibold text-zinc-900">{user?.name}</p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <span className="badge badge-primary mt-2">{user?.role}</span>
          </div>

          {user?.role === 'candidate' && (
            <div className="card p-6">
              <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                Resume
              </h3>
              {user?.resumeOriginalName ? (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm text-emerald-700 font-medium truncate">{user.resumeOriginalName}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Uploaded ✓</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 mb-4">No resume uploaded yet</p>
              )}
              <input type="file" ref={fileRef} onChange={handleResumeUpload} accept=".pdf,.doc,.docx" className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-secondary w-full justify-center text-sm">
                {uploading ? <Spinner size="sm" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading...' : user?.resume ? 'Replace Resume' : 'Upload Resume'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-zinc-900 mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Personal Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="City, State" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              {user?.role === 'candidate' && (
                <div>
                  <label className="label">Years of Experience</label>
                  <input type="number" min="0" className="input" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                </div>
              )}
              {user?.role === 'candidate' && (
                <div className="sm:col-span-2">
                  <label className="label">Education</label>
                  <input className="input" placeholder="e.g. B.S. Computer Science" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="label">Bio</label>
                <textarea className="input h-28 resize-none" placeholder="Tell recruiters about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
          </div>

          {user?.role === 'candidate' && (
            <div className="card p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                {skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm border border-indigo-100">
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-indigo-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Add a skill (e.g. React, Python)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="btn-secondary px-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary px-8">
              {saving ? <Spinner size="sm" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
