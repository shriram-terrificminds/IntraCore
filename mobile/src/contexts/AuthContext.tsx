// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserType {
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string, remember?: boolean, onLogin?: () => void) => Promise<void>;
  signOut: () => Promise<void>;
  user: UserType | null;
  getDashboard: () => Promise<{ role: string; requests: number; complaints: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  // load token on mount
  useEffect(() => {
    AsyncStorage.getItem('userToken')
      .then(stored => {
        if (stored) {
          setTokenState(stored);
          // Dummy user for now
          setUser({ email: 'alice@example.com', role: 'Employee' });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string, password: string, remember = false, onLogin?: () => void) => {
    setLoading(true);
    // simulate API call delay
    await new Promise(res => setTimeout(res, 1000));
    const dummyToken = `token-${username}`;
    if (remember) {
      await AsyncStorage.setItem('userToken', dummyToken);
    }
    setTokenState(dummyToken);
    setUser({ email: username, role: 'Employee' }); // Dummy role
    setLoading(false);
    if (onLogin) onLogin();
  };

  const signOut = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('userToken');
    setTokenState(null);
    setUser(null);
    setLoading(false);
  };

  const getDashboard = async () => {
    // Return dummy dashboard data
    return {
      role: user?.role || 'Employee',
      requests: 5,
      complaints: 2,
    };
  };

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut, user, getDashboard }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
