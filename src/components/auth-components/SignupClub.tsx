'use client';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SignupClubFormValues, signupClubSchema } from '@/schemas/Club.schema';

// All the imports
// This component is being used for 1 route as of now - /sign-up-club

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const SignupClub = ({ imageSrc }: SignupProps) => {
  //React hook form Logic
  const form = useForm<SignupClubFormValues>({
    resolver: zodResolver(signupClubSchema),
    defaultValues: {
      clubName: '',
      clubLocation: '',
      clubAddress: '',
      contactPerson: '',
      phoneNumber: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: SignupClubFormValues) => {
    console.log('Submitting values:', values);
    // Replace with actual API request
    // On Successful Validation, Push to the required page.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/login" />
      {/* Global Logo component */}

      <div className="m-20">
        {/* Container Div */}
        <h1 className="flex text-2xl mb-6 font-bold">
          Tell us a bit about Club
        </h1>

        {/* The below is the form-logic for the signup-club */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="clubName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Club Name <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Club Name"
                      className="w-[450px]"
                      {...field}
                      aria-label="Club Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clubLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Club Location <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Club Location"
                      className="w-[450px]"
                      {...field}
                      aria-label="Club Location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clubAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Club Address <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Club Address"
                      className="w-[450px]"
                      {...field}
                      aria-label="Club Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Contact Person <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Contact Person Name"
                      className="w-[450px]"
                      {...field}
                      aria-label="Contact Person"
                    />
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
                  <FormLabel className="text-input-grey">
                    Phone Number <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {/* Country Code Selector */}
                      <Select
                        onValueChange={(value) => console.log(value)}
                        defaultValue="+91"
                      >
                        <SelectTrigger className="w-[125px]">
                          <SelectValue placeholder="+1" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1"> +1 (USA)</SelectItem>
                          <SelectItem value="+91"> +91 (India)</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Phone Number Input */}
                      <Input
                        type="tel"
                        placeholder="555-123-4567"
                        {...field}
                        aria-label="Phone Number"
                        className="w-[320px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-extrabold bg-primary">
              Get Started
            </Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default SignupClub;
