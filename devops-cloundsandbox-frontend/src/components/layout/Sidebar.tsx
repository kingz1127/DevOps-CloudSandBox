import { LayoutDashboard, LogOut, ShieldCheck, Terminal, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Terminal size={20} />, label: 'Sandbox Terminal', path: '/terminal' },
    { icon: <ShieldCheck size={20} />, label: 'YAML Validator', path: '/validator' },
    { icon: <User size={20} />, label: 'My Progress', path: '/progress' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-500">CloudSandbox</h2>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise Dev Engine</span>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-900 text-slate-400'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-900">
        <button className="flex items-center space-x-3 text-red-400 p-2 hover:bg-red-950 w-full rounded-lg transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;