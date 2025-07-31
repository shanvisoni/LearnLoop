import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useMyCreatedCommunities, useJoinedCommunities } from '../../hooks/useCommunities';
import { ROUTES } from '../../utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  BookOpen,
  CheckCircle,
  Plus,
  Target,
  Users,
  ArrowRight,
  CheckSquare,
  BarChart3,
  Activity,
  Zap,
  Calendar,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { TaskStatus } from '../../types/task.types';

const DashboardPage=()=>{
  const{user}=useAuth();

  const{
    tasks,
    loading: tasksLoading,
    error: tasksError,
    stats:taskStats
  } = useTasks();

  const{
    data: createdCommunities,
    isLoading:createdCommunitiesLoading
  }=useMyCreatedCommunities();

  const{
    data: joinedCommunities,
    isLoading: joinedCommunitiesLoading
  }= useJoinedCommunities();

  const completionPercentage = taskStats.total>0
  ? (taskStats.completed / taskStats.total) * 100
  : 0;

  const recentTasks = tasks
  .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0,5);

  const allCommunities =[
    ...(createdCommunities || []).map(c => ({...c, isOwner:true})),
    ...(joinedCommunities || []).map(c =>({...c, isOwner:false}))
  ];

  const recentCommunities = allCommunities
  .sort((a,b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0,5);

  const overdueTasks = tasks.filter(task =>
    task.dueDate &&
    new Date(task.dueDate) <  new Date() && 
    task.status !== TaskStatus.COMPLETED
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() -7);

  const tasksCompletedThisWeek = tasks.filter(task => 
    task.status === TaskStatus.COMPLETED &&
    task.updatedAt &&
    new Date(task.updatedAt) >= oneWeekAgo
  ).length;

  const weeklyProgress= taskStats.total>0
  ? Math.min((tasksCompletedThisWeek / taskStats.total) * 100,100)
  :0;

  const getStatusColor =(status: string) =>{
    switch (status){
      case TaskStatus.COMPLETED:
        return 'bg-green-500';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-500';
      case TaskStatus.PENDING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor =(priority:string)=>{
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string | Date)=>{
    return new Date(dateString).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if(tasksLoading || createdCommunitiesLoading || joinedCommunitiesLoading){
    return(
       <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }
  return(
     <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              Welcome back, {user?.firstName || user?.username}! 
              <span className="ml-2 text-2xl">👋</span>
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey? You're doing great!
            </p>
            {overdueTasks.length > 0 && (
              <div className="mt-3 flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Activity className="h-6 w-6" />
                  <span className="text-2xl font-bold">{Math.round(weeklyProgress)}%</span>
                </div>
                <span className="text-sm text-blue-100">This week</span>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg font-semibold">{tasksCompletedThisWeek}</span>
                </div>
                <span className="text-xs text-blue-100">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-800">{taskStats.total}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {taskStats.pending} pending
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full shadow-md">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-800">{taskStats.completed}</p>
                <p className="text-xs text-green-500 mt-1">
                  {Math.round(completionPercentage)}% completion rate
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full shadow-md">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Communities</p>
                <p className="text-3xl font-bold text-purple-800">{allCommunities.length}</p>
                <p className="text-xs text-purple-500 mt-1">
                  {(createdCommunities || []).length} created, {(joinedCommunities || []).length} joined
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

         <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-800">{taskStats.inProgress}</p>
                <p className="text-xs text-orange-500 mt-1">
                  Active tasks
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-full shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 justify-start group transition-all duration-200"
              asChild
            >
              <Link to={ROUTES.TASKS}>
                <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium">Create New Task</div>
                  <div className="text-sm opacity-90">Add a new learning goal</div>
                </div>
              </Link>
            </Button>

            <Button 
              className="h-auto p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 justify-start group transition-all duration-200"
              asChild
            >
              <Link to={ROUTES.CREATE_COMMUNITY}>
                <Users className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-medium">Create Community</div>
                  <div className="text-sm opacity-90">Start a new learning group</div>
                </div>
              </Link>
            </Button>

            <Button 
              className="h-auto p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 justify-start group transition-all duration-200"
              asChild
            >
              <Link to={ROUTES.COMMUNITIES}>
                <BookOpen className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
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
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Recent Tasks</span>
            </CardTitle>
            <Link to={ROUTES.TASKS}>
              <Button variant="outline" size="sm" className="hover:bg-blue-50">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)} shadow-sm`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Due: {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.status === TaskStatus.COMPLETED && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tasks yet</p>
                <Link to={ROUTES.TASKS}>
                  <Button size="sm" className="mt-2">Create your first task</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        
        {/* Recent Communities */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Your Communities</span>
            </CardTitle>
            <Link to={ROUTES.COMMUNITIES}>
              <Button variant="outline" size="sm" className="hover:bg-purple-50">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentCommunities.length > 0 ? (
              <div className="space-y-4">
                {recentCommunities.map((community) => (
                  <div key={community._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm truncate">{community.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {(community.members?.length || 0)} members
                          </span>
                          {community.description && (
                            <>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400 truncate max-w-32">
                                {community.description}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {community.isOwner ? (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-xs">
                          Owner
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-50 text-green-600 text-xs">
                          Member
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No communities yet</p>
                <div className="flex gap-2 justify-center mt-2">
                  <Link to={ROUTES.CREATE_COMMUNITY}>
                    <Button size="sm">Create Community</Button>
                  </Link>
                  <Link to={ROUTES.COMMUNITIES}>
                    <Button size="sm" variant="outline">Browse Communities</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <span>Progress Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Completion Rate</span>
              <span className="text-sm text-gray-500 font-semibold">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                <div className="text-sm text-green-500 font-medium">Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
                <div className="text-sm text-blue-500 font-medium">In Progress</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
                <div className="text-sm text-yellow-500 font-medium">Pending</div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">This Week's Progress</span>
                <span className="text-sm text-gray-500">{tasksCompletedThisWeek} tasks completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

       {/* Error Display */}
      {tasksError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Error loading tasks: {tasksError}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardPage;