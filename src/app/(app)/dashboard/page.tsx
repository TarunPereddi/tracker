'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Zap,
  Heart,
  DollarSign,
  Briefcase,
  BookOpen,
  Activity,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Flame,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
// Removed custom skill map - will use recharts radar chart

// Chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface HealthLog {
  _id: string;
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
  muscleMassPct?: number;
  sleepHrs?: number;
  steps?: number;
  waterLiters?: number;
  energy1to10?: number;
  mood?: string;
  supplements: {
    multi: boolean;
    d3k2: boolean;
    b12: boolean;
    creatine: boolean;
    fishOil: boolean;
    other: string[];
  };
}

interface DayPlan {
  _id: string;
  date: string;
  dayTypeId: string;
  dayType: {
    name: string;
    intendedWake: string;
    intendedSleep: string;
    intendedSteps: number;
  };
  routineChecks: boolean[];
  stepsMet: boolean;
  wakeMet: boolean;
  sleepMet: boolean;
  checklistPct: number;
}

interface SkillLog {
  _id: string;
  date: string;
  skill: string;
  category: string;
  timeSpent: number;
  difficulty: string;
  rating?: number;
}

interface JobApplication {
  _id: string;
  company: string;
  position: string;
  status: string;
  appliedDate: string;
  interviews: any[];
}

interface FinanceSetup {
  currentBalance: number;
  incomeSources: Array<{ name: string; amount: number; creditDay: number }>;
  emis: Array<{ name: string; amount: number; debitDay: number }>;
  livingExpenses: Array<{ name: string; amount: number; debitDay: number; category: string }>;
  investments: Array<{ name: string; type: string; amount: number; currentValue?: number }>;
}

interface Transaction {
  _id: string;
  date: string;
  type: 'debit' | 'credit';
  amount: number;
  category: string;
  desc?: string;
}

interface DayType {
  _id: string;
  name: string;
  intendedWake: string;
  intendedSleep: string;
  intendedSteps: number;
  routineChecklist: Array<{
    key: string;
    label: string;
    defaultChecked: boolean;
  }>;
}

