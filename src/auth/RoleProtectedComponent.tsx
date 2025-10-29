import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '@/components/layouts/state';

interface RoleProtectedComponentProps {
  component: React.ComponentType;
  allowedRoles: string[];
  redirectPath?: string;
}

/**
 * A component that protects routes based on user roles
 * Only allows access if the user has one of the specified roles
 */
const RoleProtectedComponent: React.FC<RoleProtectedComponentProps> = ({
  component: Component,
  allowedRoles,
  redirectPath = '/unauthorized',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  const userRole = user?.role || 'member';
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated and has the required role, render the component
  return <Component />;
};

export default RoleProtectedComponent;
