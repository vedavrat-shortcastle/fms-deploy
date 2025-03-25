'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { FormContainer } from '@/components/player-components/FormContainer';
import { PersonalInformationForm } from '@/components/player-components/PersonalInfoform';
import MailingAddressForm from '@/components/player-components/MailingAddressform';
import { OtherInfoForm } from '@/components/player-components/OtherInfoform';
import {
  CreatePlayerFormValues,
  createPlayerSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import { Country, State } from 'country-state-city';
import { useRouter } from 'next/navigation';

export default function AddPlayerPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'mailing' | 'other'>(
    'personal'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const form = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    mode: 'onChange',
    defaultValues: {
      baseUser: {
        email: '',
        password: 'arunsrinivaas',
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
        countryCode: '',
        fideId: '',
        schoolName: '',
        graduationYear: undefined,
        gradeInSchool: '',
        gradeDate: undefined,
        clubName: '',
      },
    },
  });

  const { handleSubmit, reset, trigger } = form;
  const router = useRouter();
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

  // Mutation for adding a player for a parent user
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

  // Validate fields for each tab using nested paths
  const validateTab = async (tab: 'personal' | 'mailing' | 'other') => {
    let isValid = true;
    if (tab === 'personal') {
      isValid = await trigger([
        'baseUser.firstName',
        'baseUser.lastName',
        'baseUser.email',
        'playerDetails.gender',
        'playerDetails.birthDate',
        'playerDetails.ageProof',
      ]);
    } else if (tab === 'mailing') {
      isValid = await trigger([
        'playerDetails.streetAddress',
        'playerDetails.country',
        'playerDetails.state',
        'playerDetails.city',
        'playerDetails.postalCode',
        'playerDetails.phoneNumber',
        'playerDetails.countryCode',
      ]);
    }
    return isValid;
  };

  const handleTabChange = async (newTab: 'personal' | 'mailing' | 'other') => {
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
      // Check if the current user's role is "PARENT"
      const updatedData = {
        ...data,
        playerDetails: {
          ...data.playerDetails,
          country:
            Country.getCountryByCode(data.playerDetails.country)?.name || '',
          state: State.getStateByCode(data.playerDetails.state)?.name || '',
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
  return (
    <FormProvider {...form}>
      <div className="flex min-h-svh bg-gray-50">
        <main className="flex-1 p-6">
          <PageHeader icon={<User size={16} color="white" />} title="Players" />
          <FormContainer
            title="Add Player"
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onBack={handleBack}
            onNext={activeTab === 'other' ? handleSubmit(onSubmit) : handleNext}
            submitLabel={activeTab === 'other' ? 'Save' : 'Next'}
          >
            {activeTab === 'personal' && <PersonalInformationForm />}
            {activeTab === 'mailing' && <MailingAddressForm />}
            {activeTab === 'other' && <OtherInfoForm />}
          </FormContainer>

          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-xl">Creating player...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </FormProvider>
  );
}
