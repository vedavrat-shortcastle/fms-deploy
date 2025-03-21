export interface StripeMetadata {
  membershipPlanId: string;
  playerIds: string;
  parentId?: string;
  type: 'membership' | 'event';
}

export interface PaymentSuccessData {
  paymentIntentId: string;
  amount: number;
  currency: string;
  metadata: StripeMetadata;
  paymentMethod: string;
}
