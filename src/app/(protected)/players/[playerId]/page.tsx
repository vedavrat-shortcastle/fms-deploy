'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/useToast';
import { DeleteConfirmDialog } from '@/components/deleteConfirmDialog';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { useFormConfig } from '@/hooks/useFormConfig';
import {
  EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/Player.schema';
import {
  baseUserFields,
  mapPlayerData,
} from '@/app/(protected)/players/[playerId]/PlayerDataMapping';

const sanitizeFields = (fields: any[]) =>
  fields.map((field) => ({
    ...field,
    defaultValue: field.defaultValue ?? undefined,
    placeholder: field.placeholder ?? undefined,
    validations:
      typeof field.validations === 'object' && !Array.isArray(field.validations)
        ? field.validations
        : undefined,
  }));

export default function PlayerDetails() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const { playerId } = useParams<{ playerId: string }>();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<EditPlayerFormValues>({
    resolver: zodResolver(editPlayerSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, control } = form;

  const { config, isLoading: isConfigLoading } = useFormConfig('PLAYER');
  const isParent = sessionData?.user?.role === 'PARENT';

  const {
    data: playerData,
    error,
    isLoading,
    refetch,
  } = isParent
    ? trpc.parent.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      )
    : trpc.player.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      );

  const editPlayerMutation = isParent
    ? trpc.parent.editPlayerById.useMutation({
        onSuccess: () => handleMutationSuccess(),
        onError: (error) => handleMutationError(error, 'update'),
      })
    : trpc.player.editPlayerById.useMutation({
        onSuccess: () => handleMutationSuccess(),
        onError: (error) => handleMutationError(error, 'update'),
      });

  const deletePlayerMutation = isParent
    ? trpc.parent.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => handleMutationError(error, 'delete'),
      })
    : trpc.player.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => handleMutationError(error, 'delete'),
      });

  const handleMutationSuccess = () => {
    setIsEditing(false);
    refetch();
    setIsSubmitting(false);
    toast({
      title: 'Success',
      description: 'Player details updated successfully!',
      variant: 'default',
    });
  };

  const handleMutationError = (error: any, action: 'update' | 'delete') => {
    console.error(`Failed to ${action} player:`, error.message);
    setIsSubmitting(false);
    if (action === 'delete') setShowDeleteConfirm(false);
    toast({
      title: 'Error',
      description: `Failed to ${action} player: ${error.message}`,
      variant: 'destructive',
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (playerData) reset(mapPlayerData(playerData));
  };

  const handleDelete = () => {
    setIsSubmitting(true);
    deletePlayerMutation.mutate({ id: playerId });
  };

  const onSubmit = (formData: EditPlayerFormValues) => {
    setIsSubmitting(true);
    editPlayerMutation.mutate(formData);
  };

  useEffect(() => {
    if (playerData) {
      reset(mapPlayerData(playerData));
    }
    if (error) {
      toast({
        title: 'Error',
        description: `Error fetching player details: ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [playerData, error, reset]);

  const renderFormFields = () => {
    if (!config?.fields) return null;

    const sanitizedFields = sanitizeFields(
      config.fields.map((field) => ({
        ...field,
        prefix: baseUserFields.includes(field.fieldName)
          ? 'baseUser'
          : 'playerDetails',
        dependentValue: {
          country: form.getValues('playerDetails.country'),
          state: form.getValues('playerDetails.state'),
        },
      }))
    );

    const baseUserFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'baseUser'
    );
    const playerDetailsFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'playerDetails'
    );

    return (
      <>
        <FormBuilder
          config={{
            ...config,
            fields: baseUserFieldsConfig,
          }}
          control={control}
          basePrefix="baseUser." // Pass correct prefix for baseUser fields
        />
        <FormBuilder
          config={{
            ...config,
            fields: playerDetailsFieldsConfig,
          }}
          control={control}
          basePrefix="playerDetails." // Pass correct prefix for playerDetails fields
        />
      </>
    );
  };

  if (isLoading || isConfigLoading) {
    return (
      <div className="flex min-h-svh justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="flex min-h-svh bg-[#f6f6f6]">
        <div className="flex-1 p-8">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push('/players')}
            disabled={isSubmitting}
          >
            Player
          </Button>
          <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
            {renderFormFields()}
            <div className="flex justify-end gap-4">
              {isEditing && (
                <Button variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleEditToggle} disabled={isSubmitting}>
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>
        </div>

        <DeleteConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={handleDelete}
          isSubmitting={isSubmitting}
          playerName={`${playerData?.firstName || ''} ${
            playerData?.lastName || ''
          }`}
        />
      </div>
    </FormProvider>
  );
}
