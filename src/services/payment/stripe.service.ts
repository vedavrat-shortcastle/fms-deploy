import { db } from '@/lib/db';
import { PaymentSuccessData } from '@/types/stripe';
import { PaymentStatus, Prisma, SubscriptionStatus } from '@prisma/client';

export class StripeService {
  static async handleMembershipPaymentSuccess(data: PaymentSuccessData) {
    const { paymentIntentId, amount, currency, metadata, paymentMethod } = data;

    const playerIds = metadata.playerIds.split(',');

    return await db.$transaction(async (tx) => {
      // Create subscriptions for all players
      const subscriptions = await Promise.all(
        playerIds.map(async (playerId) => {
          return await tx.subscription.create({
            data: {
              type: 'INDIVIDUAL',
              status: SubscriptionStatus.ACTIVE,
              startDate: new Date(),
              subscriberId: playerId,
              planId: metadata.membershipPlanId,
              federationId: '', // Get from plan
              endDate: new Date(), // Calculate from plan duration
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
          amount,
          currency: currency.toUpperCase(),
          status: PaymentStatus.COMPLETED,
          paymentMethod,
          metadata: metadata as unknown as Prisma.InputJsonValue,
        },
      });

      return { subscriptions, transaction };
    });
  }
}
