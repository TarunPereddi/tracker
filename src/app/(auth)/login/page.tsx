'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinesBackground } from '@/components/ui/lavender-bg';
import { LoadingSpinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Sparkles, Lock, ArrowRight, User, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { username, password }
        : { username, password, passcode };
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

          if (data.ok) {
            // Check onboarding status
            if (!data.user.onboardingStatus || data.user.onboardingStatus !== 'completed') {
              router.push('/onboarding');
            } else {
              router.push('/dashboard');
            }
          } else {
            setError(data.error || `${isLogin ? 'Login' : 'Registration'} failed`);
          }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <LinesBackground />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-semibold text-white">LifeFlow</h1>
            </div>
            <CardDescription className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Toggle between Login and Register */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  isLogin 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  !isLogin 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="passcode" className="text-sm font-medium text-gray-300">
                    Registration Passcode
                  </Label>
                  <Input
                    id="passcode"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter registration passcode"
                    required
                    className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-400">
                    Contact tarun.pereddi@outlook.com for the passcode
                  </p>
                </div>
              )}
              
              {error && (
                <Alert type="error" title={`${isLogin ? 'Login' : 'Registration'} Failed`} description={error} />
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {!isLogin && (
              <div className="text-center text-sm text-gray-400">
                <p>By creating an account, you agree to our simple terms.</p>
                <p className="mt-1">No email required - just username and password!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
