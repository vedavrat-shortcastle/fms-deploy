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
  ClubOnboardingFormValues,
  clubOnboardingSchema,
} from '@/schemas/Club.schema';
import { PasswordInput } from '@/components/PasswordInput'; // Custom Password component.
import { PhoneInput } from '@/components/PhoneInput';

// All the imports

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const OnboardingClub = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<ClubOnboardingFormValues>({
    resolver: zodResolver(
      clubOnboardingSchema.pick({
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

  const { setValue } = form;

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('phoneNumber', phoneNumber); // Directly set phoneNumber
  };

  // Function to handle submit
  const onSubmit = (values: any) => {
    // The Api call will be on the next route

    // What this does : Put all the values obtained from the form and put them on query
    // The next route will extract the data and make the api call.
    const queryData = encodeURIComponent(JSON.stringify(values));

    router.push(`/onboarding-club-subdomain?data=${queryData}`);
    // This is the next route that will make the api call.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/login" />
      {/* Global Logo component */}

      {/* Container Div */}
      <div className="sm:px-20 md:px-20 md:py-20">
        <h1 className="text-xl md:text-2xl font-bold mt-10">
          Tell us a bit about yourself.
        </h1>

        {/* The below is the form-logic for the onboarding-federation */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Personal Details */}
            <h2 className="text-base md:text-lg font-semibold mt-5">
              Personal details
            </h2>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Error message should go here */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Error message should go here */}
                </FormItem>
              )}
            />
            {/* Additional Fields: Email, Password, Gender */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage /> {/* Error message should go here */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">Password</FormLabel>
                  <PasswordInput field={field} />
                  <FormMessage /> {/* Error message should go here */}
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <PhoneInput
              className="w-full"
              placeholder="Your phone number"
              defaultCountry="US"
              value=""
              onChange={handlePhoneNumberChange} // Only handle phone number change
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white font-extrabold"
            >
              Next →
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default OnboardingClub;
