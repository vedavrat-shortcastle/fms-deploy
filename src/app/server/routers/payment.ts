import { z } from 'zod';
import { protectedProcedure, router } from '@/app/server/trpc';
import { stripe } from '@/config/stripe.config';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

const membershipPurchaseSchema = z.object({
  membershipPlanId: z.string(),
  playerIds: z.array(z.string()),
  parentId: z.string().optional(),
});

export const paymentRouter = router({
  // Create payment intent for membership purchase
  createMembershipPayment: protectedProcedure
    .input(membershipPurchaseSchema)
    .mutation(async ({ ctx, input }) => {
      const { membershipPlanId, playerIds, parentId } = input;

      // Fetch membership plan
      const plan = await ctx.db.membershipPlan.findUnique({
        where: { id: membershipPlanId },
      });

      if (!plan) {
        throw new Error('Membership plan not found');
      }

      // Calculate total amount (plan price * number of players)
      const amount = plan.price * playerIds.length;

      // Create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: plan.currency.toLowerCase(),
        metadata: {
          membershipPlanId,
          playerIds: playerIds.join(','),
          parentId: parentId ?? null,
          type: 'membership',
        },
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        amount,
        currency: plan.currency,
      };
    }),

  confirmMembershipPayment: protectedProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        membershipPlanId: z.string(),
        playerIds: z.array(z.string()),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { paymentIntentId, membershipPlanId, playerIds, parentId } = input;

      // Verify payment intent status
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      // Get plan details for subscription duration
      const plan = await ctx.db.membershipPlan.findUnique({
        where: { id: membershipPlanId },
      });

      if (!plan) {
        throw new Error('Membership plan not found');
      }

      // Create subscriptions and transaction in a single transaction
      return await ctx.db.$transaction(async (tx) => {
        // Create subscriptions for all players
        const subscriptions = await Promise.all(
          playerIds.map(async (playerId) => {
            return await tx.subscription.create({
              data: {
                type: 'INDIVIDUAL',
                status: SubscriptionStatus.ACTIVE,
                startDate: new Date(),
                endDate: new Date(
                  Date.now() + plan.duration * 24 * 60 * 60 * 1000
                ),
                subscriberId: playerId,
                planId: membershipPlanId,
                federationId: plan.federationId,
              },
            });
          })
        );

        // Create transaction record
        const transaction = await tx.transaction.create({
          data: {
            subscriptionId: subscriptions[0].id,
            gatewayTransactionId: paymentIntentId,
            gatewayName: 'stripe',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            status: PaymentStatus.COMPLETED,
            paymentMethod: paymentIntent.payment_method_types[0],
            gatewayResponse: JSON.stringify(paymentIntent),
            metadata: {
              playerIds,
              parentId,
              membershipPlanId,
            },
          },
        });

        return { subscriptions, transaction };
      });
    }),
});
