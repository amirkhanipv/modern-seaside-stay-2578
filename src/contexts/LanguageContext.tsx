
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { en } from '../locales/en';
import { it } from '../locales/it';
import { fa } from '../locales/fa';

type Translations = typeof en;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  isRTL: boolean;
}

const translations: Record<string, Translations> = {
  en,
  it,
  fa
};

const rtlLanguages = ['fa', 'ar', 'he'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState<Translations>(translations.en);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      setT(translations[savedLanguage]);
      setIsRTL(rtlLanguages.includes(savedLanguage));
      
      // Set document direction
      document.documentElement.dir = rtlLanguages.includes(savedLanguage) ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      setT(translations[lang]);
      setIsRTL(rtlLanguages.includes(lang));
      localStorage.setItem('language', lang);
      
      // Set document direction and language
      document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
