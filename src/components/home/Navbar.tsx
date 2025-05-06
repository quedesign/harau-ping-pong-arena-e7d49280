
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <nav className="w-full p-6 flex justify-between items-center z-10 relative">
      <div className="text-2xl font-bold flex items-center">
        <span className="text-white font-light tracking-wide">Harau</span>
        <span className="text-primary text-2xl">.</span>
      </div>
      <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/atletas">
                <Button variant="outline">{t('common.athletes')}</Button>
              </Link>
              <Link to="/dashboard">
                <Button>{t('common.dashboard')}</Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">{t('common.login')}</Button>
              </Link>
              <Button onClick={() => navigate('/register')} className="rounded-full bg-primary hover:bg-primary/90">{t('common.register')}</Button>
            </>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
