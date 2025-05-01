
import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, setSettings } = useSettings();

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  // Atualiza i18n se settings.language estiver definido mas não aplicado
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    } else if (!settings.language && i18n.language) {
      setSettings({ ...settings, language: i18n.language });
    }
  }, [i18n.language, settings.language, setSettings, i18n, settings]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setSettings({ ...settings, language: value });
  };

  return (
    <Select value={settings.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('Select language')} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
