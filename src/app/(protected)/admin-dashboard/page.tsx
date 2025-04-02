// src/app/(protected)/admin-dashboard/page.tsx

import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/app/server/authConfig';
import AdminDashboard from '@/components/dashboard-components/adminDashboard';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authConfig);
  const lng = session?.user?.language || 'English';
  console.log('AdminDashboardPage - LNG:', lng);
  return <AdminDashboard lng={lng} />;
}
