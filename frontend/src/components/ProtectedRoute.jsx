import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading, switchRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg space-y-5">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {requiredRole === 'recruiter' ? 'Recruiter Access Required' : 'Restricted Access'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This portal section requires a <span className="font-semibold text-indigo-600 capitalize">{requiredRole.replace('_', ' ')}</span> account. You are currently signed in as a <span className="font-semibold text-slate-800 capitalize">{user?.role?.replace('_', ' ') || 'Job Seeker'}</span>.
          </p>
        </div>

        {requiredRole === 'recruiter' && (
          <button
            onClick={async () => {
              try {
                await switchRole('recruiter');
              } catch (e) {
                console.error(e);
              }
            }}
            className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Switch to Recruiter Account & Continue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}

        <div className="pt-2">
          <a href="/" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
