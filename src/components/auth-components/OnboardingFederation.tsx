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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  onboardingFederationSchema,
  OnboardingFederationFormValues,
} from '@/schemas/form-schemas/onboardingFederationSchema';

// All the imports

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const OnboardingFederation = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<OnboardingFederationFormValues>({
    resolver: zodResolver(onboardingFederationSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      type: '',
      federationName: '',
      federationCountry: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: any) => {
    console.log('Submitting values:', values);
    //Replace with actual API request
    router.push('/onboarding-federation-subdomain');
    // On Successful Validation, Push to the custom-subdomain page.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="max-w-lg mx-auto mt-10">
        {/* Container Div */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Tell us a bit about yourself.
        </h1>

        {/* The below is the form-logic for the onboarding-federation */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details */}
            <h2 className="text-lg font-semibold">Personal details</h2>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 55555-55555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Details */}
            <h2 className="text-lg font-semibold mt-6">Organization details</h2>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="club">Club</SelectItem>
                        <SelectItem value="association">Association</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="federationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Federation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Federation name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="federationCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Federation Country</FormLabel>
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

            <Button type="submit" className="w-full bg-primary text-black">
              Next →
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default OnboardingFederation;
