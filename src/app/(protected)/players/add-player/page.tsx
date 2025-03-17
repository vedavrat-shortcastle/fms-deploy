'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

import { PageHeader } from '@/components/layouts/PageHeader';
import Sidebar from '@/components/SideBar';
import { FormContainer } from '@/components/player-components/FormContainer';
import { PersonalInformationForm } from '@/components/player-components/PersonalInfoform';
import MailingAddressForm from '@/components/player-components/MailingAddressform';
import { OtherInfoForm } from '@/components/player-components/OtherInfoform';
import {
  CreatePlayerFormValues,
  createPlayerSchema,
} from '@/schemas/player.schema';
import { trpc } from '@/utils/trpc';

export default function AddPlayerPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'mailing' | 'other'>(
    'personal'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use nested default values with proper Date objects
  const form = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    mode: 'onChange',
    defaultValues: {
      baseUser: {
        email: '',
        password: 'defaultPassw0rd', // default password added here
        firstName: '',
        lastName: '',
        middleName: '',
        nameSuffix: '',
        gender: 'MALE',
      },
      playerDetails: {
        birthDate: new Date(), // Now using null instead of an empty string
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
        gradeDate: null,
        clubName: '',
        clubId: null,
      },
    },
  });

  const { handleSubmit, reset, trigger } = form;

  const createPlayerMutation = trpc.player.createPlayer.useMutation({
    onSuccess: () => {
      reset();
      setActiveTab('personal');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating player:', error);
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
        'baseUser.gender',
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
      await createPlayerMutation.mutateAsync(data);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
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
