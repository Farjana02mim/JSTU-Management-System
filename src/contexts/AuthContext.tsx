import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UserRole, UserCustomClaims, UserProfile, isStaffRole } from '../types/auth';
import { getAuthService } from '../services/auth';
import { AuthService, AuthUserSession } from '../services/auth/types';

interface AuthContextType {
  user: AuthUserSession | null;
  profile: UserProfile | null;
  claims: UserCustomClaims | null;
  role: UserRole | null;
  loading: boolean;
  isMfaRequired: boolean;
  isMfaVerified: boolean;
  completeMfaChallenge: (code: string) => Promise<boolean>;
  mustChangePassword: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string; requireMfa?: boolean; role?: UserRole }>;
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
  reauthenticate: (password: string) => Promise<boolean>;
  updateUserPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  idleTimeRemaining: number | null; // seconds until idle logout
  resetIdleTimer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 30 minutes idle timeout; warning at 25 minutes (300 seconds countdown)
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_THRESHOLD_MS = 5 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authService, setAuthService] = useState<AuthService | null>(null);
  const [user, setUser] = useState<AuthUserSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [claims, setClaims] = useState<UserCustomClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMfaVerified, setIsMfaVerified] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Idle timeout tracking (in-memory only)
  const lastActivityRef = useRef<number>(Date.now());
  const [idleTimeRemaining, setIdleTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    getAuthService().then((service) => {
      setAuthService(service);
      unsubscribe = service.onAuthStateChanged((activeUser, activeProfile, activeClaims) => {
        setUser(activeUser);
        setProfile(activeProfile);
        setClaims(activeClaims);
        setMustChangePassword(!!activeClaims?.mustChangePassword);
        if (activeClaims?.mfaEnforced) {
          setIsMfaVerified(false);
        } else {
          setIsMfaVerified(true);
        }
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const refreshClaims = useCallback(async () => {
    if (!authService) return;
    const currentUser = authService.getCurrentUser();
    const currentClaims = authService.getCurrentClaims();
    const currentProfile = authService.getCurrentProfile();
    setUser(currentUser);
    setClaims(currentClaims);
    setProfile(currentProfile);
    setMustChangePassword(!!currentClaims?.mustChangePassword);
  }, [authService]);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setIdleTimeRemaining(null);
  }, []);

  useEffect(() => {
    if (!user) {
      setIdleTimeRemaining(null);
      return;
    }

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remainingMs = IDLE_TIMEOUT_MS - elapsed;

      if (remainingMs <= 0) {
        // Idle timeout reached
        if (authService) {
          authService.signOut();
        }
        setUser(null);
        setClaims(null);
        setProfile(null);
        setIdleTimeRemaining(null);
      } else if (remainingMs <= WARNING_THRESHOLD_MS) {
        setIdleTimeRemaining(Math.ceil(remainingMs / 1000));
      } else {
        setIdleTimeRemaining(null);
      }
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(interval);
    };
  }, [user, authService]);

  const signIn = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; requireMfa?: boolean; role?: UserRole }> => {
    setLoading(true);
    try {
      const service = authService || (await getAuthService());
      const res = await service.signIn(email, pass);
      if (res.success) {
        const activeClaims = service.getCurrentClaims();
        const activeProfile = service.getCurrentProfile();
        const activeUser = service.getCurrentUser();
        const userRole = res.role || activeClaims?.role || activeProfile?.role;
        setUser(activeUser);
        setClaims(activeClaims);
        setProfile(activeProfile);
        setMustChangePassword(!!activeClaims?.mustChangePassword);
        if (res.requireMfa) {
          setIsMfaVerified(false);
        } else {
          setIsMfaVerified(true);
        }
        setLoading(false);
        return { ...res, role: userRole };
      }
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const completeMfaChallenge = async (code: string): Promise<boolean> => {
    if (!authService) return false;
    const ok = await authService.completeMfaChallenge(code);
    if (ok) {
      setIsMfaVerified(true);
    }
    return ok;
  };

  const signOut = async () => {
    if (authService) {
      await authService.signOut();
    }
    setUser(null);
    setProfile(null);
    setClaims(null);
    setIsMfaVerified(false);
    setMustChangePassword(false);
  };

  const reauthenticate = async (password: string): Promise<boolean> => {
    if (!authService) return false;
    return authService.reauthenticate(password);
  };

  const updateUserPassword = async (
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!authService) return { success: false, error: 'Auth service not initialized' };
    return authService.updateUserPassword(oldPass, newPass);
  };

  const role = claims?.role || profile?.role || null;
  const isMfaRequired = !!(claims?.mfaEnforced || (role && isStaffRole(role)));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        claims,
        role,
        loading,
        isMfaRequired,
        isMfaVerified,
        completeMfaChallenge,
        mustChangePassword,
        signIn,
        signOut,
        refreshClaims,
        reauthenticate,
        updateUserPassword,
        idleTimeRemaining,
        resetIdleTimer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
