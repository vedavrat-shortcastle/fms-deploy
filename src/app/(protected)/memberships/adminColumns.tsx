'use client';

import { ColumnDef } from '@tanstack/react-table';

export type PlanTable = {
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
};

export const adminColumns: ColumnDef<PlanTable>[] = [
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
    accessorKey: 'createdAt',
    header: 'Created At',
  },
];
