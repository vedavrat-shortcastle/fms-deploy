'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { OnboardingFormContainer } from '@/components/player-components/OnboardingFormContainer';
import { FormBuilder } from '@/components/forms/FormBuilder';
import {
  playerOnboardingInput,
  playerOnboardingSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useFormConfig } from '@/hooks/useFormConfig';
import { useTranslation } from 'react-i18next';

type FormSections = 'stepOne' | 'stepTwo';

const FORM_SECTIONS: Record<FormSections, { fields: string[] }> = {
  stepOne: {
    fields: [
      'birthDate',
      'gender',
      'ageProof',
      'streetAddress',
      'streetAddress2',
      'country',
      'state',
      'city',
      'postalCode',
      'phoneNumber',
    ],
  },
  stepTwo: {
    fields: [
      'fideId',
      'schoolName',
      'graduationYear',
      'gradeInSchool',
      'gradeDate',
      'clubName',
      'avatarUrl',
    ],
  },
};

// Utility function to sanitize fields
const sanitizeFields = (fields: any[]) => {
  return fields.map((field) => ({
    ...field,
    defaultValue: field.defaultValue ?? undefined, // Transform null to undefined
    placeholder: (field.placeholder || field.displayName) ?? undefined, // Transform null to undefined
    validations: field.validations ?? undefined, // Transform null to undefined
  }));
};

export default function PlayerOnboarding() {
  const [activeTab, setActiveTab] = useState<'stepOne' | 'stepTwo'>('stepOne');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { config, isLoading: isConfigLoading } = useFormConfig('PLAYER');
  const { t } = useTranslation();

  const form = useForm<playerOnboardingInput>({
    resolver: zodResolver(playerOnboardingSchema),
    mode: 'onChange',
    defaultValues: {
      birthDate: undefined,
      avatarUrl: '',
      ageProof: '',
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      fideId: '',
      schoolName: '',
      graduationYear: undefined,
      gradeInSchool: '',
      gradeDate: undefined,
      clubName: '',
      gender: 'MALE',
    },
  });

  const { handleSubmit, trigger, control, watch } = form;

  // Watch for changes in country and state
  const watchedCountry = watch('country');
  const watchedState = watch('state');

  // Update form with configuration when loaded
  useEffect(() => {
    if (config) {
      const sanitizedFields = sanitizeFields(config.fields);
      const customFields = sanitizedFields
        .filter((field) => field.isCustomField)
        .reduce(
          (acc, field) => ({
            ...acc,
            [field.fieldName]: field.defaultValue ?? undefined,
          }),
          {}
        );

      form.reset({
        ...form.getValues(),
        ...customFields,
      });
    }
  }, [config, form]);

  useEffect(() => {
    if (status === 'loading') {
      return; // Wait for session to load
    }

    if (session?.user?.profileId !== session?.user?.id) {
      router.push('/memberships');
    }
  }, [session?.user?.profileId, session?.user?.id, router, status]);

  // If profileId doesn't match userId, don't render anything (redirect happens in useEffect)
  if (session?.user?.profileId !== session?.user?.id) {
    return null;
  }

  const onboardPlayerMutation = trpc.player.onboardPlayer.useMutation({
    onSuccess: (data) => {
      if (data?.id) {
        update({ user: { ...session?.user, profileId: data.id } });
      }
      router.push('/memberships');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error onboarding player:', error);
      setIsSubmitting(false);
    },
  });

  const validateTab = async (tab: FormSections) => {
    if (!config) return false;

    const fieldsToValidate = config.fields
      .filter((field) => FORM_SECTIONS[tab].fields.includes(field.fieldName))
      .map((field) => field.fieldName);

    return await trigger(fieldsToValidate as any);
  };

  const handleTabChange = async (newTab: FormSections) => {
    const tabOrder = ['stepOne', 'stepTwo'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);

    if (newIndex > currentIndex) {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
    }

    setActiveTab(newTab);
  };

  const handleNext = async () => {
    if (activeTab === 'stepOne') {
      const isValid = await validateTab('stepOne');
      if (isValid) setActiveTab('stepTwo');
    }
  };

  const handleBack = () => {
    if (activeTab === 'stepTwo') setActiveTab('stepOne');
  };

  const onSubmit = async (data: playerOnboardingInput) => {
    setIsSubmitting(true);
    try {
      if (activeTab === 'stepTwo') {
        await onboardPlayerMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  if (isConfigLoading) {
    return <div>{t('playerOnboardingPage_loadingConfig')}</div>;
  }

  const renderFormSection = () => {
    if (!config) return null;

    const getFieldsForSection = (section: FormSections) => {
      const sanitizedFields = sanitizeFields(config.fields);
      const fields = sanitizedFields.filter((field) =>
        section === 'stepTwo'
          ? FORM_SECTIONS[section].fields.includes(field.fieldName) ||
            field.isCustomField
          : FORM_SECTIONS[section].fields.includes(field.fieldName)
      );

      return fields.map((field) => ({
        ...field,
        dependentValue: {
          country: watchedCountry,
          state: watchedState,
        },
      }));
    };

    const sectionFields = getFieldsForSection(activeTab);

    return (
      <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {activeTab === 'stepOne' &&
            t('playerOnboardingPage_personalInformation')}
          {activeTab === 'stepTwo' &&
            t('playerOnboardingPage_otherInformation')}
        </h3>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-2">
          {sectionFields.map((field) => (
            <FormBuilder
              key={field.id}
              config={{
                ...config,
                fields: [field],
              }}
              control={control}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex min-h-svh bg-gray-50">
          <main className="flex-1">
            <PageHeader
              icon={<User size={16} color="white" />}
              title={t('playerOnboardingPage_playerOnboarding')}
            />
            <OnboardingFormContainer
              title={t('playerOnboardingPage_tellUsMore')}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onBack={handleBack}
              onNext={
                activeTab === 'stepTwo' ? handleSubmit(onSubmit) : handleNext
              }
              submitLabel={
                activeTab === 'stepTwo'
                  ? t('playerOnboardingPage_save')
                  : t('playerOnboardingPage_next')
              }
            >
              {renderFormSection()}
            </OnboardingFormContainer>

            {isSubmitting && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-xl">
                    {t('playerOnboardingPage_creatingProfile')}
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </form>
    </FormProvider>
  );
}
