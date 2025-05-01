import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, setSettings } = useSettings();

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  const handleLanguageChange = (languageCode: string) => {    
    i18n.changeLanguage(languageCode);    
    setSettings((prev) => ({
        ...prev, language: languageCode
      }));
  };

  return (
    <Select value={settings.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('Select language')} />
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ code, name }) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
