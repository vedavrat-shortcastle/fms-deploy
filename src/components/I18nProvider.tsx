// src/components/I18nProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { SupportedLanguages } from '@prisma/client';
import { getDirection } from '@/utils/getLanguageDirection';

const languages = Object.values(SupportedLanguages) as string[];
const i18nInstance = i18n.createInstance();
i18nInstance
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: languages,
    fallbackLng: SupportedLanguages.en,
    debug: process.env.NODE_ENV === 'development',
    backend: {
      loadPath: '/locales/{{lng}}/common.json',
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'navigator'],
      caches: [],
    },
    preload: languages,
    ns: ['common'],
    defaultNS: 'common',
  });

// Define language direction
i18nInstance.on('languageChanged', (lng: SupportedLanguages) => {
  const direction = getDirection(lng);
  i18nInstance.dir = () => direction;
});

interface TranslationProviderProps {
  children: React.ReactNode;
  lng: string;
}

export default function TranslationProvider({
  children,
  lng,
}: TranslationProviderProps) {
  const [direction, setDirection] = useState(i18nInstance.dir());

  useEffect(() => {
    if (i18nInstance.language !== lng) {
      i18nInstance.changeLanguage(lng);
    }
    setDirection(i18nInstance.dir());
  }, [lng]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <div dir={direction}>{children}</div>
    </I18nextProvider>
  );
}
