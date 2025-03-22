import Sidebar from '@/components/SideBar';
import { ProtectedRoute } from '@/hooks/protectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto">{children}</main>
        </div>
      </section>
    </ProtectedRoute>
  );
}
