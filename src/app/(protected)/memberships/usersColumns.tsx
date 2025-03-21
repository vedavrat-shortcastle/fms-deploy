'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export type PlanTable = {
  name: string;
  price: string;
  benefits: string;
  duration: number | null;
  createAt: Date;
  id: string;
};

export const usersColumns: ColumnDef<PlanTable>[] = [
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
            className="bg-red-600 text-white"
            onClick={() => {
              {
                console.log('row', row);
              }
              router.push(
                `/memberships-payment?planId=${row.original.id}&playerIds=${[session.data?.user.profileId]}`
              );
            }}
          >
            Purchase Plan
          </Button>
        </div>
      );
    },
  },
];
