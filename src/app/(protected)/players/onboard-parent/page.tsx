'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { createParentSchema } from '@/schemas/Parent.schema';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useFormConfig } from '@/hooks/useFormConfig';
import { Button } from '@/components/ui/button';
import { FieldType } from '@prisma/client';
import { useTranslation } from 'react-i18next';

// Define types
interface FormField {
  id: string;
  fieldName: string;
  displayName: string;
  placeholder?: string | null; // Change to accept null
  defaultValue?: any;
  validations?: any;
  isCustomField?: boolean;
  // Add missing fields based on your schema
  fieldType: string; // or the specific type you're using
  isHidden: boolean;
  isMandatory: boolean;
  isDisabled: boolean;
  order: number;
}

type FormSections = 'address';

export default function OnboardParentPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { config, isLoading: isConfigLoading } = useFormConfig('PARENT');
  const { t } = useTranslation();

  // Redirect if user already has a profile
  useEffect(() => {
    if (session?.user?.profileId !== session?.user?.id) {
      router.push('/players');
    }
  }, [session?.user?.profileId, router]);

  // Form setup
  const form = useForm({
    resolver: zodResolver(createParentSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      countryCode: '+1',
    },
  });

  const { handleSubmit, control, setValue, watch, formState } = form;
  const { isSubmitting } = formState;

  // Set default phone country code
  useEffect(() => {
    setValue('countryCode', '+1');
  }, [setValue]);

  // Form sections definition (similar to AddPlayerPage)
  const FORM_SECTIONS: Record<FormSections, { fields: string[] }> = {
    address: {
      fields: [
        'streetAddress',
        'streetAddress2',
        'country',
        'state',
        'city',
        'postalCode',
        'phoneNumber',
      ],
    },
  };

  // Utility function to sanitize fields (from AddPlayerPage)
  const sanitizeFields = (fields: any[]): FormField[] => {
    return fields.map((field) => ({
      ...field,
      defaultValue: field.defaultValue ?? undefined,
      placeholder: field.placeholder ?? undefined, // This will convert null to undefined
      validations: field.validations ?? undefined,
    }));
  };

  // Parent onboarding mutation
  const parentOnboardMutation = trpc.parent.onboardParent.useMutation({
    onSuccess: async (data) => {
      if (data?.id) {
        await update({ user: { ...session?.user, profileId: data.id } });
      }
      router.push('/players');
    },
    onError: (error) => {
      console.error('Error onboarding parent:', error);
    },
  });

  const onSubmit = (data: any) => {
    parentOnboardMutation.mutate(data);
  };

  // Render form fields function (inspired by AddPlayerPage)
  const renderFormSection = () => {
    if (!config) return null;

    const getFieldsForSection = () => {
      const sanitizedFields = sanitizeFields(config.fields);
      const fields = sanitizedFields.filter(
        (field) =>
          FORM_SECTIONS.address.fields.includes(field.fieldName) ||
          field.isCustomField
      );

      return fields.map((field: FormField) => ({
        ...field,
        dependentValue: {
          country: watch('country'),
          state: watch('state'),
        },
      }));
    };

    const sectionFields = getFieldsForSection();

    return (
      <div className="space-y-6 max-w-3xl mx-auto bg-white">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {t('onboardParentPage_contactInformation')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {sectionFields.map((field) => (
            <FormBuilder
              key={field.id}
              config={{
                ...config,
                fields: [
                  {
                    ...field,
                    fieldType: field.fieldType as FieldType,
                    placeholder: field.placeholder ?? undefined,
                    isCustomField: field.isCustomField ?? false,
                  },
                ],
              }}
              control={control}
              basePrefix=""
            />
          ))}
        </div>
      </div>
    );
  };

  if (isConfigLoading) {
    return <div>{t('onboardParentPage_loadingConfig')}</div>;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex min-h-svh bg-gray-50">
          <main className="flex-1">
            <PageHeader
              icon={<User size={16} color="white" />}
              title={t('onboardParentPage_parents')}
            />
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white border rounded-md shadow-lg p-6">
                <h2 className="mb-4 pt-1 text-2xl font-bold bg-red-500 rounded-md text-white border-b pb-2 text-center">
                  {t('onboardParentPage_parentOnboarding')}
                </h2>

                {renderFormSection()}

                <div className="flex justify-end mt-6">
                  <Button
                    variant="destructive"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('onboardParentPage_submitting')
                      : t('onboardParentPage_submit')}
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </form>
    </FormProvider>
  );
}
