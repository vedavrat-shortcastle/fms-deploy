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
} from '@/schemas/Player.schema';

// Define the tab order for navigation
const tabOrder: Array<'personal' | 'mailing' | 'other'> = [
  'personal',
  'mailing',
  'other',
];

export default function AddPlayerPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'mailing' | 'other'>(
    'personal'
  );

  const form = useForm<CreatePlayerFormValues>({
    resolver: zodResolver(createPlayerSchema),
    mode: 'onChange', // Validate on every change for instant feedback
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      nameSuffix: '',
      birthDate: '',
      gender: 'MALE',
      email: '',
      ageProof: undefined,
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      fideId: '',
      schoolName: '',
      graduationYear: NaN,
      gradeInSchool: '',
      gradeDate: new Date(),
      clubName: '',
    },
  });

  const { handleSubmit, reset } = form;

  // When manually switching tabs, validate the current tab if moving forward.
  const handleTabChange = async (newTab: 'personal' | 'mailing' | 'other') => {
    const currentTabIndex = tabOrder.indexOf(activeTab);
    const newTabIndex = tabOrder.indexOf(newTab);
    // Only validate if moving forward
    if (newTabIndex > currentTabIndex) {
      // const valid = await trigger(activeTab); //TODO: Update this setup to match new structure
      // if (!valid) return; // Block navigation if current tab is invalid.
    }
    setActiveTab(newTab);
  };

  // Next button: validate current tab and move forward if valid.
  const handleNext = async () => {
    // const valid = await trigger(activeTab); //TODO: Update this setup to match new structure
    // if (!valid) return;
    if (activeTab === 'personal') setActiveTab('mailing');
    else if (activeTab === 'mailing') setActiveTab('other');
  };

  // Allow moving back freely.
  const handleBack = () => {
    if (activeTab === 'other') setActiveTab('mailing');
    else if (activeTab === 'mailing') setActiveTab('personal');
  };

  // Final submission of the form.
  const onSubmit = (data: CreatePlayerFormValues) => {
    console.log('Final form submission:', data);
    // Here you can call your API or process the data.
    reset();
    setActiveTab('personal');
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
        </main>
      </div>
    </FormProvider>
  );
}
