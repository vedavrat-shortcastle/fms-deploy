'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { trpc } from '@/utils/trpc';
import Toast from '@/app/(protected)/memberships-payment/Toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type FormData = {
  email: string;
  name: string;
  country: string;
  address: string;
};

interface CheckoutFormProps {
  membershipPlanId: string;
  playerIds: string[];
  parentId?: string;
}

const CheckoutForm = ({
  membershipPlanId,
  playerIds,
  parentId,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t } = useTranslation();

  const { mutateAsync: createPaymentIntent } =
    trpc.payment.createMembershipPayment.useMutation();
  const { mutateAsync: confirmPayment } =
    trpc.payment.confirmMembershipPayment.useMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      name: '',
      country: 'us',
      address: '',
    },
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Helper to show a toast and hide it after 3 seconds
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data: FormData) => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent({
        membershipPlanId,
        playerIds,
        parentId,
      });
      if (!clientSecret) {
        throw new Error('Missing clientSecret from PaymentIntent');
      }

      // Get CardElement instance
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      // Confirm the card payment using Stripe.
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: data.email,
              name: data.name,
              address: {
                line1: data.address,
                country: data.country,
              },
            },
          },
        }
      );

      if (error) {
        console.error('Payment failed:', error);
        showToast(t('checkoutFormPage_paymentFailed'), 'error');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        const result = await confirmPayment({
          paymentIntentId: paymentIntent.id,
          membershipPlanId,
          playerIds,
          parentId,
        });
        showToast(t('checkoutFormPage_paymentSucceeded'), 'success');

        // Extract the order id from the transaction record
        const orderId = result.transaction.id;
        const amount = result.transaction.amount;
        // Extract the transaction date from the result (createdAt field)
        const transactionDate = new Date(
          result.transaction.createdAt
        ).toISOString();

        showToast(t('checkoutFormPage_paymentSucceeded'), 'success');
        // Redirect to the success page and pass the transaction date via query parameter
        router.push(
          `/memberships-payment/success?date=${encodeURIComponent(transactionDate)}&orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(amount)}`
        );
      }
    } catch (err) {
      console.error('Error creating PaymentIntent:', err);
      showToast(t('checkoutFormPage_anErrorOccurred'), 'error');
    }
    setIsProcessing(false);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-sm font-normal block mb-2">
              {t('checkoutFormPage_email')}
            </Label>
            <Input
              id="email"
              className="border rounded w-full"
              {...register('email', {
                required: t('checkoutFormPage_emailRequired'),
              })}
            />
            {errors.email && (
              <p className="text-primary text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Card Input */}
          <div>
            <Label htmlFor="card" className="text-sm font-normal block mb-2">
              {t('checkoutFormPage_cardInfo')}
            </Label>
            <div className="border rounded w-full mb-2 p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': { color: '#aab7c4' },
                    },
                    invalid: { color: '#9e2146' },
                  },
                }}
              />
            </div>
          </div>

          {/* Name on Card Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-normal block mb-2">
              {t('checkoutFormPage_nameOnCard')}
            </Label>
            <Input
              id="name"
              className="border rounded w-full"
              {...register('name', {
                required: t('checkoutFormPage_nameRequired'),
              })}
            />
            {errors.name && (
              <p className="text-primary text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Billing Address */}
          <div>
            <Label htmlFor="country" className="text-sm font-normal block mb-2">
              {t('checkoutFormPage_billingAddress')}
            </Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="country"
                    className="border rounded w-full mb-2"
                  >
                    <SelectValue
                      placeholder={t('checkoutFormPage_unitedStates')}
                    />
                  </SelectTrigger>
                  {/* //TODO: Update this to use dynamic options */}
                  <SelectContent>
                    <SelectItem value="us">
                      {t('checkoutFormPage_unitedStates')}
                    </SelectItem>
                    <SelectItem value="nz">
                      {t('checkoutFormPage_newZealand')}
                    </SelectItem>
                    <SelectItem value="uk">
                      {t('checkoutFormPage_unitedKingdom')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              className="border rounded w-full mb-2"
              placeholder={t('checkoutFormPage_address')}
              {...register('address', {
                required: t('checkoutFormPage_addressRequired'),
              })}
            />
            {errors.address && (
              <p className="text-primary text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-red-700 text-white"
            disabled={isProcessing || !stripe}
          >
            {isProcessing
              ? t('checkoutFormPage_processing')
              : t('checkoutFormPage_pay')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
