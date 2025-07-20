import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { ROUTES } from './utils/constants';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TasksPage from './pages/tasks/TasksPage';
import CommunitiesPage from './pages/community/CommunitiesPage';
import { CommunityDetailPage } from './pages/community/CommunityDetailPage';
import CreateCommunityPage from './pages/community/CreateCommunityPage';
import MyCommunitiesPage from './pages/community/MyCommunitiesPage';
import JoinedCommunitiesPage from './pages/community/JoinedCommunitiesPage';
// import ProfilePage from './pages/profile/ProfilePage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
function App() {

  return (
    <QueryClientProvider client={queryClient}>
     <Router>
      <Routes>
         {/* Public Routes */}
       <Route path={ROUTES.HOME} element={<HomePage/>}/>
       <Route path={ROUTES.LOGIN} element={< LoginPage/>}/>
       <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
       <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
       <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
{/* Protected Routes */}
       <Route element={<ProtectedRoute/>}>
       <Route element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage/>}/>
         <Route path={ROUTES.TASKS} element={<TasksPage />} />
         
             <Route path={ROUTES.COMMUNITIES} element={<CommunitiesPage  />} />
              <Route path={ROUTES.COMMUNITY_DETAIL} element={<CommunityDetailPage />} />
              <Route path={ROUTES.CREATE_COMMUNITY} element={<CreateCommunityPage />} />
                <Route path={ROUTES.MY_COMMUNITIES} element={<MyCommunitiesPage />} />
              <Route path={ROUTES.JOINED_COMMUNITIES} element={<JoinedCommunitiesPage />} />
              
             {/* <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> */}
       </Route>
       </Route>
      </Routes>
     </Router>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
