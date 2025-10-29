import React from 'react';
import Spinner from './Spinner';

interface LoadingFallbackProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Loading...', 
  className = '',
  fullScreen = true
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center p-6 
      ${fullScreen ? 'fixed inset-0 bg-white backdrop-blur-sm z-50 h-screen' : ''}
      ${className}
    `}>
      <Spinner size="lg" color="red" className="mb-4" />
      <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
    </div>
  );
};

export default LoadingFallback;
