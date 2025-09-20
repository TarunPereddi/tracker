'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs Tracker</h1>
          <p className="text-gray-600">Track job applications, interviews, and career progress</p>
        </div>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-gray-500">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-500">Interviews This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-500">Follow-ups Due</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-gray-500">Offers Received</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your latest job applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Software Engineer</div>
                <div className="text-sm text-gray-500">TechCorp • Applied 2 days ago</div>
              </div>
              <Badge variant="outline">Interview Scheduled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Full Stack Developer</div>
                <div className="text-sm text-gray-500">StartupXYZ • Applied 1 week ago</div>
              </div>
              <Badge variant="secondary">Under Review</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Senior Developer</div>
                <div className="text-sm text-gray-500">BigTech Inc • Applied 2 weeks ago</div>
              </div>
              <Badge variant="destructive">Rejected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs Tracker</CardTitle>
          <CardDescription>Coming Soon - Full job application management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Job tracking features are under development.</p>
            <p className="text-sm">This will include application management, interview scheduling, and progress tracking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
