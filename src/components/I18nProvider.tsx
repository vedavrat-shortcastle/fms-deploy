// src/components/I18nProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { SupportedLanguages } from '@prisma/client';
import { getDirection } from '@/utils/getLanguageDirection';
import { useSession } from 'next-auth/react';

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
  children: React.ReactNode; // Use React.ReactNode for children
}

export default function TranslationProvider({
  children,
}: TranslationProviderProps) {
  const { data: session, status } = useSession();
  const [direction, setDirection] = useState(i18nInstance.dir());
  const [lng, setLng] = useState<SupportedLanguages | undefined>(
    session?.user?.language as SupportedLanguages | undefined
  );
  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    const sessionLanguage = session?.user?.language as
      | SupportedLanguages
      | undefined;
    if (sessionLanguage && i18nInstance.language !== sessionLanguage) {
      i18nInstance.changeLanguage(sessionLanguage);
      setLng(sessionLanguage);
    } else if (
      !sessionLanguage &&
      i18nInstance.language !== i18nInstance.language
    ) {
      setLng(i18nInstance.language as SupportedLanguages | undefined);
    }
    setDirection(i18nInstance.dir());
  }, [session?.user?.language, status, lng]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      <div dir={direction}>{children}</div>
    </I18nextProvider>
  );
}
