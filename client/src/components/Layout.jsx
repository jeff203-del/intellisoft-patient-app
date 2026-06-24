import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, Stethoscope } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">IntelliSOFT</h1>
                <p className="text-xs text-gray-500 -mt-1">Patient Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Register
                </span>
              </Link>
              <Link
                to="/patients"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive('/patients') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Patients
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2026 IntelliSOFT — Health IT Systems for Africa
        </div>
      </footer>
    </div>
  );
};

export default Layout;