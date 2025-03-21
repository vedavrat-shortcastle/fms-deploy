// app/payment/page.tsx
'use client';

import { ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Sidebar from '@/components/SideBar';
import CheckoutForm from '@/app/(protected)/memberships-payment/CheckoutForm';
import { Toaster } from '@/components/ui/toaster';
import { useSession } from 'next-auth/react'; // import useSession from next-auth

// Replace with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  // Get session data using next-auth hook
  const { data: session } = useSession();

  // Optionally, define default/fallback values if session is not available
  const firstName = session?.user.firstName || 'Unknown';
  const lastName = session?.user.lastName || '';
  const userEmail = session?.user?.email || 'unknown@example.com';

  return (
    <div className="flex h-screen">
      <Sidebar />

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
                <CheckoutForm />
              </Elements>
            </CardContent>
          </Card>

          {/* Right section - Plan summary */}
          <Card className="w-1/2 shadow-none border rounded">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Youth Annual Plan</h3>

              <div className="mb-4">
                <span className="text-red-500 font-medium">Year</span>
              </div>

              <div className="border-t border-b py-8 mb-6">
                <h3 className="text-3xl font-bold">$ 29.00</h3>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Player details</h4>

                <div className="bg-gray-50 p-6 rounded">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">FirstName</p>
                      <p className="font-medium">{firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">LastName</p>
                      <p className="font-medium">{lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email ID</p>
                      <p className="font-medium">{userEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
