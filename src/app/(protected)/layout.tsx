'use client';

import Sidebar from '@/components/SideBar';
import { ProtectedRoute } from '@/hooks/protectedRoute';
import { useSession } from 'next-auth/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const lng = session?.user.language || 'en';
  const dir = session?.user.isRtl ? 'rtl' : 'ltr';

  return (
    <ProtectedRoute>
      <section lang={lng} dir={dir}>
        <div className="flex min-h-svh">
          <Sidebar />
          <main className="flex-1 min-h-svh">{children}</main>
        </div>
      </section>
    </ProtectedRoute>
  );
}
