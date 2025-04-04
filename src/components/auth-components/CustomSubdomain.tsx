'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Logo } from '@/components/Logo';
import Loader from '../Loader';
import { trpc } from '@/utils/trpc';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FederationOnboardingFormValues,
  federationOnboardingSchema,
} from '@/schemas/Federation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { sanitizeFields } from '@/utils/sanitize';
import { federationDomainOnboardConfig } from '@/config/staticFormConfigs';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignupProps {
  imageSrc: string;
}

const CustomSubdomain = ({ imageSrc }: SignupProps) => {
  const router = useRouter();

  return (
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/login" />
      <div className="sm:px-20 md:px-10 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold my-10">
          Tell us a bit about yourself.
        </h1>
        <Suspense fallback={<Loader />}>
          <CustomSubdomainForm router={router} />
        </Suspense>
      </div>
    </AuthLayout>
  );
};

export default CustomSubdomain;

interface CustomSubdomainFormProps {
  router: ReturnType<typeof useRouter>;
}

const CustomSubdomainForm = ({ router }: CustomSubdomainFormProps) => {
  const searchParams = useSearchParams();
  const mutation = trpc.federation.federationOnboarding.useMutation();

  // Retrieve and parse query data
  const queryData = searchParams?.get('data') || null;
  let onboardingData: any = {};
  if (queryData) {
    try {
      onboardingData = JSON.parse(decodeURIComponent(queryData));
    } catch (e) {
      console.error('Error parsing query data', e);
    }
  } else {
    router.push('/onboarding-federation');
  }
  const form = useForm<FederationOnboardingFormValues>({
    resolver: zodResolver(
      federationOnboardingSchema.pick({
        type: true,
        name: true,
        shortCode: true,
        country: true,
        domain: true,
        language: true,
      })
    ),
    defaultValues: {
      type: 'NATIONAL',
      name: '',
      shortCode: '',
      country: '',
      domain: '',
      language: 'en',
    },
  });

  const onSubmit = async (values: FederationOnboardingFormValues) => {
    const finalData = { ...onboardingData, ...values };

    try {
      await mutation.mutateAsync(finalData);
      router.push('/onboarding-welcome');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(errorMessage);
      alert(errorMessage);
    }
  };

  const { control, handleSubmit } = form;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Onboarding Federation</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormBuilder
              config={{
                id: 'federation-domain-onboard-form',
                isActive: true,
                fields: sanitizeFields(federationDomainOnboardConfig),
              }}
              control={control}
            />
            <div>
              <FormLabel className="text-input-grey">URL</FormLabel>
              <div className="flex items-center border rounded px-2 py-1">
                <span className="text-gray-800">https://</span>
                <Input
                  className="border-0 bg-transparent focus:ring-0 w-full pl-4 bg-white"
                  disabled
                  value={`${form.watch('domain')}`}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? <Loader /> : 'Submit'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
