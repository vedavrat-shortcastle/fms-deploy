'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FederationOnboardingFormValues,
  federationOnboardingSchema,
} from '@/schemas/Federation.schema';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Logo } from '@/components/Logo';

interface SignupProps {
  imageSrc: string;
}
const OnboardingFederation = ({ imageSrc }: SignupProps) => {
  const router = useRouter();
  const form = useForm<FederationOnboardingFormValues>({
    resolver: zodResolver(
      federationOnboardingSchema.pick({
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phoneNumber: true, // Removed countryCode
      })
    ),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (formData: FederationOnboardingFormValues) => {
    const queryData = encodeURIComponent(JSON.stringify(formData));

    router.push(`/onboarding-federation-subdomain?data=${queryData}`);
  };

  return (
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/login" />
      <div className="sm:px-20 md:px-10 md:py-10">
        <h1 className="text-xl md:text-2xl font-bold my-10">
          Tell us a bit about yourself.
        </h1>
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Onboarding Federation</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* <FormBuilder
                  config={{
                    id: 'federation-onboarding-form',
                    isActive: true,
                    fields: sanitizeFields(federationOnboardingFormConfig),
                  }}
                  control={control}
                /> */}
                <div className="flex justify-end gap-4">
                  <Button type="submit">Next</Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default OnboardingFederation;