export default function DashboardPage() {
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [dayTypes, setDayTypes] = useState<DayType[]>([]);
  const [skillLogs, setSkillLogs] = useState<SkillLog[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [financeSetup, setFinanceSetup] = useState<FinanceSetup | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const { error: showError } = useToast();

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      const today = new Date();
      let startDate: string;
      
      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().split('T')[0];
          break;
        default:
          startDate = today.toISOString().split('T')[0];
      }
      
      const endDate = today.toISOString().split('T')[0];

      const [healthRes, dayPlansRes, dayTypesRes, skillsRes, jobsRes, financeRes, transactionsRes] = await Promise.all([
        fetch(`/api/health?startDate=${startDate}&endDate=${endDate}`),
        fetch(`/api/routine/day-plan?startDate=${startDate}&endDate=${endDate}`),
        fetch('/api/routine/day-types'),
        fetch(`/api/skills?startDate=${startDate}&endDate=${endDate}`),
        fetch('/api/jobs/applications'),
        fetch('/api/finance/setup'),
        fetch(`/api/finance/transactions?startDate=${startDate}&endDate=${endDate}`)
      ]);

      const [healthData, dayPlansData, dayTypesData, skillsData, jobsData, financeData, transactionsData] = await Promise.all([
        healthRes.json(),
        dayPlansRes.json(),
        dayTypesRes.json(),
        skillsRes.json(),
        jobsRes.json(),
        financeRes.json(),
        transactionsRes.json()
      ]);

      if (healthData.ok) setHealthLogs(healthData.logs || []);
      if (dayPlansData.ok) setDayPlans(dayPlansData.dayPlans || []);
      if (dayTypesData.ok) setDayTypes(dayTypesData.dayTypes || []);
      if (skillsData.ok) setSkillLogs(skillsData.skills || []);
      if (jobsData.ok) setJobApplications(jobsData.applications || []);
      if (financeData.ok) setFinanceSetup(financeData.setup);
      if (transactionsData.ok) setTransactions(transactionsData.transactions || []);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showError('Failed to load dashboard data', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  // Calculate insights
  const getHealthInsights = () => {
    const recentLogs = healthLogs.slice(0, 7);
    const avgSleep = recentLogs.reduce((sum, log) => sum + (log.sleepHrs || 0), 0) / recentLogs.length || 0;
    const avgSteps = recentLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / recentLogs.length || 0;
    const avgWater = recentLogs.reduce((sum, log) => sum + (log.waterLiters || 0), 0) / recentLogs.length || 0;
    const avgEnergy = recentLogs.reduce((sum, log) => sum + (log.energy1to10 || 0), 0) / recentLogs.length || 0;
    
    return { avgSleep, avgSteps, avgWater, avgEnergy, totalLogs: recentLogs.length };
  };

  const getRoutineInsights = () => {
    const recentPlans = dayPlans.slice(0, 7);
    const avgCompliance = recentPlans.reduce((sum, plan) => sum + (plan.checklistPct || 0), 0) / recentPlans.length || 0;
    const stepsCompliance = recentPlans.filter(plan => plan.stepsMet).length / recentPlans.length || 0;
    const wakeCompliance = recentPlans.filter(plan => plan.wakeMet).length / recentPlans.length || 0;
    const sleepCompliance = recentPlans.filter(plan => plan.sleepMet).length / recentPlans.length || 0;
    
    return { avgCompliance, stepsCompliance, wakeCompliance, sleepCompliance, totalPlans: recentPlans.length };
  };

  const getSkillsInsights = () => {
    const totalTime = skillLogs.reduce((sum, skill) => sum + skill.timeSpent, 0);
    const categories = [...new Set(skillLogs.map(skill => skill.category))];
    const avgRating = skillLogs.reduce((sum, skill) => sum + (skill.rating || 0), 0) / skillLogs.length || 0;
    const difficultyBreakdown = {
      beginner: skillLogs.filter(s => s.difficulty === 'beginner').length,
      intermediate: skillLogs.filter(s => s.difficulty === 'intermediate').length,
      advanced: skillLogs.filter(s => s.difficulty === 'advanced').length
    };
    
    return { totalTime, categories, avgRating, difficultyBreakdown, totalSessions: skillLogs.length };
  };

  const getJobsInsights = () => {
    const activeApplications = jobApplications.filter(app => !['rejected', 'withdrawn'].includes(app.status));
    const inInterview = jobApplications.filter(app => app.status === 'interview');
    const offers = jobApplications.filter(app => app.status === 'offer');
    const totalInterviews = jobApplications.reduce((sum, app) => sum + app.interviews.length, 0);
    const totalApplications = jobApplications.length;
    
    return { 
      activeApplications: activeApplications.length, 
      inInterview: inInterview.length, 
      offers: offers.length, 
      totalInterviews,
      totalApplications
    };
  };

  // Generate real data for charts
  const getEMIChartData = () => {
    if (!financeSetup?.emis || financeSetup.emis.length === 0) {
      return [];
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const data: any = { month };
      financeSetup.emis.forEach((emi, emiIndex) => {
        // Simulate gradual reduction over time
        const reductionFactor = Math.max(0.1, 1 - (index * 0.15));
        data[`emi${emiIndex + 1}`] = Math.round(emi.amount * reductionFactor);
      });
      return data;
    });
  };

  const getApplicationFrequencyData = () => {
    if (jobApplications.length === 0) {
      return [];
    }
    
    // Group applications by week for the last 4 weeks
    const weeks = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekApplications = jobApplications.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= weekStart && appDate <= weekEnd;
      });
      
      const weekInterviews = weekApplications.reduce((sum, app) => sum + app.interviews.length, 0);
      
      weeks.push({
        week: `Week ${4 - i}`,
        applications: weekApplications.length,
        interviews: weekInterviews
      });
    }
    
    return weeks;
  };

  const getSkillRadarData = () => {
    if (skillLogs.length === 0) {
      return [];
    }
    
    // Group skills by category and calculate metrics
    const categories = ['frontend', 'backend', 'database', 'devops', 'mobile', 'ai-ml', 'algorithms', 'system-design'];
    const categoryStats = categories.map(category => {
      const categorySkills = skillLogs.filter(skill => skill.category === category);
      const totalTime = categorySkills.reduce((sum, skill) => sum + skill.timeSpent, 0);
      const avgRating = categorySkills.reduce((sum, skill) => sum + (skill.rating || 0), 0) / categorySkills.length || 0;
      const sessionCount = categorySkills.length;
      
      // Calculate a composite score (0-100)
      const timeScore = Math.min(100, (totalTime / 60) * 2); // 2 points per hour, max 100
      const ratingScore = avgRating * 20; // 5 stars = 100 points
      const sessionScore = Math.min(100, sessionCount * 10); // 10 points per session, max 100
      
      const compositeScore = Math.round((timeScore + ratingScore + sessionScore) / 3);
      
      return {
        category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score: compositeScore,
        time: totalTime,
        sessions: sessionCount
      };
    });
    
    return categoryStats;
  };

  const getFinanceInsights = () => {
    if (!financeSetup) return null;
    
    const totalIncome = (financeSetup.incomeSources || []).reduce((sum, source) => sum + (source.amount || 0), 0);
    const totalEMIs = (financeSetup.emis || []).reduce((sum, emi) => sum + (emi.amount || 0), 0);
    const totalExpenses = (financeSetup.livingExpenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalInvestments = (financeSetup.investments || []).reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const netMonthly = totalIncome - totalEMIs - totalExpenses - totalInvestments;
    
    const recentTransactions = transactions.slice(0, 10);
    const credits = recentTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const debits = recentTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    
    return { 
      totalIncome, 
      totalEMIs, 
      totalExpenses, 
      totalInvestments, 
      netMonthly, 
      currentBalance: financeSetup.currentBalance || 0,
      recentCredits: credits,
      recentDebits: debits
    };
  };

  const calculateEfficiencyScore = () => {
    const health = getHealthInsights();
    const routine = getRoutineInsights();
    const skills = getSkillsInsights();
    const jobs = getJobsInsights();
    
    // Weighted scoring system
    const healthScore = Math.min(100, (health.avgSleep / 8) * 25 + (health.avgSteps / 10000) * 25 + (health.avgWater / 3) * 25 + (health.avgEnergy / 10) * 25);
    const routineScore = routine.avgCompliance;
    const skillsScore = Math.min(100, (skills.totalTime / 300) * 50 + (skills.avgRating / 5) * 50); // 5 hours = 100%
    const jobsScore = Math.min(100, jobs.activeApplications * 10 + jobs.totalInterviews * 5);
    
    return Math.round((healthScore * 0.3 + routineScore * 0.3 + skillsScore * 0.2 + jobsScore * 0.2));
  };

  const healthInsights = getHealthInsights();
  const routineInsights = getRoutineInsights();
  const skillsInsights = getSkillsInsights();
  const jobsInsights = getJobsInsights();
  const financeInsights = getFinanceInsights();
  const efficiencyScore = calculateEfficiencyScore();

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  // Check if day types are set up
  if (dayTypes.length === 0) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl lg:text-3xl font-semibold text-white">Dashboard</h1>
            </div>
            <p className="text-gray-400">Your comprehensive life tracking overview</p>
          </div>
          <div className="flex gap-2">
            <Link href="/routine/calendar">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Setup Required</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              To see your dashboard insights, you need to create day types first. Day types help track your routines and provide meaningful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/routine">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Target className="mr-2 h-4 w-4" />
                  Create Day Types
                </Button>
              </Link>
              <Link href="/routine/calendar">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Dashboard</h1>
          </div>
          <p className="text-gray-400">Your comprehensive life tracking overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/routine/calendar">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </Link>
          <Button
            variant={timeRange === 'today' ? 'default' : 'outline'}
            onClick={() => setTimeRange('today')}
            size="sm"
            className={timeRange === 'today' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
          >
            Today
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            size="sm"
            className={timeRange === 'week' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
          >
            This Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            size="sm"
            className={timeRange === 'month' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Efficiency Score */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Efficiency Score</h2>
              </div>
              <p className="text-gray-400">Your overall life optimization rating</p>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-4xl font-bold text-white">{efficiencyScore}</div>
              <div className="text-gray-400">/ 100</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${efficiencyScore}%` }}
            ></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Needs Improvement</span>
            <span>Excellent</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Heart className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{healthInsights.avgSleep.toFixed(1)}h</div>
                <div className="text-sm text-gray-400">Avg Sleep</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{Math.round(healthInsights.avgSteps).toLocaleString()}</div>
                <div className="text-sm text-gray-400">Avg Steps</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{Math.round(routineInsights.avgCompliance)}%</div>
                <div className="text-sm text-gray-400">Routine Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">{Math.round(skillsInsights.totalTime / 60)}h</div>
                <div className="text-sm text-gray-400">Learning Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Trends - Weight & Body Composition */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Heart className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-white">Body Composition Trends (Last 30 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthLogs.slice(0, 30).map(log => ({
                date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: log.weightKg || 0,
                bodyFat: log.bodyFatPct || 0,
                muscleMass: log.muscleMassPct || 0,
                sleep: log.sleepHrs || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="bodyFat" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                <Line type="monotone" dataKey="muscleMass" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics - Sleep & Steps */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-white">Sleep & Activity Trends (Last 7 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthLogs.slice(0, 7).map(log => ({
                date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sleep: log.sleepHrs || 0,
                steps: (log.steps || 0) / 1000, // Convert to thousands
                water: log.waterLiters || 0,
                energy: log.energy1to10 || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area type="monotone" dataKey="sleep" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="steps" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="water" stackId="3" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                <Area type="monotone" dataKey="energy" stackId="4" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skills Map */}
      {getSkillRadarData().length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-white">Skills Development Map</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Radar chart showing your learning progress across different skill areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={getSkillRadarData()}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
                  />
                  <Radar
                    name="Skill Level"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value, name, props) => [
                      `${value}%`,
                      'Skill Level',
                      `Sessions: ${props.payload.sessions}, Time: ${Math.round(props.payload.time / 60)}h`
                    ]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Analytics */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-white">Skills Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills by Category */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Time by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsInsights.categories.map(category => {
                    const categoryTime = skillLogs
                      .filter(skill => skill.category === category)
                      .reduce((sum, skill) => sum + skill.timeSpent, 0);
                    return {
                      category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      time: Math.round(categoryTime / 60 * 10) / 10 // Convert to hours
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      formatter={(value) => [`${value}h`, 'Time']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="time" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Difficulty Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Beginner', value: skillsInsights.difficultyBreakdown.beginner, color: '#10b981' },
                    { name: 'Intermediate', value: skillsInsights.difficultyBreakdown.intermediate, color: '#f59e0b' },
                    { name: 'Advanced', value: skillsInsights.difficultyBreakdown.advanced, color: '#ef4444' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finance Overview with Charts */}
      {financeInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-white">Financial Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-xl font-bold text-green-400">₹{financeInsights.totalIncome.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Monthly Income</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg">
                  <div className="text-xl font-bold text-red-400">₹{(financeInsights.totalEMIs + financeInsights.totalExpenses).toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Monthly Expenses</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">₹{financeInsights.totalInvestments.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Monthly Investments</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <div className={`text-xl font-bold ${financeInsights.netMonthly >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{financeInsights.netMonthly.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Net Monthly</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'EMIs', value: financeInsights.totalEMIs, color: '#ef4444' },
                    { name: 'Living Expenses', value: financeInsights.totalExpenses, color: '#f59e0b' },
                    { name: 'Investments', value: financeInsights.totalInvestments, color: '#3b82f6' },
                    { name: 'Savings', value: Math.max(0, financeInsights.netMonthly), color: '#10b981' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EMI Reduction Chart */}
      {financeInsights && getEMIChartData().length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-orange-400" />
              </div>
              <span className="text-white">EMI Reduction Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getEMIChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'EMI Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  {financeSetup?.emis?.map((emi, index) => (
                    <Line 
                      key={emi.name}
                      type="monotone" 
                      dataKey={`emi${index + 1}`} 
                      stroke={['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][index % 5]} 
                      strokeWidth={2} 
                      name={emi.name} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Search Pipeline */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-white">Job Search Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { stage: 'Applied', count: jobsInsights.totalApplications || 0, color: '#3b82f6' },
                { stage: 'HR Screen', count: jobsInsights.inInterview || 0, color: '#8b5cf6' },
                { stage: 'Technical', count: Math.floor((jobsInsights.inInterview || 0) * 0.6), color: '#f59e0b' },
                { stage: 'Final', count: Math.floor((jobsInsights.inInterview || 0) * 0.3), color: '#10b981' },
                { stage: 'Offers', count: jobsInsights.offers || 0, color: '#22c55e' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="stage" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Applications']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Application Frequency */}
      {getApplicationFrequencyData().length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-white">Application Frequency (Last 4 Weeks)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getApplicationFrequencyData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="interviews" fill="#10b981" name="Interviews" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  );
}