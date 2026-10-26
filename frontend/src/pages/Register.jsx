import React, { useState, useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Users, Building2, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role');

  const [selectedRole, setSelectedRole] = useState(() => {
    if (queryRole === 'recruiter' || queryRole === 'job_seeker') {
      localStorage.setItem('clerk_selected_role', queryRole);
      return queryRole;
    }
    return localStorage.getItem('clerk_selected_role') || 'job_seeker';
  });

  useEffect(() => {
    if (queryRole && ['recruiter', 'job_seeker'].includes(queryRole)) {
      setSelectedRole(queryRole);
      localStorage.setItem('clerk_selected_role', queryRole);
    }
  }, [queryRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    localStorage.setItem('clerk_selected_role', role);
  };

  const redirectTarget = selectedRole === 'recruiter' ? '/recruiter/dashboard' : '/my-applications';

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-6 space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-100 mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Create Your Account</h1>
        <p className="text-xs text-slate-500">Select your account persona to get started</p>
      </div>

      {/* Account Type Selector */}
      <div className="max-w-md w-full mb-3 p-1.5 bg-slate-200/80 rounded-2xl grid grid-cols-2 gap-2 shadow-inner">
        <button
          type="button"
          onClick={() => handleRoleSelect('job_seeker')}
          className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedRole === 'job_seeker'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Job Seeker</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('recruiter')}
          className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedRole === 'recruiter'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Recruiter / Employer</span>
        </button>
      </div>

      {/* Persona Description Banner */}
      <div className="max-w-md w-full mb-6 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          {selectedRole === 'recruiter'
            ? 'Account Type: Recruiter / Employer — Grants permission to Post Vacancies, Manage Listings, and Review Applicants in the ATS Board.'
            : 'Account Type: Job Seeker — Allows searching verified openings, uploading your resume, and tracking your job applications.'}
        </span>
      </div>

      <div className="w-full flex justify-center">
        <SignUp
          key={selectedRole}
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl={redirectTarget}
          fallbackRedirectUrl={redirectTarget}
          unsafeMetadata={{
            role: selectedRole
          }}
          appearance={{
            elements: {
              card: 'shadow-xl shadow-slate-100/60 border border-slate-200/80 rounded-3xl',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold rounded-xl'
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
