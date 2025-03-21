import { z } from 'zod';
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/config/stripe.config';
import { StripeService } from '@/services/payment/stripe.service';
import { publicProcedure, router } from '@/app/server/trpc';

export const webhookRouter = router({
  stripeWebhook: publicProcedure
    .input(
      z.object({
        payload: z.any(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { payload, signature } = input;

      try {
        const event = stripe.webhooks.constructEvent(
          payload,
          signature,
          STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'payment_intent.succeeded') {
          const paymentIntent = event.data.object;

          if (paymentIntent.metadata.type === 'membership') {
            await StripeService.handleMembershipPaymentSuccess({
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              metadata: {
                membershipPlanId: paymentIntent.metadata.membershipPlanId,
                playerIds: paymentIntent.metadata.playerIds,
                type: paymentIntent.metadata.type,
              },
              paymentMethod: paymentIntent.payment_method?.toString() ?? '',
            });
          }
        }

        return { success: true };
      } catch (err: any) {
        throw new Error(`Webhook Error: ${err.message}`);
      }
    }),
});
