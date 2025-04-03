'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { AddMemberFormConfig } from '@/config/staticFormConfigs';
import { sanitizeFields } from '@/utils/sanitize';
import { Button } from '@/components/ui/button';

// Define a zod schema for the add member form based on the configuration
const addMemberSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
  subscriptionType: z.string().min(1, 'Subscription Type is required'),
  paymentMode: z.enum([
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Wallet',
  ]),
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

interface MemberFormProps {
  onClose: () => void;
}

export default function MemberForm({ onClose }: MemberFormProps) {
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    mode: 'onChange',
  });
  const { control, handleSubmit } = form;

  const onSubmit = (formData: AddMemberFormValues) => {
    console.log('Member Form Data:', formData);
    // TODO: Implement API call or state update here
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
          <div className="p-3">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormBuilder
                  config={{
                    id: 'add-member-form',
                    isActive: true,
                    fields: sanitizeFields(AddMemberFormConfig),
                  }}
                  control={control}
                />
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Member</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
