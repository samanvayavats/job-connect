import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';

import { KeyRound, ExternalLink, ShieldCheck } from 'lucide-react';

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.CLERK_PUBLISHABLE_KEY;

function App() {
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === 'pk_test_sample_key_replace_with_yours') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Clerk Authentication Setup
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Job Connect is configured with enterprise <strong className="text-indigo-400">Clerk</strong> authentication. To launch the portal, specify your free Clerk Publishable Key.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Step 1: In frontend/.env</span>
            </p>
            <code className="text-xs text-indigo-300 font-mono block bg-slate-950 p-2.5 rounded-xl border border-slate-800 select-all">
              VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
            </code>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Step 2: In backend/.env</span>
            </p>
            <code className="text-xs text-indigo-300 font-mono block bg-slate-950 p-2.5 rounded-xl border border-slate-800 select-all">
              CLERK_PUBLISHABLE_KEY=pk_test_...<br />
              CLERK_SECRET_KEY=sk_test_...
            </code>
          </div>

          <a
            href="https://dashboard.clerk.com/last-active?path=api-keys"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all"
          >
            <span>Obtain Free Keys from Clerk Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Discovery Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/register/*" element={<Register />} />

                {/* Candidate Protected Routes */}
                <Route
                  path="/my-applications"
                  element={
                    <ProtectedRoute requiredRole="job_seeker">
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <CandidateProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute requiredRole="recruiter">
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post-job"
                  element={
                    <ProtectedRoute requiredRole="recruiter">
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/job/:jobId/applicants"
                  element={
                    <ProtectedRoute requiredRole="recruiter">
                      <JobApplicants />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ClerkProvider>
  );
}

export default App;
