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
import { addPlayerSchema, AddPlayerFormData } from '@/schemas/addplayer.schema';

export default function AddPlayerPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'mailing' | 'other'>(
    'personal'
  );

  const methods = useForm<AddPlayerFormData>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: {
      personal: {
        firstName: '',
        middleName: '',
        lastName: '',
        nameSuffix: '',
        birthDate: '',
        gender: 'Male',
        email: '',
        photo: null,
        ageProof: null,
      },
      mailing: {
        streetAddress: '',
        streetAddressLine2: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
      },
      other: {
        fideId: '',
        schoolName: '',
        graduationYear: '',
        grade: '',
        gradeAsOf: '',
        clubName: '',
      },
    },
  });

  const { handleSubmit, reset } = methods;

  // Tab Navigation Handlers
  const handleTabChange = (newTab: 'personal' | 'mailing' | 'other') => {
    setActiveTab(newTab);
  };

  const handleNext = () => {
    if (activeTab === 'personal') setActiveTab('mailing');
    else if (activeTab === 'mailing') setActiveTab('other');
  };

  const handleBack = () => {
    if (activeTab === 'other') setActiveTab('mailing');
    else if (activeTab === 'mailing') setActiveTab('personal');
  };

  const onSubmit = (data: AddPlayerFormData) => {
    console.log('Final form submission:', data);
    // Here you can make an API call or process the data
    reset();
    setActiveTab('personal');
  };

  return (
    <FormProvider {...methods}>
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
