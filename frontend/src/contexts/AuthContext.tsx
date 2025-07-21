import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    location: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, email: string, password: string, password_confirmation: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await authService.getUser();
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    const response = await authService.login(email, password, remember);
    setUser(response.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    location: string
  ) => {
    const response = await authService.register(
      name,
      email,
      password,
      password_confirmation,
      location
    );
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      return false;
    }
  };

  const resetPassword = async (token: string, email: string, password: string, password_confirmation: string) => {
    try {
      await authService.resetPassword(token, email, password, password_confirmation);
      return true;
    } catch (error) {
      console.error('Reset password failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}