
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './store/AuthContext';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/dashboard/DashboardPage';
import TerminalPage from './pages/terminal/TerminalPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProgressPage from './pages/progress/ProgressPage';
import LandingNavbar from './components/layout/LandingNavbar';
import Home from './pages/public/Home';
import Guide from './pages/public/Guide';
import About from './pages/public/About';
import LoadBalancerPage from './pages/lb/LoadBalancerPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import YamlValidatorPage from './pages/validator/YamlValidatorPage';
import ResetPassword from './pages/auth/ResetPassword';

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white font-mono">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">SYNCHRONIZING SANDBOX...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with landing navbar */}
        <Route path="/" element={<><LandingNavbar /><Home /></>} />
        <Route path="/about" element={<><LandingNavbar /><About /></>} />
        <Route path="/guide" element={<><LandingNavbar /><Guide /></>} />
        <Route path="/login" element={<><LandingNavbar /><LoginPage /></>} />
        <Route path="/forgot-password" element={<><LandingNavbar /><ForgotPassword/></>} />
        
        <Route path="/reset-password" element={<><LandingNavbar /><ResetPassword/></>} />
        <Route path="/register" element={<><LandingNavbar /><RegisterPage /></>} />
        
        {/* Protected routes */}
        <Route 
          path="/*" 
          element={
            <AuthenticatedLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/terminal" element={<TerminalPage />} />
                <Route path="/validator" element={<YamlValidatorPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/loadbalancer" element={<LoadBalancerPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AuthenticatedLayout>
          } 
        />
      </Routes>
      
      {/* Toast Container - Added here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;