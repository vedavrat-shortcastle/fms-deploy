'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const usersColumns: ColumnDef<{
  status: string;
  currency: string;
  name: string;
  id: string;
  federationId: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  duration: number;
  price: number;
  benefits: string[];
  autoRenewal: boolean;
}>[] = [
  {
    accessorKey: 'name',
    header: 'Plan Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'benefits',
    header: 'Benefits',
  },
  {
    accessorKey: 'duration',
    header: 'Billing cycle',
    cell: ({ row }) => `${row.getValue('duration')} months`,
  },
  {
    id: 'actions',
    // header: 'Actions',
    cell: ({ row }) => {
      const router = useRouter();
      const session = useSession();
      return (
        <div className="flex space-x-2 justify-end">
          <Button
            variant={row.original.status === 'active' ? 'outline' : 'default'}
            onClick={() => {
              if (row.original.status === 'active') {
                return;
              }
              if (
                session.data?.user.role === 'PARENT' ||
                session.data?.user.role === 'CLUB_MANAGER'
              ) {
                router.push(`/memberships-players?planId=${row.original.id}`);
                return;
              }
              if (session.data?.user.role === 'PLAYER') {
                router.push(
                  `/memberships-payment?planId=${row.original.id}&playerIds=${[session.data?.user.profileId]}`
                );
                return;
              }
            }}
          >
            {row.original.status === 'active' ? 'Purchased' : 'Purchase Plan'}
          </Button>
        </div>
      );
    },
  },
];
