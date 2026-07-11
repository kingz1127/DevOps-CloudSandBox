import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Terminal className="text-white" size={20} />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">CloudSandbox</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
            <Link to="/guide" className="text-slate-300 hover:text-white transition">How it Works</Link>
            <Link to="/login" className="text-slate-300 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-slate-300 hover:text-white transition p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-slate-800">
            <Link 
              to="/about" 
              className="block text-slate-300 hover:text-white transition px-2 py-2 rounded-lg hover:bg-slate-800"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/guide" 
              className="block text-slate-300 hover:text-white transition px-2 py-2 rounded-lg hover:bg-slate-800"
              onClick={closeMenu}
            >
              How it Works
            </Link>
            <Link 
              to="/login" 
              className="block text-slate-300 hover:text-white transition px-2 py-2 rounded-lg hover:bg-slate-800"
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="block bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition text-center"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;