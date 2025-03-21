'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/usages/DataTable';
import { adminColumns } from './adminColumns';

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
import { usersColumns } from '@/app/(protected)/memberships/usersColumns';

export default function Memberships() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const canCreatePlan = usePermission(PERMISSIONS.PLAN_CREATE);

  // Fetch plans using tRPC query
  const { data, isLoading, refetch } = trpc.membership.getPlans.useQuery({
    page: 1,
    limit: 10,
    searchQuery: search,
  });

  // Extract plans from fetched data or fallback to an empty array
  const plans: any = data?.plans || [];

  // Optionally, refetch on search query change (if you are not debouncing the input)
  useEffect(() => {
    refetch();
  }, [search, refetch, formOpen]);

  // You can also add error handling and loading state if needed

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 flex flex-col overflow-auto p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-red-600">
            <FileText size={20} />
          </span>{' '}
          Memberships
        </h1>
        <div className="border-b my-4">
          <Button variant="link" className="text-red-600 font-semibold">
            Plans
          </Button>
        </div>

        <div className="flex gap-4 mb-4 items-end">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          {canCreatePlan && (
            <div className="flex  mt-6 items-end w-full h-15 justify-end">
              {/* Modal Pop-up for Adding usage */}
              <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                  <Button>Add Plan</Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl order ">
                  <DialogHeader className="">
                    <DialogTitle className="text-2xl font-bold">
                      {/* <div className=""> */}
                      <h1 className="text-2xl font-bold">Create Plan</h1>
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
          <div className="flex justify-center w-full h-full items-center ">
            <Loader />
          </div>
        ) : (
          <>
            {canCreatePlan ? (
              <DataTable columns={adminColumns} data={plans} />
            ) : (
              <DataTable columns={usersColumns} data={plans} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
