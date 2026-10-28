import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SkeletonLoader } from '../common/SkeletonLoader';

/**
 * ProtectedRoute
 * Verifies authentication state, email verification, mandatory MFA status for staff,
 * and forces password change on initial login.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isMfaRequired, isMfaVerified, mustChangePassword } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-4">
        <SkeletonLoader variant="rectangular" className="h-12 w-full" />
        <SkeletonLoader variant="text" className="h-6 w-1/3" />
        <SkeletonLoader variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  // 1. Must be authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Email verification check
  if (!user.emailVerified) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-center space-y-3">
        <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">Email Verification Required</h2>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          In accordance with JSTU security policies, access is blocked until you verify your institutional email address ({user.email}).
        </p>
      </div>
    );
  }

  // 3. Force password change on first login
  if (mustChangePassword && location.pathname !== '/set-password') {
    return <Navigate to="/set-password" replace />;
  }

  // 4. Staff MFA Enforcement
  if (isMfaRequired && !isMfaVerified && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ requireMfa: true }} replace />;
  }

  return <>{children}</>;
};
