export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

}

export interface AuthResponse {
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

export interface AuthError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  field?: string;
}
