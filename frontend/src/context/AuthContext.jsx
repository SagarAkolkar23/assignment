import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [accessToken, setAccessToken] = useState(() => tokenStorage.getAccessToken());

  const saveAuthSession = useCallback(({ access, refresh, user: nextUser }) => {
    tokenStorage.setSession({ access, refresh, user: nextUser });
    setAccessToken(access);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearSession();
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('healthcare:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('healthcare:unauthorized', handleUnauthorized);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      saveAuthSession,
      logout,
    }),
    [user, accessToken, saveAuthSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
