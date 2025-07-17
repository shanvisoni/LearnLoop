## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Backend API Documentation](#backend-api-documentation)
6. [Frontend Components Structure](#frontend-components-structure)
7. [Authentication & Authorization](#authentication--authorization)
8. [Validation Rules](#validation-rules)
9. [Setup & Installation](#setup--installation)
10. [Development Workflow](#development-workflow)
11. [Deployment Guide](#deployment-guide)

---

## Project Overview

**StudyTracker** is a comprehensive learning management platform that combines personal study tracking with community-based learning. Users can manage their study tasks, track progress, and participate in topic-based communities.

### Core Features
- **User Authentication**: Secure signup/login system
- **Task Management**: Create, edit, delete, and track study tasks with status updates
- **Community System**: Create and join learning communities
- **Social Features**: Post sharing, member profiles, and community interactions
- **Search & Discovery**: Find communities based on topics and interests

### User Flow
1. User signs up/logs in
2. Access personal dashboard with task management
3. Browse or create communities via navigation
4. Join communities of interest
5. Participate in community discussions
6. View member profiles and connect with others

---

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt
- **Environment Management**: @nestjs/config

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useState/useReducer
- **HTTP Client**: Axios
- **API State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation

### Development Tools
- **Package Manager**: npm/yarn
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## Project Structure

```
studytracker/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── communities/
│   │   │   ├── communities.controller.ts
│   │   │   ├── communities.service.ts
│   │   │   ├── communities.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── posts/
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── posts.module.ts
│   │   │   ├── dto/
│   │   │   └── schemas/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── communities/
│   │   │   ├── posts/
│   │   │   └── common/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CommunitiesPage.tsx
│   │   │   └── CommunityDetailPage.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   ├── useCommunities.ts
│   │   │   └── usePosts.ts
│   │   ├── contexts/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── community.service.ts
│   │   │   └── post.service.ts
│   │   ├── types/
│   │   ├── utils/
│   │   ├── lib/
│   │   │   └── queryClient.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String, // unique, required
  email: String, // unique, required
  password: String, // hashed, required
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String, // URL to profile picture
  contactInfo: {
    email: String,
    phone: String,
    linkedin: String,
    github: String
  },
  joinedCommunities: [ObjectId], // references to Community
  createdCommunities: [ObjectId], // references to Community
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  _id: ObjectId,
  title: String, // required
  description: String,
  status: String, // enum: ['pending', 'in_progress', 'completed']
  priority: String, // enum: ['low', 'medium', 'high']
  dueDate: Date,
  userId: ObjectId, // reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Community Collection
```javascript
{
  _id: ObjectId,
  name: String, // unique, required
  description: String,
  tags: [String], // for searching (e.g., ['MERN', 'JavaScript', 'React'])
  creatorId: ObjectId, // reference to User
  members: [ObjectId], // references to User
  posts: [ObjectId], // references to Post
  isPrivate: Boolean, // default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection
```javascript
{
  _id: ObjectId,
  title: String, // required
  content: String, // required
  authorId: ObjectId, // reference to User
  communityId: ObjectId, // reference to Community
  likes: [ObjectId], // references to User who liked
  comments: [{
    authorId: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Backend API Documentation

### Authentication Endpoints

#### POST /auth/register
**Description**: Register a new user
```typescript
// Request Body
{
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Response
{
  success: boolean;
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
}
```

#### POST /auth/login
**Description**: Login user
```typescript
// Request Body
{
  email: string;
  password: string;
}

// Response
{
  success: boolean;
  message: string;
  user: UserProfile;
  accessToken: string;
}
```

### User Endpoints

#### GET /users/profile
**Description**: Get current user profile
**Headers**: `Authorization: Bearer <token>`

#### PUT /users/profile
**Description**: Update user profile
**Headers**: `Authorization: Bearer <token>`

#### GET /users/:id
**Description**: Get user profile by ID

### Task Endpoints

#### GET /tasks
**Description**: Get all tasks for current user
**Headers**: `Authorization: Bearer <token>`

#### POST /tasks
**Description**: Create new task
```typescript
// Request Body
{
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}
```

#### PUT /tasks/:id
**Description**: Update task

#### DELETE /tasks/:id
**Description**: Delete task

#### PATCH /tasks/:id/status
**Description**: Update task status
```typescript
// Request Body
{
  status: 'pending' | 'in_progress' | 'completed';
}
```

### Community Endpoints

#### GET /communities
**Description**: Get all communities with optional search
**Query Parameters**: `?search=<term>&page=<number>&limit=<number>`

#### POST /communities
**Description**: Create new community
```typescript
// Request Body
{
  name: string;
  description?: string;
  tags?: string[];
  isPrivate?: boolean;
}
```

#### GET /communities/:id
**Description**: Get community details

#### POST /communities/:id/join
**Description**: Join community

#### POST /communities/:id/leave
**Description**: Leave community

#### GET /communities/my-communities
**Description**: Get user's created communities

#### GET /communities/joined-communities
**Description**: Get user's joined communities

### Post Endpoints

#### GET /posts/community/:communityId
**Description**: Get posts in a community

#### POST /posts
**Description**: Create new post
```typescript
// Request Body
{
  title: string;
  content: string;
  communityId: string;
}
```

#### PUT /posts/:id
**Description**: Update post

#### DELETE /posts/:id
**Description**: Delete post

#### POST /posts/:id/like
**Description**: Like/unlike post

#### POST /posts/:id/comment
**Description**: Add comment to post

---

## React Query Integration

### Setup and Configuration

#### Query Client Setup
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

#### App Integration
```typescript
// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          {/* Your app components */}
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### API Service Layer
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Custom Hooks with React Query

#### Authentication Hook
```typescript
// src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
  });

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
```

#### Tasks Hook
```typescript
// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Get all tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAllTasks,
  });

  // Create task
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update task status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTaskStatus: updateStatusMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
```

#### Communities Hook
```typescript
// src/hooks/useCommunities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService } from '../services/community.service';

export const useCommunities = () => {
  const queryClient = useQueryClient();

  // Get all communities with search
  const useCommunitiesQuery = (search?: string) => {
    return useQuery({
      queryKey: ['communities', { search }],
      queryFn: () => communityService.getAllCommunities(search),
    });
  };

  // Get single community
  const useCommunityQuery = (id: string) => {
    return useQuery({
      queryKey: ['communities', id],
      queryFn: () => communityService.getCommunity(id),
      enabled: !!id,
    });
  };

  // Get user's created communities
  const useMyCommunitiesQuery = () => {
    return useQuery({
      queryKey: ['communities', 'my-communities'],
      queryFn: communityService.getMyCreatedCommunities,
    });
  };

  // Get user's joined communities
  const useJoinedCommunitiesQuery = () => {
    return useQuery({
      queryKey: ['communities', 'joined-communities'],
      queryFn: communityService.getJoinedCommunities,
    });
  };

  // Create community
  const createCommunityMutation = useMutation({
    mutationFn: communityService.createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  // Join community
  const joinCommunityMutation = useMutation({
    mutationFn: communityService.joinCommunity,
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
    },
  });

  // Leave community
  const leaveCommunityMutation = useMutation({
    mutationFn: communityService.leaveCommunity,
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
    },
  });

  return {
    useCommunitiesQuery,
    useCommunityQuery,
    useMyCommunitiesQuery,
    useJoinedCommunitiesQuery,
    createCommunity: createCommunityMutation.mutate,
    joinCommunity: joinCommunityMutation.mutate,
    leaveCommunity: leaveCommunityMutation.mutate,
    isCreating: createCommunityMutation.isPending,
    isJoining: joinCommunityMutation.isPending,
    isLeaving: leaveCommunityMutation.isPending,
  };
};
```

#### Posts Hook
```typescript
// src/hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/post.service';

export const usePosts = () => {
  const queryClient = useQueryClient();

  // Get posts by community
  const usePostsQuery = (communityId: string) => {
    return useQuery({
      queryKey: ['posts', 'community', communityId],
      queryFn: () => postService.getPostsByCommunity(communityId),
      enabled: !!communityId,
    });
  };

  // Create post
  const createPostMutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['posts', 'community', variables.communityId] 
      });
    },
  });

  // Update post
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      postService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Delete post
  const deletePostMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Like/unlike post
  const toggleLikeMutation = useMutation({
    mutationFn: postService.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Add comment
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => 
      postService.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    usePostsQuery,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    addComment: addCommentMutation.mutate,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
};
```

### Service Layer Implementation
```typescript
// src/services/task.service.ts
import api from './api';

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  createTask: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  updateTaskStatus: async (id: string, status: string) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },
};

// src/services/community.service.ts
import api from './api';

export const communityService = {
  getAllCommunities: async (search?: string) => {
    const params = search ? { search } : {};
    const response = await api.get('/communities', { params });
    return response.data;
  },

  getCommunity: async (id: string) => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },

  createCommunity: async (data: any) => {
    const response = await api.post('/communities', data);
    return response.data;
  },

  joinCommunity: async (id: string) => {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
  },

  leaveCommunity: async (id: string) => {
    const response = await api.post(`/communities/${id}/leave`);
    return response.data;
  },

  getMyCreatedCommunities: async () => {
    const response = await api.get('/communities/my-communities');
    return response.data;
  },

  getJoinedCommunities: async () => {
    const response = await api.get('/communities/joined-communities');
    return response.data;
  },
};
```

### Component Usage Examples
```typescript
// TaskList.tsx
import { useTasks } from '../hooks/useTasks';

const TaskList = () => {
  const { tasks, isLoading, error, updateTaskStatus } = useTasks();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {tasks?.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onStatusChange={(status) => updateTaskStatus({ id: task.id, status })}
        />
      ))}
    </div>
  );
};

// CommunityList.tsx
import { useCommunities } from '../hooks/useCommunities';

const CommunityList = () => {
  const { useCommunitiesQuery, joinCommunity, isJoining } = useCommunities();
  const [search, setSearch] = useState('');
  
  const { data: communities, isLoading, error } = useCommunitiesQuery(search);

  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      {isLoading && <LoadingSpinner />}
      {communities?.map(community => (
        <CommunityCard 
          key={community.id} 
          community={community}
          onJoin={() => joinCommunity(community.id)}
          isJoining={isJoining}
        />
      ))}
    </div>
  );
};
```

### Key Benefits of React Query Integration

1. **Automatic Caching**: Reduces API calls and improves performance
2. **Background Updates**: Keeps data fresh without user intervention
3. **Optimistic Updates**: Immediate UI feedback for better UX
4. **Error Handling**: Built-in retry logic and error states
5. **Loading States**: Granular loading states for better UX
6. **Invalidation**: Smart cache invalidation after mutations
7. **Offline Support**: Works seamlessly with offline scenarios
8. **DevTools**: Excellent debugging capabilities

---

## Frontend Components Structure

### Authentication Components
- `LoginForm.tsx` - Login form with validation
- `RegisterForm.tsx` - Registration form with validation
- `ProtectedRoute.tsx` - Route protection wrapper

### Dashboard Components
- `DashboardLayout.tsx` - Main dashboard layout
- `TaskOverview.tsx` - Task statistics and quick actions
- `RecentActivity.tsx` - Recent tasks and community activity

### Task Components
- `TaskList.tsx` - Display list of tasks
- `TaskCard.tsx` - Individual task display
- `TaskForm.tsx` - Create/edit task form
- `TaskStatusBadge.tsx` - Status indicator
- `TaskFilter.tsx` - Filter tasks by status/priority

### Community Components
- `CommunityList.tsx` - Display list of communities
- `CommunityCard.tsx` - Individual community display
- `CommunityForm.tsx` - Create community form
- `CommunityDetail.tsx` - Community details and posts
- `CommunitySearch.tsx` - Search communities
- `MemberList.tsx` - Display community members

### Post Components
- `PostList.tsx` - Display posts in community
- `PostCard.tsx` - Individual post display
- `PostForm.tsx` - Create/edit post form
- `CommentSection.tsx` - Comments for posts

### Common Components
- `Navbar.tsx` - Navigation bar
- `Sidebar.tsx` - Side navigation
- `UserProfile.tsx` - User profile display
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorMessage.tsx` - Error display

---

## Authentication & Authorization

### JWT Implementation
- **Token Storage**: localStorage (with httpOnly cookie option for production)
- **Token Expiry**: 24 hours
- **Refresh Strategy**: Automatic token refresh on API calls

### Protected Routes
- Dashboard and all user-specific pages require authentication
- Community creation requires authentication
- Posting requires authentication and community membership

### Role-Based Access
- **User**: Basic user permissions
- **Community Creator**: Can manage their created communities
- **Admin**: Full platform access (future enhancement)

---

## Validation Rules

### Frontend Validation (Zod)
```typescript
// User Registration
const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional()
});

// Task Creation
const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional()
});

// Community Creation
const communitySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().min(1).max(20)).max(10).optional()
});
```

### Backend Validation (class-validator)
```typescript
// CreateUserDto
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;
}
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# .env file content:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/studytracker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12

