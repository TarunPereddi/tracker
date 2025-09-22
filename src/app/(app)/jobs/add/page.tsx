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
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JobApplicationForm {
  company: string;
  position: string;
  jobUrl: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  source: 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'other';
  salaryRange: string;
  location: string;
  jobDescription: string;
  notes: string;
  followUpDate: string;
}

export default function AddJobApplicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<JobApplicationForm>({
    company: '',
    position: '',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    source: 'linkedin',
    salaryRange: '',
    location: '',
    jobDescription: '',
    notes: '',
    followUpDate: ''
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/jobs/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        router.push('/jobs');
      } else {
        alert(data.error || 'Failed to save job application');
      }
    } catch (error) {
      console.error('Failed to save job application:', error);
      alert('Failed to save job application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof JobApplicationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href="/jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add Job Application</h1>
            <p className="text-muted-foreground">Track a new job application</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Application'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Essential job application details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Google, Microsoft"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appliedDate">Applied Date *</Label>
              <Input
                id="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={(e) => handleInputChange('appliedDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleInputChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="company_website">Company Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>Optional information about the job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={(e) => handleInputChange('jobUrl', e.target.value)}
                placeholder="https://company.com/careers/position"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                value={formData.salaryRange}
                onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleInputChange('followUpDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Description & Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Description & Notes</CardTitle>
            <CardDescription>Additional details about the role and your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                placeholder="Paste the job description here..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional notes about this application..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
