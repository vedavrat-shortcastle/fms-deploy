'use client';
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

import { PageHeader } from '@/components/layouts/PageHeader';
import Sidebar from '@/components/SideBar';

import { PlayerDetailsStepOne } from '@/components/player-components/OnboardingStepOne';
import { PlayerDetailsStepTwo } from '@/components/player-components/OnboardingStepTwo';
import { OnboardingFormContainer } from '@/components/player-components/OnboardingFormContainer';
import { trpc } from '@/utils/trpc';
import {
  playerOnboardingInput,
  playerOnboardingSchema,
} from '@/schemas/Player.schema';

import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define the tab order for navigation
const tabOrder: Array<'stepOne' | 'stepTwo'> = ['stepOne', 'stepTwo'];

export default function PlayerOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session?.user?.profileId !== session?.user?.id) {
    router.push('/players');
  }
  const [activeTab, setActiveTab] = useState<'stepOne' | 'stepTwo'>('stepOne');

  const form = useForm<playerOnboardingInput>({
    resolver: zodResolver(playerOnboardingSchema),
    mode: 'onChange', // Validate on every change for instant feedback
    defaultValues: {
      birthDate: '',
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
      gradeDate: '',
      clubName: '',
      clubId: null,
    },
  });

  const { handleSubmit } = form;

  const { mutate } = trpc.player.onboardPlayer.useMutation({
    onSuccess: async (data) => {
      // Get the existing session
      const session = await getSession();
      // Update the session with the new player id (data.id)
      if (session) {
        // Assuming your session has a `user` object
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            profileId: data?.id, // Adding data.id to the session's user object
          },
        };

        await signIn('credentials', {
          redirect: false,
          user: updatedSession.user,
        });
      }

      router.push('/membership');
    },
  });

  // When manually switching tabs, validate the current tab if moving forward.
  const handleTabChange = async (newTab: 'stepOne' | 'stepTwo') => {
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
    if (activeTab === 'stepOne') setActiveTab('stepTwo');
  };

  // Allow moving back freely.
  const handleBack = () => {
    if (activeTab === 'stepTwo') setActiveTab('stepOne');
  };

  // Final submission of the form.
  const onSubmit = (data: playerOnboardingInput) => {
    console.log('data: ', data, 'activeTab: ', activeTab);
    if (activeTab === 'stepTwo') {
      // Here you can call your API or process the data.
      mutate(data);
    }
    // reset();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <PageHeader
              icon={<User size={16} color="white" />}
              title="Players"
            />
            <OnboardingFormContainer
              title="Tell Us More About Yourself"
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onBack={handleBack}
              onNext={handleNext}
            >
              {activeTab === 'stepOne' && <PlayerDetailsStepOne />}
              {activeTab === 'stepTwo' && <PlayerDetailsStepTwo />}
            </OnboardingFormContainer>
          </main>
        </div>
      </form>
    </FormProvider>
  );
}
