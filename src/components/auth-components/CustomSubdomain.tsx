'use client';

import { useRouter } from 'next/navigation'; // Import useRouter
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
  subdomainSchema,
  SubdomainFormValues,
} from '@/schemas/form-schemas/subdomainSchema';

// All the imports

interface CustomSubdomainProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const CustomSubdomain = ({ imageSrc }: CustomSubdomainProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<SubdomainFormValues>({
    resolver: zodResolver(subdomainSchema),
    defaultValues: {
      subdomain: '',
    },
  });

  //Function to handle submit
  const onSubmit = (values: { subdomain: string }) => {
    console.log('Subdomain:', values.subdomain);
    // Replace with actual API request
    router.push('/welcome-federation');
    // On Successful Validation, Push to the welcome page.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="max-w-3xl w-[500px] mx-auto mt-16 p-10 bg-white ">
        {/* Container Div */}
        <h1 className="text-3xl font-bold mb-10">Custom Subdomain Creation</h1>

        {/* The below is the form-logic for the custom-subdomain */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subdomain Input */}
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Subdomain</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subdomain"
                      className="h-12 px-4 text-lg w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Generated URL Display */}
            <div>
              <FormLabel className="text-xl">URL</FormLabel>
              <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
                <span className="text-gray-500">https://</span>
                <Input
                  className="border-0 bg-transparent focus:ring-0 w-full pl-1"
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
