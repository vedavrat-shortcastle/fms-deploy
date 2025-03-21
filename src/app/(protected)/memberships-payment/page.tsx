'use client';

import { ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/app/(protected)/memberships-payment/CheckoutForm';
import { Toaster } from '@/components/ui/toaster';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/hooks/trpcProvider';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';

// Replace with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  // Get session data using next-auth hook
  const { data: session } = useSession();

  return (
    <Suspense fallback={<Loader />}>
      <PaymentContent session={session} />
    </Suspense>
  );
}

function PaymentContent({ session }: { session: any }) {
  const searchParams = useSearchParams();
  const membershipPlanId = searchParams.get('planId');
  const playerIds = searchParams.get('playerIds')?.split(',') || [];

  const { data: plan, isLoading } = trpc.membership.getPlanById.useQuery(
    { id: membershipPlanId! },
    { enabled: !!membershipPlanId }
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!plan || !membershipPlanId) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white p-8">
        <div className="mb-4 flex items-center">
          <Button variant="ghost" className="p-0 mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">Payment</h2>
        </div>

        <div className="flex gap-6">
          {/* Left section - Payment form */}
          <Card className="w-1/2 shadow-none border rounded">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">Payment</h3>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  membershipPlanId={membershipPlanId}
                  playerIds={playerIds}
                  parentId={
                    session?.user.role === 'PARENT'
                      ? session?.user?.profileId
                      : undefined
                  }
                />
              </Elements>
            </CardContent>
          </Card>

          {/* Right section - Plan summary */}
          <Card className="w-1/2 shadow-none border rounded">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{plan.name}</h3>

              <div className="mb-4">
                <span className="text-red-500 font-medium">
                  {plan.duration} days
                </span>
              </div>

              <div className="border-t border-b py-8 mb-6">
                <h3 className="text-3xl font-bold">
                  {plan.currency} {plan.price * playerIds.length}
                </h3>
                {playerIds.length > 1 && (
                  <p className="text-sm text-gray-500">
                    ({playerIds.length} players × {plan.currency} {plan.price})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
