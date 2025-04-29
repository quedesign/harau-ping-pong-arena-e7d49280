
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Navbar = () => {
    const { currentUser } = useAuth();
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;
    const navigate = useNavigate();

  const handleRegister = () => {
    console.log("Redirecionando para a página de registro");
    navigate('/register');
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <nav className="w-full p-6 flex justify-between items-center z-10 relative">
      <div className="text-2xl font-bold flex items-center">
        <span className="text-white font-light tracking-wide">Harau</span>
        <span className="text-primary text-2xl">.</span>
      </div>
      <div className="flex items-center space-x-4">
        <Select onValueChange={handleLanguageChange} defaultValue={currentLanguage}>
          <SelectTrigger className="w-[100px] bg-transparent border-none text-white hover:bg-white/10">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">
              Português
            </SelectItem>
            <SelectItem value="en">
              English
            </SelectItem>
            <SelectItem value="es">
              Español
            </SelectItem>
          </SelectContent>
        </Select>

      <div className="space-x-4">
        {currentUser ? (
          <Link to="/dashboard">
            <Button>{t('common.dashboard')}</Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">{t('common.login')}</Button>
            </Link>
            <Button onClick={handleRegister} className="rounded-full bg-primary hover:bg-primary/90">{t('common.register')}</Button>
          </>
        )}
      </div>

      </div>
    </nav>
  );
};

export default Navbar;
