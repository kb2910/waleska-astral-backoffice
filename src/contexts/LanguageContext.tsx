import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  lang: string;
  changeLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({ lang: 'es', changeLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language?.split('-')[0] || 'es');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  const changeLang = (newLang: string) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('backoffice_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
