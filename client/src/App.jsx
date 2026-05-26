import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateDashboard from './pages/candidate/Dashboard';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import PostJobPage from './pages/recruiter/PostJob';
import AdminDashboard from './pages/admin/Dashboard';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Spinner from './components/common/Spinner';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner fullScreen />;
  if (user) {
    const redirects = { candidate: '/dashboard', recruiter: '/recruiter', admin: '/admin' };
    return <Navigate to={redirects[user.role] || '/'} replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />

      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="/recruiter" element={<ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/post-job" element={<ProtectedRoute roles={['recruiter']}><PostJobPage /></ProtectedRoute>} />
      <Route path="/recruiter/edit-job/:id" element={<ProtectedRoute roles={['recruiter']}><PostJobPage /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
