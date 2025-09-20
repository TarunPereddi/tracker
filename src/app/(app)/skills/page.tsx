'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/ui/modal';
import { 
  BookOpen, 
  Plus,
  Clock,
  Star,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Filter,
  Monitor,
  Server,
  Database,
  Settings,
  Smartphone,
  Brain,
  BarChart3,
  Shield,
  Network,
  Code,
  Wrench,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface SkillLog {
  _id: string;
  date: string;
  skill: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai-ml' | 'data-science' | 'cybersecurity' | 'system-design' | 'algorithms' | 'tools' | 'soft-skills' | 'other';
  timeSpent: number;
  resource: string;
  description?: string;
  outcome?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('week');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<SkillLog | null>(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchSkills();
  }, [timeRange]);

  const fetchSkills = async () => {
    try {
      const today = new Date();
      let startDate: string;
      
      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().split('T')[0];
          break;
        default:
          startDate = today.toISOString().split('T')[0];
      }
      
      const endDate = today.toISOString().split('T')[0];
      
      const response = await fetch(`/api/skills?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      if (data.ok) {
        setSkills(data.skills);
      } else {
        showError('Failed to load skills', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      showError('Failed to load skills', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      backend: 'bg-green-500/20 text-green-400 border-green-500/30',
      database: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      devops: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      mobile: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'ai-ml': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'data-science': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      cybersecurity: 'bg-red-500/20 text-red-400 border-red-500/30',
      'system-design': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      algorithms: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      tools: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'soft-skills': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      other: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      frontend: Monitor,
      backend: Server,
      database: Database,
      devops: Settings,
      mobile: Smartphone,
      'ai-ml': Brain,
      'data-science': BarChart3,
      cybersecurity: Shield,
      'system-design': Network,
      algorithms: Code,
      tools: Wrench,
      'soft-skills': Users,
      other: BookOpen
    };
    const IconComponent = icons[category as keyof typeof icons] || BookOpen;
    return <IconComponent className="h-4 w-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === filter);

  const getStats = () => {
    const totalTime = skills.reduce((sum, skill) => sum + skill.timeSpent, 0);
    const totalSessions = skills.length;
    const avgTime = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;
    const categories = [...new Set(skills.map(skill => skill.category))].length;
    
    return { totalTime, totalSessions, avgTime, categories };
  };

  const stats = getStats();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleDeleteClick = (skill: SkillLog) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;

    try {
      const response = await fetch(`/api/skills/${skillToDelete._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.ok) {
        setSkills(prev => prev.filter(skill => skill._id !== skillToDelete._id));
        setShowDeleteModal(false);
        setSkillToDelete(null);
        success('Skill session deleted successfully');
      } else {
        showError('Failed to delete skill session', data.error);
      }
    } catch (error) {
      console.error('Failed to delete skill session:', error);
      showError('Failed to delete skill session', 'Please try again');
    }
  };

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
            <BookOpen className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Skills Tracker</h1>
          </div>
          <p className="text-gray-400">Track your learning progress and skill development</p>
        </div>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/skills/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill Session
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</div>
                <div className="text-sm text-gray-400">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                <div className="text-sm text-gray-400">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.avgTime)}</div>
                <div className="text-sm text-gray-400">Avg Session</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.categories}</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex space-x-2">
          <Button
            variant={timeRange === 'today' ? 'default' : 'outline'}
            onClick={() => setTimeRange('today')}
            size="sm"
            className={timeRange === 'today' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Today
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            size="sm"
            className={timeRange === 'week' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            This Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            size="sm"
            className={timeRange === 'month' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            This Month
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'frontend', label: 'Frontend' },
            { key: 'backend', label: 'Backend' },
            { key: 'database', label: 'Database' },
            { key: 'devops', label: 'DevOps' },
            { key: 'mobile', label: 'Mobile' },
            { key: 'ai-ml', label: 'AI/ML' },
            { key: 'data-science', label: 'Data Science' },
            { key: 'cybersecurity', label: 'Cybersecurity' },
            { key: 'system-design', label: 'System Design' },
            { key: 'algorithms', label: 'Algorithms' },
            { key: 'tools', label: 'Tools' },
            { key: 'soft-skills', label: 'Soft Skills' },
            { key: 'other', label: 'Other' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'default' : 'outline'}
              onClick={() => setFilter(tab.key)}
              size="sm"
              className={filter === tab.key ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <Card key={skill._id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{skill.skill}</h3>
                      <Badge className={getCategoryColor(skill.category)}>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(skill.category)}
                          <span className="capitalize">{skill.category.replace('-', ' ')}</span>
                        </div>
                      </Badge>
                      <Badge className={getDifficultyColor(skill.difficulty)}>
                        {skill.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(skill.timeSpent)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{skill.resource}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{new Date(skill.date).toLocaleDateString()}</span>
                      </div>
                      {skill.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{skill.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {skill.description && (
                      <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
                    )}

                    {skill.outcome && (
                      <div className="text-sm text-gray-300 mb-2">
                        <span className="font-medium">Outcome: </span>
                        <span>{skill.outcome}</span>
                      </div>
                    )}

                    {skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {skill.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {skill.notes && (
                      <p className="text-sm text-gray-400 italic">{skill.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Link href={`/skills/${skill._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Link href={`/skills/${skill._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-600 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDeleteClick(skill)}
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
              <div className="p-4 bg-purple-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Skill Sessions Found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Start tracking your learning progress' 
                  : `No sessions in ${filter} category`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSkillToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Skill Session"
        description="Are you sure you want to delete this skill session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}