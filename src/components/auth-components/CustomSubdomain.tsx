'use client';

import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter
import { Suspense } from 'react'; // Import Suspense
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

import { trpc } from '@/utils/trpc'; /// import trpc
import {
  FederationOnboardingFormValues,
  federationOnboardingSchema,
} from '@/schemas/Federation.schema';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// This component is currently being used by 1 route - /onboarding-federation-subdomain

interface CustomSubdomainProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const CustomSubdomain = ({ imageSrc }: CustomSubdomainProps) => {
  const router = useRouter(); // Initialize the router

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="mx-auto mt-16 p-10 w">
        {/* Container Div */}

        <Suspense fallback={<div>Loading...</div>}>
          <CustomSubdomainForm router={router} />
        </Suspense>
      </div>
    </AuthLayout>
  );
};

const CustomSubdomainForm = ({ router }: { router: AppRouterInstance }) => {
  const searchParams = useSearchParams(); // Get query parameters
  const mutation = trpc.federation.federationOnboarding.useMutation(); // initialisation

  // Read the "data" query parameter from the URL and decode it
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

  //React hook form Logic
  const form = useForm<FederationOnboardingFormValues>({
    resolver: zodResolver(
      federationOnboardingSchema.pick({
        type: true,
        name: true,
        country: true,
        domain: true,
      })
    ),
    defaultValues: {
      type: 'NATIONAL',
      name: '',
      country: '',
      domain: '',
    },
  });

  //Function to handle submit
  const onSubmit = async (values: FederationOnboardingFormValues) => {
    // Destructure subdomain and collect the rest of the form values
    // Combine all values with onboardingData and rename subdomain to domain
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Subdomain Input */}
        <h2 className="text-2xl font-semibold pt-2">Federation details</h2>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Federation Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Federation name"
                  className="w-[450px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Subdomain</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter subdomain"
                  className="h-12 px-4 text-lg w-[450px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel className="text-lg">URL</FormLabel>
          <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
            <span className="text-gray-800">https://</span>
            <Input
              className="border-0 bg-transparent focus:ring-0 w-[350px] pl-4 bg-white"
              disabled
              value={`${form.watch('domain')}.fedchess.com`}
            />
          </div>
        </div>
        {/* Submit Button */}
        <Button type="submit" className="w-full bg-primary text-black">
          Next →
        </Button>
      </form>
    </Form>
  );
};

export default CustomSubdomain;
