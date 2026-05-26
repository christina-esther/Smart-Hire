export default function StatCard({ label, value, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="stat-card animate-slide-up">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 mt-0.5">{value}</p>
        {trend && <p className="text-xs text-emerald-600 mt-1">{trend}</p>}
      </div>
    </div>
  );
}
