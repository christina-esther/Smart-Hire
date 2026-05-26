import { Link } from 'react-router-dom';
import { Briefcase, Zap, Users, TrendingUp, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const features = [
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our Gemini-powered engine analyzes your skills and recommends jobs with pinpoint accuracy.' },
  { icon: Users, title: 'Top Tier Companies', desc: 'Connect with thousands of verified employers from startups to Fortune 500 companies.' },
  { icon: TrendingUp, title: 'Career Insights', desc: 'Track your applications, get interview tips, and grow your career with smart analytics.' },
];

const stats = [
  { value: '50K+', label: 'Active Jobs' },
  { value: '120K+', label: 'Candidates' },
  { value: '8K+', label: 'Companies' },
  { value: '92%', label: 'Placement Rate' },
];

const categories = [
  'Engineering', 'Design', 'Data Science', 'Marketing', 'DevOps', 'Finance', 'Product', 'Sales',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-white pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Job Matching
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 leading-tight max-w-4xl mx-auto">
            Find Your Dream Job with{' '}
            <span className="text-indigo-600 relative">
              AI Intelligence
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10 Q75 2 150 6 Q225 10 298 4" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="mt-8 text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            SmartHire uses cutting-edge AI to match your unique skills with the perfect opportunities. Stop scrolling, start landing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-indigo-200 hover:shadow-indigo-300">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/jobs" className="btn-secondary text-base px-8 py-3.5">
              Browse Jobs
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-zinc-400">
            {['No credit card required', 'Free for candidates', '500+ new jobs daily'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="text-zinc-400 mt-1 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900">Why SmartHire?</h2>
            <p className="text-zinc-500 mt-4 max-w-xl mx-auto">Everything you need to land your next role, powered by the latest AI technology.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-8 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h3>
                <p className="text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">Explore by Category</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/jobs?category=${cat}`}
                className="px-6 py-3 bg-white rounded-2xl border border-zinc-200 text-zinc-700 font-medium hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-400/30 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Hired?</h2>
              <p className="text-indigo-200 mb-8 text-lg">Join 120,000+ professionals who found their dream job on SmartHire.</p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-900">Smart<span className="text-indigo-600">Hire</span></span>
          </div>
          <p className="text-zinc-400 text-sm">© 2024 SmartHire. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
