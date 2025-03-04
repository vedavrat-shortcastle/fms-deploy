'use client';

import { PERMISSIONS } from '@/constants';
import { ProtectedRoute } from '@/hooks/protected-route';
import { usePermission } from '@/hooks/use-permission';

export default function OrganizationsPage() {
  const canCreateOrg = usePermission(PERMISSIONS.ORG_CREATE);
  console.log('canCreateOrg', canCreateOrg);
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.ORG_VIEW}>
      You have permission to view organizations and you can{' '}
      {canCreateOrg ? 'create' : 'not create'} organizations.
    </ProtectedRoute>
  );
}
