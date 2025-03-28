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

export default function MembersTable() {
  const page = 1;
  const limit = 10;

  // Call the API endpoint using tRPC
  const { data, isLoading, error } =
    trpc.membership.getFederationSubscribers.useQuery({ page, limit });

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.subscriberId}>
              <TableCell>{sub.subscriberId}</TableCell>
              <TableCell>{sub.type}</TableCell>
              <TableCell>{sub.status}</TableCell>
              <TableCell>
                {new Date(sub.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(sub.endDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
