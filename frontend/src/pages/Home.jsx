import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Users, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await api.get('/job/all?limit=6');
        setRecentJobs(res.data.jobs || []);
      } catch (err) {
        console.warn('Could not fetch jobs for homepage:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Job Recruitment & Career Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connect With Your Next <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Dream Opportunity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore thousands of verified vacancies, manage candidate pipelines with our integrated Applicant Tracking System, and eliminate the recruitment black hole.
            </p>

            {/* Interactive Search Box */}
            <form 
              onSubmit={handleSearch}
              className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-indigo-100/60 border border-slate-200/80 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
            >
              <div className="flex items-center flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center flex-1 px-3 py-2">
                <MapPin className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="City, region, or 'Remote'..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center space-x-2"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
              <span className="font-medium">Popular:</span>
              <Link to="/jobs?jobType=Remote" className="hover:text-indigo-600 hover:underline">Remote</Link>
              <span>•</span>
              <Link to="/jobs?search=Frontend" className="hover:text-indigo-600 hover:underline">Frontend</Link>
              <span>•</span>
              <Link to="/jobs?search=Backend" className="hover:text-indigo-600 hover:underline">Backend</Link>
              <span>•</span>
              <Link to="/jobs?jobType=Internship" className="hover:text-indigo-600 hover:underline">Internships</Link>
              <span>•</span>
              <Link to="/jobs?search=Full+Stack" className="hover:text-indigo-600 hover:underline">Full Stack</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="text-center space-y-1">
            <p className="text-3xl font-extrabold text-indigo-600">5,000+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Active Listings</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl font-extrabold text-violet-600">1,200+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Verified Companies</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl font-extrabold text-emerald-600">95%</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Applicant Response Rate</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-3xl font-extrabold text-amber-600">24h</p>
            <p className="text-xs sm:text-sm font-medium text-slate-500">Average Review Time</p>
          </div>
        </div>
      </section>

      {/* Recent Openings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Job Openings</h2>
            <p className="text-sm text-slate-500 mt-1">Discover recently posted vacancies across tech, marketing, and design.</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View all positions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800">No Job Postings Yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first recruiter to post an opening or check back shortly for new listings.
            </p>
            <Link
              to="/post-job"
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Post a Job Opening
            </Link>
          </div>
        )}
      </section>

      {/* Dual Persona Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Candidate Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Are You Looking for a Job?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Build your professional profile, upload your resume, browse curated jobs with verified salary bands, and track your applications step-by-step.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time status updates on submitted applications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Direct resume submission with no intermediaries</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-indigo-100"
            >
              <span>Sign Up as Job Seeker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Employer Card */}
          <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-3xl border border-violet-100 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-200">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Are You Hiring Talent?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Publish openings in seconds, evaluate applicant dossiers, download resumes, and manage candidates smoothly through your dedicated recruitment pipeline.
              </p>
              <ul className="space-y-2 text-sm text-slate-600 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Streamlined Applicant Tracking System (ATS)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero-cost posting for startups and organizations</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-violet-100"
            >
              <span>Sign Up as Recruiter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
