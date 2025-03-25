import Sidebar from '@/components/SideBar';
import { ProtectedRoute } from '@/hooks/protectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
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
