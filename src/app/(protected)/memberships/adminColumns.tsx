'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

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

export const useAdminPlanColumns = (): ColumnDef<PlanTable>[] => {
  const { t } = useTranslation();

  return [
    {
      accessorKey: 'name',
      header: t('planTable_planName'),
    },
    {
      accessorKey: 'price',
      header: t('planTable_price'),
    },
    {
      accessorKey: 'benefits',
      header: t('planTable_benefits'),
    },
    {
      accessorKey: 'duration',
      header: t('planTable_billingCycle'),
      cell: ({ row }) => `${row.getValue('duration')} ${t('planTable_months')}`,
    },

    {
      accessorKey: 'createdAt',
      header: t('planTable_createdAt'),
    },
  ];
};
