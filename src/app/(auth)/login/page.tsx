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
import { Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await response.json();

      if (data.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
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
              Enter your passcode to access your personal dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-sm font-medium text-gray-300">
                  Passcode
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter your passcode"
                  required
                  className="h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              
              {error && (
                <Alert type="error" title="Authentication Failed" description={error} />
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
