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
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/ui/modal';
import { 
  Plus, 
  Weight, 
  Moon, 
  Activity, 
  Heart, 
  Smile,
  Camera,
  Save,
  Edit,
  Trash2,
  Droplets,
  Zap
} from 'lucide-react';

interface HealthLog {
  _id?: string;
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
  muscleMassPct?: number;
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
  const [editingLog, setEditingLog] = useState<HealthLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [todayLog, setTodayLog] = useState<HealthLog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<HealthLog | null>(null);
  const { success, error: showError } = useToast();
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
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/health?date=${today}`);
      const data = await response.json();
      if (data.ok) {
        const todayLog = data.logs.find((log: HealthLog) => log.date === today);
        setTodayLog(todayLog || null);
        setLogs(data.logs);
      } else {
        showError('Failed to load health data', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch health logs:', error);
      showError('Failed to load health data', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Check if this is an update (log already exists for this date)
      const existingLog = logs.find(log => log.date === formData.date);
      const method = existingLog ? 'PUT' : 'POST';

      const response = await fetch('/api/health', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        setTodayLog(data.log);
        setLogs(prev => [data.log, ...prev.filter(log => log.date !== data.log.date)]);
        setShowForm(false);
        setEditingLog(null);
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
        success('Health log saved successfully!');
      } else {
        showError('Failed to save health log', data.error);
      }
    } catch (error) {
      console.error('Failed to save health log:', error);
      showError('Failed to save health log', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (log: HealthLog) => {
    setEditingLog(log);
    setFormData(log);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLog(null);
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
  };

  const handleDeleteClick = (log: HealthLog) => {
    setLogToDelete(log);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!logToDelete) return;

    try {
      const response = await fetch(`/api/health/${logToDelete.date}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.ok) {
        setTodayLog(null);
        setLogs(prev => prev.filter(l => l.date !== logToDelete.date));
        setShowForm(false);
        setEditingLog(null);
        setShowDeleteModal(false);
        setLogToDelete(null);
        success('Health log deleted successfully');
      } else {
        showError('Failed to delete health log', data.error);
      }
    } catch (error) {
      console.error('Failed to delete health log:', error);
      showError('Failed to delete health log', 'Please try again');
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
      <div className="p-4 lg:p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Health Tracker</h1>
          </div>
          <p className="text-gray-400">
            {todayLog ? 'Update your health log for today' : 'Log your health metrics for today'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              if (todayLog) {
                handleEdit(todayLog);
              } else {
                setShowForm(true);
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {todayLog ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Update Today's Log
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Log Today
              </>
            )}
          </Button>
          {todayLog && (
            <Button
              variant="outline"
              onClick={() => handleDeleteClick(todayLog)}
              className="border-red-500 text-red-400 hover:bg-red-500/10 hover:border-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Today's Health Status */}
      {todayLog ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Heart className="h-5 w-5 text-red-400" />
              </div>
              <span className="text-white">Today's Health Log</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-xl font-bold text-blue-400">
                  {todayLog.weightKg || '--'}kg
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Weight className="h-3 w-3" />
                  <span>Weight</span>
                </div>
              </div>
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <div className="text-xl font-bold text-red-400">
                  {todayLog.bodyFatPct || '--'}%
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>Body Fat</span>
                </div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-xl font-bold text-green-400">
                  {todayLog.muscleMassPct || '--'}%
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Muscle</span>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-xl font-bold text-purple-400">
                  {todayLog.sleepHrs || '--'}h
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Moon className="h-3 w-3" />
                  <span>Sleep</span>
                </div>
              </div>
              <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                <div className="text-xl font-bold text-cyan-400">
                  {todayLog.waterLiters || '--'}L
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Droplets className="h-3 w-3" />
                  <span>Water</span>
                </div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <div className="text-xl font-bold text-orange-400">
                  {todayLog.energy1to10 || '--'}/10
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>Energy</span>
                </div>
              </div>
            </div>
            {todayLog.mood && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="text-sm border-gray-600 text-gray-300">
                  Mood: {todayLog.mood}
                </Badge>
              </div>
            )}
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(todayLog)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(todayLog)}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-8">
            <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Health Log Today</h3>
            <p className="text-gray-400 mb-4">Start tracking your health by logging your daily metrics</p>
            <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Log Today's Health
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Entry Form */}
      {showForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingLog ? 'Update Today\'s Health Log' : 'Log Today\'s Health'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {editingLog ? 'Update your health metrics for today' : 'Log your health metrics for today'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-300">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  disabled={true}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-400">
                  Health logs are only for today
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-300">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weightKg || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightKg: parseFloat(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat" className="text-gray-300">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.bodyFatPct || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bodyFatPct: parseFloat(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleMass" className="text-gray-300">Muscle Mass (%)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.muscleMassPct || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, muscleMassPct: parseFloat(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep" className="text-gray-300">Sleep (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.1"
                  value={formData.sleepHrs || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleepHrs: parseFloat(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps" className="text-gray-300">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.steps || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: parseInt(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waterLiters" className="text-gray-300">Water (Liters)</Label>
                <Input
                  id="waterLiters"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.waterLiters || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, waterLiters: parseFloat(e.target.value) || undefined }))}
                  placeholder="3.0"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-400">Recommended: 3+ liters per day</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="energy" className="text-gray-300">Energy Level (1-10)</Label>
                <Input
                  id="energy"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.energy1to10 || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, energy1to10: parseInt(e.target.value) || undefined }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workout" className="text-gray-300">Workout Type</Label>
                <Select
                  value={formData.workoutType || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, workoutType: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {workoutTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Supplements */}
            <div className="space-y-3">
              <Label className="text-gray-300">Supplements Taken</Label>
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
                        className="border-gray-600"
                      />
                      <Label htmlFor={key} className="text-sm capitalize text-gray-300">
                        {key === 'd3k2' ? 'D3/K2' : key}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <Label className="text-gray-300">Mood</Label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mood: option.value as any }))}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.mood === option.value
                        ? `${option.color} text-white`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-gray-300">Photo (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : (editingLog ? 'Update Entry' : 'Save Entry')}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supplements Status */}
      {todayLog && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-white">Supplements & Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Supplements */}
              {todayLog.supplements && Object.values(todayLog.supplements).some(Boolean) && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-2">Supplements Taken:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(todayLog.supplements).map(([key, value]) => {
                      if (key === 'other' || !value) return null;
                      return (
                        <Badge key={key} variant="secondary" className="text-sm bg-purple-500/20 text-purple-300">
                          {key === 'd3k2' ? 'D3/K2' : key}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Workout */}
              {todayLog.workoutType && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-1">Workout:</div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">{todayLog.workoutType}</Badge>
                </div>
              )}

              {/* Notes */}
              {todayLog.notes && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-1">Notes:</div>
                  <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded">
                    {todayLog.notes}
                  </div>
                </div>
              )}

              {/* Photo */}
              {todayLog.photoBase64 && (
                <div>
                  <div className="text-sm font-medium text-gray-300 mb-2">Progress Photo:</div>
                  <img
                    src={todayLog.photoBase64}
                    alt="Health photo"
                    className="w-full max-w-md h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLogToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Health Log"
        description="Are you sure you want to delete today's health log? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}


