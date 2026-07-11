import React, { useState } from 'react';
import { LayoutDashboard, LogOut, ShieldCheck, Terminal, User, Menu, X, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext'; // 1. Import useAuth

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // 2. Extract logout function
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Terminal size={20} />, label: 'Sandbox Terminal', path: '/terminal' },
    { icon: <ShieldCheck size={20} />, label: 'YAML Validator', path: '/validator' },
    { icon: <Activity size={20} />, label: 'Load Balancer', path: '/loadbalancer' }, // Fixed icon
    { icon: <User size={20} />, label: 'My Progress', path: '/progress' },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 transition shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-40
        w-64 h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-500 tracking-tight">CloudSandbox</h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">DevOps Simulator</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all font-medium ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with working Logout */}
        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={logout} // 3. Attach the logout handler
            className="flex items-center space-x-3 text-red-400 p-3 hover:bg-red-500/10 w-full rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;