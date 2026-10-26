import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Job Connect</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modern full-stack employment exchange and candidate tracking portal connecting top talent with progressive organizations.
            </p>
            <div className="flex space-x-3 text-slate-400">
              <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700">React</span>
              <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700">Express</span>
              <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700">MongoDB</span>
              <span className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700">Clerk</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Browse Vacancies</Link>
              </li>
              <li>
                <Link to="/my-applications" className="hover:text-white transition-colors">Track Applications</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Manage Profile & CV</Link>
              </li>
              <li>
                <Link to="/jobs?jobType=Remote" className="hover:text-white transition-colors">Remote Opportunities</Link>
              </li>
            </ul>
          </div>

          {/* Recruiter Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/post-job" className="hover:text-white transition-colors">Publish Job Opening</Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Applicant Tracking System</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Recruiter Sign Up</Link>
              </li>
            </ul>
          </div>

          {/* System & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Academic Project</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Developed as a minor engineering degree project adhering to contemporary software engineering principles and secure REST API architectures.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="https://github.com/samanvayavats/job-connect" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <span className="text-xs text-slate-500">v1.0.0 Production Prototype</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Job Connect Portal. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500" /> for seamless hiring.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
