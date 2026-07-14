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
    setError('');
    
    try {
        const response = await authService.login(formData);
        
        // Save to state/storage FIRST (using your AuthContext logic)
        login(response.user, response.accessToken); 
        
        // THEN redirect
        navigate('/dashboard', { replace: true });
    } catch (err: any) {
        // Descriptive error based on backend message
        setError(err.response?.data?.message || 'Login Failed. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-500/20">
            <Terminal className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight text-gradient bg-clip-text">CloudSandbox</h1>
          <p className="text-slate-400 mt-2">Enterprise Infrastructure Simulator</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#11121d] border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-3 text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Enter your username"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                {/* Forgot Password Link */}
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Access Sandbox'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              New to the platform?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-bold transition-all ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold">
           Built for Vercel Deployment &bull; Localized Cloud Sim
        </p>
      </div>
    </div>
  );
};

export default LoginPage;