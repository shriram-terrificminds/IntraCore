import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Button } from '@/components/ui/button';

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  // Check for reset token in URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    if (token && email) {
      setResetToken(token);
      setResetEmail(email);
      setActiveTab('reset-password');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      <div className="relative z-10 w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card/90 backdrop-blur-sm shadow-auth-card p-1 rounded-lg mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-0">
            <LoginForm onForgotPassword={() => setActiveTab('forgot-password')} />
          </TabsContent>
          <TabsContent value="forgot-password" className="mt-0">
            <ForgotPasswordForm onBackToLogin={() => setActiveTab('login')} />
          </TabsContent>
          <TabsContent value="reset-password" className="mt-0">
            {resetToken && resetEmail ? (
              <ResetPasswordForm 
                token={resetToken} 
                email={resetEmail} 
                onPasswordReset={() => setActiveTab('login')} 
              />
            ) : (
              <Card className="w-full max-w-md shadow-auth-card border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Invalid Link</CardTitle>
                  <CardDescription>The password reset link is invalid or expired. Please request a new one.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('forgot-password')} className="w-full">Request New Link</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(/placeholder-background.jpg)' }}></div>
    </div>
  );
}