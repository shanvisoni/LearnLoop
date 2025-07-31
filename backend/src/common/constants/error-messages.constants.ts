export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_REQUEST: 'Invalid request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',

  // Task specific
  TASK_NOT_FOUND: 'Task not found',
  TASK_ACCESS_DENIED: 'You do not have permission to access this task',
  TASK_UPDATE_FAILED: 'Failed to update task',
  TASK_DELETE_FAILED: 'Failed to delete task',
  INVALID_TASK_STATUS: 'Invalid task status',
  INVALID_TASK_PRIORITY: 'Invalid task priority',
  TASK_CREATION_FAILED: 'Failed to create task',
  TASK_STATUS_UPDATE_FAILED: 'Failed to update task status',
  TASK_STATS_FAILED: 'Failed to retrieve task statistics',

  // User specific
  USER_NOT_FOUND: 'User not found',
  INVALID_USER_ID: 'Invalid user ID format',

  // Community specific
  COMMUNITY_NOT_FOUND: 'Community not found',
  COMMUNITY_NAME_EXISTS: 'Community with this name already exists',
  COMMUNITY_ACCESS_DENIED: 'Only the creator can perform this action',
  ALREADY_MEMBER: 'You are already a member of this community',
  NOT_MEMBER: 'You are not a member of this community',
  CREATOR_CANNOT_LEAVE: 'Creator cannot leave their own community',

  // Validation
  VALIDATION_FAILED: 'Validation failed',
  REQUIRED_FIELD: 'This field is required',
  INVALID_FORMAT: 'Invalid format',
  INVALID_OBJECT_ID: 'Invalid ID format',
};
