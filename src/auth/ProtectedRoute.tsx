import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '@/components/layouts/state';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  redirectPath?: string;
}

/**
 * ProtectedRoute component that handles authentication-based routing
 * 
 * @param requireAuth - If true, redirects to login when user is not authenticated
 * @param redirectPath - Path to redirect to when access is denied
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = true,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is authenticated but the route is for non-authenticated users only (like login page)
  // redirect to dashboard or home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
