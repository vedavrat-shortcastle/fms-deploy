'use client';

import TranslationProvider from '@/components/I18nProvider';
import TrpcProvider from '@/hooks/trpcProvider';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
  lng: string;
}

export default function Providers({ children, lng }: ProvidersProps) {
  return (
    <TrpcProvider>
      <SessionProvider>
        <TranslationProvider lng={lng}>{children}</TranslationProvider>
      </SessionProvider>
    </TrpcProvider>
  );
}
