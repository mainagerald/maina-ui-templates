import { Spinner } from '@/components/layouts/state';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const refresh = params.get('refresh');
        
        if (!token || !refresh) {
          setError('Authentication failed. Missing token information.');
          setLoading(false);
          return;
        }
        
        // Store tokens in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refresh);
        
        // Reload the page to trigger the auth context to load the user from the token
        setTimeout(() => {
          // Redirect to dashboard after a short delay
          navigate('/');
          // Force reload to update auth context
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error('Authentication callback error:', error);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-500 mt-2">Authenticating...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Authentication Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default AuthCallback;
