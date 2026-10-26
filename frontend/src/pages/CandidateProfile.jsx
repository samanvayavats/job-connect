import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  UploadCloud, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  X
} from 'lucide-react';

const CandidateProfile = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [summary, setSummary] = useState('');
  const [role, setRole] = useState('job_seeker');

  const [qualifications, setQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Modal states for adding qualification
  const [qualModalOpen, setQualModalOpen] = useState(false);
  const [instituteName, setInstituteName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [startingYear, setStartingYear] = useState('');
  const [endingYear, setEndingYear] = useState('');
  const [percentage, setPercentage] = useState('');

  // Modal states for adding experience
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [expRole, setExpRole] = useState('');
  const [description, setDescription] = useState('');

  // File upload loading
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber(user.phoneNumber || '');
      setSummary(user.summary || '');
      setRole(user.role || 'job_seeker');
    }
  }, [user]);

  const fetchQualificationsAndExperiences = async () => {
    try {
      const [qualRes, expRes] = await Promise.all([
        api.get('/qualification/all').catch(() => ({ data: { qualifications: [] } })),
        api.get('/experience/all').catch(() => ({ data: { experiences: [] } }))
      ]);
      setQualifications(qualRes.data.qualifications || []);
      setExperiences(expRes.data.experiences || []);
    } catch (err) {
      console.warn('Could not fetch qualifications/experiences:', err.message);
    }
  };

  useEffect(() => {
    fetchQualificationsAndExperiences();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      await api.put('/user/update-profile', {
        fullName,
        phoneNumber,
        summary,
        role
      });
      await refreshUser();
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.post('/user/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      setProfileMsg({ type: 'success', text: 'Profile avatar updated!' });
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Avatar upload failed';
      setProfileMsg({ type: 'error', text: errMsg });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/user/update-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      setProfileMsg({ type: 'success', text: 'Resume updated successfully!' });
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Resume upload failed';
      setProfileMsg({ type: 'error', text: errMsg });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAddQualification = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/qualification/add-qualification', {
        instituteName,
        courseName,
        startingYear,
        endingYear,
        percentage
      });
      setQualifications([res.data.qualification, ...qualifications]);
      setQualModalOpen(false);
      setInstituteName('');
      setCourseName('');
      setStartingYear('');
      setEndingYear('');
      setPercentage('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add qualification');
    }
  };

  const handleDeleteQualification = async (id) => {
    try {
      await api.delete(`/qualification/delete-qualification?id=${id}`);
      setQualifications(qualifications.filter((q) => q._id !== id));
    } catch (err) {
      alert('Failed to delete qualification');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/experience/add-experience', {
        jobTitle,
        role: expRole,
        description
      });
      setExperiences([res.data.data, ...experiences]);
      setExpModalOpen(false);
      setJobTitle('');
      setExpRole('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await api.delete(`/experience/delete-experience?id=${id}`);
      setExperiences(experiences.filter((exp) => exp._id !== id));
    } catch (err) {
      alert('Failed to delete experience');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Account & Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your contact information, resume attachment, educational credentials, and work history.
        </p>
      </div>

      {profileMsg.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2 border ${
          profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{profileMsg.text}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.userName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-3xl">
                {user?.userName?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <UploadCloud className="w-6 h-6" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.fullName || user?.userName}</h2>
            <p className="text-sm text-slate-500 font-medium">@{user?.userName}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
              {user?.role === 'recruiter' ? 'Recruiter Account' : 'Job Seeker'}
            </span>
          </div>

          {/* Resume Widget */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center sm:text-right w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 block mb-2">Resume / CV</span>
            {user?.resume ? (
              <div className="space-y-2">
                <a
                  href={user.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Current Resume</span>
                </a>
                <label className="block text-[11px] text-slate-500 hover:text-indigo-600 underline cursor-pointer">
                  {uploadingResume ? 'Uploading...' : 'Replace Resume File'}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div>
                <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{uploadingResume ? 'Uploading...' : 'Upload Resume (PDF)'}</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Edit Info Form */}
        <form onSubmit={handleProfileSave} className="mt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Professional Summary / Bio</label>
            <textarea
              rows="3"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>

      </div>

      {/* Qualifications Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Academic Qualifications</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Degrees, certifications, and educational credentials</p>
          </div>
          <button
            onClick={() => setQualModalOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Qualification</span>
          </button>
        </div>

        {qualifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualifications.map((q) => (
              <div key={q._id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{q.courseName}</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{q.instituteName}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {q.startingYear} - {q.endingYear} • {q.percentage}%
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQualification(q._id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No academic qualifications listed yet.</p>
        )}
      </div>

      {/* Experiences Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>Work Experience</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Previous employment history and responsibilities</p>
          </div>
          <button
            onClick={() => setExpModalOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Experience</span>
          </button>
        </div>

        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp._id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h4>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{exp.role}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg shrink-0 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No work experiences listed yet.</p>
        )}
      </div>

      {/* Modal Add Qualification */}
      {qualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setQualModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Academic Qualification</h3>
            <form onSubmit={handleAddQualification} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course / Degree</label>
                <input required placeholder="e.g. B.Tech Computer Science" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College / Institute</label>
                <input required placeholder="e.g. Delhi University" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Year</label>
                  <input required placeholder="2020" value={startingYear} onChange={(e) => setStartingYear(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Year</label>
                  <input required placeholder="2024" value={endingYear} onChange={(e) => setEndingYear(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Score (%)</label>
                  <input required placeholder="85" value={percentage} onChange={(e) => setPercentage(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
                Save Qualification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Experience */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setExpModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Work Experience</h3>
            <form onSubmit={handleAddExperience} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                <input required placeholder="e.g. Junior Web Developer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Role</label>
                <input required placeholder="e.g. Frontend Engineering" value={expRole} onChange={(e) => setExpRole(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Responsibilities / Impact</label>
                <textarea rows="3" required placeholder="Describe your responsibilities..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <button type="submit" className="w-full mt-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
                Save Experience
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateProfile;
