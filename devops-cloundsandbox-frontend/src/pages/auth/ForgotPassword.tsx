

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../../api/services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before sending
    if (!email.trim()) {
      toast.warning('Please enter your email address', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.warning('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
      
      toast.success('📧 Password reset link sent to your email!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err: any) {
      console.error('Forgot password error:', err);
      
      const errorMessage = err.response?.data || err.message;
      let displayMessage = "Failed to send reset link. Please verify your email and try again.";
      
      if (typeof errorMessage === 'string') {
        displayMessage = errorMessage;
      } else if (errorMessage?.message) {
        displayMessage = errorMessage.message;
      }
      
      setError(displayMessage);
      
      toast.error(displayMessage, {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] p-4">
      <div className="max-w-md w-full bg-[#11121d] border border-slate-800 p-8 rounded-2xl shadow-2xl">
        {!isSent ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h1>
            <p className="text-slate-400 text-center mb-8 text-sm">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg flex items-center gap-2 text-xs">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0b10] border border-slate-800 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="student@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <><Send size={18} /> Send Reset Link</>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We have sent a password reset link to <br/> 
              <span className="text-white font-medium">{email}</span>
            </p>
            <button 
              onClick={() => {
                setIsSent(false);
                setError('');
                setEmail('');
              }} 
              className="text-blue-500 text-sm font-bold hover:text-blue-400 transition-colors"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
        
        <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-tighter">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;