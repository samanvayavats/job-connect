import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  User, 
  PlusCircle, 
  FileText, 
  Layers, 
  Menu, 
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isRecruiter, switchRole } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Job Connect
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Careers & Talent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/jobs')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Explore Jobs
            </Link>

            <SignedIn>
              {!isRecruiter && (
                <Link
                  to="/my-applications"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive('/my-applications')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Applications</span>
                </Link>
              )}

              {isRecruiter && (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      isActive('/recruiter/dashboard')
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Recruiter Dashboard</span>
                  </Link>

                  <Link
                    to="/post-job"
                    className="px-3.5 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center space-x-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Vacancy</span>
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive('/profile')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & CV</span>
              </Link>
            </SignedIn>
          </nav>

          {/* User Auth Section with Clerk */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedIn>
              <div className="flex items-center space-x-3 pl-2">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">
                    {user?.fullName || user?.userName}
                  </p>
                  <div className="flex items-center justify-end space-x-1.5 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isRecruiter
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {isRecruiter ? 'Recruiter' : 'Job Seeker'}
                    </span>
                    <button
                      type="button"
                      onClick={() => switchRole(isRecruiter ? 'job_seeker' : 'recruiter')}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-medium cursor-pointer"
                    >
                      {isRecruiter ? 'Switch to Job Seeker' : 'Switch to Recruiter'}
                    </button>
                  </div>
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-9 h-9 rounded-xl border border-slate-200'
                    }
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
                >
                  Create Account
                </Link>
              </div>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Jobs
          </Link>

          <SignedIn>
            {isRecruiter ? (
              <>
                <Link
                  to="/recruiter/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Recruiter Dashboard
                </Link>
                <Link
                  to="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Post Vacancy
                </Link>
              </>
            ) : (
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Applications
              </Link>
            )}

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              My Profile & CV
            </Link>

            <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500 font-medium">
                Persona: <strong className="text-indigo-600 capitalize">{isRecruiter ? 'Recruiter' : 'Job Seeker'}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  switchRole(isRecruiter ? 'job_seeker' : 'recruiter');
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-indigo-600 underline cursor-pointer"
              >
                {isRecruiter ? 'Switch to Job Seeker' : 'Switch to Recruiter'}
              </button>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-slate-700 font-medium rounded-lg hover:bg-slate-50 border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
              >
                Create Account
              </Link>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
};

export default Navbar;
