'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Weight, 
  Moon, 
  Activity, 
  Heart, 
  Smile,
  Camera,
  Save
} from 'lucide-react';

interface HealthLog {
  _id?: string;
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
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
  mood?: 'Very Low' | 'Low' | 'Ok' | 'Good' | 'Great';
  notes?: string;
  photoBase64?: string;
}

const workoutTypes = [
  'Mobility',
  'Bodyweight',
  'Strength Training',
  'Cardio',
  'Yoga',
  'Rest Day'
];

const moodOptions = [
  { value: 'Very Low', label: 'Very Low', color: 'bg-red-500' },
  { value: 'Low', label: 'Low', color: 'bg-orange-500' },
  { value: 'Ok', label: 'Ok', color: 'bg-yellow-500' },
  { value: 'Good', label: 'Good', color: 'bg-blue-500' },
  { value: 'Great', label: 'Great', color: 'bg-green-500' }
];

export default function HealthPage() {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HealthLog>({
    date: new Date().toISOString().split('T')[0],
    supplements: {
      multi: false,
      d3k2: false,
      b12: false,
      creatine: false,
      fishOil: false,
      other: []
    }
  });

  useEffect(() => {
    fetchHealthLogs();
  }, []);

  const fetchHealthLogs = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      if (data.ok) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        setLogs(prev => [data.log, ...prev.filter(log => log.date !== data.log.date)]);
        setShowForm(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          supplements: {
            multi: false,
            d3k2: false,
            b12: false,
            creatine: false,
            fishOil: false,
            other: []
          }
        });
      }
    } catch (error) {
      console.error('Failed to save health log:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, photoBase64: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getMoodColor = (mood?: string) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption?.color || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Tracker</h1>
          <p className="text-gray-600">Track your daily health metrics and progress</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Weight className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {logs[0]?.weightKg || '--'}kg
                </div>
                <div className="text-sm text-gray-500">Current Weight</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {logs[0]?.sleepHrs || '--'}h
                </div>
                <div className="text-sm text-gray-500">Last Sleep</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {logs[0]?.steps?.toLocaleString() || '--'}
                </div>
                <div className="text-sm text-gray-500">Steps Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {logs[0]?.energy1to10 || '--'}/10
                </div>
                <div className="text-sm text-gray-500">Energy Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Health Entry</CardTitle>
            <CardDescription>Log your daily health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightKg: parseFloat(e.target.value) || undefined }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep">Sleep (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.1"
                  value={formData.sleepHrs || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleepHrs: parseFloat(e.target.value) || undefined }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.steps || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: parseInt(e.target.value) || undefined }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="energy">Energy Level (1-10)</Label>
                <Input
                  id="energy"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.energy1to10 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, energy1to10: parseInt(e.target.value) || undefined }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workout">Workout Type</Label>
                <Select
                  value={formData.workoutType || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, workoutType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Supplements */}
            <div className="space-y-3">
              <Label>Supplements Taken</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(formData.supplements).map(([key, value]) => {
                  if (key === 'other') return null;
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value as boolean}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            supplements: {
                              ...prev.supplements,
                              [key]: checked
                            }
                          }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm capitalize">
                        {key === 'd3k2' ? 'D3/K2' : key}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <Label>Mood</Label>
              <div className="flex space-x-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood: option.value as any }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      formData.mood === option.value
                        ? `${option.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Logs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Entries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logs.map((log) => (
            <Card key={log._id || log.date}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{log.date}</CardTitle>
                  {log.mood && (
                    <div className={`w-3 h-3 rounded-full ${getMoodColor(log.mood)}`}></div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {log.weightKg && (
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <div className="font-medium">{log.weightKg}kg</div>
                    </div>
                  )}
                  {log.sleepHrs && (
                    <div>
                      <span className="text-gray-500">Sleep:</span>
                      <div className="font-medium">{log.sleepHrs}h</div>
                    </div>
                  )}
                  {log.steps && (
                    <div>
                      <span className="text-gray-500">Steps:</span>
                      <div className="font-medium">{log.steps.toLocaleString()}</div>
                    </div>
                  )}
                  {log.energy1to10 && (
                    <div>
                      <span className="text-gray-500">Energy:</span>
                      <div className="font-medium">{log.energy1to10}/10</div>
                    </div>
                  )}
                </div>

                {log.workoutType && (
                  <div>
                    <Badge variant="outline">{log.workoutType}</Badge>
                  </div>
                )}

                {log.supplements && Object.values(log.supplements).some(Boolean) && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Supplements:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(log.supplements).map(([key, value]) => {
                        if (key === 'other' || !value) return null;
                        return (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key === 'd3k2' ? 'D3/K2' : key}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {log.notes && (
                  <div className="text-sm text-gray-600">
                    {log.notes}
                  </div>
                )}

                {log.photoBase64 && (
                  <div className="mt-2">
                    <img
                      src={log.photoBase64}
                      alt="Health photo"
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No health entries yet. Add your first entry to get started!
          </div>
        )}
      </div>
    </div>
  );
}
