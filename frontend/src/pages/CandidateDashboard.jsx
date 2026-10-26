import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { 
  FileText, 
  Building2, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Briefcase, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await api.get('/application/my-applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be reversed.')) {
      return;
    }

    try {
      await api.delete(`/application/withdraw/${applicationId}`);
      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Application Status Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time visibility into your submitted job applications and recruiter reviews.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <span>Find More Vacancies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Position & Company</th>
                  <th className="py-4 px-6">Submitted On</th>
                  <th className="py-4 px-6">Evaluation Stage</th>
                  <th className="py-4 px-6">Recruiter Notes</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Job Info */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">
                        {app.jobId ? (
                          <Link to={`/jobs/${app.jobId._id}`} className="hover:text-indigo-600 transition-colors">
                            {app.jobId.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Position Archived</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.jobId?.companyName || 'Company'}</span>
                        <span>•</span>
                        <span>{app.jobId?.location || 'Remote'}</span>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Recruiter Notes */}
                    <td className="py-4 px-6 text-xs text-slate-600 max-w-xs">
                      {app.recruiterNote ? (
                        <span className="italic bg-slate-50 px-2 py-1 rounded border border-slate-200/60 block">
                          "{app.recruiterNote}"
                        </span>
                      ) : (
                        <span className="text-slate-400">No notes yet</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {app.resume && (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleWithdraw(app._id)}
                        title="Withdraw Application"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Applications Submitted</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any job applications yet. Browse open vacancies to apply!
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-100"
          >
            <span>Browse Job Vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default CandidateDashboard;