# Start development server
npm run start:dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install React Query
npm install @tanstack/react-query @tanstack/react-query-devtools

# Create environment file
cp .env.example .env

# Configure environment variables
# .env file content:
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=StudyTracker

# Start development server
npm start
```

### Database Setup
```bash
# If using local MongoDB
mongod

# The application will automatically create collections
# on first run with proper indexes
```

---

## Development Workflow

### 1. Backend Development
```bash
# Create new module
nest generate module <module-name>
nest generate controller <module-name>
nest generate service <module-name>

# Run tests
npm run test

# Run in watch mode
npm run start:dev
```

### 2. Frontend Development
```bash
# Create new component
mkdir src/components/<component-name>
touch src/components/<component-name>/<ComponentName>.tsx

# Add shadcn/ui components
npx shadcn-ui@latest add <component-name>

# Start development server
npm start
```

### 3. Database Operations
```bash
# MongoDB connection test
mongo --eval "db.adminCommand('ismaster')"

# View collections
mongo studytracker --eval "show collections"

# Export data
mongoexport --db studytracker --collection users --out users.json
```

---

## Deployment Guide

### Backend Deployment (Railway/Heroku)
```bash
# Build application
npm run build

# Set environment variables in platform
# DATABASE_URL=mongodb+srv://...
# JWT_SECRET=production-secret
# PORT=3000

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build application
npm run build

# Set environment variables
# REACT_APP_API_URL=https://your-api.herokuapp.com/api

# Deploy
# Connect GitHub repo to Netlify/Vercel
```

### Database Deployment (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Configure network access
3. Create database user
4. Get connection string
5. Update environment variables

### Environment Variables Checklist
**Backend Production:**
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`
- `CORS_ORIGIN`

**Frontend Production:**
- `REACT_APP_API_URL`
- `REACT_APP_APP_NAME`

---

## Key Implementation Notes

### Security Best Practices
- Password hashing with bcrypt
- JWT token validation on protected routes
- Input validation on both frontend and backend
- CORS configuration for production
- Rate limiting on API endpoints

### Performance Optimizations
- Database indexing on frequently queried fields
- Pagination for large data sets
- Lazy loading for React components
- Image optimization for avatars
- Caching strategies for community data

### Error Handling
- Global error handler in NestJS
- Custom error boundary in React
- Proper HTTP status codes
- User-friendly error messages

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for API endpoints
- Component testing for React components
- End-to-end testing with Cypress

This documentation provides a complete foundation for building your StudyTracker platform. Each section can be expanded as you develop new features or encounter specific challenges during implementation.