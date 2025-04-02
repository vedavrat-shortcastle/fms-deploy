'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/utils/trpc';
import {
  FederationOnboardingFormValues,
  federationOnboardingSchema,
} from '@/schemas/Federation.schema';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Loader from '../Loader';

// Import Country from the country-state-city library
import { Country } from 'country-state-city';
import { SupportedLanguages } from '@prisma/client';

interface CustomSubdomainProps {
  imageSrc: string;
}

export const CustomSubdomain = ({ imageSrc }: CustomSubdomainProps) => {
  const router = useRouter();

  return (
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/onboarding-federation" />
      <div className="mx-auto mt-16 p-10 max-w-xl w-full">
        <Suspense fallback={<Loader />}>
          <CustomSubdomainForm router={router} />
        </Suspense>
      </div>
    </AuthLayout>
  );
};

const CustomSubdomainForm = ({ router }: { router: AppRouterInstance }) => {
  const searchParams = useSearchParams();
  const mutation = trpc.federation.federationOnboarding.useMutation();

  // Retrieve and parse query data
  const queryData = searchParams.get('data');
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

  // Local state to store country options
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // React Hook Form setup
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

  // Load country options on component mount
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode, // Use ISO code as value
      label: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  // Fetch existing short codes
  const { data: existingShortCodes } =
    trpc.federation.getExistingShortCodes.useQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <h2 className="text-2xl font-semibold pt-2">Federation details</h2>
        {/* Type Field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATIONAL">National</SelectItem>
                    <SelectItem value="REGIONAL">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
        />
        {/* Federation Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Federation Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Federation name"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
        />

        {/* Federation Short Code Field */}
        <FormField
          control={form.control}
          name="shortCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">
                Federation Short code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Federation short name"
                  className="w-full"
                  {...field}
                  onBlur={() => {
                    if (existingShortCodes?.includes(field.value)) {
                      form.setError('shortCode', {
                        type: 'manual',
                        message: 'Short code already exists',
                      });
                    }
                  }}
                />
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
        />

        {/* Federation Country Field - Dynamic Country Selection */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">
                Federation Country
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
        />

        {/* Federation Language Field - Language Selection */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">
                Federation Language
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SupportedLanguages).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
        />

        {/* Domain Field */}
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Domain</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Domain"
                  className="px-4 text-lg w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage /> {/* Error message should go here */}
            </FormItem>
          )}
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
        <Button type="submit" className="w-full bg-primary text-black">
          Next →
        </Button>
      </form>
    </Form>
  );
};

export default CustomSubdomain;
