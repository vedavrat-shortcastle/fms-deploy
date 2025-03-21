// server/routers/payment.ts
import { z } from 'zod';
import Stripe from 'stripe';
import { router, publicProcedure } from '../trpc';

// Initialize Stripe with your secret key and API version.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export const paymentRouter = router({
  // Define a procedure to create a PaymentIntent.
  createPaymentIntent: publicProcedure
    .input(z.object({ amount: z.number().min(1) }))
    .mutation(async ({ input }) => {
      const { amount } = input;

      // Create a PaymentIntent with Stripe.
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      return { clientSecret: paymentIntent.client_secret };
    }),
});
