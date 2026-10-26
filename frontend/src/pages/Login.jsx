import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Briefcase } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-6 space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-100 mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Sign In to Job Connect</h1>
        <p className="text-xs text-slate-500">Secure authentication powered by Clerk</p>
      </div>

      <div className="w-full flex justify-center">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
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

export default Login;
