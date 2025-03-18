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
  FederationOnboardingFormValues,
  federationOnboardingSchema,
} from '@/schemas/Federation.schema';
import { PasswordInput } from '@/components/PasswordInput'; // Custom Password component.

// All the imports

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const OnboardingFederation = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<FederationOnboardingFormValues>({
    resolver: zodResolver(
      federationOnboardingSchema.pick({
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        gender: true,
        phoneNumber: true,
        countryCode: true,
      })
    ),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      gender: 'MALE',
      phoneNumber: '',
      countryCode: '',
    },
  });

  console.log('error', form.formState.errors, form.getValues());

  // Function to handle submit
  const onSubmit = (values: any) => {
    // The Api call will be on the next route

    // What this does : Put all the values obtained from the form and put them on query
    // The next route will extract the data and make the api call.
    const queryData = encodeURIComponent(JSON.stringify(values));

    router.push(`/onboarding-federation-subdomain?data=${queryData}`);
    // This is the next route that will make the api call.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      {/* Container Div */}
      <div className="px-4 sm:px-20 md:px-12 lg:px-20">
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
                  <FormLabel className="text-input-grey">
                    First name
                    <FormMessage />
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="First name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Last name
                    <FormMessage />
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Additional Fields: Email, Password, Gender */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Email
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Password
                    <FormMessage />
                  </FormLabel>
                  <PasswordInput field={field} />
                </FormItem>
              )}
            />

            {/* Country Code Field */}
            <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-5 w-full">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">
                      Country Code
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[125px] h-[42px]">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+91">+91 (India)</SelectItem>
                          <SelectItem value="+64">+64 (NZ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-input-grey">
                      Phone Number
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="55555-55555"
                        {...field}
                        className="w-full h-[42px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
