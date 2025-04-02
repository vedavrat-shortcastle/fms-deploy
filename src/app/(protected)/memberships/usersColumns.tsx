'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

export type UserPlanTable = {
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

export const useUsersPlanColumns = (): ColumnDef<UserPlanTable>[] => {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useSession();

  return [
    {
      accessorKey: 'name',
      header: t('userPlanTable_planName'),
    },
    {
      accessorKey: 'price',
      header: t('userPlanTable_price'),
    },
    {
      accessorKey: 'benefits',
      header: t('userPlanTable_benefits'),
    },
    {
      accessorKey: 'duration',
      header: t('userPlanTable_billingCycle'),
      cell: ({ row }) =>
        `${row.getValue('duration')} ${t('userPlanTable_months')}`,
    },
    {
      id: 'actions',
      // header: t('userPlanTable_actions'), // Optional: Add a translation for "Actions" if needed
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 justify-end">
            <Button
              variant={row.original.status === 'active' ? 'outline' : 'default'}
              onClick={() => {
                if (row.original.status === 'active') {
                  return;
                }
                router.push(
                  `/memberships-payment?planId=${row.original.id}&playerIds=${[session.data?.user.profileId]}`
                );
              }}
            >
              {row.original.status === 'active'
                ? t('userPlanTable_purchased')
                : t('userPlanTable_purchasePlan')}
            </Button>
          </div>
        );
      },
    },
  ];
};
