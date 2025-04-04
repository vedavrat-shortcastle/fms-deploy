'use client';

import React, { useCallback, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { Toast } from '@/components/ui/toast';
import {
  addMemberSchema,
  AddMemberFormValues,
} from '@/schemas/Membership.schema';
import { sanitizeFields } from '@/utils/sanitize';
import { AddMemberFormConfig } from '@/config/staticFormConfigs';
import { debounce } from 'lodash';

interface MemberFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MemberForm({ onClose, onSuccess }: MemberFormProps) {
  // State for search terms
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [planSearchTerm, setPlanSearchTerm] = useState('');
  const [debouncedPlayerSearch, setDebouncedPlayerSearch] = useState('');
  const [debouncedPlanSearch, setDebouncedPlanSearch] = useState('');

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

  // Create debounced search functions
  const debouncedPlayerSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedPlayerSearch(value);
    }, 300),
    []
  );

  const debouncedPlanSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedPlanSearch(value);
    }, 300),
    []
  );

  // Handler for player search input
  const handlePlayerSearchChange = (value: string) => {
    setPlayerSearchTerm(value);
    debouncedPlayerSearchHandler(value);
  };

  // Handler for plan search input
  const handlePlanSearchChange = (value: string) => {
    setPlanSearchTerm(value);
    debouncedPlanSearchHandler(value);
  };

  // Fetch players for dropdown using debounced search term
  const { data: playersData, isLoading: playersLoading } =
    trpc.player.getPlayers.useQuery({
      page: 1,
      limit: 100,
      searchQuery: debouncedPlayerSearch,
    });

  // Fetch subscription plans for dropdown using debounced search term
  const { data: plansData, isLoading: plansLoading } =
    trpc.membership.getPlans.useQuery({
      page: 1,
      limit: 10,
      searchQuery: debouncedPlanSearch,
    });

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
    const extractId = (value: string): string => {
      const parts = value.split('|');
      return parts[1] || parts[0];
    };

    const formattedData = {
      ...formData,
      playerId: extractId(formData.playerId),
      planId: extractId(formData.planId),
      subscriptionType: extractId(formData.subscriptionType),
      paymentMode: formData.paymentMode,
    };

    console.log('Formatted Data:', formattedData);
    await addMemberMutation.mutateAsync(formattedData);
  };

  // Format all available plans for dropdown (combining active and inactive plans)
  const availablePlans = React.useMemo(() => {
    if (!plansData) return [];

    const allPlans = [
      ...(plansData.activePlans || []),
      ...(plansData.inactivePlans || []),
    ];

    // Format: "Plan name (price currency)|id"
    return allPlans.map(
      (plan) => `${plan.name} (${plan.price} ${plan.currency})|${plan.id}`
    );
  }, [plansData]);

  // Format player data for dropdown
  const availablePlayers = React.useMemo(() => {
    if (!playersData?.players) return [];

    return playersData.players.map(
      (player) =>
        `${player.email || ''} (${player.firstName} ${player.lastName})|${player.profile?.profileId}`
    );
  }, [playersData]);

  // Override dynamic options in the imported form configuration
  const dynamicFormConfig = React.useMemo(() => {
    return {
      id: 'add-member-form',
      isActive: true,
      fields: sanitizeFields(
        AddMemberFormConfig.map((field) => {
          if (field.fieldName === 'playerId') {
            return {
              ...field,
              validations: {
                ...field.validations,
                options: availablePlayers,
              },
              isDisabled: playersLoading,
              // Add search capability for players
              onSearchChange: handlePlayerSearchChange,
              searchValue: playerSearchTerm,
            };
          }
          if (field.fieldName === 'planId') {
            return {
              ...field,
              validations: {
                ...field.validations,
                options: availablePlans,
              },
              isDisabled: plansLoading,
              // Add search capability for plans
              onSearchChange: handlePlanSearchChange,
              searchValue: planSearchTerm,
            };
          }
          return field;
        })
      ),
    };
  }, [
    availablePlayers,
    availablePlans,
    playersLoading,
    plansLoading,
    playerSearchTerm,
    planSearchTerm,
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Member to Plan</h2>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormBuilder config={dynamicFormConfig} control={control} />
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
                    disabled={
                      isSubmitting ||
                      addMemberMutation.isLoading ||
                      playersLoading ||
                      plansLoading ||
                      availablePlans.length === 0 ||
                      availablePlayers.length === 0
                    }
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
