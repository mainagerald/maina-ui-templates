import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GradientBackground from '../../components/animations/GradientBackground';
import { useAuth } from '../../auth';
import { showSuccessToast, showErrorToast, showInfoToast } from '../../components/layouts/toast/miniToast';

const Login = () => {
  const [formData, setFormData] = useState({
    user: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set animation visibility after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Call the login function from AuthContext
      const userData = await login(formData.user, formData.password);
      
      // Show success toast notification with username if available
      if (userData && userData.username) {
        showSuccessToast(`Welcome back, ${userData.username}! Login successful.`);
      } else {
        showSuccessToast(`Welcome back! Login successful.`);
      }
      
      // Get the redirect path from location state or default to profile page
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showErrorToast(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      // Show a toast notification before redirecting
      showInfoToast('Redirecting to Google login...');
      window.location.href = `${API_URL}/users/auth/google/login/`;
    } catch (error) {
      console.error('Google login redirect failed:', error);
      showErrorToast('Failed to redirect to Google login. Please try again.');
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
        <div>
          <h1 
            className={`text-3xl font-bold tracking-tight mb-2 text-center transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-red-600">
              Welcome Back
            </span>
          </h1>
          
        </div>
        
        {error && (
          <div 
            className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
            role="alert"
            style={{ transitionDelay: '350ms' }}
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form 
          className={`mt-8 space-y-6 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
          style={{ transitionDelay: '400ms' }}
          onSubmit={handleSubmit}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user" className="sr-only">Email address</label>
              <input
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md mb-2 relative block w-full px-3 py-3 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address or username"
                value={formData.user}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div> */}

            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-black/80 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div 
          className={`mt-2 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <p 
            className={`mb-4 text-center text-sm text-gray-600 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '300ms' }}
          >
            New member?{' '}
            <Link to="/register" className="underline font-medium text-blue-600 hover:text-blue-500">
              Create a new account
            </Link>
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-700 rounded-md">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2 border-0 border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                  fill="#34A853"
                />
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link 
              to='/' 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium transition-all duration-300"
            >
              <span className="mr-1 no-underline">←</span>
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;