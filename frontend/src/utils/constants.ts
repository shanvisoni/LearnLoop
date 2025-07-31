 export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// export const API_BASE_URL =  'http://localhost:3001';
console.log("API_BASE_URL:", import.meta.env.VITE_API_URL);


export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  COMMUNITIES: '/communities',
  COMMUNITY_DETAIL: '/communities/:id',
  CREATE_COMMUNITY: '/communities/create',
  MY_COMMUNITIES: '/communities/my',
  EDIT_MY_COMMUNITY:'/communities/:id/edit',
  JOINED_COMMUNITIES: '/communities/joined',
  PROFILE: '/profile',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};