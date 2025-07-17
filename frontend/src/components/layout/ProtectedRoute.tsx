import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute =()=>{
      const { isAuthenticated, isLoading } = useAuth();
      if(isLoading){
        return(
    <div className="min-h-screen flex items-center justify-center">
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
    </div>
   )  
      }
  return isAuthenticated? <Outlet/>: <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;