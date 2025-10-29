import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import GradientBackground from '../../components/animations/GradientBackground';
import { showErrorToast, showSuccessToast } from '../../components/layouts/toast/miniToast';

const RegisterSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleResendVerification = async () => {
    if (!email) {
      const errorMsg = 'Email address is missing. Please go back to registration.';
      setError(errorMsg);
      showErrorToast(errorMsg, { duration: 5000 });
      return;
    }
    
    setError('');
    setMessage('');
    setIsResending(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/users/resend-verification/`, { email });
      
      const successMsg = 'Verification email has been sent again. Please check your inbox.';
      setMessage(successMsg);
      showSuccessToast(successMsg, { duration: 5000 });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to resend verification email. Please try again.';
      setError(errorMsg);
      showErrorToast(errorMsg, { duration: 5000 });
    } finally {
      setIsResending(false);
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
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold tracking-tight mb-2 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Check Your Email
            </span>
          </h1>
          
          <p className="mt-4 text-gray-600 text-sm">
            We've sent a verification link to <strong>{email || 'your email address'}</strong>.
            <br />
            Please check your inbox or spam folder and click the link to verify your account.
          </p>
          
          <p className="mt-2 text-blue-500 text-xs border border-blue-500 p-1 rounded-3xl">
            If you don't see the email, check your <strong>spam</strong> folder.
          </p>
          
          {message && (
            <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-3xl text-sm">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending || !email}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-black/80 disabled:opacity-50 transition-all duration-300"
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
