import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  Building2, 
  Calendar, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/job/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? All candidate applications for this position will also be deleted.')) {
      return;
    }

    try {
      await api.delete(`/job/delete-job-opening?id=${jobId}`);
      setJobs(jobs.filter((j) => j._id !== jobId));
      setActionMsg({ type: 'success', text: 'Job listing deleted successfully' });
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to delete job' });
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      await api.put(`/job/update-job/${job._id}`, { status: newStatus });
      setJobs(jobs.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      setActionMsg({ type: 'success', text: `Job status changed to ${newStatus}` });
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to update job status' });
    }
  };

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0);
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Recruiter Management Console</h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee active vacancies, review applicant dossiers, and advance candidates through the ATS pipeline.
          </p>
        </div>

        <Link
          to="/post-job"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      {actionMsg.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 border ${
          actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{jobs.length}</p>
            <p className="text-xs text-slate-500 font-medium">Total Vacancies Posted</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{activeJobs}</p>
            <p className="text-xs text-slate-500 font-medium">Active & Accepting Applications</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{totalApplicants}</p>
            <p className="text-xs text-slate-500 font-medium">Candidate Applications In Pipeline</p>
          </div>
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Published Job Listings</h2>
          <span className="text-xs text-slate-400">{jobs.length} postings total</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Position & Details</th>
                  <th className="py-4 px-6">Date Created</th>
                  <th className="py-4 px-6">Listing Status</th>
                  <th className="py-4 px-6">Candidate Pipeline</th>
                  <th className="py-4 px-6 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">
                        <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600 transition-colors">
                          {job.title}
                        </Link>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.companyName}</span>
                        </span>
                        <span>•</span>
                        <span>{job.jobType}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          job.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span>{job.status || 'Active'}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Link
                        to={`/recruiter/job/${job._id}/applicants`}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} Applicants</span>
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/recruiter/job/${job._id}/applicants`}
                        className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        title="Delete Vacancy"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Job Postings Created</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Publish your first opening to attract qualified applicants and manage your candidate pipeline.
            </p>
            <Link
              to="/post-job"
              className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Vacancy</span>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default RecruiterDashboard;
