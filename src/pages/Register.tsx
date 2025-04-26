
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('athlete');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
      setLocalError(t('auth.allFieldsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError(t('auth.passwordsDontMatch'));
      return;
    }
    
    if (password.length < 6) {
      setLocalError(t('auth.passwordTooShort'));
      return;
    }
    
    try {
      const success = await register(name, email, password, role);
      if (success) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };
  
  return (
    <Layout>
      <div className="flex justify-center items-center py-8">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.registerTitle')}</CardTitle>
            <CardDescription>{t('auth.registerDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {(error || localError) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {localError || error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t('auth.name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                    autoComplete="name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('auth.password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 pr-10"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t('auth.confirmPassword')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 pr-10"
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('auth.selectRole')}</Label>
                  <RadioGroup 
                    value={role} 
                    onValueChange={(value) => setRole(value as UserRole)} 
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="athlete" id="athlete" />
                      <Label htmlFor="athlete">{t('auth.athlete')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">{t('auth.admin')}</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('auth.register')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-zinc-400 w-full">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.loginNow')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;

