'use client';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createParentSchema } from '@/schemas/Parent.schema';
import { ParentOnboardingForm } from '@/components/player-components/ParentOnboardingForm';
import { PageHeader } from '@/components/layouts/PageHeader';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardParentPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  useEffect(() => {
    if (session?.user?.profileId !== session?.user?.id) {
      router.push('/players');
    }
  }, [session?.user?.profileId, router]);

  const methods = useForm({
    resolver: zodResolver(createParentSchema),
    defaultValues: {
      phoneNumber: '',
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
    },
  });

  const { handleSubmit } = methods;
  const { update } = useSession(); // ✅ Get the update function

  const { mutate } = trpc.parent.onboardParent.useMutation({
    onSuccess: async (data) => {
      if (data?.id) {
        update({ user: { ...session?.user, profileId: data.id } });
      }
      router.push('/players');
    },
    onError: (error) => {
      console.error('Error onboarding parent:', error);
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex min-h-svh bg-gray-50">
          <main className="flex-1">
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
                  <Button variant="destructive" type="submit">
                    Submit
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
