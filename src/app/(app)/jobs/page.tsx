'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/ui/modal';
import { 
  Briefcase, 
  Plus,
  Calendar,
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Clock
} from 'lucide-react';
import Link from 'next/link';

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

export default function JobsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/jobs/applications');
      const data = await response.json();
      if (data.ok) {
        setApplications(data.applications);
      } else {
        showError('Failed to load job applications', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch job applications:', error);
      showError('Failed to load job applications', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (application: JobApplication) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;

    try {
      const response = await fetch(`/api/jobs/applications/${applicationToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.ok) {
        setApplications(prev => prev.filter(app => app._id !== applicationToDelete._id));
        setShowDeleteModal(false);
        setApplicationToDelete(null);
        success('Job application deleted successfully');
      } else {
        showError('Failed to delete job application', data.error);
      }
    } catch (error) {
      console.error('Failed to delete job application:', error);
      showError('Failed to delete job application', 'Please try again');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      screening: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      interview: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      offer: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      withdrawn: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'linkedin': return '💼';
      case 'indeed': return '🔍';
      case 'company_website': return '🌐';
      case 'referral': return '🤝';
      default: return '📝';
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const getStats = () => {
    const total = applications.length;
    const active = applications.filter(app => !['rejected', 'withdrawn'].includes(app.status)).length;
    const interviews = applications.filter(app => app.status === 'interview').length;
    const offers = applications.filter(app => app.status === 'offer').length;
    
    return { total, active, interviews, offers };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
            <Briefcase className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Job Applications</h1>
          </div>
          <p className="text-gray-400">Track your job search progress and interviews</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/jobs/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.active}</div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.interviews}</div>
                <div className="text-sm text-gray-400">In Interview</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.offers}</div>
                <div className="text-sm text-gray-400">Offers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'applied', label: 'Applied' },
          { key: 'screening', label: 'Screening' },
          { key: 'interview', label: 'Interview' },
          { key: 'offer', label: 'Offer' },
          { key: 'rejected', label: 'Rejected' }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'default' : 'outline'}
            onClick={() => setFilter(tab.key)}
            size="sm"
            className={filter === tab.key ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card key={application._id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{application.position}</h3>
                      <span className="text-sm text-gray-400">at</span>
                      <h4 className="text-lg font-medium text-gray-300">{application.company}</h4>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                      {application.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <span>{getSourceIcon(application.source)}</span>
                        <span className="capitalize">{application.source.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {application.salaryRange && (
                      <div className="text-sm text-gray-300 mb-2">
                        💰 {application.salaryRange}
                      </div>
                    )}

                    {application.interviews.length > 0 && (
                      <div className="text-sm text-gray-300 mb-2">
                        📞 {application.interviews.length} interview(s) scheduled
                      </div>
                    )}

                    {application.notes && (
                      <p className="text-sm text-gray-400 line-clamp-2">{application.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {application.jobUrl && (
                      <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Link href={`/jobs/${application._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Link href={`/jobs/${application._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-600 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteClick(application)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-8">
              <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Job Applications Found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Start tracking your job applications' 
                  : `No applications in ${filter} status`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Job Application"
        description="Are you sure you want to delete this job application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}