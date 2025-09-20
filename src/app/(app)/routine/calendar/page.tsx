'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle,
  Plus,
  ArrowLeft
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

export default function CalendarPage() {
  const [dayTypes, setDayTypes] = useState<DayType[]>([]);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDayType, setSelectedDayType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dayTypesRes, dayPlansRes] = await Promise.all([
        fetch('/api/routine/day-types'),
        fetch('/api/routine/day-plan')
      ]);

      const dayTypesData = await dayTypesRes.json();
      const dayPlansData = await dayPlansRes.json();

      if (dayTypesData.ok) {
        setDayTypes(dayTypesData.dayTypes);
      } else {
        showError('Failed to load day types', dayTypesData.error);
      }
      if (dayPlansData.ok) {
        setDayPlans(dayPlansData.dayPlans);
      } else {
        showError('Failed to load day plans', dayPlansData.error);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showError('Failed to load calendar data', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const existingPlan = dayPlans.find(plan => plan.date === date);
    setSelectedDayType(existingPlan?.dayTypeId || '');
  };

  const handleDayTypeAssign = async () => {
    if (!selectedDate || !selectedDayType) return;

    setSaving(true);
    try {
      const response = await fetch('/api/routine/day-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          dayTypeId: selectedDayType
        }),
      });

      const data = await response.json();
      if (data.ok) {
        setDayPlans(prev => {
          const existing = prev.find(plan => plan.date === selectedDate);
          if (existing) {
            return prev.map(plan => 
              plan.date === selectedDate ? data.dayPlan : plan
            );
          }
          return [...prev, data.dayPlan];
        });
        setSelectedDate('');
        setSelectedDayType('');
        success('Day type assigned successfully!');
      } else {
        showError('Failed to assign day type', data.error);
      }
    } catch (error) {
      console.error('Failed to assign day type:', error);
      showError('Failed to assign day type', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const getDayTypeForDate = (date: string) => {
    const plan = dayPlans.find(plan => plan.date === date);
    if (!plan) return null;
    return dayTypes.find(type => type._id === plan.dayTypeId);
  };

  const getComplianceForDate = (date: string) => {
    const plan = dayPlans.find(plan => plan.date === date);
    return plan?.compliance;
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <Link href="/routine">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Day Types
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl lg:text-3xl font-semibold text-white">Calendar</h1>
            </div>
            <p className="text-gray-400">Assign day types to specific dates</p>
          </div>
        </div>
        <Link href="/routine">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Manage Day Types
          </Button>
        </Link>
      </div>

      {/* Day Type Assignment */}
      {selectedDate && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Assign Day Type for {selectedDate}</CardTitle>
            <CardDescription className="text-gray-400">Choose a day type to assign to this date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={selectedDayType} onValueChange={setSelectedDayType}>
                <SelectTrigger className="w-full sm:w-64 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select day type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {dayTypes.map((dayType) => (
                    <SelectItem key={dayType._id} value={dayType._id} className="text-white hover:bg-gray-700">
                      {dayType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleDayTypeAssign} 
                disabled={!selectedDayType || saving}
                className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              >
                {saving ? 'Assigning...' : 'Assign'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDate('');
                  setSelectedDayType('');
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Current Month</CardTitle>
          <CardDescription className="text-gray-400">Click on a date to assign a day type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-20"></div>;
              }

              const dayType = getDayTypeForDate(date);
              const compliance = getComplianceForDate(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              const isSelected = selectedDate === date;

              return (
                <div
                  key={date}
                  className={`h-20 p-2 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-purple-500/20 border-purple-400' 
                      : isToday 
                        ? 'bg-green-500/20 border-green-400' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium text-white">
                      {new Date(date).getDate()}
                    </div>
                    
                    {dayType && (
                      <div className="flex-1 flex flex-col justify-end space-y-1">
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {dayType.name}
                        </Badge>
                        
                        {compliance && (
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Target className="h-3 w-3" />
                            <span>{Math.round(compliance.checklistPct * 100)}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Type Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Day Types</CardTitle>
          <CardDescription>Available day types and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayTypes.map((dayType) => (
              <div key={dayType._id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{dayType.name}</h3>
                  <Badge variant="outline">{dayType.intendedSteps.toLocaleString()} steps</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Wake: {dayType.intendedWake}</span>
                    <span className="mx-2">•</span>
                    <span>Sleep: {dayType.intendedSleep}</span>
                  </div>
                  <div className="text-xs">
                    {dayType.routineChecklist.length} routine items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
