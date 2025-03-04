import { getServerSession } from 'next-auth';
import { authConfig } from '@/app/server/authConfig';
import { redirect } from 'next/navigation';

export async function auth(requireAuth = true) {
  const session = await getServerSession(authConfig);

  if (requireAuth && !session) {
    redirect('/login');
  }

  return session;
}

export function checkPermission(
  userPermissions: string[],
  requiredPermission: string
) {
  return userPermissions.includes(requiredPermission);
}
