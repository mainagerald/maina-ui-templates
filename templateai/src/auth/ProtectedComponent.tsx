import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '@/components/layouts/state';

interface ProtectedComponentProps {
  component: React.ComponentType;
  redirectPath?: string;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  component: Component,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated, render the component
  return <Component />;
};

export default ProtectedComponent;
