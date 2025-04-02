'use client';
import Sidebar from '@/components/SideBar';
import { ProtectedRoute } from '@/hooks/protectedRoute';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isRtl !== undefined) {
      document.documentElement.setAttribute(
        'dir',
        session.user.isRtl ? 'rtl' : 'ltr'
      );
    }
  }, [session, status]);

  return (
    <ProtectedRoute>
      <section>
        <div className="flex min-h-svh">
          <Sidebar />
          <main className="flex-1 min-h-svh">{children}</main>
        </div>
      </section>
    </ProtectedRoute>
  );
}
