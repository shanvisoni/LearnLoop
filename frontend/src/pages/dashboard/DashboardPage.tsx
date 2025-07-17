// src/pages/dashboard/DashboardPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  BookOpen,
  CheckCircle,
  Plus,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  CheckSquare,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Mock data - Replace with actual data from your hooks
  const [stats] = useState({
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 4,
    inProgressTasks: 2,
    joinedCommunities: 5,
    createdCommunities: 2,
    totalPosts: 12,
    weeklyProgress: 85
  });

  const [recentTasks] = useState([
    {
      id: '1',
      title: 'Complete React Query Implementation',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-07-15',
      completedAt: '2025-07-14'
    },
    {
      id: '2',
      title: 'Study Database Design Patterns',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2025-07-18'
    },
    {
      id: '3',
      title: 'Review JavaScript Fundamentals',
      status: 'pending',
      priority: 'low',
      dueDate: '2025-07-20'
    }
  ]);

  const [recentCommunities] = useState([
    {
      id: '1',
      name: 'MERN Stack Developers',
      memberCount: 1250,
      postCount: 45,
      isJoined: true
    },
    {
      id: '2',
      name: 'Python Enthusiasts',
      memberCount: 890,
      postCount: 32,
      isJoined: true
    },
    {
      id: '3',
      name: 'UI/UX Designers',
      memberCount: 650,
      postCount: 28,
      isJoined: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const completionPercentage = (stats.completedTasks / stats.totalTasks) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || user?.username}! 👋
            </h1>
            <p className="text-blue-100">
              Ready to continue your learning journey? You're doing great!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <span className="text-lg font-semibold">{stats.weeklyProgress}%</span>
              <span className="text-sm text-blue-100">This week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-800">{stats.totalTasks}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-800">{stats.completedTasks}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Communities</p>
                <p className="text-3xl font-bold text-purple-800">{stats.joinedCommunities}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Progress</p>
                <p className="text-3xl font-bold text-orange-800">{Math.round(completionPercentage)}%</p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-4 bg-blue-600 hover:bg-blue-700 justify-start"
              asChild
            >
              <Link to={ROUTES.TASKS}>
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create New Task</div>
                  <div className="text-sm opacity-90">Add a new learning goal</div>
                </div>
              </Link>
            </Button>

            <Button 
              className="h-auto p-4 bg-purple-600 hover:bg-purple-700 justify-start"
              asChild
            >
              <Link to={ROUTES.CREATE_COMMUNITY}>
                <Users className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create Community</div>
                  <div className="text-sm opacity-90">Start a new learning group</div>
                </div>
              </Link>
            </Button>

            <Button 
              className="h-auto p-4 bg-green-600 hover:bg-green-700 justify-start"
              asChild
            >
              <Link to={ROUTES.COMMUNITIES}>
                <BookOpen className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Browse Communities</div>
                  <div className="text-sm opacity-90">Find study groups</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Recent Tasks</span>
            </CardTitle>
            <Link to={ROUTES.TASKS}>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {task.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Communities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Your Communities</span>
            </CardTitle>
            <Link to={ROUTES.COMMUNITIES}>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommunities.map((community) => (
                <div key={community.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{community.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {community.memberCount} members
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {community.postCount} posts
                        </span>
                      </div>
                    </div>
                  </div>
                  {community.isJoined ? (
                    <Badge variant="secondary" className="bg-green-50 text-green-600">
                      Joined
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Completion Rate</span>
              <span className="text-sm text-gray-500">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;