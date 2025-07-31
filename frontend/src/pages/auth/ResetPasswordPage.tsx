// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import { authService } from '../../services/auth.service';
// import type { ResetPasswordRequest } from '../../types/auth.types';

// const ResetPasswordPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const tokenFromUrl = searchParams.get('token');
//     if (!tokenFromUrl) {
//       setError('Invalid or missing reset token');
//       return;
//     }
//     setToken(tokenFromUrl);
//   }, [searchParams]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!token) {
//       setError('Invalid reset token');
//       return;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const data: ResetPasswordRequest = {
//         token,
//         newPassword: formData.newPassword,
//       };
      
//       const response = await authService.resetPassword(data);
      
//       if (response.success) {
//         // Show success message and redirect to login
//         alert('Password reset successfully! Please login with your new password.');
//         navigate('/login');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token && error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Reset Link</h3>
//               <p className="text-sm text-gray-600 mb-6">{error}</p>
//               <Link
//                 to="/forgot-password"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Request New Reset Link
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Reset your password
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Enter your new password below
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//                 New Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="newPassword"
//                   name="newPassword"
//                   type="password"
//                   required
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Enter new password"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                 Confirm New Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Confirm new password"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? 'Resetting...' : 'Reset Password'}
//               </button>
//             </div>

//             <div className="text-center">
//               <Link
//                 to="/login"
//                 className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Back to Login
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;