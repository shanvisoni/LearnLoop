// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   bio?: string;
//   avatar?: string;
//   contactInfo?: {
//     email?: string;
//     phone?: string;
//     linkedin?: string;
//     github?: string;
//   };
//   joinedCommunities: string[];
//   createdCommunities: string[];
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface RegisterRequest {
//   username: string;
//   email: string;
//   password: string;
//   firstName?: string;
//   lastName?: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   message: string;
//   user: User;
//   accessToken: string;
// }

// export interface ForgotPasswordRequest{
//   email:string;
// }

// export interface ResetPasswordRequest{
//   token: string;
//   newPassword: string;
// }
// export interface ForgotPasswordResponse{
//   success: boolean;
//   message: string;
// }

// export interface ResetPasswordResponse{
//   success:boolean;
//   message:string;
// }






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
  // country: string;
  // countryCode: string;
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
    // country: string;
    // countryCode: string;
  };
  accessToken: string;
}

export interface AuthError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  field?: string;
}
