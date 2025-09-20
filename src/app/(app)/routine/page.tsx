'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Clock, 
  Target, 
  CheckCircle,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

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
  createdAt?: string;
}

export default function RoutinePage() {
  const [dayTypes, setDayTypes] = useState<DayType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<DayType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setDayTypes(data.dayTypes);
      }
    } catch (error) {
      console.error('Failed to fetch day types:', error);
    } finally {
      setLoading(false);
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
      }
    } catch (error) {
      console.error('Failed to save day type:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dayType: DayType) => {
    setEditingType(dayType);
    setFormData(dayType);
    setShowForm(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Routine Management</h1>
          <p className="text-gray-600">Create and manage different day types with their routines</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Day Type
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingType ? 'Edit Day Type' : 'Add New Day Type'}
            </CardTitle>
            <CardDescription>
              Define the schedule and routine checklist for this day type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Day Type Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Office, WFH, Weekend"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps">Intended Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.intendedSteps}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedSteps: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wake">Intended Wake Time</Label>
                <Input
                  id="wake"
                  type="time"
                  value={formData.intendedWake}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedWake: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep">Intended Sleep Time</Label>
                <Input
                  id="sleep"
                  type="time"
                  value={formData.intendedSleep}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedSleep: e.target.value }))}
                />
              </div>
            </div>

            {/* Routine Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Routine Checklist</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRoutineItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {formData.routineChecklist.map((item, index) => (
                  <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={item.defaultChecked}
                      onCheckedChange={(checked) => 
                        updateRoutineItem(index, 'defaultChecked', checked as boolean)
                      }
                    />
                    <Input
                      value={item.label}
                      onChange={(e) => updateRoutineItem(index, 'label', e.target.value)}
                      placeholder="Routine item description"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRoutineItem(index)}
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
              <Button onClick={handleSave} disabled={saving || !formData.name}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Day Type'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingType(null);
                  setFormData({
                    name: '',
                    intendedWake: '06:00',
                    intendedSleep: '22:00',
                    intendedSteps: 8000,
                    routineChecklist: []
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dayTypes.map((dayType) => (
          <Card key={dayType._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dayType.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(dayType)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Wake: {dayType.intendedWake}</span>
                  <span className="mx-2">•</span>
                  <span>Sleep: {dayType.intendedSleep}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="mr-2 h-4 w-4" />
                  <span>Steps: {dayType.intendedSteps.toLocaleString()}</span>
                </div>
              </div>

              {/* Routine Checklist */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Routine Checklist</div>
                <div className="space-y-1">
                  {dayType.routineChecklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${item.defaultChecked ? 'text-green-500' : 'text-gray-300'}`} />
                      <span className={item.defaultChecked ? 'text-gray-900' : 'text-gray-500'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                {dayType.routineChecklist.length === 0 && (
                  <div className="text-sm text-gray-500 italic">No routine items defined</div>
                )}
              </div>

              {/* Stats */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <Badge variant="outline">{dayType.routineChecklist.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dayTypes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No day types created yet</div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Day Type
          </Button>
        </div>
      )}
    </div>
  );
}
