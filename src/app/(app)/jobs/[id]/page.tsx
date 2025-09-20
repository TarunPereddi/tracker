'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Save,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  ExternalLink,
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InterviewLog {
  _id: string;
  date: string;
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'hr' | 'final';
  interviewer?: string;
  notes?: string;
  outcome?: 'pending' | 'passed' | 'failed' | 'rescheduled';
  nextSteps?: string;
  createdAt: string;
}

interface JobApplication {
  _id: string;
  company: string;
  position: string;
  jobUrl?: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  source: 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'other';
  salaryRange?: string;
  location?: string;
  jobDescription?: string;
  notes?: string;
  followUpDate?: string;
  interviews: InterviewLog[];
  createdAt: string;
  updatedAt: string;
}

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<JobApplication>>({});
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [newInterview, setNewInterview] = useState<Partial<InterviewLog>>({
    date: new Date().toISOString().split('T')[0],
    type: 'phone',
    outcome: 'pending'
  });

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/jobs/applications/${params.id}`);
      const data = await response.json();
      if (data.ok) {
        setApplication(data.application);
        setFormData(data.application);
      }
    } catch (error) {
      console.error('Failed to fetch job application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/jobs/applications/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        setApplication(data.application);
        setEditing(false);
      } else {
        alert(data.error || 'Failed to update job application');
      }
    } catch (error) {
      console.error('Failed to update job application:', error);
      alert('Failed to update job application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/applications/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.ok) {
        router.push('/jobs');
      } else {
        alert(data.error || 'Failed to delete job application');
      }
    } catch (error) {
      console.error('Failed to delete job application:', error);
      alert('Failed to delete job application. Please try again.');
    }
  };

  const handleAddInterview = async () => {
    try {
      const response = await fetch(`/api/jobs/applications/${params.id}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInterview),
      });

      const data = await response.json();
      if (data.ok) {
        setApplication(data.application);
        setShowAddInterview(false);
        setNewInterview({
          date: new Date().toISOString().split('T')[0],
          type: 'phone',
          outcome: 'pending'
        });
      } else {
        alert(data.error || 'Failed to add interview');
      }
    } catch (error) {
      console.error('Failed to add interview:', error);
      alert('Failed to add interview. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getOutcomeColor = (outcome: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      rescheduled: 'bg-blue-100 text-blue-800'
    };
    return colors[outcome as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Job application not found</p>
          <Link href="/jobs">
            <Button className="mt-4">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/jobs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editing ? 'Edit Application' : application.position}
            </h1>
            <p className="text-gray-600">
              {editing ? 'Update job application details' : `at ${application.company}`}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={formData.company || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status || 'applied'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
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
                  <Label>Applied Date</Label>
                  <Input
                    type="date"
                    value={formData.appliedDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, appliedDate: e.target.value }))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{application.position}</h3>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                  </div>
                  {application.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location}</span>
                    </div>
                  )}
                  {application.salaryRange && (
                    <div className="flex items-center space-x-2">
                      <span>💰</span>
                      <span>{application.salaryRange}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label>Job URL</Label>
                  <Input
                    value={formData.jobUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobUrl: e.target.value }))}
                    placeholder="https://company.com/careers/position"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input
                    value={formData.salaryRange || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryRange: e.target.value }))}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={formData.followUpDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              </>
            ) : (
              <>
                {application.jobUrl && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={application.jobUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Job Posting
                    </a>
                  </div>
                )}
                {application.followUpDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Follow up: {new Date(application.followUpDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <span className="capitalize">{application.source.replace('_', ' ')}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about this application..."
                rows={3}
              />
            ) : (
              <p className="text-gray-600">
                {application.notes || 'No notes added yet.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interviews</CardTitle>
              {!editing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddInterview(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Interview
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {showAddInterview ? (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newInterview.date || ''}
                      onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newInterview.type || 'phone'}
                      onValueChange={(value) => setNewInterview(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Outcome</Label>
                    <Select
                      value={newInterview.outcome || 'pending'}
                      onValueChange={(value) => setNewInterview(prev => ({ ...prev, outcome: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="rescheduled">Rescheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Interviewer</Label>
                  <Input
                    value={newInterview.interviewer || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer: e.target.value }))}
                    placeholder="Interviewer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newInterview.notes || ''}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Interview notes..."
                    rows={2}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddInterview}>
                    Add Interview
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddInterview(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}

            {application.interviews.length > 0 ? (
              <div className="space-y-3">
                {application.interviews.map((interview, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge className={getOutcomeColor(interview.outcome || 'pending')}>
                          {interview.outcome}
                        </Badge>
                        <span className="font-medium capitalize">{interview.type}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(interview.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {interview.interviewer && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4" />
                        <span>{interview.interviewer}</span>
                      </div>
                    )}
                    {interview.notes && (
                      <p className="text-sm text-gray-600">{interview.notes}</p>
                    )}
                    {interview.nextSteps && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Next Steps: </span>
                        <span className="text-gray-600">{interview.nextSteps}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No interviews scheduled yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
