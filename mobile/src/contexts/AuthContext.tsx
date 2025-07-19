// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // load token on mount
  useEffect(() => {
    AsyncStorage.getItem('userToken')
      .then(stored => {
        if (stored) setTokenState(stored);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string, password: string, remember = false) => {
    setLoading(true);
    // simulate API call delay
    await new Promise(res => setTimeout(res, 1000));
    const dummyToken = `token-${username}`;
    if (remember) {
      await AsyncStorage.setItem('userToken', dummyToken);
    }
    setTokenState(dummyToken);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('userToken');
    setTokenState(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
