'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { AddMemberFormConfig } from '@/config/staticFormConfigs';
import { sanitizeFields } from '@/utils/sanitize';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { Toast } from '@/components/ui/toast';
import {
  addMemberSchema,
  AddMemberFormValues,
} from '@/schemas/Membership.schema';

interface MemberFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MemberForm({ onClose, onSuccess }: MemberFormProps) {
  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    mode: 'onChange',
    defaultValues: {
      playerId: '',
      planId: '',
      subscriptionType: '',
      paymentMode: 'Credit Card',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Use the mutation
  const addMemberMutation = trpc.membership.addMemberSubscription.useMutation({
    onSuccess: () => {
      Toast({
        title: 'Success',
        variant: 'default',
      });

      reset();
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error: any) => {
      console.log(error);
      Toast({
        title: 'Error',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (formData: AddMemberFormValues) => {
    console.log('Member Form Data:', formData);
    await addMemberMutation.mutateAsync(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Member to Plan</h2>
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
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting || addMemberMutation.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || addMemberMutation.isLoading}
                  >
                    {isSubmitting || addMemberMutation.isLoading
                      ? 'Adding...'
                      : 'Add Member'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
