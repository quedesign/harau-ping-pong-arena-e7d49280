
import React, { useEffect, useState } from 'react';
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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');

  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  useEffect(() => {
    const detectedLanguage = i18n.language;
    if (detectedLanguage !== 'pt' && 
        detectedLanguage !== 'en' && 
        detectedLanguage !== 'es') {
      i18n.changeLanguage('pt');
      setCurrentLanguage('pt');
    }
  }, [i18n]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    setCurrentLanguage(value);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : 'Português';
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
