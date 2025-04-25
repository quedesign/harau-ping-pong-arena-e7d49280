
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, Calendar, Users, User, Settings, 
  PlusCircle, Award, BarChart 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) return null;
  
  const isActive = (path: string) => location.pathname === path;
  
  const getLinkClass = (path: string) => {
    return `flex items-center gap-3 py-3 px-4 rounded-md transition-colors ${
      isActive(path) 
        ? 'bg-primary/10 text-primary' 
        : 'text-white hover:bg-white/5'
    }`;
  };

  // Define menu items based on user role
  const athleteMenuItems = [
    { path: '/dashboard', icon: <BarChart size={20} />, label: 'Dashboard' },
    { path: '/tournaments', icon: <Trophy size={20} />, label: 'Tournaments' },
    { path: '/athletes', icon: <Users size={20} />, label: 'Find Athletes' },
    { path: '/my-profile', icon: <User size={20} />, label: 'My Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];
  
  const adminMenuItems = [
    { path: '/dashboard', icon: <BarChart size={20} />, label: 'Dashboard' },
    { path: '/tournaments', icon: <Trophy size={20} />, label: 'Tournaments' },
    { path: '/admin/create-tournament', icon: <PlusCircle size={20} />, label: 'Create Tournament' },
    { path: '/athletes', icon: <Users size={20} />, label: 'Athletes' },
    { path: '/my-profile', icon: <User size={20} />, label: 'My Profile' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];
  
  const menuItems = currentUser.role === 'admin' ? adminMenuItems : athleteMenuItems;

  return (
    <aside className="fixed h-screen w-64 bg-black border-r border-zinc-800 pt-6 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="px-6 mb-6">
          <h2 className="text-white font-semibold">
            {currentUser.role === 'admin' ? 'Admin Panel' : 'Athlete Menu'}
          </h2>
        </div>
        
        <nav className="flex-1 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={getLinkClass(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-zinc-800 mt-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {currentUser.name.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-zinc-400 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
