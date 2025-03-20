'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createParentSchema } from '@/schemas/Parent.schema';
import { ParentOnboardingForm } from '@/components/player-components/ParentOnboardingForm';
import Sidebar from '@/components/SideBar';
import { PageHeader } from '@/components/layouts/PageHeader';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';

export default function OnboardParentPage() {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(createParentSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: '',
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
    },
  });

  // Initialize the onboardParent mutation
  const onboardParentMutation = trpc.parent.onboardParent.useMutation({
    onSuccess: (data) => {
      console.log('Parent onboarded successfully:', data);
      router.push('/players');
    },
    onError: (error) => {
      // Handle errors
      console.error('Error onboarding parent:', error);
    },
  });

  const onSubmit = (data: any) => {
    // Call the onboardParent mutation with the form data
    onboardParentMutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <PageHeader
              icon={<User size={16} color="white" />}
              title="Parents"
            />
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white border rounded-md shadow-lg p-6">
                <h2 className="mb-4 pt-1 text-2xl font-bold bg-red-500 rounded-md text-gray-800 border-b pb-2 text-center">
                  Parent Onboarding
                </h2>
                <ParentOnboardingForm />
                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    type="submit"
                    disabled={onboardParentMutation.isLoading}
                  >
                    {onboardParentMutation.isLoading
                      ? 'Submitting...'
                      : 'Submit'}
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
