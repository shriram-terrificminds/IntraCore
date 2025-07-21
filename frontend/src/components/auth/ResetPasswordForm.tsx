import React, { useState } from 'react';
import { Mail, Lock, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface ResetPasswordFormProps {
  token: string;
  email: string;
  onPasswordReset: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, email, onPasswordReset }) => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ password?: string; passwordConfirmation?: string }>({});
  const [resetSuccess, setResetSuccess] = useState(false);

  const { resetPassword, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { password?: string; passwordConfirmation?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await resetPassword(token, email, password, passwordConfirmation);
    if (success) {
      setResetSuccess(true);
      setTimeout(onPasswordReset, 3000); // Redirect to login after 3 seconds
    }
  };

  if (resetSuccess) {
    return (
      <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Password Reset Successful!
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your password has been successfully updated. You will be redirected to the login page shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onPasswordReset} className="w-full" variant="default">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Set New Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
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
            <Label htmlFor="password-confirm">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password-confirm"
                type="password"
                placeholder="Confirm your new password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary ${
                  errors.passwordConfirmation ? 'border-destructive' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
                {errors.passwordConfirmation}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 