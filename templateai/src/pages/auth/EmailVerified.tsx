import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import GradientBackground from '../../components/animations/GradientBackground';

const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuth();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');
    
    if (token && refresh) {
      // Set tokens in auth context
      setTokens(token, refresh);
      
      // Start countdown to redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/profile');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [searchParams, setTokens, navigate]);
  
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
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
              Email Verified!
            </span>
          </h1>
          
          <p className="mt-4 text-gray-600">
            Your email has been successfully verified. You are now logged in.
          </p>
          
          <p className="mt-6 text-gray-500">
            Redirecting to your profile in {countdown} seconds...
          </p>
          
          <button
            onClick={() => navigate('/profile')}
            className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-black/80 transition-all duration-300"
          >
            Go to Profile Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
