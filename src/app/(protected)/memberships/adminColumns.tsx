'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next'; // Assuming you are using react-i18next

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
    header: t('adminPlans.planName'),
  },
  {
    accessorKey: 'price',
    header: t('adminPlans.price'),
  },
  {
    accessorKey: 'benefits',
    header: t('adminPlans.benefits'),
  },
  {
    accessorKey: 'duration',
    header: t('adminPlans.billingCycle'),
    cell: ({ row }) => `${row.getValue('duration')} ${t('adminPlans.months')}`, // Added translation for "months"
  },

  {
    accessorKey: 'createdAt',
    header: t('adminPlans.createdAt'),
  },
];

function t(key: string): string {
  const { t: translate } = useTranslation('adminPlans');
  return translate(key);
}
