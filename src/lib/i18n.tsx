'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import ru from '@/translations/ru.json';
import kz from '@/translations/kz.json';

type Language = 'ru' | 'kz';
type Translations = typeof ru;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = { ru, kz };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'ru' || saved === 'kz')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = translations[language];
    
    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
