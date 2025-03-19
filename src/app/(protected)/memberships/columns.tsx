'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type PlanTable = {
    name: string;
    price: string;
    benefits: string;
    eligibility: string | null;
  };
  

export const columns: ColumnDef<PlanTable>[] = [
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
    accessorKey: 'eligibility',
    header: 'Eligibility Criteria',
  },
  {
    id: 'actions',
    // header: 'Actions',
    cell: ({ }) => (
      <div className="flex space-x-2 flex justify-end">
        <Button className="bg-red-600 text-white">Purchase Plan</Button>
      </div>
    ),
  },
 
];

