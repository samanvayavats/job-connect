import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Banknote, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  FileText, 
  UploadCloud, 
  X,
  AlertCircle
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [application, setApplication] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Application form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/job/get/${id}`);
        setJob(res.data.job);
        setHasApplied(res.data.hasApplied);
        setApplication(res.data.application);
        setApplicantCount(res.data.applicantCount || 0);

        if (user) {
          setFullName(user.fullName || user.userName || '');
          setEmail(user.email || '');
          setPhone(user.phoneNumber || '');
          setExperience(user.summary || '');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!useProfileResume && !resumeFile && !user?.resume) {
      setFormError('Please upload a resume file or update your profile resume.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('qualification', qualification);
      formData.append('experience', experience);
      formData.append('coverLetter', coverLetter);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await api.post('/application/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setHasApplied(true);
      setApplication(res.data.application);
      setApplicantCount((prev) => prev + 1);
      setFormSuccess('Your application was submitted successfully!');
      setTimeout(() => {
        setModalOpen(false);
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
        <div className="h-48 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          This vacancy might have been archived or removed by the employer.
        </p>
        <Link to="/jobs" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">
          Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to job listings</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl shadow-sm">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="text-base text-slate-600 font-medium flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{job.companyName}</span>
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{applicantCount} applicants</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action button in header */}
          <div>
            {hasApplied ? (
              <div className="text-right space-y-1.5 bg-emerald-50 border border-emerald-200/70 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You Have Applied</span>
                </div>
                {application && (
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs text-slate-500 mr-1">Status:</span>
                    <StatusBadge status={application.status} />
                  </div>
                )}
              </div>
            ) : isRecruiter ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium max-w-xs">
                Recruiter account active. To apply, switch to a candidate profile.
              </div>
            ) : job.status === 'Closed' ? (
              <span className="px-4 py-2 bg-slate-100 text-slate-500 font-semibold rounded-xl text-sm">
                Applications Closed
              </span>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>{job.location || 'Remote'}</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Type</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>{job.jobType || 'Full-Time'}</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{job.experienceRequired}</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Salary Range</span>
            <p className="text-sm font-semibold text-slate-800 flex items-center space-x-1">
              <Banknote className="w-3.5 h-3.5 text-indigo-500" />
              <span>{job.salary || 'Negotiable'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Job Description & Responsibilities</h2>
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Skills required */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Target Skills & Proficiencies</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900">Apply for {job.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-6">at {job.companyName}</p>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              {/* Resume Selection */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Resume Attachment</span>
                  {user?.resume && (
                    <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useProfileResume}
                        onChange={(e) => setUseProfileResume(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Use profile resume</span>
                    </label>
                  )}
                </div>

                {useProfileResume && user?.resume ? (
                  <div className="flex items-center justify-between text-xs text-indigo-700 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Current Profile Resume</span>
                    </span>
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline font-medium"
                    >
                      Inspect
                    </a>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Accepts PDF, DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech in Computer Science"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Summary</label>
                <input
                  type="text"
                  placeholder="e.g. 2 years MERN Stack developer at ABC Corp"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Note (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Why are you a great match for this opening?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <span>Submitting Dossier...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetails;
