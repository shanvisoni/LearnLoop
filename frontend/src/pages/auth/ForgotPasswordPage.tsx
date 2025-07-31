// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../hooks/useAuth';

// const ForgotPasswordPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<'email' | 'security' | 'reset'>('email');
//   const [email, setEmail] = useState('');
//   const [securityQuestions, setSecurityQuestions] = useState<any[]>([]);
//   const [securityAnswers, setSecurityAnswers] = useState<{[key: string]: string}>({});
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errors, setErrors] = useState<{[key: string]: string}>({});
//   const [loading, setLoading] = useState(false);

//   // const {
//   //   forgotPassword,
//   //   resetPassword,
//   //   isForgotPasswordLoading,
//   //   isResetPasswordLoading,
//   //   forgotPasswordError,
//   //   resetPasswordError,
//   // } = useAuth();

//   // Mock security questions - you should fetch these from your backend
//   const availableQuestions = [
//     "What was the name of your first pet?",
//     "What is your mother's maiden name?",
//     "What city were you born in?",
//     "What was your first car?",
//     "What is your favorite food?"
//   ];

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     if (!email) {
//       setErrors({ email: 'Email is required' });
//       return;
//     }

//     if (!validateEmail(email)) {
//       setErrors({ email: 'Please enter a valid email address' });
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call your backend to get security questions for this email
//       // For now, mock the response
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
//       // Mock security questions for demo
//       setSecurityQuestions([
//         { id: 1, question: availableQuestions[0] },
//         { id: 2, question: availableQuestions[1] }
//       ]);
      
//       setStep('security');
//     } catch (error) {
//       setErrors({ email: 'User not found or an error occurred' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSecuritySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     // Check if all questions are answered
//     const unansweredQuestions = securityQuestions.filter(q => !securityAnswers[q.id]);
//     if (unansweredQuestions.length > 0) {
//       setErrors({ security: 'Please answer all security questions' });
//       return;
//     }

//     setLoading(true);
//     try {
//       // Verify security questions with backend
//       // For now, just simulate verification
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // If verification passes, move to password reset
//       setStep('reset');
//     } catch (error) {
//       setErrors({ security: 'Security answers are incorrect' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     if (!newPassword || !confirmPassword) {
//       setErrors({ 
//         newPassword: !newPassword ? 'New password is required' : '',
//         confirmPassword: !confirmPassword ? 'Please confirm your password' : ''
//       });
//       return;
//     }

//     if (newPassword.length < 6) {
//       setErrors({ newPassword: 'Password must be at least 6 characters long' });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setErrors({ confirmPassword: 'Passwords do not match' });
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call your backend to reset password directly
//       // You'll need to modify your backend to accept email + security verification
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Show success and redirect
//       alert('Password reset successfully!');
//       navigate('/login');
//     } catch (error) {
//       setErrors({ password: 'Failed to reset password. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Reset Your Password
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             {step === 'email' && 'Enter your email to get started'}
//             {step === 'security' && 'Answer your security questions'}
//             {step === 'reset' && 'Create your new password'}
//           </p>
//         </div>

//         {/* Step 1: Email */}
//         {step === 'email' && (
//           <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 className={`mt-1 appearance-none relative block w-full px-3 py-3 border ${
//                   errors.email ? 'border-red-300' : 'border-gray-300'
//                 } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//                 placeholder="Enter your email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//             >
//               {loading ? 'Loading...' : 'Continue'}
//             </button>
//           </form>
//         )}

//         {/* Step 2: Security Questions */}
//         {step === 'security' && (
//           <form className="mt-8 space-y-6" onSubmit={handleSecuritySubmit}>
//             <div className="space-y-4">
//               {securityQuestions.map((question) => (
//                 <div key={question.id}>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     {question.question}
//                   </label>
//                   <input
//                     type="text"
//                     className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Your answer"
//                     value={securityAnswers[question.id] || ''}
//                     onChange={(e) => setSecurityAnswers({
//                       ...securityAnswers,
//                       [question.id]: e.target.value
//                     })}
//                   />
//                 </div>
//               ))}
//               {errors.security && (
//                 <p className="text-sm text-red-600">{errors.security}</p>
//               )}
//             </div>

//             <div className="flex space-x-4">
//               <button
//                 type="button"
//                 onClick={() => setStep('email')}
//                 className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
//               >
//                 {loading ? 'Verifying...' : 'Verify'}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Step 3: Reset Password */}
//         {step === 'reset' && (
//           <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
//                   New Password
//                 </label>
//                 <input
//                   id="newPassword"
//                   name="newPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   className={`mt-1 appearance-none relative block w-full px-3 py-3 border ${
//                     errors.newPassword ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 {errors.newPassword && (
//                   <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Confirm New Password
//                 </label>
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   autoComplete="new-password"
//                   className={`mt-1 appearance-none relative block w-full px-3 py-3 border ${
//                     errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
//                 )}
//               </div>

//               {errors.password && (
//                 <p className="text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             <div className="flex space-x-4">
//               <button
//                 type="button"
//                 onClick={() => setStep('security')}
//                 className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
//               >
//                 {loading ? 'Updating...' : 'Reset Password'}
//               </button>
//             </div>
//           </form>
//         )}

//         <div className="text-center">
//           <Link
//             to="/login"
//             className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
//           >
//             ← Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;