// src/components/layout/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import {
  BookOpen,
  LayoutDashboard,
  CheckSquare,
  Users,
  User,
  LogOut,
  ChevronDown,
  Plus,
  Eye,
  Settings,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: ROUTES.DASHBOARD,
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      path: ROUTES.TASKS,
      label: 'Tasks',
      icon: <CheckSquare className="h-4 w-4" />
    }
  ];

  const communityItems = [
    {
      path: ROUTES.COMMUNITIES,
      label: 'View Communities',
      icon: <Eye className="h-4 w-4" />
    },
    {
      path: ROUTES.CREATE_COMMUNITY,
      label: 'Create Community',
      icon: <Plus className="h-4 w-4" />
    },
    {
      path: ROUTES.MY_COMMUNITIES,
      label: 'My Communities',
      icon: <Settings className="h-4 w-4" />
    },
    {
      path: ROUTES.JOINED_COMMUNITIES,
      label: 'Joined Communities',
      icon: <Users className="h-4 w-4" />
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trackademy
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "hover:bg-blue-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Communities Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 hover:bg-blue-50 data-[state=open]:bg-blue-50"
                >
                  <Users className="h-4 w-4" />
                  <span>Communities</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {communityItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center space-x-2 w-full">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hover:bg-blue-50">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName || user?.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.PROFILE} className="flex items-center space-x-2 w-full">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2 w-full">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center space-x-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`w-full flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                      : "hover:bg-blue-50"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full flex items-center space-x-2 hover:bg-blue-50"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Communities</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {communityItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center space-x-2 w-full">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;