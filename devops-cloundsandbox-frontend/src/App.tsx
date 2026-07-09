import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/dashboard/DashboardPage';
import TerminalPage from './pages/terminal/TerminalPage';
import LoginPage from './pages/auth/LoginPage';

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/*" 
          element={
            <AuthenticatedLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/terminal" element={<TerminalPage />} />
                <Route path="/validator" element={<div className="p-8">YAML Validator</div>} />
                <Route path="/progress" element={<div className="p-8">My Progress</div>} />
              </Routes>
            </AuthenticatedLayout>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;