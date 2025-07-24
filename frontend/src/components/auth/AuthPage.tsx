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
      {/* Logo and Title */}
      <div className="z-10 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>IntraCore</h1>
        <p className="text-white/80 text-base">Inventory & Complaint Management</p>
      </div>
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
    </div>
  );
}