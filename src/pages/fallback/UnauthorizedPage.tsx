import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="responsive-container mt-16">
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <ShieldAlert className="h-16 w-16 text-red-600" />
        </div>
        
        <h1 className="text-3xl mb-4">Access Denied</h1>
        
        <p className="text-gray-600 max-w-md mb-8">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-black/80 transition-colors"
          >
            <ArrowLeft size={18} />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
