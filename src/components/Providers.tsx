'use client';

import TranslationProvider from '@/components/I18nProvider';
import TrpcProvider from '@/hooks/trpcProvider';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <TrpcProvider>
      <SessionProvider>
        <TranslationProvider>{children}</TranslationProvider>
      </SessionProvider>
    </TrpcProvider>
  );
}
