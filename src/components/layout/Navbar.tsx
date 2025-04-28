
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, Trophy, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

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
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-white font-light tracking-wide">Harau</span>
          <span className="text-primary text-2xl">.</span>
        </Link>

        <button 
          onClick={toggleMenu} 
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/tournaments" className="text-white hover:text-primary transition flex items-center gap-2">
            <Trophy size={20} />
            {t('common.tournaments')}
          </Link>
          
          {currentUser && (
            <>
              <Link to="/athletes" className="text-white hover:text-primary transition">
                {t('common.athletes')}
              </Link>
              {currentUser.role === 'admin' && (
                <Button 
                  onClick={() => navigate('/admin/create-tournament')}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  <Plus size={20} />
                  {t('common.createTournament')}
                </Button>
              )}
            </>
          )}
          
          <LanguageSwitcher />
          
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
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/my-profile')}>
                  <User size={16} className="mr-2" />
                  <span>{t('common.profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={() => navigate('/settings')}>
                  <Settings size={16} className="mr-2" />
                  <span>{t('common.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-2 cursor-pointer" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                {t('common.login')}
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('/register')}>
                {t('common.register')}
              </Button>
            </div>
          )}
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-zinc-800 p-4 flex flex-col gap-4">
            <Link to="/tournaments" className="text-white hover:text-primary transition py-2 flex items-center gap-2" onClick={toggleMenu}>
              <Trophy size={20} />
              {t('common.tournaments')}
            </Link>
            
            {currentUser && (
              <>
                <Link to="/athletes" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
                  {t('common.athletes')}
                </Link>
                {currentUser.role === 'admin' && (
                  <Button 
                    onClick={() => {
                      navigate('/admin/create-tournament');
                      toggleMenu();
                    }}
                    className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    {t('common.createTournament')}
                  </Button>
                )}
              </>
            )}
            
            <div className="my-2">
              <LanguageSwitcher />
            </div>
            
            {currentUser ? (
              <>
                <Link to="/my-profile" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
                  {t('common.profile')}
                </Link>
                <Link to="/settings" className="text-white hover:text-primary transition py-2" onClick={toggleMenu}>
                  {t('common.settings')}
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="text-white hover:text-primary transition py-2 text-left"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={() => {
                  navigate('/login');
                  toggleMenu();
                }}>
                  {t('common.login')}
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => {
                  navigate('/register');
                  toggleMenu();
                }}>
                  {t('common.register')}
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
