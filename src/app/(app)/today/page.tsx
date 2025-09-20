'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Target, 
  CheckCircle,
  Heart,
  Activity,
  Moon,
  Calendar,
  Plus
} from 'lucide-react';
import Link from 'next/link';

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

interface DayPlan {
  _id: string;
  date: string;
  dayTypeId: string;
  overrides?: any;
  routineChecks: Array<{
    key: string;
    checked: boolean;
    ts?: Date;
  }>;
  compliance?: {
    checklistPct: number;
    stepsMet: boolean;
    wakeMet: boolean;
    sleepMet: boolean;
  };
}

interface HealthLog {
  _id: string;
  date: string;
  weightKg?: number;
  sleepHrs?: number;
  energy1to10?: number;
  steps?: number;
  workoutType?: string;
  supplements: {
    multi: boolean;
    d3k2: boolean;
    b12: boolean;
    creatine: boolean;
    fishOil: boolean;
    other?: string[];
  };
  mood?: string;
  notes?: string;
}

export default function TodayPage() {
  const [dayType, setDayType] = useState<DayType | null>(null);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [healthLog, setHealthLog] = useState<HealthLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const [dayPlanRes, healthRes] = await Promise.all([
        fetch(`/api/routine/day-plan?startDate=${today}&endDate=${today}`),
        fetch(`/api/health?date=${today}`)
      ]);

      const dayPlanData = await dayPlanRes.json();
      const healthData = await healthRes.json();

      if (dayPlanData.ok && dayPlanData.dayPlans.length > 0) {
        const plan = dayPlanData.dayPlans[0];
        setDayPlan(plan);

        // Fetch day type details
        const dayTypeRes = await fetch('/api/routine/day-types');
        const dayTypeData = await dayTypeRes.json();
        if (dayTypeData.ok) {
          const type = dayTypeData.dayTypes.find((t: DayType) => t._id === plan.dayTypeId);
          setDayType(type);
        }
      }

      if (healthData.ok && healthData.logs.length > 0) {
        setHealthLog(healthData.logs[0]);
      }
    } catch (error) {
      console.error('Failed to fetch today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoutineCheck = async (key: string, checked: boolean) => {
    if (!dayPlan) return;

    setUpdating(true);
    try {
      const updatedChecks = dayPlan.routineChecks.map(check => 
        check.key === key ? { ...check, checked, ts: new Date() } : check
      );

      // Add new check if it doesn't exist
      if (!dayPlan.routineChecks.find(check => check.key === key)) {
        updatedChecks.push({ key, checked, ts: new Date() });
      }

      const response = await fetch(`/api/routine/day-plan/${today}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineChecks: updatedChecks }),
      });

      if (response.ok) {
        setDayPlan(prev => prev ? { ...prev, routineChecks: updatedChecks } : null);
      }
    } catch (error) {
      console.error('Failed to update routine check:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getRoutineProgress = () => {
    if (!dayType || !dayPlan) return { completed: 0, total: 0, percentage: 0 };

    const total = dayType.routineChecklist.length;
    const completed = dayPlan.routineChecks.filter(check => check.checked).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  };

  const getStepsProgress = () => {
    if (!dayType || !healthLog) return { current: 0, target: 0, percentage: 0 };

    const target = dayType.intendedSteps;
    const current = healthLog.steps || 0;
    const percentage = Math.min((current / target) * 100, 100);

    return { current, target, percentage };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const routineProgress = getRoutineProgress();
  const stepsProgress = getStepsProgress();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/routine/calendar">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </Link>
          <Link href="/health">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Health
            </Button>
          </Link>
        </div>
      </div>

      {/* Day Type Status */}
      {dayType ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              {dayType.name} Day
            </CardTitle>
            <CardDescription>
              Wake: {dayType.intendedWake} • Sleep: {dayType.intendedSleep} • Steps: {dayType.intendedSteps.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{routineProgress.percentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-500">Routine Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stepsProgress.percentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-500">Steps Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {dayType.routineChecklist.length}
                </div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Day Type Assigned</h3>
            <p className="text-gray-500 mb-4">Assign a day type to start tracking your routine</p>
            <Link href="/routine/calendar">
              <Button>Assign Day Type</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Routine Checklist */}
      {dayType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Today's Routine
            </CardTitle>
            <CardDescription>
              {routineProgress.completed} of {routineProgress.total} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={routineProgress.percentage} className="mb-4" />
            <div className="space-y-3">
              {dayType.routineChecklist.map((item) => {
                const isChecked = dayPlan?.routineChecks.find(check => check.key === item.key)?.checked || false;
                return (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => handleRoutineCheck(item.key, checked as boolean)}
                      disabled={updating}
                    />
                    <span className={`flex-1 ${isChecked ? 'line-through text-gray-500' : ''}`}>
                      {item.label}
                    </span>
                    {isChecked && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Steps Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stepsProgress.current.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  of {stepsProgress.target.toLocaleString()} steps
                </div>
              </div>
              <Progress value={stepsProgress.percentage} className="h-2" />
              {stepsProgress.percentage >= 100 && (
                <div className="text-center text-green-600 font-medium">
                  🎉 Steps goal achieved!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLog ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{healthLog.weightKg}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sleep:</span>
                  <span className="font-medium">{healthLog.sleepHrs}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Energy:</span>
                  <span className="font-medium">{healthLog.energy1to10}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mood:</span>
                  <Badge variant="outline">{healthLog.mood}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Heart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No health log today</p>
                <Link href="/health">
                  <Button size="sm" className="mt-2">Log Health</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
