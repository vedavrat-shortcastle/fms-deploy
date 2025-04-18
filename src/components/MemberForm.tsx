'use client';

import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { Toast } from '@/components/ui/toast';
import {
  addMemberSchema,
  AddMemberFormValues,
} from '@/schemas/Membership.schema';
import MemberFormFields from '@/components/MemberFormFields';

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
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Use the mutation
  const addMemberMutation = trpc.membership.addMemberSubscription.useMutation({
    onSuccess: () => {
      // First reset the form
      reset();

      // Then close the dialog
      if (onClose) onClose();

      // Then show toast and call onSuccess callback
      setTimeout(() => {
        Toast({
          title: 'Success',
          variant: 'default',
        });
        if (onSuccess) onSuccess();
      }, 10);
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
    console.log('Formatted Data:', formData);
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
                <MemberFormFields />
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
