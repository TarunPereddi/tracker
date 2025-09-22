'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Target, Heart, DollarSign, Calendar } from 'lucide-react';

export default function WelcomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      // Update onboarding status to daytypes
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'daytypes' }),
      });

      if (response.ok) {
        router.push('/onboarding/daytypes');
      } else {
        console.error('Failed to update onboarding status');
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome to LifeFlow</h1>
            </div>
            <CardDescription className="text-gray-400 text-base sm:text-lg">
              Let's set up your personal life tracking system in just a few steps
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
                We'll help you set up:
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base">Day Types</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Define your routine patterns</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base">Health Tracking</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Set up wellness monitoring</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base">Finance Setup</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Configure money management</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-white text-sm sm:text-base">Complete Setup</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Ready to start tracking</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6">
              <Button
                onClick={handleGetStarted}
                disabled={loading}
                className="w-full h-10 sm:h-12 bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg"
              >
                {loading ? (
                  'Getting Started...'
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-400">
              <p>This will only take a few minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
