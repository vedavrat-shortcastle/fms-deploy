'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type PlanTable = {
  name: string;
  price: string;
  benefits: string;
  duration: number | null;
  createAt: Date;
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
    cell: () => (
      <div className="flex space-x-2 justify-end">
        <Button className="bg-red-600 text-white">Purchase Plan</Button>
      </div>
    ),
  },
];
