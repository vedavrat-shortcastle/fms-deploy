import type { Metadata } from 'next';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'FedChess',
  // description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
