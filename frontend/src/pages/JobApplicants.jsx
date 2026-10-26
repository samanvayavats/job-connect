import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { 
  ArrowLeft, 
  Users, 
  Building2, 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Briefcase,
  Save
} from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [notesState, setNotesState] = useState({});
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const statusOptions = [
    'All',
    'Applied',
    'Reviewing',
    'Shortlisted',
    'Interview Scheduled',
    'Accepted',
    'Rejected'
  ];

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/application/job/${jobId}`);
      setJob(res.data.job);
      const fetchedApplicants = res.data.applicants || [];
      setApplicants(fetchedApplicants);
      setFilteredApplicants(fetchedApplicants);

      // Initialize notes
      const initialNotes = {};
      fetchedApplicants.forEach((app) => {
        initialNotes[app._id] = app.recruiterNote || '';
      });
      setNotesState(initialNotes);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredApplicants(applicants);
    } else {
      setFilteredApplicants(applicants.filter((a) => a.status === statusFilter));
    }
  }, [statusFilter, applicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(`/application/status/${applicationId}`, {
        status: newStatus,
        recruiterNote: notesState[applicationId]
      });

      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );

      setActionMsg({ type: 'success', text: `Candidate status updated to ${newStatus}` });
      setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to update candidate status' });
    }
  };

  const handleSaveNote = async (applicationId) => {
    const app = applicants.find((a) => a._id === applicationId);
    if (!app) return;

    try {
      await api.patch(`/application/status/${applicationId}`, {
        status: app.status,
        recruiterNote: notesState[applicationId]
      });
      setActionMsg({ type: 'success', text: 'Recruiter evaluation note saved' });
      setTimeout(() => setActionMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to save note' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recruiter Console</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Applicant Tracking System (ATS)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Applicants for {job?.title || 'Job Opening'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{job?.companyName}</span>
              <span>•</span>
              <span>{job?.location}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl font-bold text-sm">
            <Users className="w-4 h-4" />
            <span>{applicants.length} Total Dossiers</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === opt
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt} {opt !== 'All' && `(${applicants.filter((a) => a.status === opt).length})`}
            </button>
          ))}
        </div>
      </div>

      {actionMsg.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 border ${
          actionMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Applicant Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-3xl border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : filteredApplicants.length > 0 ? (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                
                {/* Candidate Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg shrink-0">
                    {app.fullName ? app.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900">{app.fullName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.email}</span>
                      </span>
                      {app.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                  <StatusBadge status={app.status} />

                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  >
                    <option value="Applied">Stage: Applied</option>
                    <option value="Reviewing">Stage: Reviewing</option>
                    <option value="Shortlisted">Stage: Shortlisted</option>
                    <option value="Interview Scheduled">Stage: Interview Scheduled</option>
                    <option value="Accepted">Decision: Accepted</option>
                    <option value="Rejected">Decision: Rejected</option>
                  </select>

                  {app.resume && (
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Qualifications & Experience Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Education / Qualification</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">{app.qualification}</p>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700 flex items-center space-x-1 mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Experience Summary</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">{app.experience}</p>
                </div>
              </div>

              {/* Cover Letter */}
              {app.coverLetter && (
                <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-2xl border border-amber-100/70">
                  <span className="font-bold text-amber-900 block mb-1">Candidate Cover Note:</span>
                  <p className="italic leading-relaxed">{app.coverLetter}</p>
                </div>
              )}

              {/* Internal Recruiter Note */}
              <div className="flex items-center space-x-2 pt-1 text-xs">
                <input
                  type="text"
                  placeholder="Add internal recruiter feedback note..."
                  value={notesState[app._id] || ''}
                  onChange={(e) =>
                    setNotesState({ ...notesState, [app._id]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(app._id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center space-x-1 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Applicants in this Stage</h3>
          <p className="text-xs text-slate-500 mt-1">
            No candidates currently match the selected status filter ({statusFilter}).
          </p>
        </div>
      )}

    </div>
  );
};

export default JobApplicants;
