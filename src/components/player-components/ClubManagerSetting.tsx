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
const baseUserFields = [
  'id',
  'email',
  'firstName',
  'lastName',
  'middleName',
  'nameSuffix',
  'phoneNumber',
];

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

  const watchCountry = watch('clubDetails.country');
  const watchState = watch('clubDetails.state');
  // Fetch form configuration using the custom hook
  const { config, isLoading: isConfigLoading } = useFormConfig('CLUB');

  // Fetch clubManage details using tRPC
  const { data, error, isLoading, refetch } = trpc.club.getProfile.useQuery(
    undefined,
    { enabled: !!clubManagerId }
  );

  // Map clubManage data similar to the player implementation
  const mapClubManagerData = (data: any): EditClubManagerFormValues => ({
    clubManagerDetails: {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName ?? '',
      nameSuffix: data.nameSuffix ?? '',
      phoneNumber: data.phoneNumber ?? '',
    },
    clubDetails: {
      name: data.name,
      streetAddress: data.streetAddress || '',
      streetAddress2: data.streetAddress2 || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      country: data.country || '',
    },
  });

  useEffect(() => {
    if (data) {
      const mappedClubManager = mapClubManagerData(data);
      reset(mappedClubManager);
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
        title: t('clubManagerSettingsPage_error'),
        description: t('clubManagerSettingsPage_missingclubManageId'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const updatedFormData = {
      clubManagerDetails: {
        ...formData.clubManagerDetails,
        id: clubManagerId,
      },
      clubDetails: {
        ...formData.clubDetails,
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
    if (data) reset(mapClubManagerData(data));
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
          ? 'clubManagerDetails'
          : 'clubDetails',
        dependentValue: {
          country: watchCountry,
          state: watchState,
        },
      }))
    );

    const baseUserFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'clubManagerDetails'
    );
    const clubManageDetailsFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'clubDetails'
    );

    return (
      <div className="space-y-6">
        <div className="mb-6 p-4 border border-current">
          <h2 className="text-lg font-semibold mb-4">
            {t('Club Manager Details')}
          </h2>
          <FormBuilder
            config={{
              ...config,
              fields: baseUserFieldsConfig,
            }}
            control={control}
            basePrefix="clubManagerDetails." // Pass correct prefix for baseUser fields
          />
        </div>
        <div className="mt-6 p-4 border border-current">
          <h2 className="text-lg font-semibold mb-4">{t('Club Details')}</h2>
          <FormBuilder
            config={{
              ...config,
              fields: clubManageDetailsFieldsConfig,
            }}
            control={control}
            basePrefix="clubDetails." // Pass correct prefix for clubManagerDetails fields
          />
        </div>
      </div>
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
            {t('clubManagerSettingsPage_back')}
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
                  {t('clubManagerSettingsPage_cancel')}
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('clubManagerSettingsPage_saving')
                    : t('clubManagerSettingsPage_saveChanges')}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <Button variant="outline" onClick={handleEditToggle}>
                  {t('clubManagerSettingsPage_editDetails')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
