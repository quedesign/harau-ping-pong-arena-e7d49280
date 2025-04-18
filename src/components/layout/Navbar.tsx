
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black border-b border-zinc-800 py-3 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-white">Harau</span>
          <span className="text-primary text-sm border-l border-zinc-700 pl-2">PING PONG</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/tournaments" className="text-white hover:text-primary transition">
            Tournaments
          </Link>
          <Link to="/athletes" className="text-white hover:text-primary transition">
            Athletes
          </Link>
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-zinc-700">
                    <AvatarImage src={currentUser.profileImage} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/profile')}>
                  <User size={16} className="mr-2" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-zinc-800 p-4 flex flex-col gap-4">
            <Link to="/tournaments" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
              Tournaments
            </Link>
            <Link to="/athletes" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
              Athletes
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/profile" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/settings" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="text-white hover:text-primary transition py-2 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}>
                  Login
                </Button>
                <Button className="bg-primary" onClick={() => {
                  navigate('/register');
                  toggleMenu();
                }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
