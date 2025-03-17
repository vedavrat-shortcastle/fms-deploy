'use client';

import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
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
import {
  SubdomainFormValues,
  subdomainSchema,
} from '@/schemas/Federation.schema';
import { trpc } from '@/utils/trpc'; /// import trpc

// This component is currently being used by 1 route - /onboarding-federation-subdomain

interface CustomSubdomainProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const CustomSubdomain = ({ imageSrc }: CustomSubdomainProps) => {
  const router = useRouter(); // Initialize the router
  const searchParams = useSearchParams(); // Get query parameters
  const mutation = trpc.federation.federationOnboarding.useMutation(); // initialisation

  // Read the "data" query parameter from the URL and decode it
  const queryData = searchParams.get('data');
  let onboardingData: any = {};
  if (queryData) {
    try {
      onboardingData = JSON.parse(decodeURIComponent(queryData));
      console.log(queryData);
    } catch (e) {
      console.error('Error parsing query data', e);
    }
  } else {
    // If no query data is found, redirect to the previous route
    // router.push('/onboarding-federation');
  }

  //React hook form Logic
  const form = useForm<SubdomainFormValues>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {
      subdomain: '',
    },
  });

  //Function to handle submit
  const onSubmit = async (values: { subdomain: string }) => {
    const finalData = { ...onboardingData, domain: values.subdomain };

    try {
      const response = await mutation.mutateAsync(finalData);
      console.log('Federation created with domain:', response);
      router.push('/onboarding-welcome');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(errorMessage);
      alert(errorMessage);
    }
  };
  // Parse the stored data and merge with subdomain value

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="mx-auto mt-16 p-10 w">
        {/* Container Div */}
        <h1 className="text-2xl font-bold mb-10">Custom Subdomain Creation</h1>

        {/* The below is the form-logic for the custom-subdomain */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subdomain Input */}
            <FormField
              control={form.control}
              name="subdomain"
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

            {/* Generated URL Display */}
            <div>
              <FormLabel className="text-lg">URL</FormLabel>
              <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
                <span className="text-gray-800">https://</span>
                <Input
                  className="border-0 bg-transparent focus:ring-0 w-[350px] pl-4 bg-white"
                  disabled
                  value={`${form.watch('subdomain')}.fedchess.com`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary text-black">
              Next →
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default CustomSubdomain;
