import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onBackToLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; password_confirmation?: string; token?: string; email?: string; }>({});
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Invalid Reset Link',
        description: 'The password reset link is missing a token.',
        variant: 'destructive',
      });
      // Optionally redirect after a short delay
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [token, toast, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; password_confirmation?: string; token?: string; } = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!token) newErrors.token = 'Reset token is missing';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (password !== passwordConfirmation) newErrors.password_confirmation = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await resetPassword(token, email, password, passwordConfirmation);
      if (success) {
        setResetSuccess(true);
        toast({
          title: 'Password Reset Successful',
          description: 'Your password has been reset. You can now log in with your new password.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Password Reset Failed',
          description: 'Could not reset password. Please check your email and token, or try again.',
          variant: 'destructive',
        });
      }
    } catch (apiError: any) {
        setErrors(apiError.response?.data?.errors || { general: 'An unexpected error occurred.' });
        toast({
            title: 'Password Reset Failed',
            description: apiError.response?.data?.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #5b42c9ff 0%, #9e43c9ff 100%)' }}>
      {/* Dynamic Blobs/Circles with Animation */}
      <svg className="absolute top-[-80px] left-[-80px] opacity-30 z-0 animate-bounce-slow" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="150" r="120" fill="#b89be7" />
      </svg>
      <svg className="absolute bottom-[-100px] right-[-100px] opacity-20 z-0 animate-bounce-medium" width="350" height="350" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="175" cy="175" r="140" fill="#9e43c9" />
      </svg>
      <svg className="absolute top-[20%] left-[-60px] opacity-20 z-0 animate-bounce-fast" width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="90" cy="90" r="80" fill="#fff" />
      </svg>
      <svg className="absolute bottom-[10%] left-[10%] opacity-10 z-0 animate-bounce-medium" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="100" fill="#f357a8" />
      </svg>
      <svg className="absolute top-[60%] right-[5%] opacity-20 z-0 animate-bounce-slow" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="#7b2ff2" />
      </svg>
      <svg className="absolute bottom-[-80px] left-[-80px] opacity-25 z-0 animate-bounce-slow" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="100" fill="#b89be7" />
      </svg>
      <svg className="absolute bottom-[5%] left-[5%] opacity-15 z-0 animate-bounce-medium" width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="70" r="65" fill="#f357a8" />
      </svg>
      {resetSuccess ? (
        <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Password Reset
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your password has been successfully reset!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="default"
              className="w-full"
              onClick={onBackToLogin}
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Set new password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-destructive' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                      errors.password ? 'border-destructive' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-confirmation">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password-confirmation"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                      errors.password_confirmation ? 'border-destructive' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onBackToLogin}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 