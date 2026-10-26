import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal 
} from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Filter States initialized from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [experience, setExperience] = useState(searchParams.get('experience') || 'All');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Remote', 'Contract', 'Internship'];
  const experienceOptions = ['All', 'Fresher', '1-2 Years', '2-4 Years', '5+ Years'];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (jobType && jobType !== 'All') params.append('jobType', jobType);
      if (experience && experience !== 'All') params.append('experience', experience);
      params.append('page', page);
      params.append('limit', 12);

      const res = await api.get(`/job/all?${params.toString()}`);
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalJobs(res.data.totalJobs || 0);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Sync with URL params
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType && jobType !== 'All') params.jobType = jobType;
    if (experience && experience !== 'All') params.experience = experience;
    if (page > 1) params.page = page;
    setSearchParams(params);
  }, [page, jobType, experience]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('All');
    setExperience('All');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="md:w-64 relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Location or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-2xl transition-all shadow-md shadow-indigo-100"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters Desktop */}
        <aside className={`md:w-64 shrink-0 space-y-6 ${showMobileFilter ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filters</span>
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Employment Type */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Employment Type</h4>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => {
                        setJobType(type);
                        setPage(1);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded-full border-slate-300"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Experience</h4>
              <div className="space-y-2">
                {experienceOptions.map((exp) => (
                  <label key={exp} className="flex items-center space-x-2.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      checked={experience === exp}
                      onChange={() => {
                        setExperience(exp);
                        setPage(1);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded-full border-slate-300"
                    />
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Jobs List Main Area */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>
              Showing <span className="font-semibold text-slate-900">{totalJobs}</span> verified job postings
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-800">No Matching Jobs Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Try loosening your search terms or resetting filters to explore all available positions.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-xl text-sm hover:bg-indigo-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm font-medium text-slate-700 px-4">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default Jobs;
