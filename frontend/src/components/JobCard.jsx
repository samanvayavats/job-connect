import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Banknote, 
  ArrowRight 
} from 'lucide-react';

const JobCard = ({ job }) => {
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays}d ago`;
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-Time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Internship':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Part-Time':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 font-bold text-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-slate-500 font-medium flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.companyName}</span>
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 whitespace-nowrap">
            {formatTimeAgo(job.createdAt)}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${getJobTypeColor(job.jobType)}`}>
            {job.jobType || 'Full-Time'}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location || 'Remote'}</span>
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{job.experienceRequired} Exp</span>
          </span>
          {job.salary && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center space-x-1">
              <Banknote className="w-3 h-3 text-slate-400" />
              <span>{job.salary}</span>
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skillsRequired.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60">
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{job.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Status: <strong className={job.status === 'Active' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>{job.status || 'Active'}</strong>
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
