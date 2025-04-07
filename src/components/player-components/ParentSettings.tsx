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
import {
  type EditParentFormValues,
  editParentSchema,
} from '@/schemas/Parent.schema';
import { useTranslation } from 'react-i18next';
import { SupportedLanguages } from '@prisma/client';

// Define base user fields similar to the player implementation
const baseUserFields = ['id', 'email', 'firstName', 'lastName'];

export default function ParentSettings() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const parentId = session?.user.id;
  const { toast } = useToast();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the FormProvider from react-hook-form
  const methods = useForm<EditParentFormValues>({
    resolver: zodResolver(editParentSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, control, watch } = methods;

  const watchCountry = watch('parentDetails.country');
  const watchState = watch('parentDetails.state');
  // Fetch form configuration using the custom hook
  const { config, isLoading: isConfigLoading } = useFormConfig('PARENT');

  // Fetch parent details using tRPC
  const { data, error, isLoading, refetch } =
    trpc.parent.getParentById.useQuery(
      { id: parentId! },
      { enabled: !!parentId }
    );

  // Map parent data similar to the player implementation
  const mapParentData = (data: any): EditParentFormValues => ({
    baseUser: {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    parentDetails: {
      streetAddress: data.streetAddress || '',
      streetAddress2: data.streetAddress2 || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      country: data.country || '',
      phoneNumber: data.phoneNumber ?? '',
    },
    parentUserProfile: {
      language: data.language || SupportedLanguages.en,
    },
  });

  useEffect(() => {
    if (data) {
      const mappedParent = mapParentData(data);
      reset(mappedParent);
    }
    if (error) {
      console.error('Error fetching parent details:', error);
      toast({
        title: t('parentSettingsPage_error'),
        description: `${t('parentSettingsPage_errorFetchingDetails')} ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [data, error, reset, toast, t]);

  // Mutation for editing parent details
  const editParentMutation = trpc.parent.editParentById.useMutation({
    onSuccess: async (data) => {
      const newLang = data?.parentUserProfile.language;
      const isRtl = data?.parentUserProfile.isRtl;
      await update({
        user: {
          ...session?.user,
          language: newLang,
          isRtl: isRtl,
        },
      });

      setIsEditing(false);
      refetch();

      toast({
        title: t('parentSettingsPage_success'),
        description: t('parentSettingsPage_detailsUpdated'),
        variant: 'default',
      });
      setIsSubmitting(false);
      router.refresh();
    },
    onError: (err: any) => {
      console.error('Failed to update parent details:', err.message);
      setIsSubmitting(false);
      toast({
        title: t('parentSettingsPage_error'),
        description: `${t('parentSettingsPage_failedToUpdate')} ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (formData: EditParentFormValues) => {
    console.log('data submitted', formData);
    setIsSubmitting(true);
    if (!parentId) {
      toast({
        title: t('parentSettingsPage_error'),
        description: t('parentSettingsPage_missingParentId'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const updatedFormData = {
      baseUser: {
        ...formData.baseUser,
        id: parentId,
      },
      parentDetails: {
        ...formData.parentDetails,
      },
      parentUserProfile: {
        language: formData.parentUserProfile.language,
      },
    };

    editParentMutation.mutate(updatedFormData);
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
    if (data) reset(mapParentData(data));
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
          : field.fieldName === 'language'
            ? 'parentUserProfile'
            : 'parentDetails',
        dependentValue: {
          country: watchCountry,
          state: watchState,
        },
      }))
    );

    const baseUserFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'baseUser'
    );
    const parentDetailsFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'parentDetails'
    );
    const parentUserProfileFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'parentUserProfile'
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
            fields: parentDetailsFieldsConfig,
          }}
          control={control}
          basePrefix="parentDetails." // Pass correct prefix for parentDetails fields
        />
        <FormBuilder
          config={{
            ...config,
            fields: parentUserProfileFieldsConfig,
          }}
          control={control}
          basePrefix="parentUserProfile." // Pass correct prefix for parentUserProfile fields
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
            onClick={() => router.push('/parents')}
            disabled={isSubmitting}
          >
            {t('parentSettingsPage_back')}
          </Button>

          <div className="bg-white p-6 rounded-lg shadow">
            <fieldset disabled={!isEditing}>{renderFormFields()}</fieldset>
            {/* <LanguagueSwitcher /> Keep the separate language switcher or integrate in FormBuilder */}
            {isEditing ? (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {t('parentSettingsPage_cancel')}
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('parentSettingsPage_saving')
                    : t('parentSettingsPage_saveChanges')}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <Button variant="outline" onClick={handleEditToggle}>
                  {t('parentSettingsPage_editDetails')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
