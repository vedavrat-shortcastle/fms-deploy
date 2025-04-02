'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  // const {} trpc call to get rtl & language config for fed
  const router = useRouter();

  // useEffect(() => {
  //     if(!window) return;
  //     const domain = window.location.host;
  //     const isRtl =
  //     document.documentElement.setAttribute(
  //       'dir',
  //       session?.user?.isRtl ? 'rtl' : 'ltr'
  //     );

  // }, [session, status]);

  useEffect(() => {
    if (session) {
      router.push('/memberships');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <Loader />
      </div>
    ); // or any loading indicator
  }

  if (session) {
    return null; // or a loading indicator while redirecting
  }

  return <div>{children}</div>;
};

export default Layout;
