'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MemberForm from '@/components/MemberForm';
export default function MembersTable() {
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [memberFormOpen, setMemberFormOpen] = useState<boolean>(false);

  // Fetch members data using tRPC query
  const { data, isLoading, error, refetch } =
    trpc.membership.getFederationSubscribers.useQuery({
      page,
      limit: itemsPerPage,
    });

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handler for items per page changes (resets to page 1)
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  // Optionally, refetch on page or itemsPerPage change
  useEffect(() => {
    refetch();
  }, [page, itemsPerPage, refetch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center">
        Error: {error.message}
      </div>
    );

  const subscriptions = data?.subscriptions || [];

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-2xl text-primary">No members found</p>
        {/* Show dialog trigger even if no members exist */}
        <Dialog open={memberFormOpen} onOpenChange={setMemberFormOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Add Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Add Member
              </DialogTitle>
            </DialogHeader>
            <div
              style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
            >
              <MemberForm onClose={() => setMemberFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Members</h2>
        {/* Dialog for Adding a Member */}
        <Dialog open={memberFormOpen} onOpenChange={setMemberFormOpen}>
          <DialogTrigger asChild>
            <Button>Add Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Add Member
              </DialogTitle>
            </DialogHeader>
            <div
              style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
            >
              <MemberForm onClose={() => setMemberFormOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Subscriber ID</TableHead>
            <TableHead>Subscription Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Plan Price</TableHead>
            <TableHead>Plan Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.subscriberId}>
              <TableCell>{sub.subscriberId}</TableCell>
              <TableCell>{sub.type}</TableCell>
              <TableCell>
                {sub.status === 'ACTIVE' ? (
                  <Badge variant="green">ACTIVE</Badge>
                ) : sub.status === 'EXPIRED' ? (
                  <Badge variant="gray">EXPIRED</Badge>
                ) : sub.status === 'CANCELED' ? (
                  <Badge variant="destructive">CANCELED</Badge>
                ) : (
                  <Badge>{sub.status}</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(sub.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(sub.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{sub.plan ? sub.plan.name : 'N/A'}</TableCell>
              <TableCell>{sub.plan ? sub.plan.price : 'N/A'}</TableCell>
              <TableCell>{sub.plan ? sub.plan.currency : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination
          totalRecords={data?.total || 0}
          currentPage={page}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}
