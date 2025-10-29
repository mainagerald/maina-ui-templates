import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth';
import { Spinner } from '@/components/layouts/state';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../components/layouts/toast/miniToast';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Verification token is missing');
        setIsVerifying(false);
        showErrorToast('Verification token is missing');
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/users/verify-email/${token}/`);
        
        // If verification is successful, we'll receive tokens for automatic login
        if (response.data.token && response.data.refresh) {
          setTokens(response.data.token, response.data.refresh);
          
          // Check if the email was already verified
          if (response.data.already_verified) {
            showSuccessToast('Welcome back! You\'ve been automatically logged in.');
          } else {
            showSuccessToast('Your email has been verified successfully!');
          }
          
          navigate('/email-verified');
        } else {
          // If we don't get tokens but the request was successful
          navigate('/email-verified');
          showInfoToast('Your email has been verified successfully. Proceeding to login...');
          setTimeout(() => {
            navigate('/login');
          }, 4000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setError('Failed to verify email. The token may be invalid or expired.');
        showErrorToast('Failed to verify email. The token may be invalid or expired.');
        navigate('/email-verification-failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate, setTokens]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-600 mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold mb-2">Verification Failed</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/email-verification-failed')}
            className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null; // This should not be rendered as we'll navigate away
};

export default VerifyEmail;
