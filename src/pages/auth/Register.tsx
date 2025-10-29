import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GradientBackground from '../../components/animations/GradientBackground';
import { useAuth } from '../../auth';
import { showErrorToast, showSuccessToast } from '../../components/layouts/toast/miniToast';
import { Spinner } from '@/components/layouts/state';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordValid, setPasswordValid] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  // Set animation visibility after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Validate password against Django's default validators
  useEffect(() => {
    const validatePassword = () => {
      const errors: string[] = [];
      const { password, username, email } = formData;
      
      // Check minimum length (Django default is 8)
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      
      // Check if password is entirely numeric
      if (/^\d+$/.test(password)) {
        errors.push('Password cannot be entirely numeric');
      }
      
      // Check for common patterns
      if (/^(123456|password|qwerty|admin|welcome)/i.test(password)) {
        errors.push('Password is too common');
      }
      
      // Check for similarity to username or email
      if (username && password.toLowerCase().includes(username.toLowerCase())) {
        errors.push('Password cannot contain your username');
      }
      
      if (email) {
        const emailUsername = email.split('@')[0];
        if (password.toLowerCase().includes(emailUsername.toLowerCase())) {
          errors.push('Password cannot contain your email username');
        }
      }
      
      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      // Check for at least one special character
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
      
      setPasswordErrors(errors);
      setPasswordValid(errors.length === 0 && password.length >= 8);
    };
    
    if (formData.password) {
      validatePassword();
    } else {
      setPasswordErrors([]);
      setPasswordValid(false);
    }
  }, [formData.password, formData.username, formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showErrorToast('Passwords do not match. Please try again.');
      return;
    }
    
    // Password strength validation
    if (!passwordValid) {
      setError('Password does not meet requirements');
      showErrorToast('Please fix the password issues before continuing.');
      return;
    }
    
    setError('');
    
    try {
      // Call the register function from AuthContext
      const response = await register(formData.email, formData.username, formData.password);
      
      // Show personalized success toast
      showSuccessToast(`Welcome to TEMPLATE, ${formData.username}! Registration successful.`);
      
      // Show additional info toast for verification if needed
      if (response?.verification_sent) {
        setTimeout(() => {
          showSuccessToast('Please check your email for verification instructions.', { duration: 6000 });
        }, 1000);
      }
      
      // Check if verification is required
      if (response?.verification_sent) {
        // Redirect to verification pending page
        navigate('/register-success', { state: { email: formData.email } });
      } else {
        // If no verification required (e.g., in development), redirect to dashboard
        navigate('/');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Check for conflict status (email or username already exists)
      if (error.response?.status === 409) {
        const field = error.response.data.field;
        if (field === 'email') {
          const errorMsg = 'This email is already registered.';
          setError(errorMsg);
          showErrorToast(errorMsg + ' Please use a different email or try logging in.', { duration: 5000 });
        } else if (field === 'username') {
          const errorMsg = 'This username is already taken.';
          setError(errorMsg);
          showErrorToast(errorMsg + ' Please choose a different username.', { duration: 5000 });
        } else {
          const errorMsg = error.response.data.error || 'Registration failed.';
          setError(errorMsg);
          showErrorToast(errorMsg + ' Please try again.', { duration: 5000 });
        }
      } else {
        const errorMsg = error.response?.data?.error || 'Registration failed.';
        setError(errorMsg);
        showErrorToast(errorMsg + ' Please try again.', { duration: 5000 });
      }
    }
  };

  const handleGoogleSignup = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    window.location.href = `${API_URL}/users/auth/google/login/`;
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

      <div className="max-w-md w-full space-y-6 backdrop-blur-sm p-8 rounded-3xl shadow-lg z-10 relative">
        <div>
          <h1 
            className={`text-3xl font-bold tracking-tight mb-1 text-center transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-purple-600 to-red-600">
              Join Us
            </span>
          </h1>
          <p 
            className={`mt-1 text-center text-sm text-gray-600 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '300ms' }}
          >
            Already have an account ?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </p>
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
          className={`mt-6 space-y-4 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
          style={{ transitionDelay: '400ms' }}
          onSubmit={handleSubmit}
        >
          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username (optional)</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="appearance-none rounded-xl relative block w-full px-3 py-2 mb-1 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Username (optional)"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 mb-1 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`appearance-none rounded-xl relative block w-full px-3 py-2 mb-1 border ${
                  formData.password && !passwordValid ? 'border-red-300' : 'border-gray-300'
                } bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              
              {/* Password requirements */}
              {formData.password && (
                <div className="mt-2 text-xs space-y-1">
                  {passwordErrors.length > 0 && (
                    <div className="text-red-600 mt-1">
                      {passwordErrors.map((err, index) => (
                        <p key={index}>{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 mb-1 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div 
            className={`transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <div 
          className={`mt-6 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="flex w-full justify-center">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-3 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 w-full max-w-[300px]"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
        
        <div 
          className={`mt-4 text-center text-xs text-gray-600 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '700ms' }}
        >
          By signing up, you agree to our{' '}
          <a href="/terms-and-conditions" rel="noopener noreferrer" target="_blank" className="text-purple-600 hover:text-purple-500">Terms of Service</a>{' '}
          and{' '}
          <a href="/policy" rel="noopener noreferrer" target="_blank" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
        </div>
        
        <div 
          className={`mt-4 transition-all text-center duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '800ms' }}
        >
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
  );
};

export default Register;