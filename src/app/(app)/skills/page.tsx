'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

export default function SkillsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Tracker</h1>
          <p className="text-gray-600">Track your learning progress and skill development</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Add Learning Log
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">12h</div>
                <div className="text-sm text-gray-500">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">48h</div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-gray-500">Projects Built</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm text-gray-500">Skills Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Skills by Category</CardTitle>
          <CardDescription>Time spent learning different skill categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">Frontend</Badge>
                <span className="text-sm text-gray-600">React, Next.js, TypeScript</span>
              </div>
              <div className="text-sm font-medium">8h 30m</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">Backend</Badge>
                <span className="text-sm text-gray-600">Node.js, Express, MongoDB</span>
              </div>
              <div className="text-sm font-medium">6h 15m</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">Cloud</Badge>
                <span className="text-sm text-gray-600">AWS, Docker, Kubernetes</span>
              </div>
              <div className="text-sm font-medium">4h 45m</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">DSA</Badge>
                <span className="text-sm text-gray-600">LeetCode, Algorithms</span>
              </div>
              <div className="text-sm font-medium">3h 20m</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Learning Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Learning Logs</CardTitle>
          <CardDescription>Your latest learning sessions and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">React Hooks Deep Dive</div>
                <div className="text-sm text-gray-500">YouTube • 2 hours • High confidence</div>
              </div>
              <Badge variant="outline">Frontend</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">AWS IAM Best Practices</div>
                <div className="text-sm text-gray-500">Documentation • 1.5 hours • Medium confidence</div>
              </div>
              <Badge variant="outline">Cloud</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">LeetCode Dynamic Programming</div>
                <div className="text-sm text-gray-500">Practice • 1 hour • Low confidence</div>
              </div>
              <Badge variant="outline">DSA</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Tracker</CardTitle>
          <CardDescription>Coming Soon - Full learning progress tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Skills tracking features are under development.</p>
            <p className="text-sm">This will include detailed learning logs, progress analytics, and skill assessments.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
