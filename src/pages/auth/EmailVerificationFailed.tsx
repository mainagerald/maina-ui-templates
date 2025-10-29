import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GradientBackground from '../../components/animations/GradientBackground';
import { showErrorToast, showSuccessToast } from '../../components/layouts/toast/miniToast';

const EmailVerificationFailed = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    
    if (!email.trim()) {
      const errorMsg = 'Please enter your email address.';
      setError(errorMsg);
      showErrorToast(errorMsg, { duration: 5000 });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/users/resend-verification/`, { email });
      
      const successMsg = 'Verification email has been sent. Please check your inbox.';
      setMessage(successMsg);
      showSuccessToast(successMsg, { duration: 5000 });
      setEmail('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to resend verification email. Please try again.';
      setError(errorMsg);
      showErrorToast(errorMsg, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-amber-50">
      {/* Motion gradient background */}
      <GradientBackground
        colors={['#f8fafc', '#f1f5f9', '#f5f3ff', '#faf5ff']}
        duration={20}
      />

      {/* Optional subtle overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 backdrop-blur-sm p-8 rounded-3xl shadow-lg z-10 relative">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-600">
              Verification Failed
            </span>
          </h1>
          
          <p className="mt-4 text-gray-600">
            We couldn't verify your email. The verification link may have expired or already been used.
          </p>
          
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleResendVerification} className="mt-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Enter your email address"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-black/80 disabled:opacity-50 transition-all duration-300"
            >
              {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationFailed;
