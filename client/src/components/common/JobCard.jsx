import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeColors = {
  'Full-time': 'badge-primary',
  'Part-time': 'badge-warning',
  'Contract': 'badge-gray',
  'Internship': 'badge-success',
  'Remote': 'badge-success',
};

export default function JobCard({ job, onSave, isSaved, compact }) {
  const formatSalary = (salary) => {
    if (!salary?.min) return null;
    const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n;
    return `$${fmt(salary.min)} – $${fmt(salary.max)}`;
  };

  return (
    <div className="card p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Company Avatar */}
          <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
            <span className="text-indigo-700 font-bold text-base">{job.company?.name?.[0]}</span>
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job._id}`}
              className="font-semibold text-zinc-900 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            <p className="text-sm text-zinc-500 mt-0.5">{job.company?.name}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className={`badge ${typeColors[job.type] || 'badge-gray'}`}>{job.type}</span>
              <span className="badge badge-gray">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              {formatSalary(job.salary) && (
                <span className="badge badge-gray">
                  <DollarSign className="h-3 w-3" />
                  {formatSalary(job.salary)}
                </span>
              )}
            </div>

            {!compact && job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded-lg">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs rounded-lg">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {onSave && (
          <button
            onClick={() => onSave(job._id)}
            className="shrink-0 p-2 rounded-xl hover:bg-indigo-50 text-zinc-400 hover:text-indigo-600 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-indigo-600" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
        <span className="text-xs text-zinc-400">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </span>
        <Link to={`/jobs/${job._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          View Details →
        </Link>
      </div>
    </div>
  );
}
