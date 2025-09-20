'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/ui/modal';
import { 
  Plus, 
  Clock, 
  Target, 
  CheckCircle,
  Edit,
  Trash2,
  Save,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dayTypeToDelete, setDayTypeToDelete] = useState<DayType | null>(null);
  const { success, error: showError } = useToast();
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
      } else {
        showError('Failed to load day types', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch day types:', error);
      showError('Failed to load day types', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingType 
        ? `/api/routine/day-types/${editingType._id}`
        : '/api/routine/day-types';
      const method = editingType ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        if (editingType) {
          setDayTypes(prev => prev.map(dt => dt._id === editingType._id ? data.dayType : dt));
          success('Day type updated successfully!');
        } else {
          setDayTypes(prev => [...prev, data.dayType]);
          success('Day type created successfully!');
        }
        setShowForm(false);
        setEditingType(null);
        setFormData({
          name: '',
          intendedWake: '06:00',
          intendedSleep: '22:00',
          intendedSteps: 8000,
          routineChecklist: []
        });
      } else {
        showError('Failed to save day type', data.error);
      }
    } catch (error) {
      console.error('Failed to save day type:', error);
      showError('Failed to save day type', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dayType: DayType) => {
    setEditingType(dayType);
    setFormData(dayType);
    setShowForm(true);
  };

  const handleDeleteClick = (dayType: DayType) => {
    setDayTypeToDelete(dayType);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!dayTypeToDelete) return;

    try {
      const response = await fetch(`/api/routine/day-types/${dayTypeToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.ok) {
        setDayTypes(prev => prev.filter(dt => dt._id !== dayTypeToDelete._id));
        setShowDeleteModal(false);
        setDayTypeToDelete(null);
        success('Day type deleted successfully');
      } else {
        showError('Failed to delete day type', data.error);
      }
    } catch (error) {
      console.error('Failed to delete day type:', error);
      showError('Failed to delete day type', 'Please try again');
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
            <Target className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Routine Management</h1>
          </div>
          <p className="text-gray-400">Create and manage different day types with their routines</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/routine/calendar">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </Link>
          <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Day Type
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingType ? 'Edit Day Type' : 'Add New Day Type'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Define the schedule and routine checklist for this day type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Day Type Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Office, WFH, Weekend"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steps" className="text-gray-300">Intended Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.intendedSteps}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedSteps: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wake" className="text-gray-300">Intended Wake Time</Label>
                <Input
                  id="wake"
                  type="time"
                  value={formData.intendedWake}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedWake: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep" className="text-gray-300">Intended Sleep Time</Label>
                <Input
                  id="sleep"
                  type="time"
                  value={formData.intendedSleep}
                  onChange={(e) => setFormData(prev => ({ ...prev, intendedSleep: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
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
                  <div key={item.key} className="flex items-center space-x-3 p-3 border border-gray-700 rounded-lg bg-gray-800">
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
                      className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
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
                {saving ? 'Saving...' : (editingType ? 'Update Day Type' : 'Save Day Type')}
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
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
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
          <Card key={dayType._id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{dayType.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(dayType)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(dayType)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Wake: {dayType.intendedWake}</span>
                  <span className="mx-2">•</span>
                  <span>Sleep: {dayType.intendedSleep}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Target className="mr-2 h-4 w-4" />
                  <span>Steps: {dayType.intendedSteps.toLocaleString()}</span>
                </div>
              </div>

              {/* Routine Checklist */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-300">Routine Checklist</div>
                <div className="space-y-1">
                  {dayType.routineChecklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${item.defaultChecked ? 'text-green-400' : 'text-gray-600'}`} />
                      <span className={item.defaultChecked ? 'text-white' : 'text-gray-400'}>
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
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Items</span>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">{dayType.routineChecklist.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dayTypes.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-8">
            <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Day Types Created</h3>
            <p className="text-gray-400 mb-4">Create your first day type to start managing routines</p>
            <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Day Type
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDayTypeToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Day Type"
        description="Are you sure you want to delete this day type? This action cannot be undone and will affect any day plans using this type."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
