
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

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { settings, setSettings } = useSettings();

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  useEffect(() => {
    if (!settings.language) {
      setSettings({...settings, language: i18n.language})
    }
  }, [i18n, settings, setSettings]);

  const handleLanguageChange = (value: string) => {
    setSettings({...settings, language: value})
    i18n.changeLanguage(value);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === settings.language);
    return lang ? lang.name : 'Português';
  };

  return (
    <Select value={settings.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={getCurrentLanguageName()} />
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
