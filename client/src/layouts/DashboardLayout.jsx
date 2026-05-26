import Sidebar from '../components/common/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
