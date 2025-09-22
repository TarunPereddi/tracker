'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, ArrowRight, Settings, User } from 'lucide-react';

export default function OnboardingStartPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const handleStartOnboarding = async () => {
    setLoading(true);
    try {
      // Update user's onboarding status to incomplete
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'incomplete' }),
      });

      if (response.ok) {
        showSuccess('Onboarding setup complete! Let\'s get started.');
        router.push('/onboarding/welcome');
      } else {
        showError('Failed to setup onboarding. Please try again.');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipOnboarding = async () => {
    setLoading(true);
    try {
      // Set onboarding status to completed to skip the process
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        showSuccess('Onboarding skipped. Welcome to your dashboard!');
        router.push('/dashboard');
      } else {
        showError('Failed to skip onboarding. Please try again.');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
            </div>
            <CardDescription className="text-gray-400 text-lg">
              We've added some new features to help you get the most out of LifeFlow
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Settings className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">New Onboarding System</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      We've created a guided setup process to help you configure your life tracking system more effectively.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Set up your day types and routines</li>
                      <li>• Configure health and wellness tracking</li>
                      <li>• Set up financial management</li>
                      <li>• Get personalized recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <User className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Your Data is Safe</h3>
                    <p className="text-gray-300 text-sm">
                      All your existing data will be preserved. The onboarding process will only help you 
                      organize and enhance your current setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleStartOnboarding}
                disabled={loading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white text-lg"
              >
                {loading ? (
                  'Setting up...'
                ) : (
                  <>
                    Start Guided Setup
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <Button
                onClick={handleSkipOnboarding}
                disabled={loading}
                variant="outline"
                className="w-full h-12 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {loading ? 'Skipping...' : 'Skip Setup & Go to Dashboard'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>You can always access the setup later from your profile settings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
