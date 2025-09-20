'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  DollarSign, 
  Briefcase, 
  BookOpen, 
  TrendingUp, 
  Target,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface DashboardStats {
  health: {
    currentWeight?: number;
    avgSleep: number;
    stepsToday: number;
    stepsTarget: number;
    moodToday?: string;
  };
  finance: {
    monthlyIncome: number;
    monthlyExpenses: number;
    emiTotal: number;
    netWorth: number;
  };
  jobs: {
    totalApplications: number;
    pendingFollowups: number;
    interviewsThisWeek: number;
    offers: number;
  };
  skills: {
    hoursThisWeek: number;
    projectsBuilt: number;
    weakAreas: string[];
  };
  routine: {
    todayCompliance: number;
    checklistCompleted: number;
    checklistTotal: number;
  };
  efficiency: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // This would be a real API call in production
      // For now, we'll use mock data
      const mockStats: DashboardStats = {
        health: {
          currentWeight: 75.2,
          avgSleep: 7.2,
          stepsToday: 8500,
          stepsTarget: 10000,
          moodToday: 'Good'
        },
        finance: {
          monthlyIncome: 50000,
          monthlyExpenses: 35000,
          emiTotal: 15000,
          netWorth: 250000
        },
        jobs: {
          totalApplications: 25,
          pendingFollowups: 3,
          interviewsThisWeek: 2,
          offers: 1
        },
        skills: {
          hoursThisWeek: 12,
          projectsBuilt: 2,
          weakAreas: ['System Design', 'AWS']
        },
        routine: {
          todayCompliance: 75,
          checklistCompleted: 6,
          checklistTotal: 8
        },
        efficiency: 78
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's how you're doing today.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{stats.efficiency}%</div>
          <div className="text-sm text-gray-500">Efficiency Score</div>
        </div>
      </div>

      {/* Efficiency Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Overall Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-500">{stats.efficiency}%</span>
            </div>
            <Progress value={stats.efficiency} className="h-2" />
            <div className="text-sm text-gray-600">
              Based on routine compliance, health metrics, skills progress, and job applications
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Routine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Checklist Progress</span>
              <span className="text-sm text-gray-500">
                {stats.routine.checklistCompleted}/{stats.routine.checklistTotal}
              </span>
            </div>
            <Progress value={(stats.routine.checklistCompleted / stats.routine.checklistTotal) * 100} className="h-2" />
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              {stats.routine.checklistCompleted} tasks completed today
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stats.health.currentWeight}kg</div>
              <div className="text-xs text-muted-foreground">
                {stats.health.avgSleep}h avg sleep
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-muted-foreground">
                  {stats.health.stepsToday.toLocaleString()}/{stats.health.stepsTarget.toLocaleString()} steps
                </div>
                <Badge variant={stats.health.stepsToday >= stats.health.stepsTarget ? "default" : "secondary"}>
                  {Math.round((stats.health.stepsToday / stats.health.stepsTarget) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹{stats.finance.netWorth.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Net Worth
              </div>
              <div className="text-xs text-muted-foreground">
                ₹{(stats.finance.monthlyIncome - stats.finance.monthlyExpenses).toLocaleString()} saved this month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stats.jobs.totalApplications}</div>
              <div className="text-xs text-muted-foreground">
                Total Applications
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.jobs.pendingFollowups} follow-ups due
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{stats.skills.hoursThisWeek}h</div>
              <div className="text-xs text-muted-foreground">
                This week
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.skills.projectsBuilt} projects built
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Logs</CardTitle>
            <CardDescription>Your latest health entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Today</div>
                  <div className="text-sm text-gray-500">Weight: 75.2kg, Sleep: 7.5h</div>
                </div>
                <Badge variant="outline">Good</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Yesterday</div>
                  <div className="text-sm text-gray-500">Weight: 75.0kg, Sleep: 6.8h</div>
                </div>
                <Badge variant="outline">Ok</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Things to follow up on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Job Application Follow-up</div>
                  <div className="text-sm text-gray-500">TechCorp - Software Engineer</div>
                </div>
                <Badge variant="destructive">Due Today</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Interview Preparation</div>
                  <div className="text-sm text-gray-500">System Design - Tomorrow</div>
                </div>
                <Badge variant="secondary">Tomorrow</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
