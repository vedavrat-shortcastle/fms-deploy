'use client';

import { ColumnDef } from '@tanstack/react-table';

export type PlanTable = {
  name: string;
  price: string;
  benefits: string;
  duration: number | null;
  createAt: Date;
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
