

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import { useAuth } from '../../store/AuthContext';
import { Lock, User as UserIcon, Terminal, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const response = await authService.login(formData);
        
        // Save to state/storage FIRST
        login(response.user, response.accessToken); 
        
        // THEN redirect
        navigate('/dashboard', { replace: true });
    } catch (err) {
        setError('Login Failed');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-500/20">
            <Terminal className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CloudSandbox</h1>
          <p className="text-slate-400 mt-2">Enterprise Infrastructure Simulator</p>
        </div>

        <div className="bg-[#11121d] border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="kingz1"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Access Sandbox'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              New to the platform?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;