import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 rounded-lg bg-red-50 text-red-800 border border-red-200 m-4">
      <h2 className="text-xl mb-2">Oops! Error encountered. It's not you, it's us.</h2>
      <p className='text-sm mb-2'>Please try reloading the page</p>
      {error && <p className="mb-4">{error.message}</p>}
      {resetErrorBoundary && (
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={resetErrorBoundary}
        >
          Please try again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
