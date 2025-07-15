export const AUTH_MESSAGES = {
  REGISTRATION_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
} as const;

export const JWT_STRATEGY_NAME = 'jwt';
export const BEARER_TOKEN_TYPE = 'Bearer';
