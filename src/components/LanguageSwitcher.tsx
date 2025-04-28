
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  useEffect(() => {
    const currentLanguage = i18n.language;
    if (currentLanguage !== 'pt' && 
        currentLanguage !== 'en' && 
        currentLanguage !== 'es') {
      i18n.changeLanguage('pt');
    }
  }, [i18n]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === i18n.language);
    return lang ? lang.name : 'Português';
  };

  return (
    <Select defaultValue={i18n.language || 'pt'} onValueChange={handleLanguageChange} value={i18n.language || 'pt'}>
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
