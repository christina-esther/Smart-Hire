import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8">
        <Briefcase className="h-8 w-8 text-indigo-600" />
      </div>
      <p className="text-8xl font-bold text-zinc-200 font-mono">404</p>
      <h1 className="text-2xl font-bold text-zinc-900 mt-4">Page Not Found</h1>
      <p className="text-zinc-500 mt-2 max-w-sm">
        Looks like this page took a career break. Let's get you back on track.
      </p>
      <div className="flex gap-3 mt-8">
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link to="/jobs" className="btn-secondary">Browse Jobs</Link>
      </div>
    </div>
  );
}
