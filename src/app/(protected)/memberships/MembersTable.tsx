'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { Badge } from '@/components/ui/badge'; // colored badge for status

export default function MembersTable() {
  const page = 1;
  const limit = 10;

  // Call the API endpoint using tRPC
  const { data, isLoading, error } =
    trpc.membership.getFederationSubscribers.useQuery({ page, limit });

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

  // The API returns an object with subscriptions and total.
  // Each subscription includes subscriberId, type, status, startDate, and endDate.
  const subscriptions = data?.subscriptions || [];

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Subscriber ID</TableHead>
            <TableHead>Subscription Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            {/* New columns for plan details */}
            <TableHead>Plan Name</TableHead>
            <TableHead>Plan Price</TableHead>
            <TableHead>Plan Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Simple condition to show "No members found" */}
          {subscriptions.length === 0 && (
            <p className="text-primary text-2xl">No members found</p>
          )}
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
              {/* New plan detail cells */}
              <TableCell>{sub.plan ? sub.plan.name : 'N/A'}</TableCell>
              <TableCell>{sub.plan ? sub.plan.price : 'N/A'}</TableCell>
              <TableCell>{sub.plan ? sub.plan.currency : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
