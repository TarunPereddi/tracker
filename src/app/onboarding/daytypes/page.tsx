'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Plus, Trash2, ArrowRight, ArrowLeft, Clock, Target, CheckCircle, Save } from 'lucide-react';

interface RoutineItem {
  key: string;
  label: string;
  defaultChecked: boolean;
}

interface DayType {
  _id?: string;
  name: string;
  intendedWake: string;
  intendedSleep: string;
  intendedSteps: number;
  routineChecklist: RoutineItem[];
}

export default function DayTypesPage() {
  const [dayTypes, setDayTypes] = useState<DayType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();
  const [formData, setFormData] = useState<DayType>({
    name: '',
    intendedWake: '06:00',
    intendedSleep: '22:00',
    intendedSteps: 8000,
    routineChecklist: []
  });

  useEffect(() => {
    fetchDayTypes();
  }, []);

  const fetchDayTypes = async () => {
    try {
      const response = await fetch('/api/routine/day-types');
      const data = await response.json();
      
      if (data.ok) {
        setDayTypes(data.dayTypes || []);
      }
    } catch (error) {
      console.error('Error fetching day types:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/routine/day-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        setDayTypes(prev => [...prev, data.dayType]);
        setShowForm(false);
        setFormData({
          name: '',
          intendedWake: '06:00',
          intendedSleep: '22:00',
          intendedSteps: 8000,
          routineChecklist: []
        });
        showSuccess('Day type created successfully!');
      } else {
        showError('Failed to save day type');
      }
    } catch (error) {
      showError('Failed to save day type');
    } finally {
      setSaving(false);
    }
  };

  const addRoutineItem = () => {
    setFormData(prev => ({
      ...prev,
      routineChecklist: [
        ...prev.routineChecklist,
        { key: `item_${Date.now()}`, label: '', defaultChecked: false }
      ]
    }));
  };

  const updateRoutineItem = (index: number, field: keyof RoutineItem, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      routineChecklist: prev.routineChecklist.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeRoutineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      routineChecklist: prev.routineChecklist.filter((_, i) => i !== index)
    }));
  };

  const handleContinue = async () => {
    if (dayTypes.length === 0) {
      showError('Please create at least one day type to continue');
      return;
    }

    setSaving(true);
    try {
      // Update onboarding status
      await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finance' }),
      });

      showSuccess('Day types setup completed!');
      router.push('/onboarding/financesetup');
    } catch (error) {
      showError('Failed to update status');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Set Up Day Types</h1>
            </div>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              Create at least one day type to define your routine patterns (e.g., Work Day, Rest Day)
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Existing Day Types */}
            {dayTypes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Your Day Types</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dayTypes.map((dayType) => (
                    <div key={dayType._id} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{dayType.name}</h4>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Wake: {dayType.intendedWake}</span>
                          <span className="mx-2">•</span>
                          <span>Sleep: {dayType.intendedSleep}</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="mr-2 h-4 w-4" />
                          <span>Steps: {dayType.intendedSteps.toLocaleString()}</span>
                        </div>
                        <div className="text-xs">
                          {dayType.routineChecklist.length} routine items
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Day Type Form */}
            {showForm && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Day Type</CardTitle>
                  <CardDescription className="text-gray-400">
                    Define the schedule and routine checklist for this day type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Day Type Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Office, WFH, Weekend"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="steps" className="text-gray-300">Intended Steps</Label>
                      <Input
                        id="steps"
                        type="number"
                        value={formData.intendedSteps}
                        onChange={(e) => setFormData(prev => ({ ...prev, intendedSteps: parseInt(e.target.value) || 0 }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wake" className="text-gray-300">Intended Wake Time</Label>
                      <Input
                        id="wake"
                        type="time"
                        value={formData.intendedWake}
                        onChange={(e) => setFormData(prev => ({ ...prev, intendedWake: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleep" className="text-gray-300">Intended Sleep Time</Label>
                      <Input
                        id="sleep"
                        type="time"
                        value={formData.intendedSleep}
                        onChange={(e) => setFormData(prev => ({ ...prev, intendedSleep: e.target.value }))}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  {/* Routine Checklist */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Routine Checklist</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addRoutineItem} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.routineChecklist.map((item, index) => (
                        <div key={item.key} className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg bg-gray-700">
                          <Checkbox
                            checked={item.defaultChecked}
                            onCheckedChange={(checked) => 
                              updateRoutineItem(index, 'defaultChecked', checked as boolean)
                            }
                            className="border-gray-600"
                          />
                          <Input
                            value={item.label}
                            onChange={(e) => updateRoutineItem(index, 'label', e.target.value)}
                            placeholder="Routine item description"
                            className="flex-1 bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRoutineItem(index)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {formData.routineChecklist.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No routine items added yet. Click "Add Item" to get started.
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={saving || !formData.name} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Day Type'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          name: '',
                          intendedWake: '06:00',
                          intendedSleep: '22:00',
                          intendedSteps: 8000,
                          routineChecklist: []
                        });
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Day Type
              </Button>
            )}

            <div className="flex flex-col sm:flex-row justify-between pt-6 space-y-3 sm:space-y-0">
              <Button
                onClick={() => router.push('/onboarding/welcome')}
                variant="outline"
                className="border-gray-600 text-gray-300 w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={saving || dayTypes.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                {saving ? 'Saving...' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
