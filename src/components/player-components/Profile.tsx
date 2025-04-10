'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { usePlayerApi } from '@/hooks/usePlayerApi';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/useToast';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { sanitizeFields } from '@/utils/sanitize';

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const params = useParams<{ playerId: string }>();
  const playerId = params?.playerId ?? sessionData?.user?.id;
  const role = sessionData?.user?.role ?? 'PLAYER';

  const { fetchPlayer, editPlayer, deletePlayer } = usePlayerApi(role);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<EditPlayerFormValues>({
    resolver: zodResolver(editPlayerSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, control, watch } = form;

  const watchCountry = watch('playerDetails.country');
  const watchState = watch('playerDetails.state');

  const { config, isLoading: isConfigLoading } = useFormConfig('PLAYER');
  const isPlayerViewing =
    role === 'PLAYER' && sessionData?.user?.id === playerId;

  const {
    data: playerData,
    error,
    isLoading,
    refetch,
  } = fetchPlayer({ id: playerId! }, { enabled: !!playerId });

  const editPlayerMutation = editPlayer({
    onSuccess: () => handleMutationSuccess(),
    onError: (error: any) => handleMutationError(error, 'update'),
  });

  const deletePlayerMutation = deletePlayer({
    onSuccess: () => router.push('/players'),
    onError: (error: any) => handleMutationError(error, 'delete'),
  });
  const handleMutationSuccess = () => {
    setIsEditing(false);
    refetch();
    setIsSubmitting(false);
    toast({
      title: t('success'),
      description: t('playerDetailsUpdated'),
      variant: 'default',
    });
  };

  const handleMutationError = (error: any, action: 'update' | 'delete') => {
    console.error(`Failed to ${action} player:`, error.message);
    setIsSubmitting(false);
    if (action === 'delete') setShowDeleteConfirm(false);
    toast({
      title: t('error'),
      description: `${t(`failedTo${action === 'update' ? 'Update' : 'Delete'}Player`)} ${error.message}`,
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
    deletePlayerMutation?.mutate({ id: playerId });
  };

  const onSubmit = (formData: EditPlayerFormValues) => {
    setIsSubmitting(true);
    editPlayerMutation?.mutate(formData);
  };

  useEffect(() => {
    if (playerData) {
      reset(mapPlayerData(playerData));
    }
    if (error) {
      toast({
        title: t('error'),
        description: `${t('errorFetchingPlayerDetails')} ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [playerData, error, reset, t, toast]);

  const renderFormFields = () => {
    if (!config?.fields) return null;

    const sanitizedFields = sanitizeFields(
      config.fields.map((field) => ({
        ...field,
        prefix: baseUserFields.includes(field.fieldName)
          ? 'baseUser'
          : 'playerDetails',
        dependentValue: {
          country: watchCountry,
          state: watchState,
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
          basePrefix="baseUser."
        />
        <FormBuilder
          config={{
            ...config,
            fields: playerDetailsFieldsConfig,
          }}
          control={control}
          basePrefix="playerDetails."
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
        <div className="flex-1 p-8 flex gap-8">
          <div className="w-1/4 flex flex-col items-center">
            <div className="w-full max-w-xs aspect-square rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {playerData?.avatarUrl ? (
                <img
                  src={playerData.avatarUrl}
                  alt="Player Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">{t('noAvatar')}</span>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="default"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                {isEditing ? t('save') : t('edit')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                {t('delete')}
              </Button>
            </div>
          </div>
          <div className="w-3/4 bg-white p-6 rounded-lg shadow">
            <fieldset disabled={!isEditing}>{renderFormFields()}</fieldset>
            {isPlayerViewing && (
              <>
                <LanguageSwitcher />
                {/* 
                //TODO: Implement password change functionality
                <Input
                  type="password"
                  placeholder={t('changePassword')}
                  className="mt-4"
                  disabled={!isEditing}
                  {...form.register('password')}
                /> */}
              </>
            )}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="ghost" onClick={handleCancel}>
                  {t('cancel')}
                </Button>
              </div>
            )}
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
