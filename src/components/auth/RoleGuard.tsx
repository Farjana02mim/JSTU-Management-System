import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonLoader } from '../common/SkeletonLoader';

/**
 * RoleGuard
 * 
 * CRITICAL ARCHITECTURAL SECURITY NOTICE:
 * Route guards are only client-side UX navigation aids.
 * The REAL, authoritative access enforcement is executed strictly server-side
 * by Firestore Security Rules (checking request.auth.token.role) and Cloud Functions.
 * Never rely solely on client-side route guards for data security.
 */

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-4">
        <SkeletonLoader variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to unauthorized page with context
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname, currentRole: role }} replace />;
  }

  return <>{children}</>;
};
