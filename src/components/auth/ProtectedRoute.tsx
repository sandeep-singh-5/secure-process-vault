import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Permission, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [] 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermissions.length > 0 && !requiredPermissions.every(permission => hasPermission(permission))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}