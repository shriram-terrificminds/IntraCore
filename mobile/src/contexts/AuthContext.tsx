// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../utils/client';

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

  const signIn = async (username: string, password: string, remember = false, onLogin?: () => void, playerId?: string) => {
    setLoading(true);
    try {
      const url = 'http://10.0.2.2:8000/api/auth/login';
      const body = {
        email: username,
        password,
        remember_me: remember,
      };
      console.log('Login request:', url, body);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error('Non-JSON response:', text);
        throw new Error('Server did not return JSON.');
      }
      console.log('Login response:', data);

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }

      const token = data.token;
      await AsyncStorage.setItem('userToken', token);
      console.log('[Auth] Token saved to AsyncStorage:', token);
      setTokenState(token);
      setUser({ email: username, role: data.user || 'Employee' });

      // Call OneSignal player_id update API if playerId is provided
      if (playerId) {
        try {
          const res = await client.post('/users/player-id', { player_id: playerId });
          console.log('[OneSignal] player_id updated:', res);
        } catch (err) {
          console.error('[OneSignal] Failed to update player_id:', err);
        }
      }

      if (onLogin) onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      throw new Error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
