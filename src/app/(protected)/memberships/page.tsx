'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/usages/DataTable';
import { useAdminPlanColumns } from './adminColumns';
import { useUsersPlanColumns } from '@/app/(protected)/memberships/usersColumns';

import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PlanForm from '@/components/subscriptions';
import { trpc } from '@/utils/trpc';
import { usePermission } from '@/hooks/usePermission';
import Loader from '@/components/Loader';
import { PERMISSIONS } from '@/config/permissions';
import { useTranslation } from 'react-i18next';

import MembersTable from '@/app/(protected)/memberships/MembersTable';
import clsx from 'clsx';
import ConfigForm from '@/app/(protected)/memberships/ConfigForm';

export default function Memberships() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    'plans' | 'members' | 'form'
  >('plans');
  const canCreatePlan = usePermission(PERMISSIONS.PLAN_CREATE);
  const { t } = useTranslation();
  const adminColumns = useAdminPlanColumns();
  const usersColumns = useUsersPlanColumns();
  const [isPlanOpen, setIsPlanOpen] = useState(true);

  // Fetch plans using tRPC query
  const { data, isLoading, refetch } = trpc.membership.getPlans.useQuery({
    page: 1,
    limit: 10,
    searchQuery: search,
  });

  // Extract plans from fetched data or fallback to an empty array
  const activePlans = data?.activePlans || [];
  const inactivePlans = data?.inactivePlans || [];

  const plans = [
    ...activePlans.map((plan) => ({ ...plan, status: 'active' })),
    ...inactivePlans.map((plan) => ({ ...plan, status: 'inactive' })),
  ];

  // Define the section type
  type Section = {
    name: string;
    value: 'plans' | 'members' | 'form';
    permission?: typeof PERMISSIONS.PLAN_CREATE; // Match the permission type
  };
  // Define sections for dynamic rendering
  const sections: Section[] = [
    { name: 'Plans', value: 'plans', permission: PERMISSIONS.PLAN_CREATE },
    { name: 'Members', value: 'members', permission: PERMISSIONS.PLAN_CREATE },
    { name: 'Form', value: 'form', permission: PERMISSIONS.PLAN_CREATE },
  ];

  // Optionally, refetch on search query change (if you are not debouncing the input)
  useEffect(() => {
    refetch();
  }, [search, refetch, formOpen]);

  // You can also add error handling and loading state if needed

  return (
    <div className="flex min-h-svh bg-gray-50">
      <main className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {/* Heading */}
          <span className="text-primary">
            <FileText size={20} />
            {/* Icon */}
          </span>{' '}
          {t('membershipsPage_memberships')}
        </h1>
        {/* Dynamic Section Tabs */}
        <div className="border-b my-4">
          <Button
            variant="link"
            className={clsx(
              'font-semibold',
              isPlanOpen ? 'text-primary' : 'text-secondary'
            )}
            onClick={() => setIsPlanOpen(true)}
          >
            {t('membershipsPage_plans')}
          </Button>
          {canCreatePlan && (
            <Button
              variant="link"
              className={clsx(
                'font-semibold',
                !isPlanOpen ? 'text-primary' : 'text-secondary'
              )}
              onClick={() => setIsPlanOpen(false)}
            >
              {t('membershipsPage_memberships')}
            </Button>
          )}
        </div>

        <div className="flex gap-4 mb-4 items-end">
          {/* Search */}
          <Input
            placeholder={t('membershipsPage_search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          {canCreatePlan && currentSection === 'plans' && (
            <div className="flex mt-6 items-end w-full h-15 justify-end">
              {/* Modal Pop-up for Adding usage */}
              <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                  <Button>{t('membershipsPage_addPlan')}</Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl order ">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {/* <div className=""> */}
                      <h1 className="text-2xl font-bold">
                        {t('membershipsPage_createPlan')}
                      </h1>
                      {/* </div> */}
                    </DialogTitle>
                  </DialogHeader>
                  <div
                    className="overflow-y-auto flex-grow"
                    style={{ maxHeight: 'calc(100vh - 140px)' }}
                  >
                    <PlanForm onClose={() => setFormOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-svh">
            <Loader />
          </div>
        ) : (
          <>
            {currentSection === 'plans' &&
              (canCreatePlan ? (
                <DataTable columns={adminColumns} data={plans} />
              ) : (
                <DataTable columns={usersColumns} data={plans} />
              ))}
            {currentSection === 'members' && <MembersTable />}
            {currentSection === 'form' && <ConfigForm />}
          </>
        )}
      </main>
    </div>
  );
}
