import { Outlet } from 'react-router-dom'; // Add this
import Navbar from './Navbar';

const Layout = () => { // Remove `children` prop since we're using Outlet

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet /> {/* This renders nested routes */}
        </div>
      </main>
    </div>
  );
};

export default Layout;