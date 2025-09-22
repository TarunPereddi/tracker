'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Target, 
  Heart, 
  DollarSign, 
  ArrowRight, 
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Play
} from 'lucide-react';

export default function AppGuidePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update onboarding status to completed
      await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      showSuccess('Welcome to LifeFlow! You\'re all set up.');
      router.push('/dashboard');
    } catch (error) {
      showError('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center space-x-2">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">How to Use LifeFlow</h1>
            </div>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              Learn how to make the most of your life tracking system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Calendar & Day Types */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calendar className="mr-3 h-5 w-5 text-blue-400" />
                  Step 1: Assign Day Types to Calendar
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Plan your week by assigning day types to specific dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                    <div>
                      <p className="text-white font-medium">Go to Routine → Calendar</p>
                      <p className="text-gray-400 text-sm">Click on any date to assign a day type</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                    <div>
                      <p className="text-white font-medium">Select a Day Type</p>
                      <p className="text-gray-400 text-sm">Choose from your created day types (Work Day, Rest Day, etc.)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                    <div>
                      <p className="text-white font-medium">Plan Your Week</p>
                      <p className="text-gray-400 text-sm">Assign different day types to different dates based on your schedule</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>💡 Tip:</strong> This helps the app know what goals to track for each day and provides relevant analytics.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Health Tracking */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Heart className="mr-3 h-5 w-5 text-red-400" />
                  Step 2: Track Your Health Data
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Log your daily health metrics to see progress over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                    <div>
                      <p className="text-white font-medium">Go to Health Tab</p>
                      <p className="text-gray-400 text-sm">Access your health tracking dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                    <div>
                      <p className="text-white font-medium">Log Daily Metrics</p>
                      <p className="text-gray-400 text-sm">Record your weight, steps, sleep, mood, and other health data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                    <div>
                      <p className="text-white font-medium">View Progress</p>
                      <p className="text-gray-400 text-sm">See charts and trends to understand your health patterns</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 text-sm">
                    <strong>💡 Tip:</strong> The app will compare your actual data against your day type goals to show compliance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Finance Management */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <DollarSign className="mr-3 h-5 w-5 text-green-400" />
                  Step 3: Manage Your Finances
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track income, expenses, and investments with your setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                    <div>
                      <p className="text-white font-medium">Go to Finance Tab</p>
                      <p className="text-gray-400 text-sm">Access your financial dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                    <div>
                      <p className="text-white font-medium">Add Transactions</p>
                      <p className="text-gray-400 text-sm">Log income and expenses as they happen</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                    <div>
                      <p className="text-white font-medium">Monitor Progress</p>
                      <p className="text-gray-400 text-sm">Track spending against your setup and see financial health</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-300 text-sm">
                    <strong>💡 Tip:</strong> Your finance setup helps predict monthly cash flow and track recurring expenses.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="mr-3 h-5 w-5 text-purple-400" />
                  Key Features to Explore
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Additional tools to help you track and improve your life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Target className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Skills Tracking</p>
                      <p className="text-gray-400 text-sm">Log learning progress and skill development</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Job Applications</p>
                      <p className="text-gray-400 text-sm">Track career opportunities and interviews</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Today's View</p>
                      <p className="text-gray-400 text-sm">See your daily goals and progress at a glance</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Dashboard Analytics</p>
                      <p className="text-gray-400 text-sm">View comprehensive insights and trends</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion */}
            <div className="text-center space-y-4 pt-6">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">You're all set up!</span>
              </div>
              <p className="text-gray-400">
                Start by going to the Calendar and assigning day types to plan your week.
              </p>
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                {loading ? 'Completing...' : 'Start Using LifeFlow'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
