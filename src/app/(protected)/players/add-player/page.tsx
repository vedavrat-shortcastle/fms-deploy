'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { FormContainer } from '@/components/player-components/FormContainer';
import { FormBuilder } from '@/components/forms/FormBuilder';
import {
  CreatePlayerFormValues,
  createPlayerSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useFormConfig } from '@/hooks/useFormConfig';
import { useTranslation } from 'react-i18next';

type FormSections = 'personal' | 'mailing' | 'other';

type FieldPrefix = 'baseUser' | 'playerDetails';

const FORM_SECTIONS: Record<
  FormSections,
  { fields: string[]; prefix: Record<string, FieldPrefix> }
> = {
  personal: {
    fields: [
      'firstName',
      'lastName',
      'middleName',
      'birthDate',
      'gender',
      'email',
      'avatarUrl',
      'ageProof',
    ],
    prefix: {
      firstName: 'baseUser',
      lastName: 'baseUser',
      middleName: 'baseUser',
      email: 'baseUser',
      birthDate: 'playerDetails',
      gender: 'playerDetails',
      avatarUrl: 'playerDetails',
      ageProof: 'playerDetails',
    },
  },
  mailing: {
    fields: [
      'streetAddress',
      'streetAddress2',
      'country',
      'state',
      'city',
      'postalCode',
      'phoneNumber',
    ],
    prefix: {
      streetAddress: 'playerDetails',
      streetAddress2: 'playerDetails',
      country: 'playerDetails',
      state: 'playerDetails',
      city: 'playerDetails',
      postalCode: 'playerDetails',
      phoneNumber: 'playerDetails',
    },
  },
  other: {
    fields: [
      'fideId',
      'schoolName',
      'graduationYear',
      'gradeInSchool',
      'gradeDate',
      'clubName',
    ],
    prefix: {
      fideId: 'playerDetails',
      schoolName: 'playerDetails',
      graduationYear: 'playerDetails',
      gradeInSchool: 'playerDetails',
      gradeDate: 'playerDetails',
      clubName: 'playerDetails',
    },
  },
} as const;
// Utility function to sanitize fields
const sanitizeFields = (fields: any[]) => {
  return fields.map((field) => ({
    ...field,
    defaultValue: field.defaultValue ?? undefined, // Transform null to undefined
    placeholder: (field.placeholder || field.displayName) ?? undefined, // Transform null to undefined
    validations: field.validations ?? undefined, // Transform null to undefined
  }));
};

export default function AddPlayerPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'mailing' | 'other'>(
    'personal'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { config, isLoading: isConfigLoading } = useFormConfig('PLAYER');
  const { t } = useTranslation();

  const form = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    mode: 'onChange',
    defaultValues: {
      baseUser: {
        email: '',
        password: 'password',
        firstName: '',
        lastName: '',
        middleName: '',
        nameSuffix: '',
      },
      playerDetails: {
        birthDate: undefined,
        gender: 'MALE',
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
      },
    },
  });

  const { handleSubmit, reset, trigger, control, watch } = form;

  // Watch for changes in country and state
  const watchCountry = watch('playerDetails.country');
  const watchState = watch('playerDetails.state');

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
        playerDetails: {
          ...form.getValues().playerDetails,
          ...customFields,
        },
      });
    }
  }, [config]);

  const createPlayerMutation = trpc.federation.createPlayer.useMutation({
    onSuccess: () => {
      reset();
      router.push('/players');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating player:', error);
      setIsSubmitting(false);
    },
  });

  const addPlayerMutation = trpc.parent.addPlayer.useMutation({
    onSuccess: () => {
      reset();
      router.push('/players');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error adding player for parent:', error);
      setIsSubmitting(false);
    },
  });

  const validateTab = async (tab: FormSections) => {
    if (!config) return false;

    const fieldsToValidate = config.fields
      .filter((field) => FORM_SECTIONS[tab].fields.includes(field.fieldName))
      .map((field) => {
        const prefix = FORM_SECTIONS[tab].prefix[field.fieldName];
        return `${prefix}.${field.fieldName}`;
      });

    return await trigger(fieldsToValidate as (keyof CreatePlayerFormValues)[]);
  };

  const handleTabChange = async (newTab: FormSections) => {
    const tabOrder = ['personal', 'mailing', 'other'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    if (newIndex > currentIndex) {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
    }
    setActiveTab(newTab);
  };

  const handleNext = async () => {
    if (activeTab === 'personal') {
      const isValid = await validateTab('personal');
      if (isValid) setActiveTab('mailing');
    } else if (activeTab === 'mailing') {
      const isValid = await validateTab('mailing');
      if (isValid) setActiveTab('other');
    }
  };

  const handleBack = () => {
    if (activeTab === 'other') setActiveTab('mailing');
    else if (activeTab === 'mailing') setActiveTab('personal');
  };

  const onSubmit = async (data: CreatePlayerFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...data,
        playerDetails: {
          ...data.playerDetails,
        },
      };

      if (session?.user?.role === 'PARENT') {
        await addPlayerMutation.mutateAsync(updatedData);
      } else {
        await createPlayerMutation.mutateAsync(updatedData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  if (isConfigLoading) {
    return <div>{t('addPlayerPage_loadingConfig')}</div>;
  }
  const renderFormSection = () => {
    if (!config) return null;

    const getFieldsForSection = (section: FormSections) => {
      const sanitizedFields = sanitizeFields(config.fields);
      const fields = sanitizedFields.filter((field) =>
        section === 'other'
          ? FORM_SECTIONS[section].fields.includes(field.fieldName) ||
            field.isCustomField
          : FORM_SECTIONS[section].fields.includes(field.fieldName)
      );

      return fields.map((field) => ({
        ...field,
        prefix:
          FORM_SECTIONS[section].prefix[field.fieldName] || 'playerDetails',
        dependentValue: {
          country: watchCountry,
          state: watchState,
        },
      }));
    };

    const sectionFields = getFieldsForSection(activeTab);

    return (
      <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {activeTab === 'personal' && t('addPlayerPage_personalInformation')}
          {activeTab === 'mailing' && t('addPlayerPage_mailingAddress')}
          {activeTab === 'other' && t('addPlayerPage_otherInformation')}
        </h3>

        {sectionFields.map((field) => (
          <FormBuilder
            key={field.id}
            config={{
              ...config,
              fields: [field],
            }}
            control={control}
            basePrefix={`${field.prefix}.`}
          />
        ))}
      </div>
    );
  };
  return (
    <FormProvider {...form}>
      <div className="flex min-h-svh bg-gray-50">
        <main className="flex-1 p-6">
          <PageHeader
            icon={<User size={16} color="white" />}
            title={t('addPlayerPage_players')}
          />
          <FormContainer
            title={t('addPlayerPage_addPlayer')}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBack={handleBack}
            onNext={activeTab === 'other' ? handleSubmit(onSubmit) : handleNext}
            submitLabel={
              activeTab === 'other'
                ? t('addPlayerPage_save')
                : t('addPlayerPage_next')
            }
          >
            {renderFormSection()}
          </FormContainer>

          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-xl">{t('addPlayerPage_creatingPlayer')}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </FormProvider>
  );
}
