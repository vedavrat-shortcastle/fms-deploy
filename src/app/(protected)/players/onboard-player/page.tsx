'use client';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

import { PageHeader } from '@/components/layouts/PageHeader';
import Sidebar from '@/components/SideBar';

import { PlayerDetailsStepOne } from '@/components/player-components/OnboardingStepOne';
import { PlayerDetailsStepTwo } from '@/components/player-components/OnboardingStepTwo';
import { OnboardingFormContainer } from '@/components/player-components/OnboardingFormContainer';
import { trpc } from '@/utils/trpc';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  playerOnboardingInput,
  playerOnboardingSchema,
} from '@/schemas/Player.schema';

export default function PlayerOnboarding() {
  const [activeTab, setActiveTab] = useState<'stepOne' | 'stepTwo'>('stepOne');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

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
      countryCode: '',
      fideId: '',
      schoolName: '',
      graduationYear: undefined,
      gradeInSchool: '',
      gradeDate: undefined,
      clubName: '',
      gender: 'MALE',
    },
  });

  useEffect(() => {
    if (session?.user?.profileId !== session?.user?.id) {
      router.push('/memberships');
    }
  }, [session?.user?.profileId, router]);

  const { handleSubmit, trigger } = form;
  const { update } = useSession();

  const onboardPlayerMutation = trpc.player.onboardPlayer.useMutation({
    onSuccess: async (data) => {
      if (data?.id) {
        update({ user: { ...session?.user, profileId: data.id } });
      }
      router.push('/memberships');
    },
    onError: (error) => {
      console.error('Error onboarding player:', error);
    },
  });

  const validateTab = async (tab: 'stepOne' | 'stepTwo') => {
    let isValid = true;
    if (tab === 'stepOne') {
      // Validate stepOne fields
      isValid = await trigger([
        'gender',
        'birthDate',
        'ageProof',
        'city',
        'country',
        'state',
        'phoneNumber',
        'streetAddress',
        'postalCode',
        'countryCode',
      ]);
    }
    if (tab === 'stepTwo') {
      // Validate stepTwo fields if needed
      isValid = await trigger([
        'schoolName',
        'graduationYear',
        'clubName',
        'gradeInSchool',
      ]);
    }
    return isValid;
  };

  const handleTabChange = async (newTab: 'stepOne' | 'stepTwo') => {
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

  // Allow moving back freely.
  const handleBack = () => {
    if (activeTab === 'stepTwo') setActiveTab('stepOne');
  };

  // Final submission of the form.
  const onSubmit = async (data: playerOnboardingInput) => {
    try {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
      if (activeTab === 'stepTwo') {
        await onboardPlayerMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <PageHeader
              icon={<User size={16} color="white" />}
              title="Player Onboarding"
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

            {isSubmitting && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-xl">Creating player...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </form>
    </FormProvider>
  );
}
