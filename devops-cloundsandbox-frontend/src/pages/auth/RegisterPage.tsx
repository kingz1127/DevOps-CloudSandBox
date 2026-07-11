import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import { Terminal, User, Mail, Lock, Hash, Loader2, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    cohortCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.register(formData);
      // After success, send them to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] p-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Join CloudSandbox</h1>
          <p className="text-slate-400 mt-2">Start your DevOps journey today</p>
        </div>

        <div className="bg-[#11121d] border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="col-span-full bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <InputGroup label="First Name" icon={<User size={18}/>} placeholder="John" 
              onChange={(v) => setFormData({...formData, firstName: v})} />
            
            <InputGroup label="Last Name" icon={<User size={18}/>} placeholder="Doe" 
              onChange={(v) => setFormData({...formData, lastName: v})} />

            <InputGroup label="Username" icon={<Terminal size={18}/>} placeholder="johndev" 
              onChange={(v) => setFormData({...formData, username: v})} />

            <InputGroup label="Email" type="email" icon={<Mail size={18}/>} placeholder="john@example.com" 
              onChange={(v) => setFormData({...formData, email: v})} />

            <InputGroup label="Cohort Code" icon={<Hash size={18}/>} placeholder="COHORT-2026" 
              onChange={(v) => setFormData({...formData, cohortCode: v})} />

            <InputGroup label="Password" type="password" icon={<Lock size={18}/>} placeholder="••••••••" 
              onChange={(v) => setFormData({...formData, password: v})} />

            <button
              type="submit"
              disabled={isLoading}
              className="col-span-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, placeholder, type = "text", onChange }: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">{icon}</div>
      <input
        required
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default RegisterPage;