'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  BookOpen,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SkillSessionForm {
  date: string;
  skill: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai-ml' | 'data-science' | 'cybersecurity' | 'system-design' | 'algorithms' | 'tools' | 'soft-skills' | 'other';
  timeSpent: number;
  resource: string;
  description: string;
  outcome: string;
  tags: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  notes: string;
}

export default function AddSkillSessionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SkillSessionForm>({
    date: new Date().toISOString().split('T')[0],
    skill: '',
    category: 'frontend',
    timeSpent: 30,
    resource: '',
    description: '',
    outcome: '',
    tags: '',
    difficulty: 'beginner',
    rating: 3,
    notes: ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert tags string to array
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const payload = {
        ...formData,
        tags: tagsArray
      };

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.ok) {
        router.push('/skills');
      } else {
        alert(data.error || 'Failed to save skill session');
      }
    } catch (error) {
      console.error('Failed to save skill session:', error);
      alert('Failed to save skill session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SkillSessionForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href="/skills">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Skills
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add Skill Session</h1>
            <p className="text-muted-foreground">Log your learning progress</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Session'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Session Details
            </CardTitle>
            <CardDescription>What did you learn today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skill *</Label>
              <Input
                id="skill"
                value={formData.skill}
                onChange={(e) => handleInputChange('skill', e.target.value)}
                placeholder="e.g., React, Python, Design Thinking"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="ai-ml">AI/ML</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="system-design">System Design</SelectItem>
                  <SelectItem value="algorithms">Algorithms</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSpent">Time Spent (minutes) *</Label>
              <Input
                id="timeSpent"
                type="number"
                min="1"
                value={formData.timeSpent}
                onChange={(e) => handleInputChange('timeSpent', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleInputChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Learning Resource */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Learning Resource
            </CardTitle>
            <CardDescription>How did you learn this skill?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resource">Resource *</Label>
              <Input
                id="resource"
                value={formData.resource}
                onChange={(e) => handleInputChange('resource', e.target.value)}
                placeholder="e.g., Udemy Course, YouTube Tutorial, Book"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => handleInputChange('rating', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ⭐</SelectItem>
                  <SelectItem value="2">2 ⭐⭐</SelectItem>
                  <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                  <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g., javascript, frontend, tutorial"
              />
              <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
            </div>
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Learning Outcomes
            </CardTitle>
            <CardDescription>What did you achieve and learn?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you learned or practiced..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={formData.outcome}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                placeholder="What specific outcome did you achieve? (e.g., built a todo app, learned new concepts)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this learning session..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
