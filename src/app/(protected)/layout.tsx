import Sidebar from '@/components/SideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 h-full overflow-auto">{children}</main>
      </div>
    </section>
  );
}
