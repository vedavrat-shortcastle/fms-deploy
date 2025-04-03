'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const dateParam = searchParams ? searchParams.get('date') : null;
  const orderId = searchParams ? searchParams.get('orderId') : null; // Retrieve order id from query
  const amount = searchParams ? searchParams.get('amount') : null;
  const { t } = useTranslation();

  // Format the date for display, e.g., "March 27, 2025"
  const formattedDate = new Date(dateParam || new Date()).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  // Format the amount (default to $149.99 if missing)
  const formattedAmount = amount ? `$${parseFloat(amount).toFixed(2)}` : ''; // TODO : remove the harcoded $ currency value and replace with a call to api.

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md border border-green-300 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2 pt-6 text-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-500">
            {t('paymentSuccessPage_paymentSuccessful')}
          </h1>
          <p className="text-sm text-muted-foreground text-green-600 pb-5">
            {t('paymentSuccessPage_paymentProcessed')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('paymentSuccessPage_orderId')}
              </span>
              <span className="font-medium">
                {orderId
                  ? `${t('paymentSuccessPage_orderIdPrefix')}${orderId}`
                  : `${t('paymentSuccessPage_orderIdPrefix')}${t(
                      'paymentSuccessPage_unknown'
                    )}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('paymentSuccessPage_date')}
              </span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t('paymentSuccessPage_paymentMethod')}
              </span>
              {/* TODO : remove the hardcoded card value and replace with card details from api */}
              <span className="font-medium">
                {t('paymentSuccessPage_creditCard')}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between font-medium">
              <span>{t('paymentSuccessPage_totalAmount')}</span>
              <span className="text-lg">{formattedAmount}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 px-6 pb-6">
          <Button asChild className="w-full">
            <Link href="/players">{t('paymentSuccessPage_goToDashboard')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
