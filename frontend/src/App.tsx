import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { ROUTES } from './utils/constants';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TasksPage from './pages/tasks/TasksPage';
// import CommunitiesPage from './pages/communities/CommunitiesPage';
// import CommunityDetailPage from './pages/communities/CommunityDetailPage';
// import CreateCommunityPage from './pages/communities/CreateCommunityPage';
// import MyCommunitiesPage from './pages/communities/MyCommunitiesPage';
// import JoinedCommunitiesPage from './pages/communities/JoinedCommunitiesPage';
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

{/* Protected Routes */}
       <Route element={<ProtectedRoute/>}>
       <Route element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage/>}/>
         <Route path={ROUTES.TASKS} element={<TasksPage />} />
            {/*   <Route path={ROUTES.COMMUNITIES} element={<CommunitiesPage />} />
              <Route path={ROUTES.COMMUNITY_DETAIL} element={<CommunityDetailPage />} />
              <Route path={ROUTES.CREATE_COMMUNITY} element={<CreateCommunityPage />} />
              <Route path={ROUTES.MY_COMMUNITIES} element={<MyCommunitiesPage />} />
              <Route path={ROUTES.JOINED_COMMUNITIES} element={<JoinedCommunitiesPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> */}
       </Route>
       </Route>
      </Routes>
     </Router>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
