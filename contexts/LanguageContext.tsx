import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

export type Language = 'en' | 'ar';
type SupportedLanguage = Language;

const LANGUAGE_STORAGE_KEY = '@sign_motivational_app_language';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  changeLanguage: (language: SupportedLanguage) => void; // Added this for compatibility
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const translations: Record<SupportedLanguage, Record<string, any>> = {
  en,
  ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

function getNestedValue(
  obj: Record<string, any>,
  path: string,
): string | undefined {
  const result = path.split('.').reduce((acc, key) => acc?.[key], obj);
  return typeof result === 'string' ? result : undefined;
}

function interpolate(
  str: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return str;
  return str.replace(
    /\{\{(.*?)\}\}/g,
    (_, key) => `${params[key.trim()] ?? ''}`,
  );
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Set Arabic as default language
  const [language, setLanguage] = useState<SupportedLanguage>('ar');

  // Load saved language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage === 'en' || savedLanguage === 'ar') {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const raw = getNestedValue(translations[language], key);
    if (!raw) {
      console.warn(
        `Translation key "${key}" not found for language "${language}"`,
      );
      return key; // Return the key as fallback
    }
    return interpolate(raw, params);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        changeLanguage,
        t,
        isRTL: language === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn('useLanguage must be used within a LanguageProvider');
    // Return a more complete fallback
    return {
      language: 'ar',
      setLanguage: () => {},
      changeLanguage: () => {},
      t: (key: string) => {
        console.warn(`Translation attempted outside provider: ${key}`);
        return key;
      },
      isRTL: true,
    };
  }
  return context;
};
