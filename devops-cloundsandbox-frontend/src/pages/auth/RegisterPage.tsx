

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../api/services/auth.service';
import { Terminal, User, Mail, Lock, Hash, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    cohortCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.warning('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.warning('Last name is required');
      return false;
    }
    if (formData.username.length < 4) {
      toast.warning('Username must be at least 4 characters');
      return false;
    }
    if (formData.username.length > 20) {
      toast.warning('Username must be less than 20 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.warning('Passwords do not match');
      return false;
    }
    if (!formData.cohortCode.trim()) {
      toast.warning('Cohort code is required');
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        cohortCode: formData.cohortCode
      });

      toast.success('🎉 Registration successful! Please login to continue.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Try a different username/email.';
      setError(errorMessage);
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
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

            <InputGroup 
              label="First Name" 
              icon={<User size={18}/>} 
              placeholder="John" 
              value={formData.firstName}
              onChange={(v) => setFormData({...formData, firstName: v})} 
            />
            
            <InputGroup 
              label="Last Name" 
              icon={<User size={18}/>} 
              placeholder="Doe" 
              value={formData.lastName}
              onChange={(v) => setFormData({...formData, lastName: v})} 
            />

            <InputGroup 
              label="Username" 
              icon={<Terminal size={18}/>} 
              placeholder="johndev" 
              value={formData.username}
              helpText="4-20 characters"
              onChange={(v) => setFormData({...formData, username: v})} 
            />

            <InputGroup 
              label="Email" 
              type="email" 
              icon={<Mail size={18}/>} 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(v) => setFormData({...formData, email: v})} 
            />

            <PasswordInput 
              label="Password" 
              icon={<Lock size={18}/>} 
              placeholder="••••••••" 
              value={formData.password}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              helpText="Minimum 6 characters"
              onChange={(v) => setFormData({...formData, password: v})} 
            />

            <PasswordInput 
              label="Confirm Password" 
              icon={<Lock size={18}/>} 
              placeholder="••••••••" 
              value={formData.confirmPassword}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              onChange={(v) => setFormData({...formData, confirmPassword: v})} 
            />

            <div className="col-span-full">
              <InputGroup 
                label="Cohort Code" 
                icon={<Hash size={18}/>} 
                placeholder="COHORT-2026" 
                value={formData.cohortCode}
                onChange={(v) => setFormData({...formData, cohortCode: v})} 
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="col-span-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

const InputGroup = ({ 
  label, 
  icon, 
  placeholder, 
  type = "text", 
  value, 
  onChange,
  helpText 
}: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">{icon}</div>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
    {helpText && (
      <p className="text-xs text-slate-500 mt-1">{helpText}</p>
    )}
  </div>
);

const PasswordInput = ({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChange,
  showPassword,
  setShowPassword,
  helpText 
}: any) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">{icon}</div>
      <input
        required
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {helpText && (
      <p className="text-xs text-slate-500 mt-1">{helpText}</p>
    )}
  </div>
);

export default RegisterPage;