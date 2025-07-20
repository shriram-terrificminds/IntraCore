import React, { useState } from 'react';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const { forgotPassword, isLoading } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await forgotPassword(email);
    if (success) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Check your email
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p>The link will expire in 24 hours.</p>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="auth"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Try another email
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onBackToLogin}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset your password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
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
            <Button
              type="submit"
              variant="auth"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending reset email...
                </>
              ) : (
                'Send reset email'
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
  );
};