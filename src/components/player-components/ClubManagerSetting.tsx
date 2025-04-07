'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';
import { trpc } from '@/utils/trpc';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { useFormConfig } from '@/hooks/useFormConfig';
import { useTranslation } from 'react-i18next';
import LanguagueSwitcher from '@/components/LanguageSwitcher';
import {
  EditClubManagerFormValues,
  editclubManagerSchema,
} from '@/schemas/Club.schema';

// Define base user fields similar to the player implementation
const baseUserFields = ['id', 'email', 'firstName', 'lastName'];

export default function ClubManagerSettings() {
  const session = useSession();
  const router = useRouter();
  const clubManagerId = session.data?.user.id;
  const { toast } = useToast();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the FormProvider from react-hook-form
  const methods = useForm<EditClubManagerFormValues>({
    resolver: zodResolver(editclubManagerSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, control, watch } = methods;

  const watchCountry = watch('clubManagerDetails.country');
  const watchState = watch('clubManagerDetails.state');
  // Fetch form configuration using the custom hook
  const { config, isLoading: isConfigLoading } = useFormConfig('CLUB');
  console.log('config', config);
  // Fetch clubManage details using tRPC
  const { data, error, isLoading, refetch } =
    trpc.club.getClubMangerById.useQuery(
      { id: clubManagerId! },
      { enabled: !!clubManagerId }
    );
  console.log('data', data);

  // Map clubManage data similar to the player implementation
  const mapClubManageData = (data: any): EditClubManagerFormValues => ({
    baseUser: {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    clubManagerDetails: {
      streetAddress: data.streetAddress || '',
      streetAddress2: data.streetAddress2 || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      country: data.country || '',
      phoneNumber: data.phoneNumber ?? '',
    },
  });

  useEffect(() => {
    if (data) {
      const mappedClubManage = mapClubManageData(data);
      reset(mapClubManageData(data));
      console.log('method', mappedClubManage);
    }

    if (error) {
      console.error('Error fetching clubManage details:', error);
      toast({
        title: t('clubManagerSettingsPage_error'),
        description: `${t('clubManagerSettingsPage_errorFetchingDetails')} ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [data, error, reset, toast, t]);

  // Mutation for editing clubManage details
  const editClubManagetMutation = trpc.club.editClubManagerById.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
      toast({
        title: t('clubManagerSettingsPage_success'),
        description: t('clubManagerSettingsPage_detailsUpdated'),
        variant: 'default',
      });
      setIsSubmitting(false);
    },
    onError: (err: any) => {
      console.error('Failed to update club manager details:', err.message);
      setIsSubmitting(false);
      toast({
        title: t('clubManagerSettingsPage_error'),
        description: `${t('clubManagerSettingsPage_failedToUpdate')} ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (formData: EditClubManagerFormValues) => {
    setIsSubmitting(true);
    if (!clubManagerId) {
      toast({
        title: t('clubManageSettingsPage_error'),
        description: t('clubManageSettingsPage_missingclubManageId'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const updatedFormData = {
      baseUser: {
        ...formData.baseUser,
        id: clubManagerId,
      },
      clubManagerDetails: {
        ...formData.clubManagerDetails,
      },
    };

    editClubManagetMutation.mutate(updatedFormData);
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
    if (data) reset(mapClubManageData(data));
  };

  // Sanitize fields similar to the player implementation
  const sanitizeFields = (fields: any[]) =>
    fields.map((field) => ({
      ...field,
      defaultValue: field.defaultValue ?? undefined,
      placeholder: field.placeholder ?? undefined,
      validations:
        typeof field.validations === 'object' &&
        !Array.isArray(field.validations)
          ? field.validations
          : undefined,
    }));

  const renderFormFields = () => {
    if (!config?.fields) return null;

    const sanitizedFields = sanitizeFields(
      config.fields.map((field) => ({
        ...field,
        prefix: baseUserFields.includes(field.fieldName)
          ? 'baseUser'
          : 'clubManagerDetails',
        dependentValue: {
          country: watchCountry,
          state: watchState,
        },
      }))
    );

    const baseUserFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'baseUser'
    );
    const clubManageDetailsFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'clubManagerDetails'
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
            fields: clubManageDetailsFieldsConfig,
          }}
          control={control}
          basePrefix="clubManagerDetails" // Pass correct prefix for clubManageDetails fields
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
    <FormProvider {...methods}>
      <div className="flex min-h-svh bg-[#f6f6f6]">
        <div className="flex-1 p-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/clubManages')}
            disabled={isSubmitting}
          >
            {t('clubManageSettingsPage_back')}
          </Button>

          <div className="bg-white p-6 rounded-lg shadow">
            <fieldset disabled={!isEditing}>{renderFormFields()}</fieldset>
            <LanguagueSwitcher />
            {isEditing ? (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {t('clubManageSettingsPage_cancel')}
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('clubManageSettingsPage_saving')
                    : t('clubManageSettingsPage_saveChanges')}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <Button variant="outline" onClick={handleEditToggle}>
                  {t('clubManageSettingsPage_editDetails')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
